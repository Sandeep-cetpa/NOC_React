import { useEffect, useRef, useState } from 'react';
import Heading from '@/components/ui/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FormInput } from 'lucide-react';
import { FormField } from '@/components/FormBuilder/FormField';
import { v4 as uuidv4 } from 'uuid';
import { formatLabel, validateForm } from '@/lib/helperFunction';
import Select from 'react-select';
// import forms from '../../../purposes.json';
import RenderForm from '@/components/RenderForm';
import toast from 'react-hot-toast';
import axiosInstance from '@/services/axiosInstance';
import { useNavigate } from 'react-router';
import NOCProcessInfo from '@/components/NewFlow';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import Loader from '@/components/ui/loader';
import { Label } from '@/components/ui/label';
interface FormField {
  fieldId: string;
  dataType: String;
  fieldName: string;
  options?: string[];
  jid: String;
  isInTableValue: boolean;
  filledBy: any;
}
interface Form {
  purposeId: string;
  purposeName: string;
  fields: FormField[];
  isInTableValue?: boolean;
}
const CreateRequest = () => {
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [forms, setForms] = useState([]);
  const userInfo = useSelector((state: RootState) => state.user);
  const [missingFields, setMisssingFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [tableRows, setTableRows] = useState([]);
  const fileRef = useRef();
  const [submitStatus, setSubmitStatus] = useState<{ type: string; message: string } | null>(null);
  const handleFormSelect = (formId: string) => {
    const form = forms.find((f) => Number(f.purposeId) === Number(formId));
    setSelectedForm(form || null);
    setMisssingFields([]);
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
  const getAllPurpose = async () => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance('User/NOC/Purposes');
      if (response.data.success) {
        setForms(response.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    getAllPurpose();
  }, []);
  useEffect(() => {
    if (selectedForm && selectedForm.fields.length > 0) {
      const initialUUID = uuidv4();
      const initialObject = {};
      selectedForm?.fields
        ?.filter((item) => item?.isInTableValue && !item.filledBy)
        .forEach((field) => {
          initialObject[field.fieldId] = ''; // Initialize with empty string
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
    selectedForm.fields
      ?.filter((item) => item?.isInTableValue && !item.filledBy)
      .forEach((field) => {
        newRowObject[field.fieldId] = '';
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
  console.log(formData, 'formData');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateForm(selectedForm, formData, setSubmitStatus);
    setMisssingFields(result);
    if (result?.length > 0) {
    const result = validateForm(selectedForm, formData, setSubmitStatus);
    setMisssingFields(result);
    if (result?.length > 0) {
      return;
    }

    if (!validateForm(selectedForm, formData, setSubmitStatus)) return;


    if (!validateForm(selectedForm, formData, setSubmitStatus)) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const submission = {
        purposeId: selectedForm?.purposeId,
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
      payloadFormData.append('fkAutoId', userInfo.EmpID.toString());
      if (Object.entries(tableRows).length > 1) {
        payloadFormData.append('dynamicTable', JSON.stringify(tableRows));
      }
      const response = await axiosInstance.post('/User/NOC', payloadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response?.data?.success) {
      if (response?.data?.success) {
        toast.success(`Your request has been submitted successfully. Reference ID: ${response.data.userId}`);
        setFormData({});
        setMisssingFields([]);
        setSelectedForm(null);
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
  if (isSubmitting) {
    return <Loader />;
  }
  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <Heading type={2}>Create Request</Heading>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <CardContent>
            {forms?.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No forms available</p>
              </div>
            ) : (
              <div className=" w-full mt-4 md:w-1/3 md:pr-2">
                <Label htmlFor="form-select" className="block mb-2 text-sm font-bold">
                  Select Purpose <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  options={forms.map((form) => ({ label: form.purposeName, value: String(form.purposeId) }))}
                  onChange={(e) => handleFormSelect(e?.value)}
                  value={
                    selectedForm
                      ? { label: selectedForm?.purposeName, value: selectedForm?.purposeId }
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
        </div>
      </div>
      <RenderForm
        fileRef={fileRef}
        missingFields={missingFields}
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
        <div className="w-full mt-8">
          <NOCProcessInfo />
        </div>
      )}
    </div>
  );
};
export default CreateRequest;
