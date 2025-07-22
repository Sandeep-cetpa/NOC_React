import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import Loader from '@/components/ui/loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UnitHrNOCDetailDialog from '@/components/dialogs/UnitHrNOCDetailDialog';
import toast from 'react-hot-toast';
import { statusConfig } from '@/lib/helperFunction';
import { format } from 'date-fns';
import TableList from '@/components/ui/data-table';
const PendingNocRequests = () => {
  const userRoles = useSelector((state: RootState) => state.user.Roles);
  const user = useSelector((state: RootState) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unitHrData, setUnitHrData] = useState({
    remarks: '',
    dor: '',
    doj: '',
  });
  const [selectedNoc, setSelectedNoc] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [requests, setRequests] = useState([]);
  const getAllRequests = async (unitId) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/UnitHR/NOC?UnitId=${unitId}`);
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUnitSelection = (unitId: string) => {
    setSelectedUnit(unitId);
    getAllRequests(unitId);
  };
  useEffect(() => {
    if (userRoles?.length > 0) {
      const firstRole = userRoles[0];
      if (firstRole.unitsAssigned?.length > 0) {
        const firstUnit = firstRole.unitsAssigned[0];
        const unitIdString = firstUnit.unitId.toString();
        setSelectedUnit(unitIdString);
        getAllRequests(firstUnit.unitId);
      }
    }
  }, [userRoles]); // optionally, you may want to depend on userRoles

  const handleApproveClick = async (nocId: number, status) => {
    try {
      const response = await axiosInstance.put('/UnitHR/NOC', {
        refId: nocId,
        status: status,
        presentUnit: 'string',
        pastPosition: 'string',
        remarks: unitHrData?.remarks,
        updatedDob: '2025-06-30T05:43:59.264Z',
        updatedDor: '2025-06-30T05:43:59.264Z',
        updatedDoeis: '2025-06-30T05:43:59.264Z',
        hrUnitId: selectedUnit,
        hrAutoId: user?.EmpID,
      });
      if (response.data.success) {
        setIsOpen(false);
        getAllRequests(selectedUnit);
        setUnitHrData({
          remarks: '',
          doj: '',
          dor: '',
        });
        toast.success('Request approved successfully');
      }
    } catch (error) {
      console.error('Error approving NOC:', error);
    }
  };
  const getStatusBadge = (status) => {
    if (!status) {
      return;
    }
    const config = statusConfig(status);
    const IconComponent = config?.icon;
    return (
      <Badge className={`${config?.color} hover:bg-none text-center items-center space-x-1 px-2 py-1`}>
        <IconComponent className="h-3 w-3" />
        <span>{config?.label}</span>
      </Badge>
    );
  };
  const columns = [
    {
      accessorKey: 'refId',
      header: 'Reference ID',
      cell: ({ row }) => <div>{`${row.original.refId ? 'NOC-' + row.original.refId : 'NA'}`}</div>,
    },
    {
      accessorKey: 'employeeCode',
      header: 'Employee Code',
      cell: ({ row }) => <div>{row?.original?.employeeCode}</div>,
    },
    {
      accessorKey: 'username',
      header: 'Employee Name',
      cell: ({ row }) => (
        <div className=" w-[140px] truncate" title={row.original.username}>
          {row.original.username}
        </div>
      ),
    },
    {
      accessorKey: 'initiationDate',
      header: 'Date',
      cell: ({ row }) => (
        <div className="flex items-center w-[90px]">
          {row.original.initiationDate ? format(new Date(row.original.initiationDate), 'dd MMM yyyy') : '-'}
        </div>
      ),
    },
    {
      accessorKey: 'purposeName',
      header: 'Purpose',
      cell: ({ row }) => <div>{row.original.purposeName}</div>,
    },

    {
      accessorKey: 'post',
      header: 'Designation',
      cell: ({ row }) => <div>{row?.original?.post ? row?.original?.post : 'NA'}</div>,
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => <div>{row.original.department}</div>,
    },

    {
      accessorKey: 'currentStatus',
      header: 'Status',
      cell: ({ row }) => <div>{row.original.currentStatus && getStatusBadge(row.original.currentStatus)}</div>,
    },
    {
      accessorKey: 'Action',
      header: 'Action',
      cell: ({ row }) => (
        <Button
          onClick={() => {
            setSelectedNoc(row.original);
            // setUnitHrData({
            //   remarks: '',
            //   doj: '',
            //   dor: '',
            // });
            setIsOpen(true);
          }}
        >
          <Eye />
        </Button>
      ),
    },
  ];
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="p-6 mx-auto space-y-6">
      <div>
        {/* <h1 className="font text-3xl mb-3">Pending Requests</h1> */}
        <div className="space-y-4">
          <>
            <TableList
              data={requests.sort((a, b) => {
                const dateA = a?.initiationDate ? new Date(a.initiationDate).getTime() : 0;
                const dateB = b?.initiationDate ? new Date(b.initiationDate).getTime() : 0;
                return dateB - dateA;
              })}
              columns={columns}
              rightElements={
                <>
                  <div className="flex rounded-xl">
                    <div className="flex space-y-2">
                      <Select value={selectedUnit} onValueChange={handleUnitSelection}>
                        <SelectTrigger id="unit-select" className="w-[200px]">
                          <SelectValue placeholder="Choose a unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {userRoles
                            ?.flatMap((role) => role.unitsAssigned || [])
                            .map((unit) => (
                              <SelectItem key={unit.unitId} value={unit.unitId.toString()}>
                                {unit.unitName}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="outline" onClick={() => getAllRequests(selectedUnit)} className=" space-x-2 ml-3">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              }
              showFilter={false}
            />
          </>
          <UnitHrNOCDetailDialog
            setUnitHrData={setUnitHrData}
            AccecptButtonName={'Forward to CGM'}
            rejectButtonName={'Reject'}
            handleRejectClick={handleApproveClick}
            handleApproveClick={handleApproveClick}
            unitHrData={unitHrData}
            nocData={selectedNoc}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            isEditable={true}
          />
        </div>
      </div>
    </div>
  );
};

export default PendingNocRequests;
