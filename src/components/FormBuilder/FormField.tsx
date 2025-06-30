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
    jid: String;
    isInTableValue: boolean;
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
        <div className="flex flex-col ">
          <div className={`flex items-center py-1 pl-1   rounded-md ${className}`}>
            <input
              ref={fileRef}
              type="file"
              className="cursor-pointer"
              disabled={isDisabled}
              onChange={(e) => onChange(e.target.files[0])}
            />
          </div>
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
