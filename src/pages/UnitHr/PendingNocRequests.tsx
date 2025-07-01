import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, FileX, Users, Eye, Building2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import Loader from '@/components/ui/loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import UnitHrNOCDetailDialog from '@/components/dialogs/UnitHrNOCDetailDialog';
import toast from 'react-hot-toast';
import { get } from 'http';

const PendingNocRequests = () => {
  const userRoles = useSelector((state: RootState) => state.user.Roles);
  const user = useSelector((state: RootState) => state.user);
  console.log(user);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [selectedNoc, setSelectedNoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const assiedUnits = userRoles.find((ele) => ele.roleId === 3);
  const [selectedUnit, setSelectedUnit] = useState<string>(assiedUnits?.unitsAssigned?.[0]?.unitId?.toString() || '');
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const getAllRequests = async (unitId) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/UnitHR/NOC?UnitId=${unitId}`);
      if (response.data.success) {
        setRequests([]);
        setFilteredRequests([]);
      }
      console.log(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUnitSelection = (unitId: string) => {
    setSelectedUnit(unitId);
    getAllRequests(unitId);
    setSearchTerm(''); // Reset search when changing units
  };
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(
        (request) =>
          request.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.purposeName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
  }, [searchTerm, requests]);
  useEffect(() => {
    if (assiedUnits?.unitsAssigned?.length > 0) {
      const firstUnit = assiedUnits.unitsAssigned[0];
      const unitIdString = firstUnit.unitId.toString();
      setSelectedUnit(unitIdString);
      getAllRequests(firstUnit.unitId);
    }
  }, []);
  const handleApproveClick = async (nocId: number) => {
    try {
      const response = await axiosInstance.put('/UnitHR/NOC', {
        refId: nocId,
        status: 0,
        presentUnit: 'string',
        pastPosition: 'string',
        remarks: remarks,
        updatedDob: '2025-06-30T05:43:59.264Z',
        updatedDor: '2025-06-30T05:43:59.264Z',
        updatedDoeis: '2025-06-30T05:43:59.264Z',
        hrUnitId: selectedUnit,
        hrAutoId: user?.EmpID,
      });
      if (response.data.success) {
        setIsOpen(false);
        getAllRequests(selectedUnit);
        setRemarks('');
        toast.success('Request approved successfully');
      }
    } catch (error) {
      console.error('Error approving NOC:', error);
    }
    // Implement logic to approve the NOC with the given ID
  };

  const EmptyState = () => (
    <Alert className="border-dashed border-2 border-gray-200">
      <FileX className="h-4 w-4" />
      <AlertDescription>
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileX className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No NOC Requests Found</h3>
          <p className="text-gray-500 text-center max-w-sm mb-4">
            {searchTerm
              ? `No requests match your search for "${searchTerm}"`
              : 'There are currently no NOC requests for the selected unit.'}
          </p>
          {searchTerm && (
            <Button variant="outline" size="sm" onClick={() => setSearchTerm('')} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Clear Search
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="p-6 mx-auto space-y-6">
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            NOC Requests History
          </CardTitle>
          <Separator />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="unit-select" className="text-sm font-medium text-gray-700">
                Select Unit
              </Label>
              <Select value={selectedUnit} onValueChange={handleUnitSelection}>
                <SelectTrigger id="unit-select" className="w-[200px]">
                  <SelectValue placeholder="Choose a unit" />
                </SelectTrigger>
                <SelectContent>
                  {assiedUnits?.unitsAssigned?.map((unit, index) => (
                    <SelectItem key={unit.unitId} value={unit.unitId.toString()}>
                      {unit?.unitName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="search-input" className="text-sm font-medium text-gray-700">
                Search Requests
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-input"
                  placeholder="Search requests..."
                  className="pl-9 w-[280px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredRequests.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Employee Code</TableHead>
                      <TableHead className="text-white">Initiation Date</TableHead>
                      <TableHead className="text-white">Department</TableHead>
                      <TableHead className="text-white">Name</TableHead>
                      <TableHead className="text-white">Purpose</TableHead>
                      <TableHead className="w-[100px] text-white">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{request.employeeCode}</TableCell>
                        <TableCell className="font-medium">{request.initiationDate}</TableCell>
                        <TableCell>{request.department}</TableCell>
                        <TableCell>{request.username}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {request.icon}
                            <span>{request.purposeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedNoc(request);
                              setIsOpen(true);
                            }}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    Showing {filteredRequests.length} of {requests.length} entries
                    {searchTerm && (
                      <Badge variant="outline" className="ml-2">
                        filtered by "{searchTerm}"
                      </Badge>
                    )}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled className="gap-1">
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button size="sm" className="w-8 h-8 p-0">
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled className="gap-1">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          <UnitHrNOCDetailDialog
            setRemarks={setRemarks}
            handleApproveClick={handleApproveClick}
            remarks={remarks}
            nocData={selectedNoc}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingNocRequests;
