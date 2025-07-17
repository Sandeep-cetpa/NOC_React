import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { User, RefreshCw, AlertCircle, Plus, Trash2, UserX, Eye, Info } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import TableList from '@/components/ui/data-table';
import toast from 'react-hot-toast';
import Loader from '@/components/ui/loader';
import AddUserInGrayList from '@/components/AddUserInGrayList';
import ReasonDialog from '@/components/dialogs/ReasonDialog';

interface Employee {
  employeeCode: string;
  userName: string;
  location?: string;
  designation?: string;
  department?: string;
  post?: string;
  positionGrade?: string;
  pkId?: number;
  userFkAutoId?: number;
}

interface EmployeeOption {
  value: string;
  label: string;
  empName: string;
  empCode: string;
  designation: string;
  unitId: string;
  department: string;
}

interface AllUsersData {
  allEmployees: Employee[];
  assignedUser: Employee[];
}

const ManageGreyList = () => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<AllUsersData>({
    allEmployees: [],
    assignedUser: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeOption[]>([]);
  const [addReason, setAddReason] = useState<string>('');
  const [selectedRowsForRemoval, setSelectedRowsForRemoval] = useState<Employee[]>([]);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [removeReason, setRemoveReason] = useState<string>('');
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    getEmployeeMap();
  }, []);

  const getEmployeeMap = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/VigilanceAdmin/NOC/GreyList`);
      if (response.data?.success) {
        setAllUsers(response.data.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const unitOptions = useMemo(() => {
    const uniqueUnits = allUsers?.allEmployees
      ?.map((emp) => ({
        location: emp.location?.toString() || '',
        name: emp.location?.toLowerCase() || '',
      }))
      .filter((unit, index, self) => unit.location && index === self.findIndex((u) => u.location === unit.location))
      .map((unit) => ({
        value: unit.location,
        label: unit.location.charAt(0).toUpperCase() + unit.location.slice(1),
      }));
    return uniqueUnits || [];
  }, [allUsers]);

  // Get employees filtered by selected unit
  const filteredEmployees = useMemo(() => {
    if (!selectedUnitId) return [];

    return (
      allUsers?.allEmployees
        ?.filter((emp) => emp.location?.toString() === selectedUnitId)
        ?.filter((emp) => !allUsers.assignedUser.some((assigned) => assigned.employeeCode === emp.employeeCode))
        .map((emp: any) => ({
          value: emp.employeeMasterAutoId,
          label: `${emp.employeeCode} | ${emp.userName || 'Unknown'}`,
          empName: emp.userName || '',
          empCode: emp.employeeCode || '',
          designation: emp.designation || '',
          unitId: emp.location || '',
          department: emp.department || '',
        })) || []
    );
  }, [allUsers, selectedUnitId]);

  const handleUnitChange = (unitId: string) => {
    setSelectedUnitId(unitId);
    const unit = unitOptions.find((u) => u.value === unitId);

    setSelectedEmployees([]);
  };

  const handleEmployeeCheckboxChange = (emp: EmployeeOption, checked: boolean) => {
    setSelectedEmployees(() => {
      if (checked) {
        return [emp];
      } else {
        return [];
      }
    });
  };

  const handleRemoveSelectedEmployee = (empCode: string) => {
    setSelectedEmployees((prev) => prev.filter((emp) => emp.value !== empCode));
  };

  const handleSelectAllEmployees = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(filteredEmployees);
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSubmitAddToGreylist = async () => {
    if (selectedEmployees.length === 0 || !addReason.trim()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        userFkAutoId: selectedEmployees.map((ele) => ele.value),
        pkId: [],
        reason: addReason,
        vigilanceAdminEmpCode: '',
        vigilanceAdminAutoId: 0,
      };
      const response = await axiosInstance.post('/VigilanceAdmin/NOC/Block-User', payload);
      if (response.data.success) {
        toast.success('Selected employees added to greylist successfully');
        setSelectedEmployees([]);
        setAddReason('');
        setShowForm(false);
        getEmployeeMap();
      }
    } catch (error) {
      console.error('Error adding to greylist:', error);
      toast.error('Failed to add employees to greylist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFromGreylist = async () => {
    if (selectedRowsForRemoval.length === 0 || !removeReason.trim()) {
      return;
    }
    setIsRemoving(true);
    try {
      const payload = {
        userFkAutoId: [],
        pkId: selectedRowsForRemoval.map((emp: any) => emp.pkTblUserid || 0),
        reason: removeReason,
        vigilanceAdminEmpCode: '',
        vigilanceAdminAutoId: 0,
      };
      const response = await axiosInstance.post('/VigilanceAdmin/NOC/UnBlock-User/Delete', payload);
      if (response.data.success) {
        toast.success('Selected employees removed from greylist successfully');
        setSelectedRowsForRemoval([]);
        setRemoveReason('');
        setIsRemoveDialogOpen(false);
        getEmployeeMap();
      }
    } catch (error) {
      console.error('Error removing from greylist:', error);
      toast.error('Failed to remove employees from greylist');
    } finally {
      setIsRemoving(false);
    }
  };
  const handleReasonEdit = async (data: any) => {
    try {
      console.log(data, 'data of edit reason');
      const payload = {
        userFkAutoId: [],
        pkId: [data?.pkTblUserid],
        reason: data.reason,
      };
      const response = await axiosInstance.put('/VigilanceAdmin/NOC/Edit-Reason', payload);
      if (response.data.success) {
        toast.success('Reason updated successfully');
        setIsDialogOpen(false);
        getEmployeeMap();
        setSelectedRow(null);
        setSelectedRowsForRemoval([]);
        setSelectedEmployees([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleRowClick = (row: Employee) => {
    console.log('Row clicked:', row);

    setSelectedRowsForRemoval((prevSelected) => {
      const isAlreadySelected = prevSelected.some((selected) => selected.employeeCode === row.employeeCode);

      if (isAlreadySelected) {
        // Remove from selection
        return prevSelected.filter((selected) => selected.employeeCode !== row.employeeCode);
      } else {
        // Add to selection
        return [...prevSelected, row];
      }
    });
  };
  const isRowSelected = (row: Employee) => {
    return selectedRowsForRemoval.some((selected) => selected.employeeCode === row.employeeCode);
  };

  const columns = [
    {
      id: 'select',
      header: ({ table }: any) => (
        <Checkbox
          checked={allUsers?.assignedUser?.length > 0 && selectedRowsForRemoval.length === allUsers.assignedUser.length}
          onCheckedChange={(value: boolean) => {
            if (value) {
              setSelectedRowsForRemoval(allUsers?.assignedUser || []);
            } else {
              setSelectedRowsForRemoval([]);
            }
          }}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={isRowSelected(row.original)}
          onCheckedChange={(value: boolean) => {
            if (value) {
              setSelectedRowsForRemoval((prev) => [...prev, row.original]);
            } else {
              setSelectedRowsForRemoval((prev) =>
                prev.filter((selected) => selected.employeeCode !== row.original.employeeCode)
              );
            }
          }}
          aria-label="Select row"
          className="translate-y-[2px]"
          onClick={(e) => e.stopPropagation()} // Prevent row click when clicking checkbox
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'employeeCode',
      header: 'Employee Code',
      cell: ({ row }: any) => <div className="font-medium text-slate-900">{row.original.employeeCode}</div>,
    },
    {
      accessorKey: 'userName',
      header: 'Employee Name',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-slate-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-slate-900 truncate" title={row.original.userName}>
              {row.original.userName}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'post',
      header: 'Designation',
      cell: ({ row }: any) => (
        <div className="text-slate-700">
          {row.original.post || row.original.designation || (
            <span className="text-slate-400 italic">Not specified</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'positionGrade',
      header: 'Position Grade',
      cell: ({ row }: any) => (
        <div className="text-center">
          {row.original.positionGrade ? (
            <Badge variant="outline" className="text-xs">
              {row.original.positionGrade}
            </Badge>
          ) : (
            <span className="text-slate-400 italic text-sm">N/A</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }: any) => (
        <div className="text-slate-700">
          <Button
            onClick={(e) => {
              e.preventDefault();
              setSelectedRow(row?.original);
              setIsDialogOpen(true);
            }}
          >
            <Info />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
          <UserX className="h-3 w-3 mr-1" />
          Greylisted
        </Badge>
      ),
    },
  ];

  return (
    <div className="mx-auto p-6 space-y-6">
      {/* Page Header */}
      {isLoading && <Loader />}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Greylist Management</h1>
          <p className="text-muted-foreground">Add or remove users from greylist</p>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add users to greylist
          </Button>
        </div>
      </div>

      {/* Add to Greylist Form */}
      <AddUserInGrayList
        handleUnitChange={handleUnitChange}
        handleSubmitAddToGreylist={handleSubmitAddToGreylist}
        handleSelectAllEmployees={handleSelectAllEmployees}
        handleRemoveSelectedEmployee={handleRemoveSelectedEmployee}
        handleEmployeeCheckboxChange={handleEmployeeCheckboxChange}
        isSubmitting={isSubmitting}
        showForm={showForm}
        setAddReason={setAddReason}
        setShowForm={setShowForm}
        addReason={addReason}
        selectedEmployees={selectedEmployees}
        selectedUnitId={selectedUnitId}
        unitOptions={unitOptions}
        setSelectedEmployees={setSelectedEmployees}
        filteredEmployees={filteredEmployees}
      />
      {/* Users List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Greylisted Users ({allUsers?.assignedUser?.length || 0})
          </h2>
        </div>

        {allUsers?.assignedUser?.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">No greylisted users found</h3>
              <p className="text-sm text-slate-500">Add users to the greylist to see them listed here</p>
            </div>
          </Card>
        ) : (
          <TableList
            rightElements={
              <>
                <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={selectedRowsForRemoval.length === 0}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove Selected Users ({selectedRowsForRemoval.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <UserX className="h-5 w-5 text-red-500" />
                        Remove Users from Greylist
                      </DialogTitle>
                      <DialogDescription>
                        You are about to remove {selectedRowsForRemoval.length} user(s) from the greylist. This action
                        cannot be undone.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Selected Users:</Label>
                        <div className="max-h-32 overflow-y-auto space-y-1 p-2 bg-slate-50 rounded">
                          {selectedRowsForRemoval.map((user) => (
                            <div key={user.employeeCode} className="text-sm flex items-center gap-2">
                              <User className="h-3 w-3 text-slate-500" />
                              {user.userName} ({user.employeeCode})
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="remove-reason" className="font-medium flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 text-slate-500" />
                          Reason for Removal <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="remove-reason"
                          placeholder="Enter the reason for removing from greylist"
                          value={removeReason}
                          onChange={(e) => setRemoveReason(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={!removeReason.trim() || isRemoving}
                        onClick={handleRemoveFromGreylist}
                        className="flex items-center gap-2"
                      >
                        {isRemoving ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Removing...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Remove Users
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            }
            data={allUsers?.assignedUser}
            columns={columns}
            onRowClick={handleRowClick}
          />
        )}
        <ReasonDialog
          userData={selectedRow}
          onSave={handleReasonEdit}
          isOpen={isDialogOpen}
          onClose={setIsDialogOpen}
        />
      </div>
    </div>
  );
};

export default ManageGreyList;
