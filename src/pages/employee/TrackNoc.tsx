import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Calendar,
  User,
  Building,
  Car,
  Home,
  Briefcase,
  Shield,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

const TrackNoc = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dummy data for NOC tracking
  const nocData = [
    {
      id: 1,
      referenceId: 'NOC-2024-001',
      purpose: 'Building Construction',
      description: 'Construction of residential building in Sector 45, Gurgaon',
      status: 'approved',
      submittedDate: '2024-01-15',
      lastUpdated: '2024-02-10',
      applicant: 'Rahul Sharma',
      department: 'Urban Development',
    },
    {
      id: 2,
      referenceId: 'NOC-2024-002',
      purpose: 'Vehicle Registration',
      description: 'NOC for vehicle transfer from Delhi to Mumbai',
      status: 'pending',
      submittedDate: '2024-02-01',
      lastUpdated: '2024-02-05',
      applicant: 'Priya Singh',
      department: 'Transport Authority',
    },
    {
      id: 3,
      referenceId: 'NOC-2024-003',
      purpose: 'Business License',
      description: 'NOC for opening restaurant in commercial complex',
      status: 'under_review',
      submittedDate: '2024-01-28',
      lastUpdated: '2024-02-08',
      applicant: 'Amit Kumar',
      department: 'Municipal Corporation',
    },
    {
      id: 4,
      referenceId: 'NOC-2024-004',
      purpose: 'Educational Institution',
      description: 'NOC for establishing new school in residential area',
      status: 'rejected',
      submittedDate: '2024-01-10',
      lastUpdated: '2024-01-25',
      applicant: 'Sunita Verma',
      department: 'Education Department',
    },
    {
      id: 5,
      referenceId: 'NOC-2024-005',
      purpose: 'Industrial Setup',
      description: 'NOC for manufacturing unit setup in industrial area',
      status: 'approved',
      submittedDate: '2024-01-20',
      lastUpdated: '2024-02-12',
      applicant: 'Rajesh Industries',
      department: 'Industrial Development',
    },
    {
      id: 6,
      referenceId: 'NOC-2024-006',
      purpose: 'Event Organization',
      description: 'NOC for organizing cultural event in public park',
      status: 'pending',
      submittedDate: '2024-02-03',
      lastUpdated: '2024-02-06',
      applicant: 'Cultural Society',
      department: 'Parks & Recreation',
    },
    {
      id: 7,
      referenceId: 'NOC-2024-007',
      purpose: 'Medical Facility',
      description: 'NOC for opening diagnostic center',
      status: 'under_review',
      submittedDate: '2024-01-25',
      lastUpdated: '2024-02-09',
      applicant: 'Dr. Meera Patel',
      department: 'Health Department',
    },
    {
      id: 8,
      referenceId: 'NOC-2024-008',
      purpose: 'Demolition Work',
      description: 'NOC for demolishing old residential structure',
      status: 'approved',
      submittedDate: '2024-01-18',
      lastUpdated: '2024-02-01',
      applicant: 'Builders Group',
      department: 'Urban Development',
    },
    {
      id: 9,
      referenceId: 'NOC-2024-009',
      purpose: 'Advertising Board',
      description: 'NOC for installing billboard on highway',
      status: 'rejected',
      submittedDate: '2024-01-30',
      lastUpdated: '2024-02-11',
      applicant: 'AdVision Media',
      department: 'Municipal Corporation',
    },
    {
      id: 10,
      referenceId: 'NOC-2024-010',
      purpose: 'Water Connection',
      description: 'NOC for new water connection in residential area',
      status: 'pending',
      submittedDate: '2024-02-02',
      lastUpdated: '2024-02-07',
      applicant: 'Ankit Gupta',
      department: 'Water Authority',
    },
    {
      id: 11,
      referenceId: 'NOC-2024-011',
      purpose: 'Road Construction',
      description: 'NOC for constructing access road to residential complex',
      status: 'under_review',
      submittedDate: '2024-01-22',
      lastUpdated: '2024-02-04',
      applicant: 'Infrastructure Ltd',
      department: 'Public Works',
    },
    {
      id: 12,
      referenceId: 'NOC-2024-012',
      purpose: 'Telecom Tower',
      description: 'NOC for installing mobile tower in residential area',
      status: 'approved',
      submittedDate: '2024-01-12',
      lastUpdated: '2024-01-28',
      applicant: 'Airtel Networks',
      department: 'Telecom Authority',
    },
  ];

  // Status configuration
  const statusConfig = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
    },
    under_review: {
      label: 'Under Review',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: AlertCircle,
    },
    approved: {
      label: 'Approved',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
    },
    rejected: {
      label: 'Rejected',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle,
    },
  };

  // Purpose icons mapping
  const purposeIcons = {
    'Building Construction': Building,
    'Vehicle Registration': Car,
    'Business License': Briefcase,
    'Educational Institution': FileText,
    'Industrial Setup': Shield,
    'Event Organization': Calendar,
    'Medical Facility': User,
    'Demolition Work': Building,
    'Advertising Board': FileText,
    'Water Connection': Home,
    'Road Construction': Building,
    'Telecom Tower': Shield,
  };

  // Filter and search logic
  const filteredData = nocData.filter((item) => {
    const matchesSearch =
      item.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.applicant.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

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

  const getStatusBadge = (status) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;
    return (
      <Badge className={`${config.color} flex max-w-[100px] flex justify-center text-center items-center space-x-1 px-2 py-1`}>
        <IconComponent className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const getPurposeIcon = (purpose) => {
    const IconComponent = purposeIcons[purpose] || FileText;
    return <IconComponent className="h-4 w-4 text-blue-600" />;
  };

  const NOCDetailDialog = ({ noc }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hover:bg-blue-50">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>NOC Details - {noc.referenceId}</span>
          </DialogTitle>
          <DialogDescription>Complete information about the NOC application</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Reference ID</Label>
              <p className="text-lg font-semibold">{noc.referenceId}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Status</Label>
              <div className="mt-1">{getStatusBadge(noc.status)}</div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Purpose</Label>
            <div className="flex items-center space-x-2 mt-1">
              {getPurposeIcon(noc.purpose)}
              <p className="text-lg">{noc.purpose}</p>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Description</Label>
            <p className="text-gray-800 mt-1">{noc.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Applicant</Label>
              <p className="text-gray-800">{noc.applicant}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Department</Label>
              <p className="text-gray-800">{noc.department}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Submitted Date</Label>
              <p className="text-gray-800">{new Date(noc.submittedDate).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
              <p className="text-gray-800">{new Date(noc.lastUpdated).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <span>Track NOC Applications</span>
              </h1>
              <p className="text-gray-600 mt-2 text-sm">
                Monitor and track the status of No Objection Certificate applications
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by Reference ID, Purpose, or Applicant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter by Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 px-3 py-1">
                  {filteredData.length} applications
                </Badge>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of{' '}
                    {filteredData.length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NOC Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>NOC Applications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-white">
                      <span>SN</span>
                    </TableHead>
                    <TableHead className='text-white'>
                      <span>Creation Date</span>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('referenceId')}
                        className="flex items-center space-x-1 p-0 h-auto font-semibold text-white"
                      >
                        <span>Reference ID</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>

                    <TableHead>
                      <span className="text-white">Employee</span>
                    </TableHead>

                    <TableHead className=" text-white">Purpose</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('status')}
                        className="flex items-center space-x-1 p-0 h-auto font-semibold  text-white"
                      >
                        <span>Present Status</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right  text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((noc, index) => (
                    <TableRow key={noc.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                      <TableCell>
                        <div className="text-sm text-600">{format(new Date(noc.submittedDate), 'dd MMM yyyy')}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-blue-600">{noc.referenceId}</div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getPurposeIcon(noc.purpose)}
                          <div>
                            <div className="text-sm text-gray-500">{noc.applicant}</div>
                            <div className="text-sm text-gray-500 mt-1">{noc.department}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="font-medium">{noc.purpose}</div>
                        <div className="truncate" title={noc.description}>
                          {noc.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(noc.status)}
                        <div className="text-xs text-gray-500 mt-1">
                          Updated: {format(new Date(noc.lastUpdated), 'dd MMM yyyy')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <NOCDetailDialog noc={noc} />
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

export default TrackNoc;
