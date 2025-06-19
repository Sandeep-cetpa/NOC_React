import React, { useState, useEffect } from 'react';
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Save,
  X,
  Copy,
  Search,
  MoveUp,
  MoveDown,
  Settings,
  FileText,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
  MoreHorizontal,
  Database,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Select from 'react-select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FormField } from '@/components/FormBuilder/FormField';
import { FormFieldEditor } from '@/components/FormBuilder/FormFieldEditor';
import { FormPreview } from '@/components/FormBuilder/FormPreview';
import { format } from 'date-fns';

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [activeForm, setActiveForm] = useState(null);
  const [previewMode, setPreviewMode] = useState({});
  const [editingForm, setEditingForm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({ type: '', message: '' });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [currentFormForAction, setCurrentFormForAction] = useState(null);

  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: '📝' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'password', label: 'Password', icon: '🔒' },
    { value: 'number', label: 'Number', icon: '🔢' },
    { value: 'tel', label: 'Phone', icon: '📞' },
    { value: 'url', label: 'URL', icon: '🔗' },
    { value: 'textarea', label: 'Textarea', icon: '📄' },
    { value: 'select', label: 'Select Dropdown', icon: '📋' },
    { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { value: 'radio', label: 'Radio Button', icon: '🔘' },
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'time', label: 'Time', icon: '⏰' },
    { value: 'file', label: 'File Upload', icon: '📎' },
  ];

  const widthOptions = [
    { value: 'full', label: 'Full Width (1/1)', class: 'w-full' },
    { value: 'half', label: 'Half Width (1/2)', class: 'w-1/2' },
    { value: 'third', label: 'One Third (1/3)', class: 'w-1/3' },
    { value: 'quarter', label: 'Quarter Width (1/4)', class: 'w-1/4' },
    { value: 'two-thirds', label: 'Two Thirds (2/3)', class: 'w-2/3' },
    { value: 'three-quarters', label: 'Three Quarters (3/4)', class: 'w-3/4' },
  ];

  // API Functions
  const apiCall = async (endpoint, method = 'GET', data = null) => {
    setIsLoading(true);
    setApiStatus({ type: '', message: '' });

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      // Simulate API response
      if (method === 'GET') {
        // Return forms from localStorage or empty array
        const savedForms = JSON.parse(localStorage.getItem('formBuilderForms') || '[]');
        return savedForms;
      } else if (method === 'POST') {
        // Save new form
        const savedForms = JSON.parse(localStorage.getItem('formBuilderForms') || '[]');
        const newForms = [...savedForms, data];
        localStorage.setItem('formBuilderForms', JSON.stringify(newForms));
        return data;
      } else if (method === 'PUT') {
        // Update existing form
        const savedForms = JSON.parse(localStorage.getItem('formBuilderForms') || '[]');
        const updatedForms = savedForms.map((form) => (form.id === data.id ? data : form));
        localStorage.setItem('formBuilderForms', JSON.stringify(updatedForms));
        return data;
      } else if (method === 'DELETE') {
        // Delete form
        const savedForms = JSON.parse(localStorage.getItem('formBuilderForms') || '[]');
        const filteredForms = savedForms.filter((form) => form.id !== data.id);
        localStorage.setItem('formBuilderForms', JSON.stringify(filteredForms));
        return { success: true };
      }
    } catch (error) {
      setApiStatus({ type: 'error', message: 'API call failed: ' + error.message });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForms = async () => {
    try {
      const formsData = await apiCall('/api/forms');
      setForms(formsData);
      setFilteredForms(formsData);
      setApiStatus({ type: 'success', message: 'Forms loaded successfully' });
    } catch (error) {
      setApiStatus({ type: 'error', message: 'Failed to fetch forms' });
    }
  };

  const saveForm = async (formData) => {
    try {
      if (formData.id && forms.find((f) => f.id === formData.id)) {
        // Update existing form
        await apiCall('/api/forms/' + formData.id, 'PUT', formData);
        setApiStatus({ type: 'success', message: 'Form updated successfully' });
      } else {
        // Create new form
        await apiCall('/api/forms', 'POST', formData);
        setApiStatus({ type: 'success', message: 'Form created successfully' });
      }
      fetchForms();
    } catch (error) {
      setApiStatus({ type: 'error', message: 'Failed to save form' });
    }
  };

  const deleteFormAPI = async (formId) => {
    try {
      await apiCall('/api/forms/' + formId, 'DELETE', { id: formId });
      setApiStatus({ type: 'success', message: 'Form deleted successfully' });
      fetchForms();
    } catch (error) {
      setApiStatus({ type: 'error', message: 'Failed to delete form' });
    }
  };

  // Load forms on component mount
  useEffect(() => {
    fetchForms();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredForms(forms);
    } else {
      const filtered = forms.filter(
        (form) =>
          form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          form.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredForms(filtered);
    }
  }, [searchQuery, forms]);

  const createNewForm = () => {
    const newForm = {
      id: Date.now(),
      title: 'New Form',
      description: '',
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    };
    setCurrentFormForAction(newForm);
    setActiveForm(newForm.id);
    setEditingForm(newForm.id);
    setShowFormDialog(true);
  };

  const updateForm = (formId, updates) => {
    const updatedForm = {
      ...currentFormForAction,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setCurrentFormForAction(updatedForm);
  };

  const addField = (formId) => {
    const newField = {
      id: Date.now(),
      type: 'text',
      label: 'New Field',
      placeholder: '',
      required: false,
      width: 'full',
      order: currentFormForAction.fields.length,
      options: [],
    };

    updateForm(formId, {
      fields: [...currentFormForAction.fields, newField],
    });
  };

  const updateField = (formId, fieldId, updates) => {
    const updatedFields = currentFormForAction.fields.map((field) =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    updateForm(formId, { fields: updatedFields });
  };

  const deleteField = (formId, fieldId) => {
    updateForm(formId, {
      fields: currentFormForAction.fields.filter((field) => field.id !== fieldId),
    });
  };

  const moveField = (formId, fieldId, direction) => {
    const fieldIndex = currentFormForAction.fields.findIndex((f) => f.id === fieldId);
    if (fieldIndex === -1) return;

    const newFields = [...currentFormForAction.fields];
    const targetIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;

    if (targetIndex >= 0 && targetIndex < newFields.length) {
      [newFields[fieldIndex], newFields[targetIndex]] = [newFields[targetIndex], newFields[fieldIndex]];
      newFields.forEach((field, index) => {
        field.order = index;
      });
      updateForm(formId, { fields: newFields });
    }
  };

  const handleSaveForm = () => {
    if (currentFormForAction) {
      saveForm(currentFormForAction);
      setShowFormDialog(false);
      setEditingForm(null);
      setCurrentFormForAction(null);
    }
  };

  const handleViewForm = (form) => {
    setCurrentFormForAction(form);
    setPreviewMode({ [form.id]: true });
    setShowFormDialog(true);
  };

  const handleEditForm = (form) => {
    setCurrentFormForAction({ ...form });
    setActiveForm(form.id);
    setEditingForm(form.id);
    setPreviewMode({ [form.id]: false });
    setShowFormDialog(true);
  };

  const duplicateForm = (form) => {
    const duplicatedForm = {
      ...form,
      id: Date.now(),
      title: `${form.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: form.fields.map((field) => ({
        ...field,
        id: Date.now() + Math.random(),
      })),
    };
    saveForm(duplicatedForm);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' },
      published: { color: 'bg-green-100 text-green-800', label: 'Published' },
      archived: { color: 'bg-gray-100 text-gray-800', label: 'Archived' },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getWidthClass = (width) => {
    const option = widthOptions.find((w) => w.value === width);
    return option ? option.class : 'w-full';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div >
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <span>Form Builder</span>
              </h1>
              <p className="text-gray-600 mt-2">Create, manage, and deploy forms with ease</p>
            </div>

            <div className="flex items-center space-x-4">
              {apiStatus.message && (
                <Alert
                  className={`${
                    apiStatus.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                  } px-4 py-2`}
                >
                  <div className="flex items-center space-x-2">
                    {apiStatus.type === 'error' ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    <AlertDescription
                      className={`${apiStatus.type === 'error' ? 'text-red-800' : 'text-green-800'} text-sm`}
                    >
                      {apiStatus.message}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <Button
                onClick={createNewForm}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Plus className="h-5 w-5 mr-2" />}
                Create New Form
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search forms by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => fetchForms()}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                  <span>Refresh</span>
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {filteredForms.length} forms
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forms Table */}
        {filteredForms.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No forms found' : 'No forms created yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? 'Try adjusting your search criteria' : 'Create your first form to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={createNewForm} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Form
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Forms Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Form Details</TableHead>
                    <TableHead className="text-white">Fields</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Created</TableHead>
                    <TableHead className="text-white">Updated</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredForms.map((form) => (
                    <TableRow key={form.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{form.title}</div>
                          {form.description && (
                            <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">{form.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50">
                          {form.fields.length} fields
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(form.status)}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(form.createdAt), 'd MMM yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(form.updatedAt), 'd MMM yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewForm(form)}
                            className="hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditForm(form)}
                            className="hover:bg-green-50 hover:text-green-700"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="hover:bg-gray-50">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => duplicateForm(form)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteFormAPI(form.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Form Builder/Preview Dialog */}
        <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
          <DialogContent
            className="max-w-6xl max-h-[90vh] overflow-y-auto"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {previewMode[currentFormForAction?.id] ? (
                  <>
                    <Eye className="h-5 w-5 text-blue-600" />
                    <span>Form Preview</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="h-5 w-5 text-green-600" />
                    <span>Form Builder</span>
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {previewMode[currentFormForAction?.id]
                  ? 'Preview how your form will look to users'
                  : 'Design and customize your form fields'}
              </DialogDescription>
            </DialogHeader>

            {currentFormForAction && (
              <div className="space-y-6">
                {/* Form Header */}
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex">
                      <div className="flex-1">
                        {editingForm === currentFormForAction.id && !previewMode[currentFormForAction.id] ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Form Title</Label>
                              <Input
                                value={currentFormForAction.title}
                                onChange={(e) => updateForm(currentFormForAction.id, { title: e.target.value })}
                                placeholder="Enter form title"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Select User Type</Label>
                              <Select
                                options={[
                                  { label: 'Admin', value: 'admin' },
                                  { label: 'User', value: 'user' },
                                  { label: 'Hr', value: 'hr' },
                                  { label: 'Unit HR', value: 'unit-hr' },
                                  { label: 'D & AR', value: 'd&ar' },
                                  { label: 'Vigilance User', value: 'vigilanceuser' },
                                ]}
                                isMulti
                                onChange={(e) => updateForm(currentFormForAction.id, { type: e })}
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">{currentFormForAction.title}</h2>
                            {currentFormForAction.description && (
                              <p className="text-gray-600 mt-2">{currentFormForAction.description}</p>
                            )}

                            <div className="flex items-center space-x-4 mt-3">
                              <Badge className="bg-blue-100 text-blue-800">
                                {currentFormForAction.fields.length} fields
                              </Badge>
                              {getStatusBadge(currentFormForAction.status)}
                              <span className="text-sm text-gray-500">
                                Created: {format(currentFormForAction.createdAt, 'd MMM yyyy')}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-end space-x-2 ml-4">
                        <Button
                          variant="outline"
                          // size="md"
                          onClick={() =>
                            setPreviewMode({
                              [currentFormForAction.id]: !previewMode[currentFormForAction.id],
                            })
                          }
                          className="flex items-center space-x-2"
                        >
                          {previewMode[currentFormForAction.id] ? (
                            <>
                              <EyeOff className="h-6 w-6" />
                              <span>Edit</span>
                            </>
                          ) : (
                            <>
                              <Eye className="h-6 w-6" />
                              <span>Preview</span>
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={handleSaveForm}
                          disabled={isLoading || previewMode[currentFormForAction.id]}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Save Form
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Form Content */}
                {previewMode[currentFormForAction.id] ? (
                  <FormPreview form={currentFormForAction} />
                ) : (
                  <div className="space-y-6">
                    {/* Add Field Section */}
                    <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                      <CardContent className="p-6 text-center">
                        <Button
                          onClick={() => addField(currentFormForAction.id)}
                          size="lg"
                          variant="outline"
                          className="border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Add New Field
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">Add text inputs, dropdowns, checkboxes, and more</p>
                      </CardContent>
                    </Card>

                    {/* Fields List */}
                    {currentFormForAction.fields.length === 0 ? (
                      <Card>
                        <CardContent className="text-center py-12">
                          <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No fields added yet</h3>
                          <p className="text-gray-500 mb-6">Start building your form by adding some fields</p>
                          <Button
                            onClick={() => addField(currentFormForAction.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Field
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                            <Settings className="h-5 w-5" />
                            <span>Form Fields ({currentFormForAction.fields.length})</span>
                          </h3>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {currentFormForAction.fields.filter((f) => f.required).length} required
                          </Badge>
                        </div>

                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                          {currentFormForAction.fields.map((field, index) => (
                            <FormFieldEditor
                              key={field.id}
                              form={currentFormForAction}
                              field={field}
                              index={index}
                              fieldTypes={fieldTypes}
                              widthOptions={widthOptions}
                              onUpdateField={updateField}
                              onDeleteField={deleteField}
                              onMoveField={moveField}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Forms;
