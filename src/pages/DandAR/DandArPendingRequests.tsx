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
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import DAndArNOCDetailDialog from '@/components/dialogs/DAndArNOCDetailDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const reportStatus = [
  {
    label: 'Pending Request',
    value: 'pending',
  },
  {
    label: 'Processed Requests',
    value: 'processed',
  },
];
const ReceivedRequests = () => {
  const [activetab, setActiveTab] = useState('pending');
  const [request, setRequests] = useState([]);
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [dAndARRemarks, setdAndARRemarksRemarks] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = useState(1);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [errorRows, setErrorRows] = useState({});
  const [errorRowsIndexs, setErrorRowsIndexs] = useState([]);
  const [excelPreviewData, setExcelPreviewData] = useState([]);
  const { departments, units, grades } = useSelector((state: RootState) => state.masterData.data);
  const userRoles = user?.Roles?.find((ele) => ele?.roleId === 7);
  const fetchRequestsByTab = async (unitId: number | string, tab: string) => {
    try {
      setIsLoading(true);
      let endpoint = `/DandR/NOC?UnitId=${unitId}&isUnit=false`;

      if (tab === 'processed') {
        endpoint = `/DandR/NOC/Report?UnitId=${unitId}`;
      }
      const response = await axiosInstance.get(endpoint);
      if (response.data?.success) {
        const { nonBulkRecord = [], probationRecords = [], awardRecords = [] } = response.data.data || {};
        setRequests([...nonBulkRecord, ...probationRecords, ...awardRecords]);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUnit) {
      fetchRequestsByTab(selectedUnit, activetab);
    }
  }, [activetab, selectedUnit]);

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
  const handleApproveClick = async (nocId: any, status: any) => {
    const payloadFormData = new FormData();

    for (const key in dAndARRemarks) {
      if (dAndARRemarks[key] !== undefined && dAndARRemarks[key] !== null) {
        payloadFormData.append(key, dAndARRemarks[key]);
      }
    }
    payloadFormData.append('Status', status);
    if (!selectedRequest.data) {
      payloadFormData.append('RefId', nocId);
      payloadFormData.append('PurposeId', selectedRequest?.purposeId);
    }
    payloadFormData.append('DandRAutoId', user.EmpID.toString());
    if (selectedRequest?.data) {
      payloadFormData.append('whichBatch', selectedRequest?.batchId);
      payloadFormData.append('PurposeId', selectedRequest?.fkPurposeId);
    }
    try {
      const response = await axiosInstance.put('/DandR/NOC', payloadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data?.success) {
        toast.success('Request Approved Successfully');
        setIsOpen(false);
        setSelectedRequest(null);
        setdAndARRemarksRemarks({} as any);
        getRequestByUnitId(selectedUnit);
        setErrorRowsIndexs([]);
        setErrorRows({});
        setExcelPreviewData([]);
      } else {
        setErrorRowsIndexs(response?.data?.erorrRowsIfBulk);
        setErrorRows(() => {
          const updatedErrors = {};
          response?.data?.erorrRowsIfBulk?.forEach((rowIndex) => {
            updatedErrors[rowIndex] = response?.data?.errorMessageIfBulk;
          });
          return updatedErrors;
        });
        toast.error(response?.data?.errorMessage);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const revertBackToCorporateHr = async (nocId: any, status: any) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/DandR/NOC/Revert', {
        refId: nocId,
        remarks: dAndARRemarks?.Remarks,
        unitId: userRoles?.unitsAssigned[0]?.unitId,
        fkAutoId: user.EmpID,
      });
      console.log(response.data);
      if (response?.data?.success) {
        toast.success('Request updated successfully');
        fetchRequestsByTab(selectedUnit, activetab);
        setIsLoading(false);
        setIsOpen(false);
        setErrorRowsIndexs([]);
        setErrorRows({});
        setdAndARRemarksRemarks({});
      } else {
        toast.error(response.data.errorMessage);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleExcelDownload = async (purposeId, batchId) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`/DandR/NOC/download-excel?PurposeId=${purposeId}`, batchId, {
        responseType: 'blob', // this is crucial
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'DandR_Report.xlsx'); // file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const columns = [
    {
      accessorKey: 'refId',
      header: 'Reference ID',
      cell: ({ row }) => <div>{`${row.original.refId ? 'NOC-' + row.original.refId : 'NA'}`}</div>,
    },
    {
      accessorKey: 'displayBatchId',
      header: 'Batch ID',
      cell: ({ row }) => <div>{`${row.original.displayBatchId ? 'Batch-' + row.original.displayBatchId : 'NA'}`}</div>,
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
        <div className="flex items-center w-[120px]">
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
  const handleExcelPreview = async () => {
    try {
      if (!dAndARRemarks?.BulkExcel) {
        return null;
      }
      const payloadFormData = new FormData();
      payloadFormData.append('file', dAndARRemarks?.BulkExcel);
      const response = await axiosInstance.post('/Util/preview-excel', payloadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setExcelPreviewData(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    handleExcelPreview();
  }, [dAndARRemarks?.BulkExcel]);
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
        }}
        defaultValue="unit"
        value={activetab}
      >
        <TabsList>
          {reportStatus.map((ele) => {
            return <TabsTrigger value={ele.value}>{ele.label}</TabsTrigger>;
          })}
        </TabsList>
        {reportStatus.map((ele) => {
          return (
            <TabsContent value={ele.value}>
              <div>
                <div className="overflow-x-auto">
                  <TableList
                    data={filteredData}
                    columns={columns}
                    rowClassName={(row) => {
                      if (row.purposeName === 'Award') {
                        return `bg-yellow-100`;
                      }
                      if (row.purposeName === 'Probation Confirmation') {
                        return `bg-blue-50`;
                      }
                    }}
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
                              <SelectItem value="0">All Units</SelectItem>
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
                          onClick={() => fetchRequestsByTab(selectedUnit, activetab)}
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
      <DAndArNOCDetailDialog
        excelPreviewData={excelPreviewData}
        errorRowsIndexs={errorRowsIndexs}
        errorRows={errorRows}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        nocData={selectedRequest}
        handleApproveClick={handleApproveClick}
        handleGetTrailClick={handleApproveClick}
        revertBackToCorporateHr={revertBackToCorporateHr}
        setdAndARRemarksRemarks={setdAndARRemarksRemarks}
        corporateHrData={dAndARRemarks}
        AccecptButtonName={'Forward To Vigilance'}
        revertButtonName={'Revert To Corporate HR'}
        handleExcelDownload={handleExcelDownload}
        handleExcelPreview={handleExcelPreview}
        isEditable={true}
        setErrorRowsIndexs={setErrorRowsIndexs}
        setErrorRows={setErrorRows}
        setExcelPreviewData={setExcelPreviewData}
      />
    </div>
  );
};

export default ReceivedRequests;
