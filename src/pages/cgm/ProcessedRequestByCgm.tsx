import React, { useEffect, useState } from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { statusConfig } from '@/lib/helperFunction';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import axiosInstance from '@/services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import TableList from '@/components/ui/data-table';
import CgmNOCDetailDialog from '@/components/dialogs/CgmNOCDetailDialog';
import Loader from '@/components/ui/loader';

const ProcessedRequestByCgm = () => {
  const userRoles = useSelector((state: RootState) => state.user.Roles);
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [cgmData, setcgmData] = useState({
    remarks: '',
    dor: '',
    doj: '',
  });
  const getAllRequests = async (unitId: any) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/CGM/NOC/Report?UnitId=${unitId}&RequestStatus=0`);
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
        const firstUnit = firstRole?.unitsAssigned[0];
        const unitIdString = firstUnit?.unitId?.toString();
        setSelectedUnit(unitIdString);
        getAllRequests(firstUnit.unitId);
      }
    }
  }, [userRoles]); // optionally, you may want to depend on userRoles

  const handleApproveClick = async (nocId: number, status) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.put('/UnitHR/NOC', {
        refId: nocId,
        status: status,
        remarks: cgmData.remarks,
        cgmUnitId: 0,
        cgmAutoId: 0,
      });
      if (response.data.success) {
        setIsOpen(false);
        getAllRequests(selectedUnit);
        toast.success('Request approved successfully');
      }
    } catch (error) {
      console.error('Error approving NOC:', error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(selectedRequest, 'selectedRequest');
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
            setSelectedRequest(row.original);

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
    <div className=" p-6">
      <div className="w-full mx-auto">
        <h1 className="font text-3xl mb-3">Pending Requests </h1>
        <div className="space-y-4">
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
                  {/* <div className="flex space-y-2">
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
                  </div> */}
                  <div className="flex space-y-2 mx-0 md:mx-2 mr-2">
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

                  <Button variant="outline" onClick={() => getAllRequests(selectedUnit)} className=" space-x-2">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </>
            }
            showFilter={false}
          />
        </div>
        <CgmNOCDetailDialog
          setcgmData={setcgmData}
          handleApproveClick={handleApproveClick}
          handleRejectClick={handleApproveClick}
          cgmData={cgmData}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          nocData={selectedRequest}
          AccecptButtonName={'Forward to Corporate HR'}
          rejectButtonName={'Reject'}
        />
      </div>
    </div>
  );
};

export default ProcessedRequestByCgm;
