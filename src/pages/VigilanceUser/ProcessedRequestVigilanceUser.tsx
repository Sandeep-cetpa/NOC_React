import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { findUnitNameByUnitId, statusConfig } from '@/lib/helperFunction';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import axiosInstance from '@/services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import TableList from '@/components/ui/data-table';
import CgmNOCDetailDialog from '@/components/dialogs/CgmNOCDetailDialog';
import Loader from '@/components/ui/loader';
import { allPurpose } from '@/constant/static';
import VigilanceUserNOCDetailDialog from '@/components/dialogs/VigilanceUserNOCDetailDialog';

const ProcessedRequestVigilanceUser = () => {
  const userRoles = useSelector((state: RootState) => state.user.Roles);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { departments, units } = useSelector((state: RootState) => state.masterData.data);
  const [isOpen, setIsOpen] = React.useState(false);
  const [cgmData, setcgmData] = useState({
    remarks: '',
    dor: '',
    doj: '',
  });
  const getAllRequests = async (unitId: any) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/VigilanceUser/NOC/Report?UnitId=${unitId}`);
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (selectedUnit) {
      getAllRequests(selectedUnit);
    }
  }, [selectedUnit]);

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
  }, [userRoles]);

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
      accessorKey: 'unitId',
      header: 'Location',
      cell: ({ row }) => (
        <div className="w-[170px]">{findUnitNameByUnitId(units, row.original.unitId)?.unitName ?? 'NA'}</div>
      ),
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

  const filteredData = useMemo(() => {
    return requests.filter((item) => {
      const departmentMatch = selectedDepartment === 'all' || item.department === selectedDepartment;
      const purposeMatch = selectedPurpose === 'all' || Number(item.purposeId) === Number(selectedPurpose);
      // return postMatch && departmentMatch;
      return purposeMatch && departmentMatch;
    });
  }, [selectedPurpose, requests, selectedUnit, selectedDepartment]);
  return (
    <div className=" p-6">
      {isLoading && <Loader />}
      <div className="w-full mx-auto">
        <h1 className="font text-3xl mb-3">Pending Requests </h1>
        <div className="space-y-4">
          <TableList
            data={filteredData?.sort((a, b) => {
              const dateA = a?.initiationDate ? new Date(a.initiationDate).getTime() : 0;
              const dateB = b?.initiationDate ? new Date(b.initiationDate).getTime() : 0;
              return dateB - dateA;
            })}
            columns={columns}
            rightElements={
              <>
                <div className="w-full md:w-1/2 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Select value={selectedUnit.toString()} onValueChange={(value) => setSelectedUnit(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Units</SelectItem>
                      {units.map((ele) => {
                        return <SelectItem value={ele.unitid?.toString()}>{ele.unitName}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                  <Select value={selectedPurpose.toString()} onValueChange={(value) => setSelectedPurpose(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Purpose</SelectItem>
                      {allPurpose.map((ele) => (
                        <SelectItem key={ele.value} value={ele.value.toString()}>
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${ele.color}`} />
                            <span>{ele.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {departments.map((ele) => {
                        return <SelectItem value={ele}>{ele}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={() => getAllRequests(selectedUnit)} className=" space-x-2">
                    <RefreshCw className="h-4 w-4" /> Refresh
                  </Button>
                </div>
              </>
            }
            showFilter={false}
          />
        </div>
        <VigilanceUserNOCDetailDialog
          setcgmData={setcgmData}
          cgmData={cgmData}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          nocData={selectedRequest}
        />
      </div>
    </div>
  );
};

export default ProcessedRequestVigilanceUser;
