import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, Loader2, AlertCircle, CheckCircle2, Trash2, FileText, X, Upload } from 'lucide-react';
import { FormField } from '@/components/FormBuilder/FormField';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { formatLabel } from '@/lib/helperFunction';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  hiddenFieldsForExIndiaLeaveSponsored,
  hiddenFieldsForExIndiaLeaveThirdParty,
  hiddenFieldsForNewPaasport,
} from '@/config';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router';
import EnhancedDatePicker from './FormBuilder/EnhancedDatePicker';

const RenderForm = ({
  selectedForm,
  handleSubmit,
  formData,
  handleInputChange,
  tableRows,
  addNewRow,
  submitStatus,
  handleFieldChange,
  removeRow,
  isSubmitting,
  fileRef,
  missingFields,
  handleExcelPreview,
}) => {
  if (!selectedForm) return null;
  const location = useLocation();
  return (
    <div className="opacity-95">
      {selectedForm && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100">
          <CardHeader className="border-b">
            <CardTitle>{selectedForm.purposeName}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Number(selectedForm.purposeId) === 47 && formData.isDirector && (
                  <div className="flex flex-col">
                    <Label className="mb-2">Father's Name</Label>
                    <Input
                      type="text"
                      className={`flex items-center py-1 pl-3 ${
                        missingFields?.includes('FatherName') ? 'border-2 border-red-500' : 'border-[1px]'
                      } rounded-md`}
                      disabled={false}
                      placeholder="Enter father name"
                      value={formData['FatherName']}
                      onChange={(value) => handleInputChange('FatherName', value?.target?.value)}
                    />
                  </div>
                )}

                {Number(selectedForm.purposeId) === 47 &&
                  formData.isDirector &&
                  location.pathname !== '/create-request' && (
                    <>
                      <div className="flex flex-col">
                        <Label className="mb-2">Date Of Joining</Label>
                        <EnhancedDatePicker
                          missingField={missingFields?.includes('doj')}
                          selectedDate={formData['doj'] ? new Date(formData['doj']) : null}
                          onChange={(date: any) => {
                            handleInputChange('doj', date ? date.toISOString().split('T')[0] : '');
                          }}
                          dateFormat="dd MMM yyyy"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>

                      <div className="flex flex-col">
                        <Label className="mb-2">Date Of Retirement</Label>
                        <EnhancedDatePicker
                          missingField={missingFields?.includes('dor')}
                          selectedDate={formData['dor'] ? new Date(formData['dor']) : null}
                          onChange={(date: any) =>
                            handleInputChange('dor', date ? date.toISOString().split('T')[0] : '')
                          }
                          dateFormat="dd MMM yyyy"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </>
                  )}

                {selectedForm?.fields
                  ?.filter((item) => !item?.isInTableValue && item?.filledBy === null)
                  ?.filter((item) => !(selectedForm?.purposeId === 53 && item?.fieldId === 153))
                  ?.filter((item) => !(selectedForm?.purposeId === 57 && item?.fieldId === 168))
                  .filter((ele) => {
                    const fieldId = Number(ele?.fieldId);
                    if (!formData['122'] && hiddenFieldsForNewPaasport?.includes(fieldId)) {
                      return false;
                    }
                    if (Number(selectedForm.purposeId) === 49) {
                      const value134 = formData[134];
                      if (value134 == '18' && hiddenFieldsForExIndiaLeaveSponsored.includes(fieldId)) {
                        return false;
                      }
                      if (value134 == '20' && hiddenFieldsForExIndiaLeaveThirdParty.includes(fieldId)) {
                        return false;
                      }
                    }
                    return true;
                  })
                  .map((field, index) => (
                    <React.Fragment key={`fragment-${field.fieldId}`}>
                      {/* Insert Director Switch at index 3 for purposeId 47 */}
                      {index === 2 && Number(selectedForm?.purposeId) === 47 && (
                        <div key="director-switch" className="flex flex-col">
                          <Label className="mb-2">Board Lavel positions</Label>
                          <div className="flex items-center">
                            <Switch
                              className="cursor-pointer"
                              disabled={false}
                              checked={formData['isDirector']}
                              onCheckedChange={(value) => {
                                handleInputChange('isDirector', value);
                              }}
                            />
                            <span className="ml-2">{formData.isDirector ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      )}

                      {/* Original field */}
                      <div key={field.fieldId}>
                        {field.jid !== 'checkbox' && (
                          <Label htmlFor={field?.fieldId} className="block mb-1 text-sm font-medium">
                            {formatLabel(field?.fieldName)}
                            {field?.fieldName.includes('*') && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                        )}
                        <FormField
                          className={
                            missingFields?.includes(Number(field?.fieldId))
                              ? 'border-2 border-red-500'
                              : field?.jid === 'File'
                              ? 'border-[1px]'
                              : ''
                          }
                          fileRef={fileRef}
                          field={field}
                          value={formData[field?.jid === 'File' ? `File${field?.fieldId}` : field?.fieldId]}
                          onChange={(value) => handleInputChange(field?.fieldId, value, field?.jid)}
                          purposeId={selectedForm?.purposeId}
                        />
                        {missingFields?.includes(field?.fieldId) && (
                          <p className="text-xs text-red-500 mt-1">
                            {missingFields?.includes(field?.fieldId) ? 'This field is required.' : ''}
                          </p>
                        )}
                      </div>
                    </React.Fragment>
                  ))}

                {/* Fallback: If there are fewer than 4 fields and purposeId is 47, show the switch at the end */}
                {Number(selectedForm?.purposeId) === 47 &&
                  selectedForm?.fields
                    ?.filter((item) => !item?.isInTableValue && item?.filledBy === null)

                    .filter((ele) => {
                      const fieldId = Number(ele?.fieldId);
                      if (!formData['122'] && hiddenFieldsForNewPaasport?.includes(fieldId)) {
                        return false;
                      }
                      return true;
                    }).length < 4 && (
                    <div className="flex flex-col">
                      <Label className="mb-2">Applying for Post of Director</Label>
                      <div className="flex items-center">
                        <Switch
                          className="cursor-pointer"
                          disabled={false}
                          checked={formData['isDirector']}
                          onCheckedChange={(value) => {
                            handleInputChange('isDirector', value);
                          }}
                        />
                        <span className="ml-2">{formData.isDirector ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  )}

                {Number(selectedForm.purposeId) === 47 && formData.isDirector && (
                  <>
                    <div className="flex flex-col">
                      <Label className="mb-2">
                        Service to which officer belongs including batch/year cadre etc. wherever applicable.
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter batch year"
                        className="cursor-pointer"
                        value={formData['BatchYear']}
                        onChange={(value) => handleInputChange('BatchYear', value?.target?.value)}
                      />
                      {missingFields?.includes('BatchYear') && (
                        <p className="text-xs text-red-500 mt-1">This is a required field</p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <Label className="mb-2">Date of Entry into Service</Label>

                      <EnhancedDatePicker
                        selectedDate={formData['ServiceEntry'] ? new Date(formData['ServiceEntry']) : null}
                        onChange={(date: any) =>
                          handleInputChange('ServiceEntry', date ? date.toISOString().split('T')[0] : '')
                        }
                        dateFormat="dd MMM yyyy"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </>
                )}
                {selectedForm.purposeId !== 53 && selectedForm.purposeId !== 57 && (
                  <>
                    <div className="flex flex-col">
                      <Label className="mb-2">Upload IPR</Label>

                      {/* Check if file is selected - assuming you have a state variable for the selected file */}
                      {formData.iprFile ? (
                        // Show selected file with remove option
                        <div
                          className={`flex items-center justify-between p-3 border rounded-md bg-gray-50 ${
                            missingFields?.includes('iprFile') ? 'border-2 border-red-500' : 'border-[1px]'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-5 h-5 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                              {formData.iprFile.name || 'Selected file'}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(formData.iprFile.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              handleInputChange('iprFile', null);
                              if (fileRef && fileRef.current) {
                                fileRef.current.value = '';
                              }
                            }}
                            disabled={false}
                            className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove file"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        // Show file input when no file selected
                        <div
                          className={`flex items-center py-1 pl-1 ${
                            missingFields?.includes('iprFile') ? 'border-2 border-red-500' : 'border-[1px]'
                          } rounded-md`}
                        >
                          <input
                            ref={fileRef}
                            type="file"
                            accept=".pdf,.xlsx,.xls"
                            className="cursor-pointer w-full"
                            disabled={false}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Validate file type
                                const allowedTypes = [
                                  'application/pdf',
                                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                  'application/vnd.ms-excel',
                                ];
                                if (allowedTypes.includes(file.type)) {
                                  handleInputChange('iprFile', file);
                                } else {
                                  alert('Please select only PDF or Excel files (.pdf, .xlsx, .xls)');
                                  e.target.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-1">Allowed formats: PDF, Excel (.xlsx, .xls)</p>

                      {/* Show error message if field is missing */}
                      {missingFields?.includes('iprFile') && (
                        <p className="text-xs text-red-500 mt-1">This is a required field</p>
                      )}
                    </div>
                    <div className={`flex flex-col `}>
                      <Label className="mb-2">IPR Date</Label>
                      <EnhancedDatePicker
                        missingField={missingFields?.includes('iprDate')}
                        selectedDate={formData['iprDate'] ? new Date(formData['iprDate']) : null}
                        onChange={(date: any) =>
                          handleInputChange('iprDate', date ? date.toISOString().split('T')[0] : '')
                        }
                        dateFormat="dd MMM yyyy"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      {missingFields?.includes('iprDate') && (
                        <p className="text-xs text-red-500 mt-1">This is a required field</p>
                      )}
                    </div>
                  </>
                )}
                {((selectedForm.purposeId === 53 && location.pathname === '/corporate-unit-hr-request-for-employee') ||
                  (selectedForm.purposeId === 57 && location.pathname === '/d-and-ar-raise-requests')) && (
                  <>
                    <div>
                      <div className="flex flex-col">
                        <Label className="mb-2">Upload Excel</Label>
                        <div
                          className={`flex items-center py-1 pl-1 ${
                            missingFields?.includes('BulkExcel') ? 'border-2 border-red-500' : 'border-[1px]'
                          } rounded-md`}
                        >
                          {formData['BulkExcel'] ? (
                            // Show selected file with close button
                            <div className="flex items-center justify-between w-full px-2 py-1">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700 truncate" title={formData['BulkExcel'].name}>
                                  {formData['BulkExcel'].name}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleInputChange('BulkExcel', null)}
                                className="h-6 w-6 p-0 hover:bg-red-100"
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ) : (
                            // Show file input
                            <div className="flex items-center w-full">
                              <input
                                type="file"
                                accept=".xlsx, .xls"
                                className="cursor-pointer flex-1"
                                disabled={false}
                                onChange={(value) => {
                                  handleInputChange('BulkExcel', value?.target?.files[0]);
                                }}
                              />
                              {missingFields?.includes('BulkExcel') && (
                                <p className="text-xs text-red-500 mt-1">This is a required field</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-5"
                        type="button"
                        onClick={() => {
                          window.location.href = 'https://uat.dfccil.com/DocUpload/Promotion_Template.xlsx';
                        }}
                      >
                        Download Excel Template
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {selectedForm &&
                ((Number(selectedForm.purposeId) === 47 && formData.isDirector && selectedForm.isInTableValue) ||
                  (Number(selectedForm.purposeId) !== 47 && selectedForm.isInTableValue)) && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell className="font-medium w-2">SN.</TableCell>
                          {selectedForm?.fields
                            ?.filter((item) => item?.isInTableValue && !item?.filledBy)
                            .filter((ele) =>
                              !formData['122'] ? !hiddenFieldsForNewPaasport?.includes(Number(ele?.fieldId)) : true
                            )
                            .map((field) => (
                              <TableCell key={field?.fieldId} className="font-medium">
                                <Label htmlFor={field?.fieldId} className="block mb-1 text-sm font-medium">
                                  {formatLabel(field?.fieldName)}
                                </Label>
                              </TableCell>
                            ))}
                          <TableCell className="font-medium w-4">Action</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(tableRows).map(([uuid, fields], index) => (
                          <TableRow key={uuid}>
                            <TableCell className="w-2">{index + 1}</TableCell>
                            {Object.entries(fields).map(([fieldId, value]) => {
                              const field = selectedForm?.fields?.find((f) => Number(f?.fieldId) === Number(fieldId));
                              if (!field) return null;
                              return (
                                <TableCell key={fieldId}>
                                  <FormField
                                    field={field}
                                    value={formData[uuid]?.[fieldId] ?? value}
                                    onChange={(newValue) => handleFieldChange(uuid, fieldId, newValue)}
                                    purposeId={selectedForm.purposeId}
                                  />
                                </TableCell>
                              );
                            })}
                            <TableCell>
                              <Button
                                disabled={Object.keys(tableRows).length === 1}
                                onClick={() => removeRow(uuid)}
                                type="button"
                              >
                                <Trash2 />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

              {/* {submitStatus && (
                <Alert
                  className={
                    submitStatus.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                  }
                >
                  <div className="flex items-center space-x-2">
                    {submitStatus.type === 'error' ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                    <AlertDescription className={submitStatus.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                      {submitStatus.message}
                    </AlertDescription>
                  </div>
                </Alert>
              )} */}

              <div className="flex justify-between">
                {selectedForm &&
                  selectedForm?.isInTableValue &&
                  (selectedForm.purposeId !== 47 || (selectedForm.purposeId === 47 && formData.isDirector)) && (
                    <Button type="button" onClick={addNewRow}>
                      Add Row
                    </Button>
                  )}
              </div>

              {Number(selectedForm?.purposeId) === 47 &&
                formData?.isDirector &&
                location?.pathname !== '/create-request' && (
                  <div>
                    <Label htmlFor="remarks">Remarks:</Label>
                    <Input
                      className={`mt-1 ${
                        missingFields?.includes('remarks') ? 'border-2 border-red-500' : 'border-[1px]'
                      } rounded-md`}
                      value={formData['remarks']}
                      name="remarks"
                      onChange={(event) => handleInputChange('remarks', event.target.value)}
                      placeholder="Enter remarks here..."
                      type="text"
                    />
                    {missingFields?.includes('remarks') && (
                      <p className="text-xs text-red-500 mt-1">This is a required field</p>
                    )}
                  </div>
                )}
              {selectedForm.purposeId === 53 && location.pathname === '/corporate-unit-hr-request-for-employee' && (
                <>
                  <Button type="button" onClick={handleExcelPreview}>
                    Preview File
                  </Button>
                  <Button
                    variant="outline"
                    className="ml-3"
                    type="button"
                    onClick={() => {
                      window.location.href = 'https://uat.dfccil.com/DocUpload/ProbationTemplate.xlsx';
                    }}
                  >
                    Download Excel Template
                  </Button>
                </>
              )}
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Form
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </div>
      )}
    </div>
  );
};

export default RenderForm;
