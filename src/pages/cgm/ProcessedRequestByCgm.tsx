import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Search,
  FileText,
  ExternalLink,
  GraduationCap,
  Briefcase,
  X,
  Download,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface NocRequest {
  employeeCode: string;
  designation: string;
  name: string;
  purpose: string;
  status: 'Approved' | 'Rejected' | 'Pending' | 'Under Review';
  icon: React.ReactNode;
  details: {
    proofOfFund: string;
    country: string;
    purpose: string;
    from: string;
    to: string;
    leaveType: string;
    passportNumber: string;
    validity: string;
    estimatedExpenditure: string;
    sourceOfFund: string;
    foreignVisit: string;
    basicPay: string;
    iprDate: string;
    iprFile: string;
    unitHrRemarks: string;
    pertainingToPresentUnit: string;
    pertainingToPastUnit: string;
  };
}

const ProcessedRequestByCgm = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<NocRequest | null>(null);

  // Sample data with status added
  const requests: NocRequest[] = [
    {
      employeeCode: '101757',
      designation: 'JR EXEC',
      name: 'BASABA DALAI',
      purpose: 'Tourism',
      status: 'Approved',
      icon: <Briefcase className="h-4 w-4" />,
      details: {
        proofOfFund: '1145_20241015_file2.pdf',
        country: 'Japan',
        purpose: 'Tourism',
        from: '2024-10-31',
        to: '2024-11-08',
        leaveType: 'LAP',
        passportNumber: '123456789',
        validity: '2024-11-30',
        estimatedExpenditure: '50000',
        sourceOfFund: 'Self',
        foreignVisit: 'test',
        basicPay: '5000000',
        iprDate: '10-Oct-2024',
        iprFile: '1145_20241015_file2.pdf',
        unitHrRemarks: 'bb',
        pertainingToPresentUnit: 'bb',
        pertainingToPastUnit: 'bb',
      },
    },
    {
      employeeCode: '101758',
      designation: 'SR EXEC',
      name: 'RAJESH KUMAR',
      purpose: 'Business',
      status: 'Rejected',
      icon: <Briefcase className="h-4 w-4" />,
      details: {
        proofOfFund: '1146_20241015_file2.pdf',
        country: 'Singapore',
        purpose: 'Business',
        from: '2024-11-01',
        to: '2024-11-10',
        leaveType: 'CL',
        passportNumber: '987654321',
        validity: '2024-12-30',
        estimatedExpenditure: '75000',
        sourceOfFund: 'Company',
        foreignVisit: 'Conference',
        basicPay: '6000000',
        iprDate: '12-Oct-2024',
        iprFile: '1146_20241015_file2.pdf',
        unitHrRemarks: 'Approved by unit',
        pertainingToPresentUnit: 'Yes',
        pertainingToPastUnit: 'No',
      },
    },
    {
      employeeCode: '101759',
      designation: 'MANAGER',
      name: 'PRIYA SHARMA',
      purpose: 'Education',
      status: 'Under Review',
      icon: <GraduationCap className="h-4 w-4" />,
      details: {
        proofOfFund: '1147_20241015_file2.pdf',
        country: 'USA',
        purpose: 'Education',
        from: '2024-12-01',
        to: '2024-12-15',
        leaveType: 'Study Leave',
        passportNumber: '456789123',
        validity: '2025-01-30',
        estimatedExpenditure: '150000',
        sourceOfFund: 'Self',
        foreignVisit: 'Training Program',
        basicPay: '8000000',
        iprDate: '15-Oct-2024',
        iprFile: '1147_20241015_file2.pdf',
        unitHrRemarks: 'Pending review',
        pertainingToPresentUnit: 'Yes',
        pertainingToPastUnit: 'Yes',
      },
    },
    {
      employeeCode: '101760',
      designation: 'ASST MANAGER',
      name: 'AMIT SINGH',
      purpose: 'Tourism',
      status: 'Pending',
      icon: <Briefcase className="h-4 w-4" />,
      details: {
        proofOfFund: '1148_20241015_file2.pdf',
        country: 'Thailand',
        purpose: 'Tourism',
        from: '2024-11-15',
        to: '2024-11-25',
        leaveType: 'LAP',
        passportNumber: '789123456',
        validity: '2025-02-28',
        estimatedExpenditure: '40000',
        sourceOfFund: 'Self',
        foreignVisit: 'Vacation',
        basicPay: '4500000',
        iprDate: '18-Oct-2024',
        iprFile: '1148_20241015_file2.pdf',
        unitHrRemarks: 'Under process',
        pertainingToPresentUnit: 'Yes',
        pertainingToPastUnit: 'No',
      },
    },
    {
      employeeCode: '101761',
      designation: 'DGM',
      name: 'SUNITA VERMA',
      purpose: 'Business',
      status: 'Approved',
      icon: <Briefcase className="h-4 w-4" />,
      details: {
        proofOfFund: '1149_20241015_file2.pdf',
        country: 'Germany',
        purpose: 'Business',
        from: '2024-12-05',
        to: '2024-12-20',
        leaveType: 'Official',
        passportNumber: '321654987',
        validity: '2025-03-15',
        estimatedExpenditure: '100000',
        sourceOfFund: 'Company',
        foreignVisit: 'Business Meeting',
        basicPay: '12000000',
        iprDate: '20-Oct-2024',
        iprFile: '1149_20241015_file2.pdf',
        unitHrRemarks: 'Approved',
        pertainingToPresentUnit: 'Yes',
        pertainingToPastUnit: 'Yes',
      },
    },
  ];

  const handleRowClick = (request: NocRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleFileClick = (fileName: string) => {
    // Implement file download logic here
    console.log('Downloading file:', fileName);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'Under Review':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            Under Review
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Processed Requests</CardTitle>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Select defaultValue="10">
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Show" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 entries</SelectItem>
                  <SelectItem value="25">25 entries</SelectItem>
                  <SelectItem value="50">50 entries</SelectItem>
                  <SelectItem value="100">100 entries</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">entries</span>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Search..." className="pl-8 w-[250px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-600">
                  <TableHead className="text-white">Employee Code</TableHead>
                  <TableHead className="text-white">Designation</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Purpose</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request, index) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(request)}
                  >
                    <TableCell>{request.employeeCode}</TableCell>
                    <TableCell>{request.designation}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {request.icon}
                        {request.purpose}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing 1 to {requests.length} of {requests.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog for showing request details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Request Details
              <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Employee Code</Label>
                    <p>{selectedRequest.employeeCode}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Name</Label>
                    <p>{selectedRequest.name}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Designation</Label>
                    <p>{selectedRequest.designation}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                  <div>
                    <Label className="font-semibold">Country</Label>
                    <p>{selectedRequest.details.country}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Purpose</Label>
                    <p>{selectedRequest.details.purpose}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">From Date</Label>
                    <p>{selectedRequest.details.from}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">To Date</Label>
                    <p>{selectedRequest.details.to}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Leave Type</Label>
                    <p>{selectedRequest.details.leaveType}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Passport Number</Label>
                    <p>{selectedRequest.details.passportNumber}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Estimated Expenditure</Label>
                    <p>₹{selectedRequest.details.estimatedExpenditure}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Source of Fund</Label>
                    <p>{selectedRequest.details.sourceOfFund}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Label className="font-semibold">Files</Label>
                  <div className="mt-2 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileClick(selectedRequest.details.proofOfFund)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Proof of Fund
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileClick(selectedRequest.details.iprFile)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      IPR File
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessedRequestByCgm;
