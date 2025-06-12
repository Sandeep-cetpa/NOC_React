import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import axiosInstance from '@/services/axiosInstance';
import useUserRoles from '@/hooks/useUserRoles';
import { Employee, SelectOption } from '@/types/Employee';
import toast from 'react-hot-toast';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Loader from '@/components/ui/loader';

// Icons
import {
  Building2,
  User,
  UserCog,
  Search,
  Trash2,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const ManageRole = () => {
  // State for unit selection
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedUnitName, setSelectedUnitName] = useState<string>('');

  // State for employee selection
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // State for role selection (only one role allowed)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  // Loading and data states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [roleAndPermissionList, setRoleAndPermissionList] = useState<any[]>([]);
  const [userListWithRoles, setUserListWithRoles] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dialog state
  const [openChangeRoleModal, setOpenChangeRoleModal] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<any>(null);

  // Redux state
  const employees = useSelector((state: RootState) => state.employee.employees);
  const { isSuperAdmin } = useUserRoles();

  // Fetch roles and employees with roles on component mount
  useEffect(() => {
    getPermissionAndRoleList();
    getEmpWithRoles();
  }, []);

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

  // API calls
  const getPermissionAndRoleList = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/User/GetRoleAndPermissionList');
      if (response?.data?.statusCode === 200) {
        setRoleAndPermissionList(response?.data?.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmpWithRoles = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/User/GetEmpRoleList');
      if (response?.data?.statusCode === 200) {
        setUserListWithRoles(response?.data?.data);
      } else {
        setUserListWithRoles([]);
      }
    } catch (error) {
      console.error('Error fetching employees with roles:', error);
      setUserListWithRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const assignRoleToUser = async () => {
    if (!selectedEmployee || !selectedRoleId) return;

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post('/User/AddUserRoleMapping', {
        empCode: Number(selectedEmployee.empCode),
        empUnitId: selectedEmployee.unitId,
        userRoles: [{ roleId: selectedRoleId }], // Only one role
      });

      if (response?.data?.statusCode === 200) {
        toast.success('Role assigned successfully!');
        // Reset selections
        setSelectedEmployee(null);
        setSelectedRoleId(null);
        // Refresh data
        getEmpWithRoles();
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeUserRole = async (user: any) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.put('/User/EditEmpRole', {
        empCode: user?.empCode,
        empUnit: user?.unit,
        roles: [], // Empty array to remove all roles
      });

      if (response?.data?.statusCode === 200) {
        toast.success('Role removed successfully');
        getEmpWithRoles();
      } else {
        toast.error('Failed to remove role');
      }
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

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
    setSelectedRoleId(null);
  };

  const handleEmployeeChange = (empCode: string) => {
    const employee = filteredEmployees.find((emp) => emp.value === empCode);
    setSelectedEmployee(employee);
    // Reset role when employee changes
    setSelectedRoleId(null);
  };

  const handleRoleChange = (roleId: string) => {
    // Only allow one role (replace previous selection)
    setSelectedRoleId(roleId);
  };

  if (isLoading && !userListWithRoles.length) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">Assign and manage user roles</p>
        </div>

        <Card className="w-full md:w-auto shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <span>Users can have a maximum of one role</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Assignment Section */}
      <Card className="shadow-md border-slate-200">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-xl flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            Assign Role to User
          </CardTitle>
          <CardDescription>Select a unit, employee, and assign a role</CardDescription>
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
                <ShieldCheck className="h-4 w-4 text-slate-500" />
                Select Role
              </Label>
              {selectedEmployee ? (
                <RadioGroup
                  value={selectedRoleId || ''}
                  onValueChange={handleRoleChange}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1"
                >
                  {roleAndPermissionList.map((role) => (
                    <div key={role.roleId} className="flex items-center space-x-2">
                      <RadioGroupItem value={role.roleId.toString()} id={`role-${role.roleId}`} />
                      <Label htmlFor={`role-${role.roleId}`} className="cursor-pointer">
                        {role.roleName}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="h-10 flex items-center text-muted-foreground text-sm">
                  Select an employee first to view available roles
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t pt-4">
          <Button
            onClick={assignRoleToUser}
            disabled={!selectedEmployee || !selectedRoleId || isSubmitting}
            className="flex items-center gap-2"
          >
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

      {/* Users List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Users with Assigned Roles
          </h2>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-[300px]"
            />
          </div>
        </div>

        <Card className="shadow-md border-slate-200 overflow-hidden">
          {userListWithRoles.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-lg font-medium text-slate-700">No users with roles found</p>
              <p className="text-sm text-slate-500">Assign roles to users to see them listed here</p>
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

export default ManageRole;
