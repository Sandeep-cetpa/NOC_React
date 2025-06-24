import React, { useEffect, useRef, useState } from 'react';
import Heading from '@/components/ui/heading';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { FormField } from '@/components/FormBuilder/FormField';
import { validateForm } from '@/lib/helperFunction';
import Select from 'react-select';
import forms from '../../../purposes.json';
import { Employee } from '@/types/Employee';
import axiosInstance from '@/services/axiosInstance';
import { useNavigate } from 'react-router';
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
  PurposeId: number;
  PurposeName: string;
  Fields: FormField[];
  isInTableValue: boolean;
}
const NocRequestForEmployee = () => {
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [missingFields, setMisssingFields] = useState([]);
  const navigate = useNavigate();
  const fileRef = useRef();
  const employees = useSelector((state: RootState) => state.employee.employees);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [submitStatus, setSubmitStatus] = useState<{ type: string; message: string } | null>(null);
  const handleFormSelect = (formId: string) => {
    const form = forms.find((f) => String(f.PurposeId) === formId);
    setMisssingFields([]);
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
  const handleEmployeeSelect = (empCode: string) => {
    const employee = employees.find((f) => Number(f.empCode) === Number(empCode));
    setSelectedEmployee(employee || null);
    setFormData({});
    setSubmitStatus(null);
  };
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
    if (result) {
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
      payloadFormData.append('fkAutoId', '1776');
      if (Object.entries(tableRows).length > 1) {
        payloadFormData.append('dynamicTable', JSON.stringify(tableRows));
      }
      const response = await axiosInstance.post('/User/NOC', payloadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        toast.success(`Your request has been submitted successfully. Reference ID: ${response.data.userId}`);
        setFormData({});
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
    <div
    // style={{
    //   backgroundImage: 'url(./back1.webp)',
    //   backgroundSize: 'contain',
    //   backgroundPosition: 'center',
    //   backgroundRepeat: 'no-repeat',
    //   padding: '1.5rem',
    //   minHeight: '100vh',
    //   display: 'flex',
    //   flexDirection: 'column',
    //   gap: '1.5rem',
    // }}
    >
      <div className="p-6 space-y-6  bg-cover bg-center bg-no-repeat">
        <div className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <Heading type={2}>Create Request For Employee</Heading>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <CardContent className="mt-4">
            {forms.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No forms available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="form-select" className="block mb-2 text-sm font-bold">
                    Select Purpose
                  </Label>
                  <Select
                    options={forms.map((form) => ({ label: form.PurposeName, value: String(form.PurposeId) }))}
                    onChange={(e) => handleFormSelect(e?.value)}
                    value={
                      selectedForm
                        ? { label: selectedForm?.PurposeName, value: selectedForm?.PurposeId }
                        : { label: 'Please select the purpose' }
                    }
                    className="w-full"
                    placeholder="Select purpose"
                  />
                </div>
                <div>
                  <Label htmlFor="form-select" className="block mb-2 text-sm font-bold">
                    Select Employee
                  </Label>
                  <Select
                    options={employees
                      .filter((ele) => ele.unitId == 396)
                      .map((emp) => ({
                        label: `${emp.empCode} | ${emp.empName || 'Unknown'} | ${emp.designation} | ${emp.department}`,
                        value: emp.empCode,
                      }))}
                    onChange={(e) => handleEmployeeSelect(e?.value)}
                    value={
                      selectedEmployee
                        ? {
                            label: `${selectedEmployee?.empCode} | ${selectedEmployee?.empName}`,
                            value: selectedEmployee?.empCode,
                          }
                        : { label: 'Please select the employee' }
                    }
                    className="w-full bg-white"
                    placeholder="Select employee"
                  />
                </div>
              </div>
            )}
          </CardContent>
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
    </div>
  );
};

export default NocRequestForEmployee;
