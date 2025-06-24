import { useEffect, useRef, useState } from 'react';
import Heading from '@/components/ui/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FormInput } from 'lucide-react';
import { FormField } from '@/components/FormBuilder/FormField';
import { v4 as uuidv4 } from 'uuid';
import { formatLabel, validateForm } from '@/lib/helperFunction';
import Select from 'react-select';
import forms from '../../../purposes.json';
import RenderForm from '@/components/RenderForm';
import toast from 'react-hot-toast';
import axiosInstance from '@/services/axiosInstance';
import { useNavigate } from 'react-router';
import WorkflowFlow from '@/components/WorkFlow';
import NOCWorkflowBox from '@/components/NewFlow';
import NOCProcessInfo from '@/components/NewFlow';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
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
  const userInfo = useSelector((state: RootState) => state.user);
  const [missingFields, setMisssingFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [tableRows, setTableRows] = useState([]);
  const fileRef = useRef();
  const [submitStatus, setSubmitStatus] = useState<{ type: string; message: string } | null>(null);
  const handleFormSelect = (formId: string) => {
    const form = forms.find((f) => String(f.PurposeId) === formId);
    setSelectedForm(form || null);
    setMisssingFields([]);
    if (Number(formId) === 48) {
      setFormData({ 142: true });
    } else {
      setFormData({});
    }
    setSubmitStatus(null);
  };
  const handleInputChange = (fieldId: string, value: any, fieldType?: any) => {
    const key = fieldType === 'File' ? `File${fieldId}` : fieldId;
    const numericFieldId = Number(fieldId);
    if (numericFieldId === 122 && value === true) {
      if (fileRef.current) {
        fileRef.current.value = ''; // this is allowed
      }
      setFormData({
        '122': true,
        '142': false,
      });
      return;
    }

    if (numericFieldId === 142 && value === true) {
      if (fileRef.current) {
        fileRef.current.value = ''; // this is allowed
      }
      setFormData({
        '142': true,
        '122': false,
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
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
    const result = validateForm(selectedForm, formData, setSubmitStatus);
    setMisssingFields(result);
    if (result?.length > 0) {
      return;
    }

    if (!validateForm(selectedForm, formData, setSubmitStatus)) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const submission = {
        purposeId: selectedForm?.PurposeId,
        ...formData,
      };
      const payloadFormData = new FormData();
      function appendFormData(formData, data, parentKey = '') {
        for (const key in data) {
          const value = data[key];
          const formKey = parentKey ? `${parentKey}[${key}]` : key;
          if (value instanceof File) {
            formData.append(formKey, value);
          } else if (value && typeof value === 'object' && !(value instanceof Date)) {
            appendFormData(formData, value, formKey);
          } else {
            formData.append(formKey, value);
          }
        }
      }
      appendFormData(payloadFormData, submission);
      payloadFormData.append('fkAutoId', userInfo.EmpID.toString());
      if (Object.entries(tableRows).length > 1) {
        payloadFormData.append('dynamicTable', JSON.stringify(tableRows));
      }
      const response = await axiosInstance.post('/User/NOC', payloadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response?.data?.success) {
        toast.success(`Your request has been submitted successfully. Reference ID: ${response.data.userId}`);
        setFormData({});
        setMisssingFields([]);
        setSelectedForm(null);
        navigate('/track-noc');
      }
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
      <div>
        <div className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <Heading type={2}>Create Request</Heading>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
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
              <div className=" w-full md:w-1/3 md:pr-2">
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
        </div>
      </div>
      <RenderForm
        fileRef={fileRef}
        missingFields={missingFields}
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
        <div className="w-full mt-8">
          <NOCProcessInfo />
        </div>
      )}
    </div>
  );
};
export default CreateRequest;
