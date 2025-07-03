import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import 'react-datepicker/dist/react-datepicker.css';

interface EnhancedDatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  showTimeSelect?: boolean;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  isClearable?: boolean;
  missingField?: boolean;
}

const EnhancedDatePicker = ({
  selectedDate,
  missingField,
  onChange,
  placeholder = 'Select date...',
  className = '',
  showTimeSelect = false,
  dateFormat = 'dd-MM-yyyy',
  minDate,
  maxDate,
  disabled = false,
}: // isClearable = true,
EnhancedDatePickerProps) => {
  console.log(missingField, 'missingField');
  const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <Button
        style={missingField ? { borderWidth: '2px', borderColor: '#ff0000' } : {}}
        type="button"
        variant="outline"
        onClick={onClick}
        ref={ref}
        disabled={disabled}
        className={cn(
          'w-full border-2 border-gray-100 bg-transparent px-6 py-2.5 flex items-center justify-start text-left font-normal',
          !value && 'text-muted-foreground',
          className
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value || <span className="text-muted-foreground">{placeholder}</span>}
      </Button>
    )
  );

  CustomInput.displayName = 'DatePickerCustomInput';

  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      customInput={<CustomInput />}
      showTimeSelect={showTimeSelect}
      dateFormat={dateFormat}
      minDate={minDate}
      maxDate={maxDate}
      disabled={disabled}
      className="w-full"
      calendarClassName="bg-white shadow-lg border-3 border-gray-200 rounded-md"
      popperClassName="z-50"
      popperPlacement="bottom-start"
    />
  );
};

export default EnhancedDatePicker;
