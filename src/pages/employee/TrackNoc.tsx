import React, { useEffect, useState } from 'react';
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
  FileQuestion,
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
import axiosInstance from '@/services/axiosInstance';
import UserNOCDetailsDialog from '@/components/dialogs/UserNOCDetailDialog';
import Loader from '@/components/ui/loader';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { statusConfig } from '@/lib/helperFunction';

const TrackNoc = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const allStatus = useSelector((state: RootState) => state.allStatus.allStatus);
  const userDetails = useSelector((state: RootState) => state.user);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedNoc, setSelectedNoc] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nocData, setNocData] = useState([]);
  const itemsPerPage = 10;
  const getAllUserNoc = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/User/NOC?fkAutoId=${userId}`);

      if (response.data.success) {
        setNocData(response.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (userDetails.EmpID) {
      getAllUserNoc(userDetails.EmpID);
    }
  }, []);

  // Filter and search logic
  const filteredData = nocData.filter((item) => {
    const matchesSearch =
      item?.currentStatus?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item?.refId)?.includes(searchQuery.toLowerCase()) ||
      item.purposeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.currentStatus === statusFilter;
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
    if (!status) {
      return;
    }
    const config = statusConfig[status];
    const IconComponent = config?.icon || Clock;
    return (
      <Badge className={`${config?.color} hover:bg-none text-center items-center space-x-1 px-2 py-1`}>
        <IconComponent className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="">
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
              <Button onClick={() => getAllUserNoc(438)} variant="outline" className="flex items-center space-x-2">
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

                <Select
                  value={statusFilter}
                  onValueChange={(e) => {
                    setStatusFilter(e);
                  }}
                >
                  <SelectTrigger className="w-56">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter by Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {allStatus?.map((ele) => (
                      <SelectItem key={ele?.statusId} value={ele?.statusName}>
                        {ele?.statusName}
                      </SelectItem>
                    ))}
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
                    <TableHead className="text-white">
                      <span>Creation Date</span>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('refId')}
                        className="flex items-center space-x-1 p-0 h-auto font-semibold text-white"
                      >
                        <span>Reference ID</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className=" text-white">Purpose</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('currentStatus')}
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
                    <TableRow key={noc.id} className="hover:bg-gray-50 py-2 transition-colors">
                      <TableCell className="font-medium py-2">{startIndex + index + 1}</TableCell>
                      <TableCell className="py-2">
                        {noc.initiationDate ? (
                          <div className="text-sm text-600">{format(new Date(noc.initiationDate), 'dd MMM yyyy')}</div>
                        ) : (
                          '--'
                        )}
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="font-medium text-blue-600">NOC-{noc?.refId}</div>
                      </TableCell>

                      <TableCell className="max-w-xs py-2">
                        <div className="font-medium">{noc.purposeName}</div>
                      </TableCell>
                      <TableCell className="py-2">{getStatusBadge(noc?.currentStatus)}</TableCell>
                      <TableCell className="text-right py-2">
                        <Button
                          onClick={() => {
                            setSelectedNoc(noc);
                            setIsOpen(true);
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
            {paginatedData.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <FileQuestion className="w-6 h-6 text-red-500" />
                </div>

                <h3 className="font-semibold text-gray-800 mb-2">No Results Found</h3>
                <p className="text-sm text-gray-600 mb-4">No NOC application found !!</p>
              </div>
            )}
            <UserNOCDetailsDialog nocData={selectedNoc} isOpen={isOpen} onOpenChange={setIsOpen} />
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
