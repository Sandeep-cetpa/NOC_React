import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, Check, Circle, Upload } from 'lucide-react';

interface FormFieldProps {
  field: {
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
  };
  value: any;
  onChange: (value: any) => void;
  isDisabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, isDisabled }) => {
  const baseProps = {
    id: field.id,
    placeholder: field.placeholder,
    required: field.required,
    value: value || '',
    className: 'w-full',
    disabled: isDisabled,
  };

  switch (field.type) {
    case 'textarea':
      return <Textarea {...baseProps} rows={3} onChange={(e) => onChange(e.target.value)} />;

    case 'select':
      return (
        <Select disabled={isDisabled} value={value || ''} onValueChange={(value) => onChange(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            <ChevronDown className="h-4 w-4 opacity-50" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option, index) => (
              <SelectItem key={index} value={option}>
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 opacity-0 data-[state=checked]:opacity-100" />
                  {option}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'checkbox':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id={field.id} checked={value || false} onCheckedChange={(checked) => onChange(checked)} />
          <Label htmlFor={field.id} className="flex items-center">
            {field.required && <span className="text-red-500 mr-1">*</span>}
            {field.label}
          </Label>
        </div>
      );
    case 'switch':
      return (
        <div className="flex items-center space-x-2">
          <Switch id={field.id} checked={value || false} onCheckedChange={(checked) => onChange(checked)} />
          <Label htmlFor={field.id} className="flex items-center">
            {field.required && <span className="text-red-500 mr-1">*</span>}
            {field.label}
          </Label>
        </div>
      );
    case 'radio':
      return (
        <RadioGroup value={value || ''} onValueChange={(value) => onChange(value)}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`} className="flex items-center">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      );
    case 'file':
      return (
        <div className="flex items-center space-x-2">
          <Input {...baseProps} type={'file'} className="cursor-pointer" onChange={(e) => onChange(e.target.value)} />
          <Upload />
        </div>
      );
    default:
      return <Input {...baseProps} type={field.type} onChange={(e) => onChange(e.target.value)} />;
  }
};
