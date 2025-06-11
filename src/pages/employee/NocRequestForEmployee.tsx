import React, { useState, useEffect } from 'react';
import Heading from '@/components/ui/heading';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Send, Loader2, AlertCircle, CheckCircle2, FormInput, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormField } from '@/components/FormBuilder/FormField';
import { getGridClass } from '@/lib/helperFunction';
import Select from 'react-select';
import forms from '../../../forms.json';
import { Employee } from '@/types/Employee';
interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  width: string;
}
interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
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
  const { toast } = useToast();
  // Load forms from localStorage


  const handleFormSelect = (formId: string) => {
    console.log(formId, 'formId');
    const form = forms.find((f) => f.id === formId);
    console.log(form, 'form');
    setSelectedForm(form || null);
    setFormData({});
    setSubmitStatus(null);
  };
  const handleEmployeeSelect = (empId: string) => {
    console.log(empId, 'empId');
    const employee = employees.find((f) => f.empCode === empId);
    console.log(employee, 'employee');
    setSelectedEmployee(employee || null);
    setFormData({});
    setSubmitStatus(null);
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const validateForm = () => {
    if (!selectedForm) return false;
    const requiredFields = selectedForm.fields.filter((field) => field.required);
    const missingFields = requiredFields.filter((field) => !formData[field.id]);
    if (missingFields.length > 0) {
      setSubmitStatus({
        type: 'error',
        message: `Please fill in the required fields: ${missingFields.map((f) => f.label).join(', ')}`,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {

      const submission = {
        id: Date.now().toString(),
        formId: selectedForm?.id,
        formTitle: selectedForm?.title,
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
          <Heading type={4}>Create Request For Employee</Heading>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FormInput className="h-5 w-5 text-blue-500" />
            <span>Select a purpose</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {forms.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No forms available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="form-select" className="block mb-2 text-sm font-bold">
                  Select Purpose
                </Label>
                <Select
                  options={forms.map((form) => ({ label: form.title, value: form.id }))}
                  onChange={(e) => handleFormSelect(e?.value)}
                  value={{ label: selectedForm?.title, value: selectedForm?.id }}
                  className="w-full"
                  placeholder="Select purpose"
                />

              </div>
              <div>
                <Label htmlFor="form-select" className="block mb-2 text-sm font-bold">
                  Select Employee
                </Label>
                <Select
                  options={employees.map((emp) => ({ label: emp.empName, value: emp.empCode }))}
                  onChange={(e) => handleEmployeeSelect(e?.value)}
                  value={{ label: selectedEmployee?.empName, value: selectedEmployee?.empCode }}
                  className="w-full bg-white"
                  placeholder="Select employee"

                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {selectedForm && (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{selectedForm.title}</CardTitle>
            {selectedForm.description && <p className="text-gray-500 mt-2">{selectedForm.description}</p>}
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-12 gap-4">
                {selectedForm.fields.map((field) => (
                  <div key={field.id} className={getGridClass(field.width)}>
                    {field.type !== 'checkbox' && (
                      <Label htmlFor={field.id} className="block mb-2 text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                    )}
                    <FormField
                      field={field}
                      value={formData[field.id]}
                      onChange={(value) => handleInputChange(field.id, value)}
                    />
                  </div>
                ))}
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
    </div>
  );
};

export default NocRequestForEmployee;
