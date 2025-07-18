import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, Building2, CheckCircle2, RefreshCw, User, UserCog, X } from 'lucide-react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';

const AddUserInGrayList = ({
  selectedEmployees,
  handleSelectAllEmployees,
  showForm,
  filteredEmployees,
  unitOptions,
  selectedUnitId,
  handleUnitChange,
  handleEmployeeCheckboxChange,
  handleRemoveSelectedEmployee,
  handleSubmitAddToGreylist,
  isSubmitting,
  addReason,
  setShowForm,
  setAddReason,
  isRoleMapping,
  setSelectedEmployees,
}) => {
  return (
    <div>
      {showForm && (
        <Card className="shadow-md border-slate-200">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              {isRoleMapping ? 'Add Users to Vigilance User' : 'Add Users to Greylist'}
            </CardTitle>
            <CardDescription>
              Select a unit and employees to add to the {isRoleMapping ? 'vigilance user' : 'greylist'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Unit Selection */}
              <div className="space-y-2">
                <Label htmlFor="unit" className="font-medium flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-slate-500" />
                  Select Unit
                </Label>
                <Select value={selectedUnitId} onValueChange={handleUnitChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Available Units</SelectLabel>
                      {unitOptions.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Employee Multi-Select */}
              <div className="space-y-2">
                <Label className="font-medium flex items-center gap-1.5">
                  <User className="h-4 w-4 text-slate-500" />
                  Select Employees ({selectedEmployees.length} selected)
                </Label>

                {selectedUnitId && (
                  <div className="space-y-3">
                    {/* Select All Checkbox */}
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                      <Checkbox
                        checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                        onCheckedChange={handleSelectAllEmployees}
                        id="select-all"
                      />
                      <Label htmlFor="select-all" className="text-sm font-medium">
                        Select All ({filteredEmployees.length} employees)
                      </Label>
                    </div>

                    {/* Employee List */}
                    <ScrollArea className="h-40 border rounded p-2 bg-white">
                      {filteredEmployees?.length === 0 ? (
                        <div className="text-sm text-muted-foreground p-2">No employees available in this unit</div>
                      ) : (
                        <div className="space-y-2">
                          {filteredEmployees?.map((emp) => (
                            <div key={emp.value} className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded">
                              <Checkbox
                                checked={selectedEmployees.some((e) => e.value === emp.value)}
                                onCheckedChange={(checked) => handleEmployeeCheckboxChange(emp, !!checked)}
                                id={`emp-checkbox-${emp.value}`}
                              />
                              <Label htmlFor={`emp-checkbox-${emp.value}`} className="text-sm cursor-pointer flex-1">
                                {emp.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>

                    {/* Selected Employees Display */}
                    {selectedEmployees.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Selected Employees:</Label>
                        <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded max-h-24 overflow-y-auto">
                          {selectedEmployees.map((emp) => (
                            <Badge key={emp.value} variant="secondary" className="flex items-center gap-1">
                              {emp.empName} ({emp.empCode})
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleRemoveSelectedEmployee(emp.value)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!selectedUnitId && (
                  <div className="text-sm text-muted-foreground p-4 border rounded bg-slate-50">
                    Please select a unit first to see available employees
                  </div>
                )}
              </div>

              {/* Reason Field */}
              {!isRoleMapping && (
                <div className="space-y-2">
                  <Label htmlFor="reason" className="font-medium flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-slate-500" />
                    Reason <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="reason"
                    placeholder={
                      isRoleMapping
                        ? 'Enter the reason for adding to vigilance user'
                        : 'Enter the reason for adding to greylist'
                    }
                    value={addReason}
                    onChange={(e) => setAddReason(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedEmployees([]);
                setShowForm(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={selectedEmployees.length === 0 || (isSubmitting && (isRoleMapping ? !addReason.trim() : false))}
              onClick={handleSubmitAddToGreylist}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Add to Greylist ({selectedEmployees.length})
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AddUserInGrayList;
