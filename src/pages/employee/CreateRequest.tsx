import { useEffect, useState } from 'react';
import Heading from '@/components/ui/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FormInput } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormField } from '@/components/FormBuilder/FormField';
import { v4 as uuidv4 } from 'uuid';
import { formatLabel } from '@/lib/helperFunction';
import Select from 'react-select';
import forms from '../../../purposes.json';
import RenderForm from '@/components/RenderForm';
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
      <RenderForm
        tableRows={tableRows}
        handleFieldChange={handleFieldChange}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        submitStatus={submitStatus}
        isSubmitting={isSubmitting}
        formData={formData}
        addNewRow={addNewRow}
        removeRow={removeRow}
        selectedForm={selectedForm}
      />
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
