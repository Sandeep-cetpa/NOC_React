import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
// UI Components
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, User, UserCog, Search, Trash2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

const ManageGreyList = () => {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean | null>(false);
  const [selectedUnitName, setSelectedUnitName] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userListWithRoles, setUserListWithRoles] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const employees = useSelector((state: RootState) => state.employee.employees);
  // Filter users based on selected unit and search query
  useEffect(() => {
    if (!userListWithRoles || !Array.isArray(userListWithRoles)) {
      setFilteredData([]);
      return;
    }
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();
    const filteredData = userListWithRoles
      .filter((user) => !selectedUnitId || Number(user.unit) === Number(selectedUnitId))
      .filter((user) => {
        const empCode = user?.empCode?.toString().toLowerCase();
        const empName = getEmpNameByID(user?.empCode)?.toLowerCase();
        const empUnit = getUnitByEmp(user?.empCode)?.toLowerCase();
        return (
          !normalizedSearchQuery ||
          empCode?.includes(normalizedSearchQuery) ||
          empName?.includes(normalizedSearchQuery) ||
          empUnit?.includes(normalizedSearchQuery)
        );
      });
    setFilteredData(filteredData);
  }, [searchQuery, userListWithRoles, selectedUnitId]);

  // Get unique units from employees
  const unitOptions = useMemo(() => {
    const uniqueUnits = employees
      .map((emp) => ({
        id: emp.unitId?.toString() || '',
        name: emp.unitName?.toLowerCase() || '',
      }))
      .filter((unit, index, self) => unit.id && index === self.findIndex((u) => u.id === unit.id))
      .map((unit) => ({
        value: unit.id,
        label: unit.name.charAt(0).toUpperCase() + unit.name.slice(1),
      }));
    return uniqueUnits;
  }, [employees]);
  // Get employees filtered by selected unit
  const filteredEmployees = useMemo(() => {
    if (!selectedUnitId) return [];

    return employees
      .filter((emp) => emp.unitId?.toString() === selectedUnitId)
      .map((emp) => ({
        value: emp.empCode,
        label: `${emp.empCode} | ${emp.empName || 'Unknown'} | ${emp.designation} | ${emp.department}`,
        empName: emp.empName || '',
        empCode: emp.empCode || '',
        designation: emp.designation || '',
        unitId: emp.unitId || '',
        department: emp.department || '',
      }));
  }, [employees, selectedUnitId]);

  // Helper functions
  const getEmpNameByID = (empCode: string | number) => {
    const emp = employees?.find((e) => Number(e.empCode) === Number(empCode));
    return emp?.empName;
  };
  const getUnitByEmp = (empCode: string | number) => {
    const emp = employees?.find((e) => Number(e.empCode) === Number(empCode));
    return emp?.unitName;
  };
  const handleUnitChange = (unitId: string) => {
    setSelectedUnitId(unitId);
    const unit = unitOptions.find((u) => u.value === unitId);
    setSelectedUnitName(unit?.label || '');
    // Reset employee and role when unit changes
    setSelectedEmployee(null);
  };

  const handleEmployeeChange = (empCode: string) => {
    const employee = filteredEmployees.find((emp) => emp.value === empCode);
    setSelectedEmployee(employee);
  };
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Greylist Management</h1>
          <p className="text-muted-foreground">Add or remove user </p>
        </div>
      </div>
      {/* Role Assignment Section */}
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)} className="">
          Add user to grey list
        </Button>
      </div>
      {showForm && (
        <Card className="shadow-md border-slate-200">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              Add user to grey list to user
            </CardTitle>
            <CardDescription>Select a unit, employee, and add to greylist</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Unit Selection */}
              <div className="space-y-2">
                <Label htmlFor="unit" className="font-medium flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-slate-500" />
                  Select Unit
                </Label>
                <Select value={selectedUnitId || ''} onValueChange={handleUnitChange}>
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

              {/* Employee Selection - Only enabled if unit is selected */}
              <div className="space-y-2">
                <Label htmlFor="employee" className="font-medium flex items-center gap-1.5">
                  <User className="h-4 w-4 text-slate-500" />
                  Select Employee
                </Label>
                <Select
                  value={selectedEmployee?.value || ''}
                  onValueChange={handleEmployeeChange}
                  disabled={!selectedUnitId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={selectedUnitId ? 'Select an employee' : 'Select a unit first'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Employees in {selectedUnitName}</SelectLabel>
                      {filteredEmployees.map((emp) => (
                        <SelectItem key={emp.value} value={emp.value}>
                          {emp.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Role Selection - Only enabled if employee is selected */}
              <div className="space-y-2">
                <Label htmlFor="role" className="font-medium flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-slate-500" />
                  Reason
                </Label>
                <Input placeholder="Inter the reason" />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end border-t pt-4">
            <Button disabled={!selectedEmployee || isSubmitting} className="flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Assign Role
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Users List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Grey listed user
          </h2>
          {userListWithRoles.length > 0 && (
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-[300px]"
              />
            </div>
          )}
        </div>

        <Card className="shadow-md border-slate-200 overflow-hidden">
          {userListWithRoles.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-lg font-medium text-slate-700">No grey listed users found </p>
              <p className="text-sm text-slate-500">Add user to greylist to see them listed here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-100">
                    <TableHead className="w-[120px]">Employee Code</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Assigned Role</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((user, index) => (
                      <TableRow key={index} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{user.empCode}</TableCell>
                        <TableCell>{getEmpNameByID(user.empCode) || '—'}</TableCell>
                        <TableCell>{getUnitByEmp(user.empCode) || '—'}</TableCell>
                        <TableCell>
                          {user.roles.map((role: any) => (
                            <Badge key={role.roleId} variant="outline" className="mr-1 bg-slate-50">
                              {role.roleName}
                            </Badge>
                          ))}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => removeUserRole(user)} title="Remove role">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No matching users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ManageGreyList;
