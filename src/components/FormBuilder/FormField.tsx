// import React from 'react';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Switch } from '@/components/ui/switch';
// import { formatLabel } from '@/lib/helperFunction';

// interface FormFieldProps {
//   field: {
//     fieldId: string;
//     dataType: String;
//     fieldName: string;
//     options?: string[];
//     jid?: String;
//     isInTableValue?: boolean;
//   };
//   value: any;
//   onChange: (value: any) => void;
//   isDisabled?: boolean;
//   purposeId?: string;
//   fileRef: any;
//   className: string;
// }

// export const FormField: React.FC<FormFieldProps> = ({
//   field,
//   value,
//   onChange,
//   isDisabled,
//   purposeId,
//   fileRef,
//   className,
// }) => {
//   const baseProps = {
//     id: field.fieldId,
//     placeholder: formatLabel(field.fieldName),
//     // required: field.fieldName.includes('*'),
//     value: value || '',
//     className: className,
//     disabled: isDisabled,
//   };
//   switch (field.jid) {
//     case 'textarea':
//       return <Textarea {...baseProps} rows={3} onChange={(e) => onChange(e.target.value)} />;
//     case 'Select':
//       return (
//         <Select disabled={isDisabled} value={value || ''} onValueChange={(value) => onChange(value)}>
//           <SelectTrigger className={`w-full ${className}`}>
//             <SelectValue placeholder={formatLabel(field.fieldName) || `Select ${formatLabel(field.fieldName)}`} />
//           </SelectTrigger>
//           <SelectContent>
//             {field?.options?.map((option: any, index) => (
//               <SelectItem key={index} value={String(option?.optionId)}>
//                 {option?.optionValue}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       );
//     case 'checkbox':
//       return (
//         <div className="flex items-center space-x-2">
//           <Checkbox id={field.fieldId} checked={value || false} onCheckedChange={(checked) => onChange(checked)} />
//           <Label htmlFor={field.fieldId} className="flex items-center">
//             {field.fieldName.includes('*') && <span className="text-red-500 mr-1">*</span>}
//             {formatLabel(field.fieldName)}
//           </Label>
//         </div>
//       );
//     case 'switch':
//       return (
//         <div className="flex items-center space-x-2">
//           <Switch id={field.fieldId} checked={value || false} onCheckedChange={(checked) => onChange(checked)} />
//           <Label htmlFor={field.fieldId} className="flex items-center">
//             {field.fieldName.includes('*') && <span className="text-red-500 mr-1">*</span>}
//             {formatLabel(field.fieldName)}
//           </Label>
//         </div>
//       );
//     case 'radio':
//       return (
//         <div className={`flex items-center ${className}`}>
//           <input
//             className="h-5 w-5"
//             checked={value || false}
//             id={`${field.fieldId}`}
//             onChange={(value) => onChange(value.target.checked)}
//             name={purposeId}
//             type="radio"
//           />
//           <Label className="ml-2" htmlFor={`${field.fieldId}`}>
//             {formatLabel(field.fieldName)}
//           </Label>
//         </div>
//       );
//     case 'File':
//       return (
//         <div className="flex flex-col ">
//           <div className={`flex items-center py-1 pl-1   rounded-md ${className}`}>
//             <input
//               ref={fileRef}
//               type="file"
//               className="cursor-pointer"
//               disabled={isDisabled}
//               onChange={(e) => onChange(e.target.files[0])}
//             />
//           </div>
//         </div>
//       );
//     default:
//       return (
//         <div>
//           <Input {...baseProps} type={field.jid.toLocaleLowerCase()} onChange={(e) => onChange(e.target.value)} />
//         </div>
//       );
//   }
// };

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { formatLabel } from '@/lib/helperFunction';

interface FormFieldProps {
  field: {
    fieldId: string;
    dataType: String;
    fieldName: string;
    options?: string[];
    jid?: String;
    isInTableValue?: boolean;
  };
  value: any;
  onChange: (value: any) => void;
  isDisabled?: boolean;
  purposeId?: string;
  fileRef: any;
  className: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  isDisabled,
  purposeId,
  fileRef,
  className,
}) => {
  const baseProps = {
    id: field.fieldId,
    placeholder: formatLabel(field.fieldName),
    // required: field.fieldName.includes('*'),
    value: value || '',
    className: className,
    disabled: isDisabled,
  };

  const handleFileRemove = () => {
    onChange(null);
    if (fileRef && fileRef.current) {
      fileRef.current.value = '';
    }
  };

  switch (field.jid) {
    case 'textarea':
      return <Textarea {...baseProps} rows={3} onChange={(e) => onChange(e.target.value)} />;
    case 'Select':
      return (
        <Select disabled={isDisabled} value={value || ''} onValueChange={(value) => onChange(value)}>
          <SelectTrigger className={`w-full ${className}`}>
            <SelectValue placeholder={formatLabel(field.fieldName) || `Select ${formatLabel(field.fieldName)}`} />
          </SelectTrigger>
          <SelectContent>
            {field?.options?.map((option: any, index) => (
              <SelectItem key={index} value={String(option?.optionId)}>
                {option?.optionValue}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'checkbox':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id={field.fieldId} checked={value || false} onCheckedChange={(checked) => onChange(checked)} />
          <Label htmlFor={field.fieldId} className="flex items-center">
            {field.fieldName.includes('*') && <span className="text-red-500 mr-1">*</span>}
            {formatLabel(field.fieldName)}
          </Label>
        </div>
      );
    case 'switch':
      return (
        <div className="flex items-center space-x-2">
          <Switch id={field.fieldId} checked={value || false} onCheckedChange={(checked) => onChange(checked)} />
          <Label htmlFor={field.fieldId} className="flex items-center">
            {field.fieldName.includes('*') && <span className="text-red-500 mr-1">*</span>}
            {formatLabel(field.fieldName)}
          </Label>
        </div>
      );
    case 'radio':
      return (
        <div className={`flex items-center ${className}`}>
          <input
            className="h-5 w-5"
            checked={value || false}
            id={`${field.fieldId}`}
            onChange={(value) => onChange(value.target.checked)}
            name={purposeId}
            type="radio"
          />
          <Label className="ml-2" htmlFor={`${field.fieldId}`}>
            {formatLabel(field.fieldName)}
          </Label>
        </div>
      );
    case 'File':
      return (
        <div className="flex flex-col space-y-2">
          {value ? (
            // Show selected file with remove option
            <div className={`flex items-center justify-between p-[7px] border rounded-md bg-gray-50 ${className}`}>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                  {value.name || 'Selected file'}
                </span>
                <span className="text-xs text-gray-500">({(value.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <button
                type="button"
                onClick={handleFileRemove}
                disabled={isDisabled}
                className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove file"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            // Show file input when no file selected
            <div className={`flex items-center py-1 pl-1 rounded-md ${className}`}>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.xlsx,.xls"
                className="cursor-pointer w-full"
                disabled={isDisabled}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(file);
                  }
                }}
              />
            </div>
          )}
          <p className="text-xs text-gray-500">Allowed formats: PDF, Excel (.xlsx, .xls)</p>
        </div>
      );
    default:
      return (
        <div>
          <Input {...baseProps} type={field.jid.toLocaleLowerCase()} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
  }
};
