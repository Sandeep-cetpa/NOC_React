import React from 'react';
import { User, FileText, Mail, Calendar, Download, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { formatKeyName, formatLabel } from '@/lib/helperFunction';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RequestStatus } from '@/constant/status';
import ExcelDataPreview from '../common/ExcelPreview';
import { environment } from '@/config';
import { PDFDownloadLink } from '@react-pdf/renderer';
import EmployeeLeavePDF from '../common/PdfGenerator';

const DAndArNOCDetailDialog = ({
  nocData,
  isOpen,
  onOpenChange,
  setdAndARRemarksRemarks,
  handleApproveClick,
  handleGetTrailClick,
  revertBackToCorporateHr,
  corporateHrData,
  AccecptButtonName,
  revertButtonName,
  isEditable = false,
  handleExcelDownload,
  handleExcelPreview,
  excelPreviewData,
  errorRows,
  errorRowsIndexs,
  setErrorRowsIndexs,
  setErrorRows,
  setExcelPreviewData,
  isFromVigilance = false,
  sendDownloadedExcelUser = (data: any) => {},
  downloadedExcelUserIds = [],
}) => {
  if (!nocData) return null;
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
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
        return dateString;
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
        <div
          onClick={() => {
            window.open(`${environment?.FileBaseUrl}/${field.value}`, '_blank');
          }}
          className="flex items-center gap-2"
        >
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
  const downloadExcelOfUserData = async (data, fileName = 'DandARReport.xlsx') => {
    const updatedData = [...data];
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    updatedData.forEach((row, rowIndex) => {
      const newRow = worksheet.addRow(row);
      if (rowIndex > 0 && downloadedExcelUserIds.includes(Number(row[0]))) {
        newRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF00' }, // Yellow
          };
        });
      }
    });
    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const value = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, value.length);
      });
      column.width = maxLength + 2;
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
    sendDownloadedExcelUser(nocData);
  };
  const handleClose = () => {
    setdAndARRemarksRemarks({});
    setErrorRowsIndexs([]);
    setErrorRows({});
    setExcelPreviewData([]);
    onOpenChange(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white mr-0 md:mr-6  rounded-lg hover:bg-blue-700 transition-colors"
            >
              {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
            </PDFDownloadLink>
          </div>
        </DialogHeader>
        <div className="space-y-6 max-w-6xl max-h-[70vh] overflow-y-auto">
          <div className="">
            {/* Application Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              {!nocData?.data ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Request Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {nocData.initiationDate && (
                        <div className="flex justify-between">
                          <span className="font-medium">Initiation Date:</span>
                          <span>{formatDate(nocData.initiationDate)}</span>
                        </div>
                      )}

                      {nocData.displayBatchId ? (
                        <div className="flex justify-between">
                          <span className="font-medium">Batch ID:</span>
                          <span>NOC-{nocData.displayBatchId || 'N/A'}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <span className="font-medium">Reference ID:</span>
                          <span>NOC-{nocData.refId || 'N/A'}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="font-medium">Purpose:</span>
                        <span>{nocData.purposeName}</span>
                      </div>
                      {nocData.currentStatus && (
                        <div className="flex justify-between">
                          <span className="font-medium">Current Status:</span>
                          <Badge variant="outline">{nocData.currentStatus}</Badge>
                        </div>
                      )}
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="">
                    <span className="font-medium">Batch ID : </span>
                    <span> Batch-{nocData.displayBatchId || 'N/A'}</span>
                  </div>
                  <div className="">
                    <span className="font-medium">Purpose : </span>
                    <span>{nocData.purposeName}</span>
                  </div>
                </div>
              )}
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

                    return (
                      <div key={key}>
                        <label className="text-sm font-medium text-gray-600">{formattedKey}</label>
                        {isFileField ? (
                          <div className="flex items-center gap-2 bg-white p-3 rounded border">
                            {value && <Download className="w-4 h-4 text-blue-600" />}
                            <span
                              onClick={() => {
                                window.open(`${environment?.FileBaseUrl}/${value}`, '_blank');
                              }}
                              className="text-blue-600 cursor-pointer hover:underline"
                            >
                              {value || 'NA'}
                            </span>
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

            {/* Form Inputs */}
            {nocData?.inputs && nocData?.inputs?.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Application Form Data
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {nocData?.inputs.map((field, index) => (
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
            {(nocData?.fkPurposeId === 54 || nocData?.fkPurposeId === 53 || nocData?.fkPurposeId === 57) && (
              <ExcelDataPreview excelData={nocData?.data} data={nocData?.data} />
            )}
            {isEditable && nocData?.unitId === 1 && (
              <div className="m-2">
                <div>
                  <Label>Pertaining to Present Unit:</Label>
                  <Textarea
                    value={corporateHrData?.PresentUnit || ''}
                    onChange={(e) =>
                      setdAndARRemarksRemarks((pre) => ({
                        ...pre,
                        PresentUnit: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Enter present unit here..."
                    className="mt-1"
                  />
                </div>
                <div className="mt-3">
                  <Label>Pertaining to Past Unit:</Label>
                  <Textarea
                    value={corporateHrData?.PastPosition || ''}
                    onChange={(e) =>
                      setdAndARRemarksRemarks((pre) => ({
                        ...pre,
                        PastPosition: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Enter past unit here..."
                    className="mt-1"
                  />
                </div>
              </div>
            )}
            {/* CGM Input Section */}
            {isEditable && !nocData.data && (
              <div className="m-2 pb-1">
                <div>
                  <Label>Any Other Remarks</Label>
                  <Textarea
                    value={corporateHrData?.Remarks || ''}
                    onChange={(e) =>
                      setdAndARRemarksRemarks((pre) => ({
                        ...pre,
                        Remarks: e.target.value,
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
          {nocData?.data && !isFromVigilance && (
            <div className="flex flex-wrap">
              <div className="flex flex-col">
                <Label className="mb-2">Upload Excel</Label>
                <div className="py-1 pl-1 border rounded-md">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    className="cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setdAndARRemarksRemarks((prev) => ({
                          ...prev,
                          BulkExcel: file,
                        }));
                      } else {
                        setdAndARRemarksRemarks((prev) => ({
                          ...prev,
                          BulkExcel: null,
                        }));
                      }
                      setErrorRowsIndexs([]);
                      setErrorRows({});
                      setExcelPreviewData([]);
                      handleExcelPreview();
                    }}
                  />
                </div>
              </div>
              {nocData?.fkPurposeId === 54 && !isFromVigilance && (
                <div className="flex flex-col ml-0 md:ml-5">
                  <Label className="mb-2">Upload IPR</Label>
                  <div className="py-1 pl-1 border rounded-md">
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      className="cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setdAndARRemarksRemarks((prev) => ({
                            ...prev,
                            iprFile: file,
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {(nocData?.fkPurposeId === 54 || nocData?.fkPurposeId === 53) && excelPreviewData?.length > 0 && (
            <div className="">
              <h1 className="mb-2 text-2xl text-gray-800">Uploaded Excel Preview</h1>
              <ExcelDataPreview
                errorMessages={errorRows}
                errorRowIndexes={errorRowsIndexs}
                excelData={excelPreviewData}
                data={excelPreviewData}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          {isEditable && !nocData.data && (
            <>
              <Button
                variant="destructive"
                // onClick={() => handleGetTrailClick(nocData?.refId, RequestStatus.RejectedByCorporateHR.value)}
              >
                Get Trail
              </Button>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600"
                onClick={() => revertBackToCorporateHr(nocData?.refId)}
              >
                {revertButtonName}
              </Button>
              <Button
                onClick={() => handleApproveClick(nocData?.refId, RequestStatus.SentToVigilanceUser.value)}
                className="bg-green-600 hover:bg-green-700"
              >
                {AccecptButtonName || 'Approve'}
              </Button>
            </>
          )}
          {isEditable && nocData.data && (
            <>
              {nocData?.fkPurposeId === 54 && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    const cleanedUrl = environment.apiUrl.replace('/api', '');
                    window.open(`${cleanedUrl}/upload/vigilance/grid.xlsx`);
                  }}
                >
                  Download Citation
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() =>
                  isFromVigilance
                    ? downloadExcelOfUserData(nocData.data)
                    : handleExcelDownload(nocData?.fkPurposeId, nocData.batchId)
                }
              >
                Download Excel
              </Button>
              {!isFromVigilance && (
                <Button
                  onClick={() => handleApproveClick(nocData?.refId, RequestStatus.SentToVigilanceUser.value)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit
                </Button>
              )}
            </>
          )}
          <Button
            onClick={() => {
              handleClose();
            }}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DAndArNOCDetailDialog;
