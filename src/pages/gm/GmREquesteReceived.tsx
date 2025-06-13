import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Eye,
  FileText,
  User,
  Briefcase,
  MessageSquare,
  Shield,
  UserCog,
  Search,
  Printer,
  Check,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type Request = {
  employeeCode: string;
  designation: string;
  name: string;
  purpose: string;
  description: string;
  remarksByUnitHR: string;
  remarksByCGM: string;
  remarksByCorporateHR: string;
  remarksByDAndAR: string;
  remarksByVigilanceOfficer: string;
  remarksByDrCVO: string;
};

const dummyData: Request[] = [
  {
    employeeCode: 'EMP001',
    designation: 'Software Engineer',
    name: 'John Doe',
    purpose: 'Passport Update',
    description: 'Upload old passport',
    remarksByUnitHR: 'Verified',
    remarksByCGM: 'Approved',
    remarksByCorporateHR: 'Reviewed',
    remarksByDAndAR: 'Checked',
    remarksByVigilanceOfficer: 'Cleared',
    remarksByDrCVO: 'Final Approval',
  },
  {
    employeeCode: 'EMP002',
    designation: 'Senior Developer',
    name: 'Jane Smith',
    purpose: 'Document Update',
    description: 'Upload new documents',
    remarksByUnitHR: 'Pending', 
    remarksByCGM: 'In Review',
    remarksByCorporateHR: 'Awaiting',
    remarksByDAndAR: 'In Process',
    remarksByVigilanceOfficer: 'Under Review',
    remarksByDrCVO: 'Pending',
  },
  {
    employeeCode: 'EMP001',
    designation: 'Software Engineer',
    name: 'John Doe',
    purpose: 'Passport Update',
    description: 'Upload old passport',
    remarksByUnitHR: 'Verified',
    remarksByCGM: 'Approved',
    remarksByCorporateHR: 'Reviewed',
    remarksByDAndAR: 'Checked',
    remarksByVigilanceOfficer: 'Cleared',
    remarksByDrCVO: 'Final Approval',
  },
  {
    employeeCode: 'EMP002',
    designation: 'Senior Developer',
    name: 'Jane Smith',
    purpose: 'Document Update',
    description: 'Upload new documents',
    remarksByUnitHR: 'Pending',
    remarksByCGM: 'In Review',
    remarksByCorporateHR: 'Awaiting',
    remarksByDAndAR: 'In Process',
    remarksByVigilanceOfficer: 'Under Review',
    remarksByDrCVO: 'Pending',
  },
  {
    employeeCode: 'EMP001',
    designation: 'Software Engineer',
    name: 'John Doe',
    purpose: 'Passport Update',
    description: 'Upload old passport',
    remarksByUnitHR: 'Verified',
    remarksByCGM: 'Approved',
    remarksByCorporateHR: 'Reviewed',
    remarksByDAndAR: 'Checked',
    remarksByVigilanceOfficer: 'Cleared',
    remarksByDrCVO: 'Final Approval',
  },
  {
    employeeCode: 'EMP002',
    designation: 'Senior Developer',
    name: 'Jane Smith',
    purpose: 'Document Update',
    description: 'Upload new documents',
    remarksByUnitHR: 'Pending',
    remarksByCGM: 'In Review',
    remarksByCorporateHR: 'Awaiting',
    remarksByDAndAR: 'In Process',
    remarksByVigilanceOfficer: 'Under Review',
    remarksByDrCVO: 'Pending',
  },
  {
    employeeCode: 'EMP001',
    designation: 'Software Engineer',
    name: 'John Doe',
    purpose: 'Passport Update',
    description: 'Upload old passport',
    remarksByUnitHR: 'Verified',
    remarksByCGM: 'Approved',
    remarksByCorporateHR: 'Reviewed',
    remarksByDAndAR: 'Checked',
    remarksByVigilanceOfficer: 'Cleared',
    remarksByDrCVO: 'Final Approval',
  },
  {
    employeeCode: 'EMP002',
    designation: 'Senior Developer',
    name: 'Jane Smith',
    purpose: 'Document Update',
    description: 'Upload new documents',
    remarksByUnitHR: 'Pending',
    remarksByCGM: 'In Review',
    remarksByCorporateHR: 'Awaiting',
    remarksByDAndAR: 'In Process',
    remarksByVigilanceOfficer: 'Under Review',
    remarksByDrCVO: 'Pending',
  },
  {
    employeeCode: 'EMP001',
    designation: 'Software Engineer',
    name: 'John Doe',
    purpose: 'Passport Update',
    description: 'Upload old passport',
    remarksByUnitHR: 'Verified',
    remarksByCGM: 'Approved',
    remarksByCorporateHR: 'Reviewed',
    remarksByDAndAR: 'Checked',
    remarksByVigilanceOfficer: 'Cleared',
    remarksByDrCVO: 'Final Approval',
  },
  {
    employeeCode: 'EMP002',
    designation: 'Senior Developer',
    name: 'Jane Smith',
    purpose: 'Document Update',
    description: 'Upload new documents',
    remarksByUnitHR: 'Pending',
    remarksByCGM: 'In Review',
    remarksByCorporateHR: 'Awaiting',
    remarksByDAndAR: 'In Process',
    remarksByVigilanceOfficer: 'Under Review',
    remarksByDrCVO: 'Pending',
  },
  {
    employeeCode: 'EMP001',
    designation: 'Software Engineer',
    name: 'John Doe',
    purpose: 'Passport Update',
    description: 'Upload old passport',
    remarksByUnitHR: 'Verified',
    remarksByCGM: 'Approved',
    remarksByCorporateHR: 'Reviewed',
    remarksByDAndAR: 'Checked',
    remarksByVigilanceOfficer: 'Cleared',
    remarksByDrCVO: 'Final Approval',
  },
  {
    employeeCode: 'EMP002',
    designation: 'Senior Developer',
    name: 'Jane Smith',
    purpose: 'Document Update',
    description: 'Upload new documents',
    remarksByUnitHR: 'Pending',
    remarksByCGM: 'In Review',
    remarksByCorporateHR: 'Awaiting',
    remarksByDAndAR: 'In Process',
    remarksByVigilanceOfficer: 'Under Review',
    remarksByDrCVO: 'Pending',
  },
  {
    employeeCode: 'EMP001',
    designation: 'Software Engineer',
    name: 'John Doe',
    purpose: 'Passport Update',
    description: 'Upload old passport',
    remarksByUnitHR: 'Verified',
    remarksByCGM: 'Approved',
    remarksByCorporateHR: 'Reviewed',
    remarksByDAndAR: 'Checked',
    remarksByVigilanceOfficer: 'Cleared',
    remarksByDrCVO: 'Final Approval',
  },
  {
    employeeCode: 'EMP002',
    designation: 'Senior Developer',
    name: 'Jane Smith',
    purpose: 'Document Update',
    description: 'Upload new documents',
    remarksByUnitHR: 'Pending',
    remarksByCGM: 'In Review',
    remarksByCorporateHR: 'Awaiting',
    remarksByDAndAR: 'In Process',
    remarksByVigilanceOfficer: 'Under Review',
    remarksByDrCVO: 'Pending',
  },
];

const getBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'Verified':
    case 'Approved':
    case 'Reviewed':
    case 'Checked':
    case 'Cleared':
    case 'Final Approval':
      return 'default';
    default:
      return 'secondary';
  }
};

const GmREquesteReceived = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredData = dummyData.filter((request) =>
    Object.values(request).some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewRequest = (request: Request) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-6 max">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Request Received</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search requests..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full overflow-x-auto rounded-md border">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-white">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Employee Code
                  </div>
                </TableHead>
                <TableHead className="text-white">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Designation
                  </div>
                </TableHead>
                <TableHead className="text-white">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </div>
                </TableHead>
                <TableHead className="text-white">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Purpose
                  </div>
                </TableHead>
                <TableHead className="text-white">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Description
                  </div>
                </TableHead>
                <TableHead className="text-white whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Remarks By Unit HR
                  </div>
                </TableHead>
                <TableHead className="text-white whitespace-nowrap">
                  <div className="flex items-center gap-2 ">
                    <UserCog className="h-4 w-4" />
                    Remarks By CGM
                  </div>
                </TableHead>
                <TableHead className="text-white whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Remarks By Corporate HR
                  </div>
                </TableHead>
                <TableHead className="text-white whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Remarks By D & AR
                  </div>
                </TableHead>
                <TableHead className="text-white whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Remarks By Vigilance Officer
                  </div>
                </TableHead>
                <TableHead className="text-white whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Remarks By Dr. CVO
                  </div>
                </TableHead>
                <TableHead className="text-white">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Action
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((request, index) => (
                <TableRow key={index}>
                  <TableCell>{request.employeeCode}</TableCell>
                  <TableCell>{request.designation}</TableCell>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.purpose}</TableCell>
                  <TableCell>{request.description}</TableCell>
                  <TableCell>{request.remarksByUnitHR}</TableCell>
                  <TableCell>{request.remarksByCGM}</TableCell>
                  <TableCell>{request.remarksByCorporateHR}</TableCell>
                  <TableCell>{request.remarksByDAndAR}</TableCell>
                  <TableCell>{request.remarksByVigilanceOfficer}</TableCell>
                  <TableCell>{request.remarksByDrCVO}</TableCell>
                  <TableCell>
                    <Eye
                      className="h-4 w-4 cursor-pointer hover:text-blue-500"
                      onClick={() => handleViewRequest(request)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div>
                    <h3 className="font-medium text-gray-500 mb-2">Employee Information</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Employee Code:</span>
                        <span className="font-medium">{selectedRequest.employeeCode}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedRequest.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Designation:</span>
                        <span className="font-medium">{selectedRequest.designation}</span>
                      </div>   
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500 mb-2">Request Information</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Purpose:</span>
                        <span className="font-medium">{selectedRequest.purpose}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Description:</span>
                        <span className="font-medium">{selectedRequest.description}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-medium text-gray-500">Remarks & Approvals</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-600 mb-1">Unit HR Remarks</p>
                      <Badge variant={getBadgeVariant(selectedRequest.remarksByUnitHR)}>
                        {selectedRequest.remarksByUnitHR}
                      </Badge>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-600 mb-1">CGM Remarks</p>
                      <Badge variant={getBadgeVariant(selectedRequest.remarksByCGM)}>
                        {selectedRequest.remarksByCGM}
                      </Badge>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-600 mb-1">Corporate HR Remarks</p>
                      <Badge variant={getBadgeVariant(selectedRequest.remarksByCorporateHR)}>
                        {selectedRequest.remarksByCorporateHR}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-600 mb-1">D & AR Remarks</p>
                      <Badge variant={getBadgeVariant(selectedRequest.remarksByDAndAR)}>
                        {selectedRequest.remarksByDAndAR}
                      </Badge>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-600 mb-1">Vigilance Officer Remarks</p>
                      <Badge variant={getBadgeVariant(selectedRequest.remarksByVigilanceOfficer)}>
                        {selectedRequest.remarksByVigilanceOfficer}
                      </Badge>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-600 mb-1">Dr. CVO Remarks</p>
                      <Badge variant={getBadgeVariant(selectedRequest.remarksByDrCVO)}>
                        {selectedRequest.remarksByDrCVO}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="flex items-center gap-2"
              size="sm"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
            <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2" size="sm">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              onClick={() => {
                // Handle accept logic here
                setIsDialogOpen(false);
              }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Check className="h-4 w-4" />
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GmREquesteReceived;
