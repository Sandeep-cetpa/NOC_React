import React, { useEffect, useState } from 'react';
import { Filter, Eye, FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import axiosInstance from '@/services/axiosInstance';
import UserNOCDetailsDialog from '@/components/dialogs/UserNOCDetailDialog';
import Loader from '@/components/ui/loader';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { statusConfig } from '@/lib/helperFunction';
import TableList from '@/components/ui/data-table';

const TrackNoc = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const allStatus = useSelector((state: RootState) => state.allStatus.allStatus);
  const userDetails = useSelector((state: RootState) => state.user);
  const [selectedNoc, setSelectedNoc] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nocData, setNocData] = useState([]);
  const masterData = useSelector((state:RootState)=>state.masterData.data)
  console.log(masterData,"masterData")
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
    if (userDetails?.EmpID) {
      getAllUserNoc(userDetails.EmpID);
    }
  }, []);

  // Filter and search logic
  const filteredData = nocData.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.currentStatus === statusFilter;
    return matchesStatus;
  });
  const getStatusBadge = (status) => {
    if (!status) {
      return;
    }
    const config = statusConfig(status);
    const IconComponent = config?.icon;
    return (
      <Badge className={`${config?.color} hover:bg-none text-center items-center space-x-1 px-2 py-1`}>
        <IconComponent className="h-3 w-3" />
        <span>{config?.label}</span>
      </Badge>
    );
  };
  const columns = [
    {
      accessorKey: 'purposeName',
      header: 'Purpose',
      cell: ({ row }) => <div>{row.original.purposeName}</div>,
    },
    {
      accessorKey: 'refId',
      header: 'Reference ID',
      cell: ({ row }) => <div>{`${row.original.refId ? 'NOC-' + row.original.refId : 'NA'}`}</div>,
    },
    {
      accessorKey: 'initiationDate',
      header: 'Date',
      cell: ({ row }) => (
        <div className="flex items-center w-[90px]">
          {row.original.initiationDate ? format(new Date(row.original.initiationDate), 'dd MMM yyyy') : '-'}
        </div>
      ),
    },

    {
      accessorKey: 'currentStatus',
      header: 'Status',
      cell: ({ row }) => <div>{row.original.currentStatus && getStatusBadge(row.original.currentStatus)}</div>,
    },
    {
      accessorKey: 'Action',
      header: 'Action',
      cell: ({ row }) => (
        <Button
          onClick={() => {
            setSelectedNoc(row.original);
            setIsOpen(true);
          }}
        >
          <Eye />
        </Button>
      ),
    },
  ];
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="p-6">
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
          </div>
        </div>
        <TableList
          data={filteredData}
          columns={columns}
          rightElements={
            <>
              <div className="flex rounded-xl">
                <div className="flex space-y-2">
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
                      {allStatus?.map((ele, index) => (
                        <SelectItem key={index} value={ele?.statusName}>
                          {ele?.statusName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" onClick={() => getAllUserNoc(userDetails.EmpID)} className=" space-x-2 ml-3">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </>
          }
          showFilter={false}
        />
      </div>
      <UserNOCDetailsDialog isOpen={isOpen} onOpenChange={() => setIsOpen(false)} nocData={selectedNoc} />
    </div>
  );
};

export default TrackNoc;
