import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Eye, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { findUnitNameByUnitId, statusConfig, validateVigilanceFields } from '@/lib/helperFunction';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import axiosInstance from '@/services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import TableList from '@/components/ui/data-table';
import Loader from '@/components/ui/loader';
import { allPurpose } from '@/constant/static';
import VigilanceAdminNOCDetailDialog from '@/components/dialogs/VigilanceAdminNOCDetailDialog';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const VigilanceAdminRequestReceived = () => {
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [IsAutomaticApproval, setIsAutomaticApproval] = useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const { departments, units } = useSelector((state: RootState) => state.masterData.data);
  const [cgmData, setcgmData] = useState({
    remarks: '',
    dor: '',
    doj: '',
  });
  const getAllRequests = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/VigilanceAdmin/NOC`);
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleApproveandRejectClick = async (nocId: number, status) => {
    try {
      const formdata = new FormData();
      formdata.append('RefId', nocId.toString());
      formdata.append('Status', status.toString());
      formdata.append('Remarks', cgmData.remarks);

      setIsLoading(true);
      const response = await axiosInstance.put('/VigilanceAdmin/NOC', formdata, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setIsOpen(false);
        getAllRequests();
        setcgmData(null);
        toast.success('Request approved successfully');
      }
    } catch (error) {
      console.error('Error approving NOC:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleTrailClick = async (nocId: number) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/CGM/NOC', {
        refId: nocId,
        remarks: cgmData.remarks,
        fkAutoId: user.EmpID,
      });
      if (response?.data?.success) {
        setIsOpen(false);
        getAllRequests();
        toast.success('Request approved successfully');
      }
    } catch (error) {
      console.error('Error approving NOC:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRevert = async (nocId: number) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/VigilanceAdmin/NOC/Revert', {
        refId: nocId,
        remarks: cgmData.remarks,
        unitId: 0,
        fkAutoId: user.EmpID,
      });
      if (response?.data?.success) {
        setIsOpen(false);
        getAllRequests();
        toast.success('Request approved successfully');
      }
    } catch (error) {
      console.error('Error approving NOC:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllRequests();
  }, []);
  const getCurrentAutomaticApprovalStatus = async () => {
    try {
      const response = await axiosInstance.get('/VigilanceAdmin/NOC/Get-AutoRenewal');
      console.log(response.data);
      if (response.data.success) {
        setIsAutomaticApproval(response?.data?.data === 'True' ? true : false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const changeCurrentAutomaticApprovalStatus = async (status: boolean) => {
    try {
      const response = await axiosInstance.put(`/VigilanceAdmin/NOC/Update-Renewal?request=${status}`);
      console.log(response.data);
      if (response.data.success) {
        getCurrentAutomaticApprovalStatus();
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCurrentAutomaticApprovalStatus();
  }, []);
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
  }, [selectedPurpose, requests, selectedDepartment]);
  return (
    <div className=" p-6">
      {isLoading && <Loader />}
      <div className="w-full mx-auto">
        <div className="flex items-center">
          <h1 className="text-3xl font-semibold mb-3">Pending Requests</h1>
          <div className="flex items-center gap-2 mb-2 ml-3">
            <Switch
              checked={IsAutomaticApproval}
              onCheckedChange={() => changeCurrentAutomaticApprovalStatus(!IsAutomaticApproval)}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-5 h-5 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    <strong>Automatic Approval:</strong> When this feature is enabled, the NOC request will be
                    automatically approved for employees who are not listed in the grey list.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

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
                <div className="w-full md:w-1/2 grid grid-cols-1 md:grid-cols-3 gap-3">
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
                      {departments.map((ele, index) => {
                        return (
                          <SelectItem key={index} value={ele}>
                            {ele}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={() => getAllRequests()} className=" space-x-2">
                    <RefreshCw className="h-4 w-4" /> Refresh
                  </Button>
                </div>
              </>
            }
            showFilter={false}
          />
        </div>
        <VigilanceAdminNOCDetailDialog
          setcgmData={setcgmData}
          handleApproveClick={handleApproveandRejectClick}
          handleRevertClick={handleRevert}
          handleTrailClick={handleTrailClick}
          cgmData={cgmData}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          nocData={selectedRequest}
          isEditable={true}
          AccecptButtonName={'Forward to Corporate HR'}
          revertButtonName={'Revert Vigilance User'}
        />
      </div>
    </div>
  );
};

export default VigilanceAdminRequestReceived;
