import React, { useState } from 'react';
import {
  Search,
  RefreshCw,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const RejectedRequests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  
  const nocData = [
    {
      id: 1,
      referenceId: '001044',
      positionGrade:'NS',
      currentStatus:'Rejected By Corporate HR',
      employeeId: '100649',
      designation: 'Junior',
      location: 'Mumbai(N)',
      emp_purpose: 'External Employment',
      emp_name: 'Kamlesh Kumar',
      department: 'Electrical',
    },
    {
      id: 2,
      referenceId: '001055',
      positionGrade:'E1',
      currentStatus:'Rejected By Corporate HR',
      employeeId: '100650',
      designation: 'Sr Exec',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Deependra Kumar Maurya',
      department: 'Transport Authority',
    },
    {
      id: 3,
      referenceId: '001056',
      positionGrade:'NS',
      currentStatus:'Rejected By Corporate HR',
      employeeId: '100651',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Municipal Corporation',
    },
    {
      id: 4,
      referenceId: '001063',
      positionGrade:'NS',
      currentStatus:'Rejected By Corporate HR',
      employeeId: '100652',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Education Department',
    },
    {
      id: 5,
      referenceId: '001072',
      positionGrade:'NS',
      currentStatus:'Rejected By Corporate HR',
      employeeId: '100653',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Industrial Development',
    },
    {
      id: 6,
      referenceId: '001085',
      positionGrade:'NS',
      currentStatus:'Rejected By Corporate HR',
      employeeId: '100654',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Parks & Recreation',
    },
    {
      id: 7,
      referenceId: '001132',
      positionGrade:'NS',
      currentStatus:'Rejected By Corporate HR',
      employeeId: '100655',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Health Department',
    },
    {
      id: 8,
      referenceId: '001136',
      positionGrade:'NS',
      currentStatus:'Rejected By Corporate HR',
      employeeId: '100656',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Urban Development',
    },
    {
      id: 9,
      referenceId: '001148',
      positionGrade:'NS',
      currentStatus:'Rejected By Corporate HR',
      employeeId: '100657',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Municipal Corporation',
    },
    {
      id: 10,
      referenceId: '001151',
      positionGrade:'NS',
      currentStatus:'Rejected By Corporate HR',
      employeeId: '100658',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Water Authority',
    },
    {
      id: 11,
      referenceId: '001152',
      positionGrade:'NS',
      currentStatus:'Rejected By Corporate HR',
      employeeId: '100659',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Public Works',
    },
    {
      id: 12,
      referenceId: '001153',
      positionGrade:'NS',
      currentStatus:'Rejected By Corporate HR',
      employeeId: '100660',
      designation: 'GM',
      location: 'Office',
      emp_purpose: 'passport',
      emp_name: 'Amit Kumar',
      department: 'Telecom Authority',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Rejected Requests </span>
            </CardTitle>
          </CardHeader>
          <div className="mb-2">
            <div className="px-6 py-2 ">
              <div className="flex flex-col   md:justify-between space-y-4 md:space-y-0 gap-4">
              <div className="flex flex-col md:flex-row space-x-4 flex-1 bg-gray-200  p-2 rounded-xl">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                      <SelectItem value="noida">Noida</SelectItem>
                      <SelectItem value="gurugram">Gurugram</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                      <SelectItem value="kolkata">Kolkata</SelectItem>
                      <SelectItem value="bengaluru">Bengaluru</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                      <SelectItem value="jaipur">Jaipur</SelectItem>

                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontdesk">Front Desk</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Position Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NS">NS</SelectItem>
                      <SelectItem value="E1">E1</SelectItem>
                      <SelectItem value="E2">E2</SelectItem>
                      <SelectItem value="E3">E3</SelectItem>
                      <SelectItem value="E4">E4</SelectItem>
                      <SelectItem value="E5">E5</SelectItem>
                      <SelectItem value="E6">E6</SelectItem>
                      <SelectItem value="E7">E7</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectValue placeholder="Select Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GM">GM</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
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
                        onClick={() => handleSort('referenceId')}
                        className="flex items-center space-x-1 p-0 h-auto font-semibold text-white"
                      >
                        <span>Reference Id</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
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
                    <TableHead className=" text-white">Name</TableHead>
                    <TableHead className=" text-white">Designation</TableHead>
                    <TableHead className=" text-white">Position Grade</TableHead>
                    <TableHead className=" text-white">Department</TableHead>
                    <TableHead className="text-white">Location</TableHead>
                     <TableHead className="text-white">Current Status</TableHead>
                    <TableHead className="text-white">Purpose</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((noc, index) => (
                    <TableRow key={noc.id} className="hover:bg-gray-50 transition-colors">
                      {/* <TableCell className="font-medium">{startIndex + index + 1}</TableCell> */}
                       <TableCell>
                        <div className="font-medium ">{noc.referenceId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium ">{noc.employeeId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div>
                            <div className="text-sm text-gray-500">{noc.emp_name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 mt-1">
                        <div className="truncate" title={noc.designation}>
                          {noc.designation}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500 mt-1">{noc.positionGrade}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500 mt-1">{noc.department}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500 mt-1">{noc.location}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500 mt-1">{noc.currentStatus}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-blue-500 mt-1">{noc.emp_purpose}</div>
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
      </div>
    </div>
  );
};

export default RejectedRequests;
