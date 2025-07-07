import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import axiosInstance from '@/services/axiosInstance';
import { Badge } from '@/components/ui/badge';
import { statusConfig } from '@/lib/helperFunction';
import Loader from '@/components/ui/loader';
import TableList from '@/components/ui/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import CorporateHrNOCDetailDialog from '@/components/dialogs/CorporateHrNOCDetailDialog';

const RequestUnderProcess = () => {
  const [activetab, setActiveTab] = useState('None');
  const [request, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(1);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { departments, units, grades } = useSelector((state: RootState) => state.masterData.data);
  const reportStatus = [
    {
      label: 'All',
      value: 'None',
    },
    {
      label: 'Under Process',
      value: 'UnderProcess',
    },
    {
      label: 'Completed',
      value: 'Completed',
    },
    {
      label: 'Rejected',
      value: 'Rejected',
    },
    {
      label: 'Parked',
      value: 'Parked',
    },
  ];
  const getRequestByUnitId = async (unitId: any) => {
    try {
      setRequests([]);
      setIsLoading(true);
      const response = await axiosInstance.get(`/CorporateHR/NOC/Report?UnitId=${unitId}&status=${activetab}`);
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
    getRequestByUnitId(selectedUnit);
  }, [activetab]);
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
    getRequestByUnitId(selectedUnit);
  }, [activetab, selectedUnit]);
  const filteredData = useMemo(() => {
    return request.filter((item) => {
      // const postMatch = selectedGrade === 'all' || item.post === selectedGrade;
      const departmentMatch = selectedDepartment === 'all' || item.department === selectedDepartment;
      // return postMatch && departmentMatch;
      return departmentMatch;
    });
  }, [selectedDepartment, selectedGrade, request]);

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
    <div className="p-6">
      <Tabs
        onValueChange={(e) => {
          setActiveTab(e);
        }}
        defaultValue="unit"
        value={activetab}
      >
        <TabsList>
          {reportStatus.map((ele) => {
            return (
              <TabsTrigger className="px-4" value={ele.value}>
                {ele.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {reportStatus.map((ele) => {
          return (
            <TabsContent value={ele.value}>
              <div>
                <h1 className="text-3xl my-4">{ele.label} Request</h1>
                <div className="overflow-x-auto mt-2">
                  <TableList
                    data={filteredData?.sort((a, b) => {
                      const dateA = a?.initiationDate ? new Date(a.initiationDate).getTime() : 0;
                      const dateB = b?.initiationDate ? new Date(b.initiationDate).getTime() : 0;
                      return dateB - dateA;
                    })}
                    columns={columns}
                    rightElements={
                      <>
                        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
                          <Select
                            value={selectedUnit.toString()}
                            onValueChange={(value) => setSelectedUnit(Number(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Position Grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map((ele) => {
                                return <SelectItem value={ele.unitid?.toString()}>{ele.unitName}</SelectItem>;
                              })}
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
                          onClick={() => getRequestByUnitId(selectedUnit)}
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
        isEditable={false}
      />
    </div>
  );
};

export default RequestUnderProcess;
