import { useEffect, useState } from 'react';
import Heading from '@/components/ui/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Send, Loader2, AlertCircle, CheckCircle2, FormInput, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormField } from '@/components/FormBuilder/FormField';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { v4 as uuidv4 } from 'uuid';
import { formatLabel } from '@/lib/helperFunction';
import Select from 'react-select';
import forms from '../../../purposes.json';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  hiddenFieldsForExIndiaLeaveSponsored,
  hiddenFieldsForExIndiaLeaveThirdParty,
  hiddenFieldsForNewPaasport,
} from '@/config';
interface FormField {
  FieldId: string;
  DataType: String;
  FieldName: string;
  Options?: string[];
  jid: String;
  isInTableValue: boolean;
  filledBy: any;
}
interface Form {
  PurposeId: string;
  PurposeName: string;
  Fields: FormField[];
  isInTableValue?: boolean;
}
const CreateRequest = () => {
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [submitStatus, setSubmitStatus] = useState<{ type: string; message: string } | null>(null);
  const { toast } = useToast();
  const handleFormSelect = (formId: string) => {
    const form = forms.find((f) => String(f.PurposeId) === formId);
    setSelectedForm(form || null);
    if (Number(formId) === 48) {
      setFormData({ 142: true });
    } else {
      setFormData({});
    }
    setSubmitStatus(null);
  };
  const handleInputChange = (fieldId: string, value: any, fieldType?: any) => {
    const key = fieldType === 'File' ? `File${fieldId}` : fieldId;
    if (Number(fieldId) === 142) {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
        ['122']: false,
      }));
    } else if (Number(fieldId) === 122) {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
        ['142']: false,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };
  const validateForm = () => {
    if (!selectedForm) return false;
    const requiredFields = selectedForm.Fields.filter((field) => field.FieldName.includes('*'));
    const missingFields = requiredFields.filter((field) => !formData[field.FieldId]);

    if (missingFields.length > 0) {
      setSubmitStatus({
        type: 'error',
        message: `Please fill in the required fields: ${missingFields.map((f) => formatLabel(f.FieldName)).join(', ')}`,
      });
      return false;
    }
    return true;
  };
  useEffect(() => {
    if (selectedForm && selectedForm.Fields.length > 0) {
      const initialUUID = uuidv4();
      const initialObject = {};
      selectedForm?.Fields?.filter((item) => item?.isInTableValue && !item.filledBy).forEach((field) => {
        initialObject[field.FieldId] = ''; // Initialize with empty string
      });
      const formattedData = {
        [initialUUID]: initialObject,
      };
      setTableRows(formattedData);
    }
  }, [selectedForm]);
  const handleFieldChange = (uuid, fieldId, value) => {
    setTableRows((prevData) => ({
      ...prevData,
      [uuid]: {
        ...prevData[uuid],
        [fieldId]: value,
      },
    }));
  };
  const addNewRow = () => {
    const newUUID = uuidv4();
    const newRowObject = {};
    selectedForm.Fields?.filter((item) => item?.isInTableValue && !item.filledBy).forEach((field) => {
      newRowObject[field.FieldId] = '';
    });
    setTableRows((prev) => ({
      ...prev,
      [newUUID]: newRowObject,
    }));
  };
  const removeRow = (uuidToRemove) => {
    setTableRows((prev) => {
      const updated = Object.entries(prev)
        .filter(([uuid]) => uuid !== uuidToRemove)
        .reduce((acc, [uuid, fields]) => {
          acc[uuid] = fields;
          return acc;
        }, {});
      return updated;
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData[122]) {
      if (!validateForm()) return;
    }
    if (!formData.iprFile) {
      setSubmitStatus({
        type: 'error',
        message: `Please upload IPR File to proceed`,
      });
      return;
    }
    if (!formData.iprDate1) {
      setSubmitStatus({
        type: 'error',
        message: `Please fill IPR date to proceed`,
      });
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const submission = {
        purposeId: selectedForm?.PurposeId,
        ...formData,
        ...tableRows,
      };
      console.log(submission);
      setSubmitStatus({
        type: 'success',
        message: 'Form submitted successfully!',
      });

      toast({
        title: 'Success!',
        description: 'Your form has been submitted successfully.',
        duration: 5000,
      });
      setFormData({});
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit form. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <Heading type={2}>Create Request</Heading>
        </div>
      </div>
      {
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FormInput className="h-5 w-5 text-blue-500" />
              <span className="text-lg">Select a purpose</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {forms?.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No forms available</p>
              </div>
            ) : (
              <div className="space-y-4 mt-0 w-full md:w-1/3 md:pr-2">
                <Select
                  options={forms.map((form) => ({ label: form.PurposeName, value: String(form.PurposeId) }))}
                  onChange={(e) => handleFormSelect(e?.value)}
                  value={
                    selectedForm
                      ? { label: selectedForm?.PurposeName, value: selectedForm?.PurposeId }
                      : { label: 'Please select the purpose' }
                  }
                  className=" bg-white"
                  placeholder="Select Purpose"
                />
              </div>
            )}
          </CardContent>
        </Card>
      }
      {selectedForm && (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{selectedForm.PurposeName}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                // e.preventDefault();
                handleSubmit(e);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Number(selectedForm.PurposeId) === 47 && formData.isDirector && (
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
                {selectedForm?.Fields?.filter((item) => !item?.isInTableValue && item?.filledBy === null)
                  .filter((ele) => {
                    const fieldId = Number(ele?.FieldId);
                    if (!formData['122'] && hiddenFieldsForNewPaasport?.includes(fieldId)) {
                      return false;
                    }
                    if (Number(selectedForm.PurposeId) === 49) {
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
                    <div key={field.FieldId}>
                      {field.jid !== 'checkbox' && (
                        <Label htmlFor={field?.FieldId} className="block mb-1 text-sm font-medium">
                          {formatLabel(field?.FieldName)}
                          {field?.FieldName.includes('*') && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                      )}
                      <FormField
                        field={field}
                        value={formData[field?.jid === 'File' ? `File${field?.FieldId}` : field?.FieldId]}
                        onChange={(value) => handleInputChange(field?.FieldId, value, field?.jid)}
                        purposeId={selectedForm?.PurposeId}
                      />
                    </div>
                  ))}
                {Number(selectedForm?.PurposeId) === 47 && (
                  <div className="flex flex-col ">
                    <Label className="mb-2">Applying for Post of Director</Label>
                    <div className="flex items-center">
                      <Switch
                        className="cursor-pointer"
                        disabled={false}
                        checked={formData['isDirector']}
                        onCheckedChange={(value) => handleInputChange('isDirector', value)}
                      />
                      <span className="ml-2">{formData.isDirector ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                )}
                {Number(selectedForm.PurposeId) === 47 && formData.isDirector && (
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
                  <div className="flex items-center  py-1 pl-1  border-[1px] rounded-md ">
                    <input
                      type="file"
                      className="cursor-pointer"
                      disabled={false}
                      value={formData['iprFile']}
                      onChange={(value) => handleInputChange('iprFile', value?.target?.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col ">
                  <Label className="mb-2">IPR Date</Label>
                  <div className="flex items-center  py-1 pl-1  border-[1px] rounded-md ">
                    <input
                      type="date"
                      className="cursor-pointer ml-2"
                      value={formData['iprDate1']}
                      onChange={(value) => handleInputChange('iprDate1', value?.target?.value)}
                    />
                  </div>
                </div>
              </div>
              {selectedForm &&
                ((Number(selectedForm.PurposeId) === 47 && formData.isDirector && selectedForm.isInTableValue) ||
                  (Number(selectedForm.PurposeId) !== 47 && selectedForm.isInTableValue)) && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell className="font-medium w-2">SN.</TableCell>
                          {selectedForm?.Fields?.filter((item) => item?.isInTableValue && !item?.filledBy)
                            .filter((ele) =>
                              !formData['122'] ? !hiddenFieldsForNewPaasport?.includes(Number(ele?.FieldId)) : true
                            )
                            .map((field) => (
                              <TableCell key={field?.FieldId} className="font-medium">
                                <Label htmlFor={field?.FieldId} className="block mb-1 text-sm font-medium">
                                  {formatLabel(field?.FieldName)}
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
                              const field = selectedForm?.Fields?.find((f) => Number(f?.FieldId) === Number(fieldId));
                              if (!field) return null;
                              return (
                                <TableCell key={fieldId}>
                                  <FormField
                                    field={field}
                                    value={formData[uuid]?.[fieldId] ?? value}
                                    onChange={(newValue) => handleFieldChange(uuid, fieldId, newValue)}
                                    purposeId={selectedForm.PurposeId}
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
                {selectedForm && selectedForm.isInTableValue && (
                  <Button type="button" onClick={addNewRow}>
                    Add Row
                  </Button>
                )}

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
        </Card>
      )}
      {!selectedForm && (
        <div className="w-full md:w-1/3 mt-8">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Please select the purpose to start NOC application
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CreateRequest;
