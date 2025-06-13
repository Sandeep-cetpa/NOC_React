import { useState, useEffect } from 'react';
import Heading from '@/components/ui/heading';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Send, Loader2, AlertCircle, CheckCircle2, FormInput, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormField } from '@/components/FormBuilder/FormField';
import { getGridClass } from '@/lib/helperFunction';
import Select from 'react-select';
import forms from '../../../forms.json';
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
  // Add other user properties as needed
}

const CreateRequest = () => {
  const user = useSelector((state: RootState) => state.user) as UserState;
  // const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(forms[0] || null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: string; message: string } | null>(null);
  const { toast } = useToast();

  const handleFormSelect = (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    setSelectedForm(form || null);
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
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1500));

      // Create submission object
      const submission = {
        id: Date.now().toString(),
        formId: selectedForm?.id,
        formTitle: selectedForm?.title,
        submittedBy: user.email || 'Anonymous',
        submittedAt: new Date().toISOString(),
        data: formData,
      };
      console.log(submission, 'submission');
      // Save to localStorage (simulating API storage)
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
              <div className="space-y-4 mt-0 w-1/3">
                <Select
                  options={forms.map((form) => ({ label: form.title, value: form.id }))}
                  onChange={(e) => handleFormSelect(e?.value)}
                  value={{ label: selectedForm?.title, value: selectedForm?.id }}
                  className=" bg-white"
                  placeholder="Select Purpose"
                />
              </div>
            )}
          </CardContent>
        </Card>
      }
      {selectedForm && selectedForm.title !== 'Please select a purpose' && (
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

export default CreateRequest;
