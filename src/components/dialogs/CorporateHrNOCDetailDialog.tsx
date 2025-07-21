import React from 'react';
import { User, FileText, Mail, Calendar, Download, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { formatKeyName, formatLabel } from '@/lib/helperFunction';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RequestStatus } from '@/constant/status';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { PDFDownloadLink } from '@react-pdf/renderer';
import EmployeeLeavePDF from '../common/PdfGenerator';

const CorporateHrNOCDetailDialog = ({
  nocData,
  isOpen,
  onOpenChange,
  setcorporateHrData,
  handleApproveClick,
  handleRejectClick,
  handleRevertClick,
  corporateHrData,
  rejectButtonName,
  AccecptButtonName,
  revertButtonName,
  isEditable = false,
  isFromVigilance = false,
  actionTaken=()=>{}
}) => {
  if (!nocData) return null;
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Handle different date formats
      let date;
      // Check if it's in DD-MMM-YYYY format (like "26-Nov-2024")
      if (dateString.includes('-') && dateString.split('-').length === 3) {
        const parts = dateString.split('-');
        if (parts[1].length === 3) {
          // Month is abbreviated (Nov, Dec, etc.)
          date = new Date(dateString);
        } else {
          date = new Date(dateString);
        }
      } else {
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) {
        return dateString; // Return original if parsing fails
      }

      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    } catch {
      return dateString;
    }
  };
  const navigate = useNavigate();
  console.log(nocData, 'NOC DATA');
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

  const renderFieldValue = (field) => {
    if (!field.value) return <span className="text-gray-400">Not provided</span>;

    if (field.fieldType === 'File') {
      return (
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-blue-600" />
          <span className="text-blue-600 cursor-pointer hover:underline">{field.value}</span>
        </div>
      );
    }

    if (field.fieldType === 'Date') {
      return formatDate(field.value);
    }
    return field.value;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()} // Prevents closing on outside click
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-6xl overflow-y-auto"
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              NOC Application Details
            </DialogTitle>
            <PDFDownloadLink
              document={<EmployeeLeavePDF data={nocData} />}
              fileName={`${nocData.refId || 'Sample'}-NOC.pdf`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 mr-0 md:mr-6 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
            </PDFDownloadLink>
          </div>
        </DialogHeader>

        <div className="space-y-6 max-w-6xl max-h-[70vh] overflow-y-auto">
          {/* Application Details */}
          <div className="bg-blue-50 p-4 rounded-lg">
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
                    <span>{formatDate(nocData.initiationDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Reference ID:</span>
                    <span>NOC-{nocData.refId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Purpose:</span>
                    <span>{nocData.purposeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Current Status:</span>
                    <Badge variant="outline">{nocData.currentStatus}</Badge>
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
                    <span>{nocData.employeeCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{nocData.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Post:</span>
                    <span>{nocData.post}</span>
                  </div>
                  {nocData?.purposeId === 47 && (
                    <>
                      {nocData.dob && (
                        <div className="flex justify-between">
                          <span className="font-medium">DOB:</span>
                          <span>{formatDate(nocData.dob)}</span>
                        </div>
                      )}
                      {nocData.dor && (
                        <div className="flex justify-between">
                          <span className="font-medium">DOR:</span>
                          <span>{formatDate(nocData.dor)}</span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Officer Remarks */}
          {(nocData?.officerRemarksR || nocData?.officerRemarks) && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Officer Remarks & Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(nocData?.officerRemarksR || nocData?.officerRemarks).map(([key, value]) => {
                  const isDateField = key.toLowerCase().includes('date');
                  const isFileField = key.toLowerCase().includes('file');
                  const formattedKey = formatKeyName(key);

                  if (formattedKey === 'Service Entry') return null;
                  if (
                    (formattedKey.toLowerCase().includes('unit') || formattedKey.toLowerCase().includes('cgm')) &&
                    nocData.unitId === 1 &&
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

          {nocData?.revision && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-red-500 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Officer Reverted Remarks & Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(nocData?.revision).map(([key, value]: [any, any]) => {
                  // Fields to skip
                  const skipFields = ['Pk Revert', 'Raised To', 'Objection For', 'Raised At'];

                  if (!nocData?.revision) return null;

                  const formattedKey = formatKeyName(key);
                  const isDateField = key.toLowerCase().includes('date');
                  const isFileField = key.toLowerCase().includes('file');

                  // Skip fields logic
                  if (formattedKey === 'Service Entry') return null;
                  if (formattedKey.toLowerCase().includes('unit')) return null;
                  if (formattedKey.toLowerCase().includes('pk revert')) return null;
                  if (skipFields.includes(formattedKey)) return null;

                  return (
                    <div key={key}>
                      <label className="text-sm font-medium text-gray-600">{formattedKey}</label>
                      {isFileField ? (
                        <div className="flex items-center gap-2 bg-red-500 p-3 rounded border">
                          {value && <Download className="w-4 h-4 text-blue-600" />}
                          <span className="text-blue-600 cursor-pointer hover:underline">{value || 'NA'}</span>
                        </div>
                      ) : (
                        <p className="bg-white p-3 rounded border">
                          {isDateField ? format(value, 'dd MMM yyyy') || value || 'NA' : value || 'NA'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Inputs */}
          {nocData.inputs && nocData.inputs.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Application Form Data
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {nocData.inputs.map((field, index) => (
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
          {nocData.tableInputs && nocData.tableInputs.length > 0 && (
            <div className="space-y-6 rounded-lg">
              {nocData.tableInputs.map((table, tableIndex) => (
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

          {/* CGM Input Section */}
          {isEditable && !isFromVigilance && (
            <div className="m-3 pb-4">
              <div>
                <Label>Enter Remarks</Label>
                <Textarea
                  value={corporateHrData?.remark || ''}
                  onChange={(e) =>
                    setcorporateHrData((pre) => ({
                      ...pre,
                      remark: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Enter remarks here..."
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          {isEditable && !isFromVigilance && (
            <>
              <Button
                onClick={() => handleApproveClick(nocData?.refId, RequestStatus.UnderDandAR.value)}
                className="bg-green-600 hover:bg-green-700"
              >
                {AccecptButtonName || 'Approve'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleRejectClick(nocData?.refId, RequestStatus.RejectedByCorporateHR.value)}
              >
                {rejectButtonName || 'Reject'}
              </Button>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600"
                onClick={() => handleRevertClick(nocData?.refId, RequestStatus.ParkedFile)}
              >
                {revertButtonName}
              </Button>
            </>
          )}
          {isFromVigilance && (
            <>
              <Button onClick={() => actionTaken(nocData?.refId, RequestStatus.ParkedFile.value)}>
                {'Action Taken'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  navigate(`/corporate-unit-hr-noc-requests-from-vigilance/noc-deatils/${nocData?.refId}`);
                }}
              >
                {'Forword To GM HR'}
              </Button>
            </>
          )}

          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CorporateHrNOCDetailDialog;
