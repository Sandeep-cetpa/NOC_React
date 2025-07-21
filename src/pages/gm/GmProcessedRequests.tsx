import React, { useEffect, useMemo, useState } from 'react';
import { Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import axiosInstance from '@/services/axiosInstance';
import { findUnitNameByUnitId, statusConfig } from '@/lib/helperFunction';
import { Badge } from '@/components/ui/badge';
import TableList from '@/components/ui/data-table';
import Loader from '@/components/ui/loader';
import CorporateHrNOCDetailDialog from '@/components/dialogs/CorporateHrNOCDetailDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { allPurpose } from '@/constant/static';
import GmHrNOCDetailDialog from '@/components/dialogs/GmHrNOCDetailDialog';

const GmProcessedRequests = () => {
  const [request, setRequests] = useState([]);
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPurpose, setSelectedPurpose] = useState('all');
  const { departments, grades, units } = useSelector((state: RootState) => state.masterData.data);
  const [corporateHrRemarks, setCorporateHdRemarks] = useState({
    remark: '',
  });
  const getRequestByUnitId = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`GMHR/NOC/Report`);
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
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
  useEffect(() => {
    getRequestByUnitId();
  }, []);
  const handleApproveClick = async (nocId: any, status: any) => {
    try {
      const response = await axiosInstance.put('/GMHR/NOC', {
        refId: nocId,
        status: status,
        remarks: corporateHrRemarks.remark,
        updatedDob: corporateHrRemarks?.dob,
        updatedDor: corporateHrRemarks?.dor,
        updatedDoeis: corporateHrRemarks?.doe,
        corpHRUnitId: selectedRequest.unitId,
        corpHRAutoId: user.EmpID,
      });
      if (response.data?.success) {
        toast.success('Request Approved Successfully');
        setIsOpen(false);
        setSelectedRequest(null);
        setCorporateHdRemarks({
          remark: '',
        });
        getRequestByUnitId();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (err) {
      console.log(err);
    }
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
    return request.filter((item) => {
      // const postMatch = selectedGrade === 'all' || item.post === selectedGrade;
      const departmentMatch = selectedDepartment === 'all' || item.department === selectedDepartment;
      const purposeMatch = selectedPurpose === 'all' || Number(item.purposeId) === Number(selectedPurpose);
      // return postMatch && departmentMatch;
      return departmentMatch && purposeMatch;
    });
  }, [selectedDepartment, selectedPurpose, request]);
  return (
    <div className=" p-6">
      {isLoading && <Loader />}
      <div>
        <div>
          <h1 className="text-3xl my-4">Processed Requests</h1>
          <div className="overflow-x-auto">
            <TableList
              data={filteredData.sort((a, b) => {
                const dateA = a?.initiationDate ? new Date(a.initiationDate).getTime() : 0;
                const dateB = b?.initiationDate ? new Date(b.initiationDate).getTime() : 0;
                return dateB - dateA;
              })}
              columns={columns}
              rightElements={
                <>
                  <div className="w-full md:w-1/2 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Select value={selectedGrade} onValueChange={(value) => setSelectedGrade(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {grades.map((ele) => {
                          return (
                            <SelectItem key={ele} value={ele}>
                              {ele}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" onClick={() => getRequestByUnitId()} className=" space-x-2 ml-3">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </>
              }
              showFilter={false}
            />
          </div>
        </div>
      </div>
      <GmHrNOCDetailDialog isOpen={isOpen} onOpenChange={setIsOpen} nocData={selectedRequest} isEditable={false} />
    </div>
  );
};

export default GmProcessedRequests;
