import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

interface FormPreviewProps {
  form: any;
  getWidthClass: (width: string) => string;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ form }) => {
  // Convert width to grid columns
  const getGridClass = (width: string): string => {
    const gridClasses = {
      full: 'col-span-12',
      half: 'col-span-12 sm:col-span-6',
      third: 'col-span-12 sm:col-span-4',
      quarter: 'col-span-12 sm:col-span-6 md:col-span-3',
      'two-thirds': 'col-span-12 sm:col-span-8',
      'three-quarters': 'col-span-12 sm:col-span-9',
    };
    return gridClasses[width] || gridClasses.full;
  };

  const renderPreviewLayout = (fields: any[]) => {
    return (
      <div className="grid grid-cols-12 gap-4">
        {fields.map((field: any) => (
          <div key={field.id} className={cn(getGridClass(field.width), 'min-w-0')}>
            {field.type !== 'checkbox' && (
              <Label htmlFor={field.id} className="block mb-2 text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            )}
            <FormField field={field} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="text-center border-b bg-gray-50">
        <CardTitle className="text-xl text-blue-600">Form Preview</CardTitle>
        <p className="text-sm text-gray-500">This is how your form will appear to users</p>
      </CardHeader>
      <CardContent className="p-6">
        {form.fields.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No fields added yet</p>
            <p className="text-gray-400 text-sm">Switch to edit mode to add fields</p>
          </div>
        ) : (
          <div className="space-y-6">
            {renderPreviewLayout(form.fields)}
            {/* <div className="pt-6 border-t">
              <Button type="button" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                Submit Form
              </Button>
            </div> */}
          </div> 
        )}
      </CardContent>
    </Card>
  );
};
