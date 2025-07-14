import React, { useEffect, useMemo, useState } from 'react';
import { Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const ReceivedRequests = () => {
  const tabStatus = [
    { label: 'Request From Corporate Office', value: 'corporate' },
    { label: 'Request From Unit', value: 'unit' },
  ];
  const [activetab, setActiveTab] = useState('corporate');
  const [request, setRequests] = useState([]);
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { departments, grades,units } = useSelector((state: RootState) => state.masterData.data);
  const [corporateHrRemarks, setCorporateHdRemarks] = useState({
    remark: '',
  });
  const [selectedUnit, setSelectedUnit] = useState(1);
  const getRequestByUnitId = async (unitId, isUnit) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/CorporateHR/NOC?UnitId=${unitId}&isUnit=${isUnit === 'corporate' ? false : true}`
      );
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
    getRequestByUnitId(selectedUnit, activetab);
  }, [activetab]);
  const handleApproveClick = async (nocId: any, status: any) => {
    try {
      const response = await axiosInstance.put('/CorporateHR/NOC', {
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
        getRequestByUnitId(selectedUnit, activetab);
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
      // return postMatch && departmentMatch;
      return departmentMatch;
    });
  }, [selectedDepartment, selectedGrade, request]);
  return (
    <div className=" p-6">
      {isLoading && <Loader />}
      <Tabs
        onValueChange={(e) => {
          setActiveTab(e);
          if (e === 'corporate') {
            setSelectedUnit(1);
          } else {
            setSelectedUnit(0);
          }
        }}
        defaultValue="unit"
        value={activetab}
      >
        <TabsList>
          {tabStatus.map((ele) => {
            return <TabsTrigger value={ele.value}>{ele.label}</TabsTrigger>;
          })}
        </TabsList>
        {tabStatus.map((ele) => {
          return (
            <TabsContent value={ele.value}>
              <div>
                <h1 className="text-3xl my-4">{ele.label}</h1>
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
                        <div className="w-full md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <Select value={selectedGrade} onValueChange={(value) => setSelectedGrade(value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select position grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              {grades.map((ele) => {
                                return <SelectItem value={ele}>{ele}</SelectItem>;
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => getRequestByUnitId(selectedUnit, activetab)}
                          className=" space-x-2 ml-3"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </>
                    }
                    showFilter={false}
                  />
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
      <CorporateHrNOCDetailDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        nocData={selectedRequest}
        handleApproveClick={handleApproveClick}
        handleRejectClick={handleApproveClick}
        handleRevertClick={handleApproveClick}
        setcorporateHrData={setCorporateHdRemarks}
        corporateHrData={corporateHrRemarks}
        AccecptButtonName={'Forword To D & AR'}
        rejectButtonName={'Reject Request'}
        revertButtonName={'Get Trail'}
        isEditable={true}
      />
    </div>
  );
};

export default ReceivedRequests;
