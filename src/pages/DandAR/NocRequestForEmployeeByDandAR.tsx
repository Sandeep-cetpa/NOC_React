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
import axiosInstance from '@/services/axiosInstance';
import { useNavigate } from 'react-router';
import RenderForm from '@/components/RenderForm';
import EmptyFormStateForEmployeeNoc from '@/components/EmptyFormStateForEmployeeNoc';
import Loader from '@/components/ui/loader';
import ExcelDataPreview from '@/components/common/ExcelPreview';

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

const NocRequestForEmployeeByDandAR = () => {
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [missingfields, setMisssingfields] = useState([]);
  const [excelPreviewData, setExcelPreviewData] = useState([]);
  const userInfo = useSelector((state: RootState) => state.user);
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();
  const fileRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [errorRows, setErrorRows] = useState({});
  const [errorRowsIndexs, setErrorRowsIndexs] = useState([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [submitStatus, setSubmitStatus] = useState<{ type: string; message: string } | null>(null);
  console.log(excelData, 'excelData in nox page');
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

  const getPurposeForDandAR = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/DandR/NOC/Purposes');
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
    getPurposeForDandAR();
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
  console.log(selectedForm, 'selected form');
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
    console.log('➡️ Starting submission');

    const result = validateForm(
      selectedForm,
      formData,
      setSubmitStatus,
      location.pathname !== '/create-request',
      userInfo?.Lavel
    );

    setMisssingfields(result);
    if (result?.length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setIsLoading(true);

    try {
      const payloadFormData = new FormData();
      excelData?.forEach((ele, index) => {
        const isoDate = new Date(ele['Promotion due from (DD-MM-YYYY)']).toISOString();
        payloadFormData.append(`Data[${index}].EmployeeCode`, ele['Employee Code'] || '');
        payloadFormData.append(`Data[${index}].PromotionDueDate`, isoDate);
        payloadFormData.append(`Data[${index}].PertainingPast`, ele['Pertaining to Past Unit'] || '');
        payloadFormData.append(`Data[${index}].PertainingPresent`, ele['Pertaining to Present Unit'] || '');
        payloadFormData.append(`Data[${index}].AnyOtherRemark`, ele['Any Other Remarks'] || '');

        if (ele.uploadFile) {
          payloadFormData.append(`Data[${index}].IprFile`, ele.uploadFile);
        }
      });
      payloadFormData.append('ExcelFile', formData?.BulkExcel);
      payloadFormData.append('PurposeId', selectedForm?.purposeId);
      payloadFormData.append('FkAutoId', userInfo?.EmpID);
      const response = await axiosInstance.post('/DandR/NOC', payloadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.success) {
        toast.success(`✅ Request submitted successfully. Reference ID: ${response.data.userId}`);
        setFormData({});
        setSelectedForm(null);
        setMisssingfields([]);
        setSubmitStatus(null);
        setTableRows([]);
        navigate('/unit-hr-processed-noc-requests');
      } else {
        // Handle partial errors if bulk failed
        const errorIndexes = response?.data?.data?.erorrRowsIfBulk || [];
        setErrorRowsIndexs(errorIndexes);
        setErrorRows(() => {
          const updatedErrors = {};
          errorIndexes.forEach((rowIndex) => {
            updatedErrors[rowIndex] = response?.data?.data?.errorMessageIfBulk;
          });
          return updatedErrors;
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: '❌ Failed to submit form. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleExcelPreview = async () => {
    setErrorRowsIndexs([]);
    setErrorRows({});
    if (!formData.BulkExcel) {
      toast.error('Please upload the excel to get the preview');
      return;
    }
    setIsLoading(true);
    const payloadFormData = new FormData();
    payloadFormData.append('file', formData.BulkExcel);
    try {
      const response = await axiosInstance.post('/Util/preview-excel', payloadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setExcelPreviewData(response.data.data);
      }
      console.log(response.data, 'response');
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (formData.BulkExcel) {
      handleExcelPreview();
    }
    setExcelPreviewData([]);
    setErrorRowsIndexs([]);
    setErrorRows(null);
  }, [formData.BulkExcel]);
  return (
    <div className="bg-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        {isLoading && <Loader />}
        <div className="text-center space-y-4">
          <Heading type={2} className="text-3xl font-bold text-gray-900">
            Raise Request On Behalf Of Employee
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                {excelPreviewData.length > 0 && (
                  <ExcelDataPreview
                    errorRowIndexes={errorRowsIndexs}
                    data={excelPreviewData}
                    errorMessages={errorRows}
                    isUploadButton={true}
                    excelData={excelData}
                    setExcelData={setExcelData}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
        {!selectedForm && <EmptyFormStateForEmployeeNoc />}
      </div>
    </div>
  );
};

export default NocRequestForEmployeeByDandAR;
