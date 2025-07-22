import React from 'react';
import { CalendarDays, User, FileText, Mail, Calendar, Download, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { formatKeyName, formatLabel } from '@/lib/helperFunction';
import { Badge } from '../ui/badge';
import { PDFDownloadLink } from '@react-pdf/renderer';
import EmployeeLeavePDF from '../common/PdfGenerator';
import { environment } from '@/config';

const UserNOCDetailsDialog = ({ nocData, isOpen, onOpenChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
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
  if (!nocData) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()} // Prevents closing on outside click
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-6xl "
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
              className="inline-flex items-center px-4 py-2 bg-blue-600 mr-0 md:mr-6  text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
            </PDFDownloadLink>
          </div>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Application Details */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Application Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Initiation Date</label>
                <p className="p-2 pl-0">{formatDate(nocData.initiationDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Reference ID</label>
                <p className="font-bold text-sm p-2 pl-0 rounded">NOC-{nocData.refId || 'N/A'}</p>
              </div>
            </div>
          </div>
          {/* Other Fields */}
          {(nocData?.officerRemarksR || nocData?.officerRemarks) && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Officer Remarks & Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(nocData?.officerRemarks || nocData?.officerRemarksR).map(([key, value]) => {
                  // Check if the field is a date field
                  const isDateField = key.toLowerCase().includes('date');

                  // Check if the field is a file field
                  const isFileField = key.toLowerCase().includes('file');

                  const formattedKey = formatKeyName(key);

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
                            {value ? value : 'NA'}
                          </span>
                        </div>
                      ) : (
                        <p className="bg-white p-3 rounded border">
                          {isDateField ? (formatDate(value) ? formatDate(value) : value) : 'NA'}
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
            <div className="bg-yellow-50 p-3 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Application Form Data
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {nocData.inputs.map((field, index) => (
                  <div key={index} className="bg-white p-2 pl-4 rounded-2xl border">
                    <div className="flex items-center gap-2 mb-2">
                      {getFieldIcon(field.fieldType)}
                      <label className="text-sm font-medium text-gray-700">{formatLabel(field.fieldName)}</label>
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
                              <TableHead key={index} className="font-semibold text-white">
                                <div className="space-y-1">
                                  <div>{formatLabel(field.fieldName)}</div>
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
                                // Find the corresponding value in this row
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
        </div>
        {/* <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div> */}
      </DialogContent>
    </Dialog>
  );
};

export default UserNOCDetailsDialog;
