import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MoveUp, MoveDown, Trash2, X, Plus } from 'lucide-react';

interface FormFieldEditorProps {
    form: any;
    field: any;
    index: number;
    fieldTypes: Array<{ value: string; label: string; icon: string }>;
    widthOptions: Array<{ value: string; label: string }>;
    onUpdateField: (formId: string, fieldId: string, updates: any) => void;
    onDeleteField: (formId: string, fieldId: string) => void;
    onMoveField: (formId: string, fieldId: string, direction: 'up' | 'down') => void;
}

export const FormFieldEditor: React.FC<FormFieldEditorProps> = ({
    form,
    field,
    index,
    fieldTypes,
    widthOptions,
    onUpdateField,
    onDeleteField,
    onMoveField,
}) => {
    return (
        <Card key={field.id} className="mb-0 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardContent className="pt-4 relative pb-0">
                <div className=" top-18 right-[60px] flex items-center space-x-1 pb-2">
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMoveField(form.id, field.id, 'up')}
                            disabled={index === 0}
                            className="h-6 w-6 p-0 hover:bg-blue-100"
                        >
                            <MoveUp className="h-3 w-3" />
                        </Button>
                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 rounded text-blue-800">{index + 1}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMoveField(form.id, field.id, 'down')}
                            disabled={index === form.fields.length - 1}
                            className="h-6 w-6 p-0 hover:bg-blue-100"
                        >
                            <MoveDown className="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`label-${field.id}`} className="text-sm font-medium">
                            Field Label
                        </Label>
                        <Input
                            id={`label-${field.id}`}
                            value={field.label}
                            onChange={(e) => onUpdateField(form.id, field.id, { label: e.target.value })}
                            placeholder="Enter field label"
                            className="focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`type-${field.id}`} className="text-sm font-medium">
                            Field Type
                        </Label>
                        <Select
                            value={field.type}
                            onValueChange={(value) =>
                                onUpdateField(form.id, field.id, {
                                    type: value,
                                    options: value === 'select' || value === 'radio' ? ['Option 1'] : [],
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {fieldTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        <div className="flex items-center space-x-2">
                                            <span>{type.icon}</span>
                                            <span>{type.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`width-${field.id}`} className="text-sm font-medium">
                            Field Width
                        </Label>
                        <Select
                            value={field.width}
                            onValueChange={(value) => onUpdateField(form.id, field.id, { width: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {widthOptions.map((width) => (
                                    <SelectItem key={width.value} value={width.value}>
                                        {width.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 col-span-2">
                        <Label htmlFor={`placeholder-${field.id}`} className="text-sm font-medium">
                            Placeholder
                        </Label>
                        <Input
                            id={`placeholder-${field.id}`}
                            value={field.placeholder}
                            onChange={(e) => onUpdateField(form.id, field.id, { placeholder: e.target.value })}
                            placeholder="Enter placeholder text"
                            className="focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                        <Switch
                            id={`required-${field.id}`}
                            checked={field.required}
                            onCheckedChange={(checked) => onUpdateField(form.id, field.id, { required: checked })}
                        />
                        <Label htmlFor={`required-${field.id}`} className="text-sm font-medium">
                            Required Field
                        </Label>
                    </div>

                    {(field.type === 'select' || field.type === 'radio') && (
                        <div className="lg:col-span-3 space-y-2">
                            <Label className="text-sm font-medium">Options</Label>
                            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                                {field.options.map((option: string, optionIndex: number) => (
                                    <div key={optionIndex} className="flex gap-2">
                                        <Input
                                            value={option}
                                            onChange={(e) => {
                                                const newOptions = [...field.options];
                                                newOptions[optionIndex] = e.target.value;
                                                onUpdateField(form.id, field.id, { options: newOptions });
                                            }}
                                            placeholder={`Option ${optionIndex + 1}`}
                                            className="flex-1"
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const newOptions = field.options.filter((_: string, i: number) => i !== optionIndex);
                                                onUpdateField(form.id, field.id, { options: newOptions });
                                            }}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        onUpdateField(form.id, field.id, {
                                            options: [...field.options, `Option ${field.options.length + 1}`],
                                        });
                                    }}
                                    className="w-full border-dashed"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Option
                                </Button>
                            </div>
                        </div>
                    )}
                    <div className="flex items-end justify-end col-span-6">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDeleteField(form.id, field.id)}
                            className="hover:bg-red-600 absolute right-[-13px] top-[-45px] bg-red-600"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>


            </CardContent>
        </Card>
    );
}; 