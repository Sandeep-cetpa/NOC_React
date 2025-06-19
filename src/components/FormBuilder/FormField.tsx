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
    FieldId: string;
    DataType: String;
    FieldName: string;
    Options?: string[];
    jid: String;
    isInTableValue: boolean;
  };
  value: any;
  onChange: (value: any) => void;
  isDisabled?: boolean;
  purposeId?: string;
  fileRef: any;
}

export const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, isDisabled, purposeId, fileRef }) => {
  const baseProps = {
    id: field.FieldId,
    placeholder: formatLabel(field.FieldName),
    required: field.FieldName.includes('*'),
    value: value || '',
    className: '',
    disabled: isDisabled,
  };
  switch (field.jid) {
    case 'textarea':
      return <Textarea {...baseProps} rows={3} onChange={(e) => onChange(e.target.value)} />;
    case 'Select':
      return (
        <Select disabled={isDisabled} value={value || ''} onValueChange={(value) => onChange(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={formatLabel(field.FieldName) || `Select ${formatLabel(field.FieldName)}`} />
          </SelectTrigger>
          <SelectContent>
            {field?.Options?.map((option: any, index) => (
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
          <Checkbox id={field.FieldId} checked={value || false} onCheckedChange={(checked) => onChange(checked)} />
          <Label htmlFor={field.FieldId} className="flex items-center">
            {field.FieldName.includes('*') && <span className="text-red-500 mr-1">*</span>}
            {formatLabel(field.FieldName)}
          </Label>
        </div>
      );
    case 'switch':
      return (
        <div className="flex items-center space-x-2">
          <Switch id={field.FieldId} checked={value || false} onCheckedChange={(checked) => onChange(checked)} />
          <Label htmlFor={field.FieldId} className="flex items-center">
            {field.FieldName.includes('*') && <span className="text-red-500 mr-1">*</span>}
            {formatLabel(field.FieldName)}
          </Label>
        </div>
      );
    case 'radio':
      return (
        <div className="flex items-center">
          <input
            className="h-5 w-5"
            checked={value || false}
            id={`${field.FieldId}`}
            onChange={(value) => onChange(value.target.checked)}
            name={purposeId}
            type="radio"
          />
          <Label className="ml-2" htmlFor={`${field.FieldId}`}>
            {formatLabel(field.FieldName)}
          </Label>
        </div>
      );
    case 'File':
      return (
        <div className="flex flex-col ">
          <div className="flex items-center  py-1 pl-1  border-[1px] rounded-md ">
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
        <div className="flex flex-col">
          <Input {...baseProps} type={field.jid.toLocaleLowerCase()} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
  }
};
