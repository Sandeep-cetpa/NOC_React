import React, { useState } from 'react';
import { Search, RefreshCw, ArrowUpDown, ChevronLeft, ChevronRight , ArrowRight, Send, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const RequestReceived = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const nocData = [
    {
      id: 1,
      employeeId: '100649',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Urban Development',
      date: '2025-06-13',
    },
    {
      id: 2,
      employeeId: '100650',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Transport Authority',
      date: '2025-06-13',
    },
    {
      id: 3,
      employeeId: '100651',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Municipal Corporation',
      date: '2025-06-13',
    },
    {
      id: 4,
      employeeId: '100652',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Education Department',
      date: '2025-06-13',
    },
    {
      id: 5,
      employeeId: '100653',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Industrial Development',
      date: '2025-06-13',
    },
  ];

  const filteredData = nocData.filter((item) => {
    const matchesSearch =
      item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emp_purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emp_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all';

    return matchesSearch && matchesStatus;
  });

  // Sorting logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (sortConfig.direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
   const handleSubmit = () => {
    // Perform form submission or data processing logic here
    // console.log(remarks);
    setIsOpen(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Pending Requests </span>
            </CardTitle>
          </CardHeader>
          <div className="mb-2">
            <div className="px-6 py-2 ">
              <div className="flex flex-col   md:justify-between space-y-4 md:space-y-0 gap-4">
                <div className="flex flex-col md:flex-row space-x-4 flex-1 bg-gray-200 max-w-2xl  p-2 rounded-xl">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Department">Department</SelectItem>
                      <SelectItem value="Location">Location</SelectItem>
                      <SelectItem value="Purpose">Purpose</SelectItem>
                      <SelectItem value="Employee Code">Employee Code</SelectItem>
                      <SelectItem value="Employee Name">Employee Name</SelectItem>
                      <SelectItem value="Designation">Designation</SelectItem>
                      <SelectItem value="Date">Date</SelectItem>
                      <SelectItem value="Time">Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Location">Location</SelectItem>
                      <SelectItem value="Purpose">Purpose</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Purpose">Passport</SelectItem>
                      <SelectItem value="Purpose">Visa</SelectItem>
                      <SelectItem value="Purpose">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex  justify-between space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>
                      Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of{' '}
                      {filteredData.length}
                    </span>
                  </div>
                  <div className="relative  max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search "
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* <TableHead className="w-16">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('id')}
                        className="flex items-center space-x-1 p-0 h-auto font-semibold  text-white"
                      >
                        <span>SR.No</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead> */}
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('employeeId')}
                        className="flex items-center space-x-1 p-0 h-auto font-semibold text-white"
                      >
                        <span>Employee Code</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className=" text-white">Date</TableHead>
                    <TableHead className=" text-white">Designation</TableHead>
                    <TableHead className=" text-white">Name</TableHead>

                    {/* <TableHead className="text-white">Location</TableHead> */}
                    <TableHead className="text-white">Purpose</TableHead>
                    <TableHead className=" text-white">Department</TableHead>
                     <TableHead className="text-white">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((noc, index) => (
                    <TableRow key={noc.id} className="hover:bg-gray-50 transition-colors">
                      {/* <TableCell className="font-medium">{startIndex + index + 1}</TableCell> */}
                      <TableCell>
                        <div className="font-medium ">{noc.employeeId}</div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 mt-1">
                        <div className="truncate w-[100px]" title={noc.designation}>
                          <p>{format(new Date(noc.date), 'dd MMM yyyy')}</p>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm text-gray-500 mt-1">
                        <div className="truncate" title={noc.designation}>
                          {noc.designation}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div>
                            <div className="text-sm text-gray-500">{noc.emp_name}</div>
                          </div>
                        </div>
                      </TableCell>

                      {/* <TableCell>
                        <div className="text-sm text-gray-500 mt-1">{noc.location}</div>
                      </TableCell> */}
                      <TableCell>
                        <div className="text-sm text-blue-500 mt-1">{noc.emp_purpose}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500 mt-1">{noc.department}</div>
                      </TableCell>
                       <TableCell>
                                                  <Button
                                                    onClick={() => {
                                                      setIsOpen(true);
                                                      setSelectedRequest(noc);
                                                    }}
                                                  >
                                                    <Eye />
                                                  </Button>
                                                </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      {selectedRequest && (
                        <DialogContent className="w-[90%] md:max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Remarks</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-6 py-6 pt-0 h-full max-h-[calc(100vh-20rem)] overflow-y-scroll">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <Label>Employee Id</Label>
                                <p className="text-sm text-muted-foreground">{selectedRequest.employeeId}</p>
                              </div>
                              <div>
                                <Label>Name</Label>
                                <p className="text-sm text-muted-foreground">{selectedRequest.emp_name}</p>
                              </div>
                              <div>
                                <Label>Designation</Label>
                                <p className="text-sm text-muted-foreground">{selectedRequest.designation}</p>
                              </div>
                              <div>
                                <Label>Location</Label>
                                <p className="text-sm text-muted-foreground">{selectedRequest.location}</p>
                              </div>
                              <div>
                                <Label>Purpose</Label>
                                <p className="text-sm text-muted-foreground">{selectedRequest.emp_purpose}</p>
                              </div>
                              <div>
                                <Label>Department</Label>
                                <p className="text-sm text-muted-foreground">{selectedRequest.department}</p>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                              Get Tctl
                            </Button>
                            <Button className="mt-2 md:mt-0 mb-2" variant="outline" onClick={() => setIsOpen(false)}>
                              <ArrowRight className="mr-2 h-4 w-4" />
                              Revert Vigilance User
                            </Button>
                            <Button onClick={handleSubmit}>
                              <Send className="mr-2 h-4 w-4" />
                              Send To Corporate HR
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      )}
                    </Dialog>
      </div>
    </div>
  );
};

export default RequestReceived;
