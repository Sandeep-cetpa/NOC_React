import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axiosInstance from '@/services/axiosInstance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Calendar, FileText, XCircle, Download, Eye, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatKeyName, formatLabel } from '@/lib/helperFunction';
import Loader from '@/components/ui/loader';
import EmptyState from '@/components/ui/empty-state';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { RequestStatus } from '@/constant/status';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
interface Input {
  fieldName: string;
  fieldType: string;
  value: string;
  filledBy: string | null;
  inputTypeId: number | null;
}

interface TableRow {
  rowId: string;
  inputs: Input[];
}

interface TableInput {
  tblHeading: string;
  tableId: string;
  rows: TableRow[];
}

interface OfficerRemarks {
  [key: string]: string | null; // Making it dynamic to handle any field
}

interface UserData {
  employeeCode: string;
  username: string;
  post: string;
  department: string;
  unitName: string;
  unitId: number;
  dob: string;
  dor: string;
  positionGrade: string;
  purposeId: number;
  purposeName: string;
  currentStatus: string;
  initiationDate: string;
  refId: number;
  inputs: Input[];
  tableInputs: TableInput[];
  officerRemarksR: OfficerRemarks;
  rejectedRemarks: string | null;
}

interface ApiResponse {
  userData: UserData;
  title: string | null;
  subtitle: string;
  paragraph: string;
}

export default function GgmSubmissionNoting() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const { EmpID } = useAppSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  const { nocId } = useParams();
  const navigate = useNavigate();
  const getNocDetailsByNocId = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/CadreGm/NOC/Noting?RefId=${nocId}`);
      if (response?.data?.success && response?.data?.data?.userData) {
        setData(response.data.data);
      } else {
        setError('Failed to fetch NOC details');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const renderFieldValue = (input: Input) => {
    switch (input.fieldType.toLowerCase()) {
      case 'date':
        return formatDate(input.value);
      case 'file':
        return (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>File ID: {input.value}</span>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );
      case 'number':
        return new Intl.NumberFormat('en-IN').format(Number(input.value));
      default:
        return input.value;
    }
  };
  const submitRequest = async (status: string) => {
    try {
      const formData = new FormData();
      formData.append('remarks', remarks);
      formData.append('RefId', nocId);
      formData.append('Status', status.toString());
      formData.append('CadreGMUnitId', '1');
      formData.append('CadreGMAutoId', EmpID.toString());
      const response = await axiosInstance.put('/CadreGm/NOC', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        toast.success('Request submitted successfully');
        navigate('/ggm-request-received');
      }
    } catch (error) {
      console.log(error, 'error');
      toast.error('Something went wrong');
    }
  };
  useEffect(() => {
    if (nocId) {
      getNocDetailsByNocId();
    }
  }, [nocId]);
  const getFieldIcon = (fieldType) => {
    switch (fieldType?.toLowerCase()) {
      case 'file':
        return <FileText className="w-4 h-4" />;
      case 'date':
        return <Calendar className="w-4 h-4" />;
      case 'select':
        return <Eye className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <EmptyState />;
  }
  const { userData } = data;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className=" mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">NOC Noting</h1>
          </div>
          <Badge className={getStatusColor(userData?.currentStatus)}>{userData?.currentStatus}</Badge>
        </div>
        {/* Title and Subtitle */}
        {(data.title || data.subtitle) && (
          <Card>
            <CardContent className="pt-4">
              {data.title && <h2 className="text-xl font-semibold text-gray-900 mb-2">{data.title}</h2>}
              {data.subtitle && <p className="text-gray-700 leading-relaxed">{data.subtitle}</p>}
            </CardContent>
          </Card>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Request Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Initiation Date:</span>
                <span>{formatDate(userData?.initiationDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Reference ID:</span>
                <span>NOC-{userData?.refId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Purpose:</span>
                <span>{userData?.purposeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Current Status:</span>
                <Badge variant="outline">{userData?.currentStatus}</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Employee Code:</span>
                <span>{userData?.employeeCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{userData?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Post:</span>
                <span>{userData?.post}</span>
              </div>
              {userData?.purposeId === 47 && (
                <>
                  {userData?.dob && (
                    <div className="flex justify-between">
                      <span className="font-medium">DOB:</span>
                      <span>{formatDate(userData?.dob)}</span>
                    </div>
                  )}
                  {userData?.dor && (
                    <div className="flex justify-between">
                      <span className="font-medium">DOR:</span>
                      <span>{formatDate(userData?.dor)}</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Employee Information */}

          {/* Application Details */}
          <div className="lg:col-span-2 space-y-4">
            {userData?.inputs && userData?.inputs.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Application Form Data
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {userData?.inputs.map((field, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        {getFieldIcon(field.fieldType)}
                        <label className="text-sm font-medium text-gray-700">
                          {formatLabel
                            ? formatLabel(field.fieldName)
                            : field.fieldName.replace(/_/g, ' ').replace(/\*/g, '').toUpperCase()}
                        </label>
                      </div>
                      <div className="text-sm">
                        {renderFieldValue(field) === 'true'
                          ? 'Yes'
                          : renderFieldValue(field) === 'false'
                          ? 'No'
                          : renderFieldValue(field)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Table Inputs */}
            {userData?.tableInputs && userData?.tableInputs.length > 0 && (
              <div className="space-y-6 rounded-lg">
                {userData?.tableInputs.map((table, tableIndex) => (
                  <div key={table.tableId || tableIndex} className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {tableIndex + 1}
                      </span>
                      {table.tblHeading || 'Additional Data'}
                    </h3>
                    {table.rows && table.rows.length > 0 ? (
                      <div className="bg-white rounded-xl border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16 font-semibold text-white">SN.</TableHead>
                              {table.rows[0]?.inputs?.map((field, index) => (
                                <TableHead key={index} className="font-semibold">
                                  <div className="space-y-1">
                                    <div className="text-white">
                                      {formatLabel ? formatLabel(field.fieldName) : field.fieldName}
                                    </div>
                                  </div>
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {table.rows.map((row, rowIndex) => (
                              <TableRow key={row.rowId || rowIndex}>
                                <TableCell className="font-medium">{rowIndex + 1}</TableCell>
                                {table.rows[0]?.inputs?.map((headerField, colIndex) => {
                                  const matchingInput = row.inputs?.find(
                                    (input) => input.fieldName === headerField.fieldName
                                  );

                                  return (
                                    <TableCell key={colIndex}>
                                      {matchingInput ? (
                                        <div className="space-y-1">
                                          <div className="text-sm">
                                            {matchingInput.fieldType === 'Date'
                                              ? formatDate(matchingInput.value)
                                              : matchingInput.fieldType === 'number'
                                              ? matchingInput.value
                                                ? new Intl.NumberFormat('en-IN').format(matchingInput.value)
                                                : 'N/A'
                                              : matchingInput.value || <span className="text-gray-400">N/A</span>}
                                          </div>
                                        </div>
                                      ) : (
                                        <span className="text-gray-400 text-sm">N/A</span>
                                      )}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No data available for this table</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* Officer Remarks */}
            {(userData?.officerRemarksR || userData?.officerRemarks) && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Officer Remarks & Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(userData?.officerRemarksR || userData?.officerRemarks).map(([key, value]) => {
                    const isDateField = key.toLowerCase().includes('date');
                    const isFileField = key.toLowerCase().includes('file');
                    const formattedKey = formatKeyName(key);

                    if (formattedKey === 'Service Entry') return null;
                    if (
                      (formattedKey.toLowerCase().includes('unit') || formattedKey.toLowerCase().includes('cgm')) &&
                      userData?.unitId === 1 &&
                      formattedKey !== 'Present Unit' &&
                      formattedKey !== 'Past Unit'
                    ) {
                      return null;
                    }

                    return (
                      <div key={key}>
                        <label className="text-sm font-medium text-gray-600">{formattedKey}</label>
                        {isFileField ? (
                          <div className="flex items-center gap-2 bg-white p-3 rounded border">
                            {value && <Download className="w-4 h-4 text-blue-600" />}
                            <span className="text-blue-600 cursor-pointer hover:underline">{value || 'NA'}</span>
                          </div>
                        ) : (
                          <p className="bg-white p-3 rounded border">
                            {isDateField ? formatDate(value) || value || 'NA' : value || 'NA'}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rejected Remarks */}
            {userData?.rejectedRemarks && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Rejection Remarks:</strong> {userData?.rejectedRemarks}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
        {/* Rich Text Editor for Paragraph */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Noting Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: data.paragraph }} />
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 flex justify-end items-center gap-4">
        {(data?.userData?.purposeId === 48 || data?.userData?.purposeId === 45) && (
          <div className="flex flex-col w-full">
            <Textarea
              onChange={(e) => setRemarks(e.target.value)}
              value={remarks}
              rows={3}
              placeholder="Enter Remark (optional) "
            />
            <div className="flex gap-4 mt-2 justify-end mt-2">
              <Button onClick={() => submitRequest(RequestStatus.GGMAccepted.value.toString())}>Approve</Button>
              <Button variant="destructive" onClick={() => submitRequest(RequestStatus.GGMRejected.value.toString())}>
                Reject
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
