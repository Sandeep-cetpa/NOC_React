import React, { useState, useEffect } from 'react';
import Heading from '@/components/ui/heading';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileText,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FormInput,
  ArrowLeft,
  FormInputIcon,
  User,
  Building,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormField } from '@/components/FormBuilder/FormField';
import { formatLabel, getGridClass } from '@/lib/helperFunction';
import Select from 'react-select';
// import forms from '../../../forms.json';
import forms from '../../../purposes.json';
import { Employee } from '@/types/Employee';
import { Badge } from '@/components/ui/badge';
interface FormField {
  FieldId: string;
  DataType: String;
  FieldName: string;
  Options?: string[];
  jid: String;
}
interface Form {
  PurposeId: number;
  PurposeName: string;
  Fields: FormField[];
}
interface UserState {
  email?: string;
  name?: string;
}

const NocRequestForEmployee = () => {
  const user = useSelector((state: RootState) => state.user) as UserState;
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const employees = useSelector((state: RootState) => state.employee.employees);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: string; message: string } | null>(null);
  const hiddenFieldsForNewPaasport = [123, 124, 125, 126];
  const { toast } = useToast();
  const handleFormSelect = (formId: any) => {
    console.log(formId, 'formId');
    const form = forms.find((f) => Number(f.PurposeId) === Number(formId));
    console.log(form, 'form');
    setSelectedForm(form || null);
    if (Number(formId) === 48) {
      setFormData({ 142: true });
    } else {
      setFormData({});
    }
    setSubmitStatus(null);
  };
  const handleEmployeeSelect = (empId: string) => {
    const employee = employees.find((f) => f.empCode === empId);
    setSelectedEmployee(employee || null);
    setFormData({});
    setSubmitStatus(null);
  };
  const handleInputChange = (fieldId: string, value: any) => {
    if (Number(fieldId) === 142) {
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
        ['122']: false,
      }));
    } else if (Number(fieldId) == 122) {
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
        ['142']: false,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
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
        message: `Please fill in the required fields: ${missingFields.map((f) => f.FieldName).join(', ')}`,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData[122]) {
      if (!validateForm()) return;
    }
    console.log(formData);
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
        id: Date.now().toString(),
        formId: selectedForm?.PurposeId,
        formTitle: selectedForm?.PurposeName,
        submittedBy: user.email || 'Anonymous',
        submittedAt: new Date().toISOString(),
        data: formData,
      };
      console.log(submission, 'submission');
      const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
      submissions.push(submission);
      localStorage.setItem('formSubmissions', JSON.stringify(submissions));

      setSubmitStatus({
        type: 'success',
        message: 'Form submitted successfully!',
      });

      toast({
        title: 'Success!',
        description: 'Your form has been submitted successfully.',
        duration: 5000,
      });

      // Reset form
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
          <Heading type={2}>Create Request For Employee</Heading>
        </div>
      </div>
      <Card>
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
                  options={forms.map((form) => ({ label: form.PurposeName, value: form.PurposeId }))}
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
                  options={employees.map((emp) => ({
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
              {/* {selectedEmployee && (
                <div className='flex flex-wrap'>
                  <Badge>Department:{selectedEmployee.department}</Badge>
                  {selectedEmployee.designation && <Badge>designation:{selectedEmployee.designation}</Badge>}
                  {selectedEmployee.tOemploy && <Badge>Employee Type:{selectedEmployee.tOemploy}</Badge>}
                  {selectedEmployee.lavel && <Badge>Grade:{selectedEmployee.lavel}</Badge>}

                  <Badge></Badge>
                  <Badge></Badge>
                </div>
              )} */}
            </div>
          )}
        </CardContent>
      </Card>
      {selectedForm && (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{selectedForm.PurposeName}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={() => {}} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedForm.Fields.filter((ele) =>
                  !formData['122'] ? !hiddenFieldsForNewPaasport.includes(Number(ele.FieldId)) : true
                ).map((field) => (
                  <div key={field.FieldId}>
                    {field.jid !== 'checkbox' && (
                      <Label htmlFor={field.FieldId} className="block mb-2 text-sm font-medium">
                        {formatLabel(field.FieldName)}
                        {field.FieldName.includes('*') && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                    )}
                    <FormField
                      field={field}
                      value={formData[field.FieldId]}
                      onChange={(value) => handleInputChange(field.FieldId, value)}
                    />
                  </div>
                ))}
                <div className="flex flex-col ">
                  <Label className="mb-2">Upload IPR</Label>
                  <div className="flex items-center  py-1 pl-1  border-[1px] rounded-md ">
                    <input
                      type="file"
                      className="cursor-pointer"
                      disabled={false}
                      value={formData['iprFile']}
                      onChange={(value) => handleInputChange('iprFile', value.target.value)}
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
                      onChange={(value) => handleInputChange('iprDate1', value.target.value)}
                    />
                  </div>
                </div>
              </div>
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

export default NocRequestForEmployee;
