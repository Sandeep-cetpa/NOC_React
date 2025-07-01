import React, { useCallback, useEffect, useRef, useState } from 'react';
import Heading from '@/components/ui/heading';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileText, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { FormField } from '@/components/FormBuilder/FormField';
import { validateForm } from '@/lib/helperFunction';
import Select from 'react-select';
import { Employee } from '@/types/Employee';
import axiosInstance from '@/services/axiosInstance';
import { useNavigate } from 'react-router';
import RenderForm from '@/components/RenderForm';
import EmptyFormStateForEmployeeNoc from '@/components/EmptyFormStateForEmployeeNoc';
import Loader from '@/components/ui/loader';

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
  purposeId: number;
  purposeName: string;
  fields: FormField[];
  isInTableValue: boolean;
}

const NocRequestForEmployee = () => {
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [missingfields, setMisssingfields] = useState([]);
  const userRoles = useSelector((state: RootState) => state.user.Roles);
  const assiedUnits = userRoles.find((ele) => ele.roleId === 3);
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();
  const fileRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [submitStatus, setSubmitStatus] = useState<{ type: string; message: string } | null>(null);
  const handleFormSelect = (formId: any) => {
    const form = forms.find((f) => Number(f.purposeId) === Number(formId));
    setMisssingfields([]);
    setSelectedForm(form || null);
    if (Number(formId) === 48) {
      setFormData({ 142: true });
    } else {
      setFormData({});
    }
    setSubmitStatus(null);
  };
  const getAllEmployees = async (unitId: number) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/Util/eligible-employees?unitId=${unitId}`);
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUnit) {
      getAllEmployees(selectedUnit?.value);
    }
  }, [selectedUnit?.value]);

  const getPurposeForUnitHr = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/UnitHR/NOC/Purposes');
      if (response.data.success) {
        setForms(response.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPurposeForUnitHr();
  }, []);
  const handleInputChange = (fieldId: string, value: any, fieldType?: any) => {
    const key = fieldType === 'File' ? `File${fieldId}` : fieldId;
    const numericfieldId = Number(fieldId);
    if (numericfieldId === 122 && value === true) {
      if (fileRef.current) {
        fileRef.current.value = '';
      }
      setFormData({
        '122': true,
        '142': false,
      });
      return;
    }

    if (numericfieldId === 142 && value === true) {
      if (fileRef.current) {
        fileRef.current.value = '';
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
    if (selectedForm && selectedForm.fields.length > 0) {
      const initialUUID = uuidv4();
      const initialObject = {};
      selectedForm?.fields
        ?.filter((item) => item?.isInTableValue && !item.filledBy)
        .forEach((field) => {
          initialObject[field.fieldId] = '';
        });
      const formattedData = {
        [initialUUID]: initialObject,
      };
      setTableRows(formattedData);
    }
  }, [selectedForm]);

  const handleEmployeeSelect = (empCode: string) => {
    const employee = employees.find((f) => Number(f.employeeMasterAutoId) === Number(empCode));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateForm(selectedForm, formData, setSubmitStatus);
    setMisssingfields(result);
    if (result?.length > 0) {
      return;
    }
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
      payloadFormData.append('fkAutoId', selectedEmployee?.employeeMasterAutoId);
      if (Object.entries(tableRows).length > 1) {
        payloadFormData.append('dynamicTable', JSON.stringify(tableRows));
      }
      const response = await axiosInstance.post('/UnitHR/NOC', payloadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        toast.success(`Your request has been submitted successfully. Reference ID: ${response.data.userId}`);
        setFormData({});
        setSelectedEmployee(null);
        setSelectedForm(null);
        setMisssingfields([]);
        setSubmitStatus(null);
        setTableRows([]);
        navigate('/unit-hr-processed-noc-requests');
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
  console.log(selectedEmployee, '  selectedEmployee');
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="bg-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Heading type={2} className="text-3xl font-bold text-gray-900">
            Create NOC Request for Employee
          </Heading>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate No Objection Certificate requests for employees with our streamlined digital process
          </p>
        </div>
        {/* Main Selection Card */}
        <Card className="border shadow-lg bg-red-40 backdrop-blur-sm">
          <CardContent className="p-8">
            {forms.length === 0 && !isLoading ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Forms Available</h3>
                <p className="text-gray-500">Please contact administrator to add NOC purposes</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Selection Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <Label
                      htmlFor="purpose-select"
                      className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                    >
                      <FileText className="w-5 h-5 text-blue-600" />
                      Select Purpose
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      options={forms.map((form) => ({ label: form.purposeName, value: form.purposeId }))}
                      onChange={(e) => handleFormSelect(e?.value)}
                      value={selectedForm ? { label: selectedForm?.purposeName, value: selectedForm?.purposeId } : null}
                      className="text-base"
                      placeholder="Choose the purpose..."
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: '40px',
                          borderRadius: '7px',
                          border: '2px solid #e2e8f0',
                          '&:hover': { borderColor: '#3b82f6' },
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                        }),
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="unit-select"
                      className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                    >
                      <FileText className="w-5 h-5 text-blue-600" />
                      Select Unit
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      isDisabled={!selectedForm}
                      options={assiedUnits.unitsAssigned.map((form) => ({ label: form.unitName, value: form.unitId }))}
                      onChange={(e) => setSelectedUnit(e)}
                      value={
                        selectedUnit
                          ? { label: selectedUnit?.label, value: selectedForm?.value }
                          : { label: 'Please select the unit' }
                      }
                      className="text-base"
                      placeholder="Select the unit..."
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: '40px',
                          borderRadius: '7px',
                          border: '2px solid #e2e8f0',
                          '&:hover': { borderColor: '#3b82f6' },
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                        }),
                      }}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="employee-select"
                      className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                    >
                      <Users className="w-5 h-5 text-green-600" />
                      Select Employee
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      isDisabled={!selectedUnit}
                      options={employees?.map((emp) => ({
                        label: `${emp?.employeeMasterAutoId} | ${emp.userName || 'Unknown'} | ${emp.post} | ${
                          emp.deptDfccil
                        }`,
                        value: emp.employeeMasterAutoId,
                      }))}
                      onChange={(e) => handleEmployeeSelect(e?.value)}
                      value={
                        selectedEmployee
                          ? {
                              label: `${selectedEmployee?.employeeMasterAutoId} | ${selectedEmployee?.userName}|${selectedEmployee?.post}`,
                              value: selectedEmployee?.employeeMasterAutoId,
                            }
                          : null
                      }
                      className="text-base"
                      placeholder="Choose employee..."
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: '40px',
                          borderRadius: '7px',
                          border: '2px solid #e2e8f0',
                          '&:hover': { borderColor: '#10b981' },
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : 'white',
                        }),
                      }}
                    />
                  </div>
                </div>

                {/* Process Steps */}
                <RenderForm
                  fileRef={fileRef}
                  missingFields={missingfields}
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
              </div>
            )}
          </CardContent>
        </Card>
        {!selectedForm && <EmptyFormStateForEmployeeNoc />}
      </div>
    </div>
  );
};

export default NocRequestForEmployee;
