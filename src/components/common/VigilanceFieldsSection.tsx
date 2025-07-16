import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

// Vigilance Fields Component
const VigilanceFieldsSection = ({ nocData, purposeList, onFieldsChange }) => {
  const [vigilanceFields, setVigilanceFields] = useState([]);
  const [fieldResponses, setFieldResponses] = useState({});

  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/\r\n/g, ' ')
      .replace(/\(/g, '(')
      .replace(/\)/g, ')')
      .replace(/\*/g, '')
      .replace(/\//g, '/')
      .replace(/\s+/g, ' ')
      .trim();
  };

  useEffect(() => {
    if (nocData?.purposeId && purposeList) {
      const purpose = purposeList.find((p) => p.purposeId === nocData.purposeId);
      if (purpose) {
        const vigilanceUserFields = purpose.fields.filter((field) => field.filledBy === 'vigilanceuser');
        setVigilanceFields(vigilanceUserFields);

        const initialResponses = {};
        vigilanceUserFields.forEach((field) => {
          initialResponses[field.fieldId] = {
            fieldId: field.fieldId,
            fieldName: field.fieldName,
            optionChecked: null,
            value: '',
          };
        });
        setFieldResponses(initialResponses);
      }
    }
  }, [nocData?.purposeId, purposeList]);

  const handleOptionChange = (fieldId, option) => {
    const updatedResponses = {
      ...fieldResponses,
      [fieldId]: {
        ...fieldResponses[fieldId],
        optionChecked: option,
        value: option === 'no' ? '' : fieldResponses[fieldId].value,
      },
    };
    setFieldResponses(updatedResponses);

    if (onFieldsChange) {
      onFieldsChange(Object.values(updatedResponses));
    }
  };

  const handleTextChange = (fieldId, value) => {
    const updatedResponses = {
      ...fieldResponses,
      [fieldId]: {
        ...fieldResponses[fieldId],
        value: value,
      },
    };
    setFieldResponses(updatedResponses);

    if (onFieldsChange) {
      onFieldsChange(Object.values(updatedResponses));
    }
  };

  if (vigilanceFields.length === 0) {
    return null;
  }

  return (
    <div className="bg-orange-50 p-4 rounded-lg">
      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-orange-600" />
        Vigilance Clearance Information
      </h3>
      <div className="space-y-4">
        {vigilanceFields.map((field) => (
          <Card key={field.fieldId} className="border-orange-200">
            <CardContent className="pt-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 block">{formatFieldName(field.fieldName)}</Label>

                <RadioGroup
                  value={fieldResponses[field.fieldId]?.optionChecked || ''}
                  onValueChange={(value) => handleOptionChange(field.fieldId, value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`${field.fieldId}-yes`} />
                    <Label htmlFor={`${field.fieldId}-yes`} className="cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`${field.fieldId}-no`} />
                    <Label htmlFor={`${field.fieldId}-no`} className="cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>

                {fieldResponses[field.fieldId]?.optionChecked === 'yes' && (
                  <div className="mt-3 ml-6">
                    <Label className="text-sm text-gray-600 mb-1 block">Please provide details:</Label>
                    <Textarea
                      value={fieldResponses[field.fieldId]?.value || ''}
                      onChange={(e) => handleTextChange(field.fieldId, e.target.value)}
                      placeholder="Enter details here..."
                      rows={3}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VigilanceFieldsSection;
