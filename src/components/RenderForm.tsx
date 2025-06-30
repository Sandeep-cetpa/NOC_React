import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, Loader2, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
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
}) => {
  if (!selectedForm) return null;
  console.log(missingFields);
  return (
    <div className="opacity-95">
      {selectedForm && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100">
          <CardHeader className="border-b">
            <CardTitle>{selectedForm.purposeName}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                // e.preventDefault();
                handleSubmit(e);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Number(selectedForm.purposeId) === 47 && formData.isDirector && (
                  <div className="flex flex-col ">
                    <Label className="mb-2">Father's Name</Label>
                    <div className="flex items-center  py-1 pl-1">
                      <Input
                        type="text"
                        className="cursor-pointer"
                        disabled={false}
                        placeholder="Enter father name"
                        value={formData['FatherName']}
                        onChange={(value) => handleInputChange('FatherName', value?.target?.value)}
                      />
                    </div>
                  </div>
                )}
                {selectedForm?.fields
                  ?.filter((item) => !item?.isInTableValue && item?.filledBy === null)
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
                  .map((field) => (
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
                    </div>
                  ))}
                {Number(selectedForm?.purposeId) === 47 && (
                  <div className="flex flex-col ">
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
                    <div className="flex flex-col ">
                      <Label className="mb-2">
                        Service to which officer belongs including batch/year cadre etc. wherever applicable.
                      </Label>
                      <div className="flex items-center  py-1 pl-1">
                        <Input
                          type="text"
                          placeholder="Enter batch year"
                          className="cursor-pointer ml-2"
                          value={formData['BatchYear']}
                          onChange={(value) => handleInputChange('BatchYear', value?.target?.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col ">
                      <Label className="mb-2">Date of Entry into Service</Label>
                      <div className="flex items-center  py-1 pl-1">
                        <Input
                          type="date"
                          className="cursor-pointer ml-2"
                          value={formData['ServiceEntry']}
                          onChange={(value) => handleInputChange('ServiceEntry', value?.target?.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="flex flex-col ">
                  <Label className="mb-2">Upload IPR</Label>
                  <div
                    className={`flex items-center  py-1 pl-1 ${
                      missingFields?.includes('iprFile') ? 'border-2 border-red-500' : 'border-[1px]'
                    } rounded-md `}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      className=" cursor-pointer"
                      disabled={false}
                      onChange={(value) => {
                        handleInputChange('iprFile', value?.target?.files[0]);
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col ">
                  <Label className="mb-2">IPR Date</Label>
                  <div
                    className={`flex items-center  py-1 pl-1 ${
                      missingFields?.includes('iprFile') ? 'border-2 border-red-500' : 'border-[1px]'
                    } rounded-md `}
                  >
                    <input
                      className="ml-2 cursor-pointer"
                      type="date"
                      value={formData['iprDate1']}
                      onChange={(value) => handleInputChange('iprDate1', value?.target?.value)}
                    />
                  </div>
                </div>
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

              {submitStatus && (
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
              )}
              <div className="flex justify-between">
                {selectedForm &&
                  selectedForm?.isInTableValue &&
                  (selectedForm.purposeId !== 47 || (selectedForm.purposeId === 47 && formData.isDirector)) && (
                    <Button type="button" onClick={addNewRow}>
                      Add Row
                    </Button>
                  )}
              </div>
              <div>
                <Input
                  value={formData.remarks}
                  name="remarks"
                  onChange={(event) => handleInputChange(event.target.name, event.target.value)}
                  placeholder="Enter remarks here..."
                  type="text"
                />
              </div>
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
