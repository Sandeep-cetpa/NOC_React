import React, { useEffect, useState } from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import axiosInstance from '@/services/axiosInstance';
import { Badge } from '@/components/ui/badge';
import { statusConfig } from '@/lib/helperFunction';
import Loader from '@/components/ui/loader';
import TableList from '@/components/ui/data-table';

const RequestUnderProcess = () => {
  const [activetab, setActiveTab] = useState('corporate');
  const [request, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(1);
  const getRequestByUnitId = async (unitId, isUnit) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/CorporateHR/NOC/Report?UnitId=${'0'}&status=${'Parked'}`);
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
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
  useEffect(() => {
    getRequestByUnitId(selectedUnit, activetab);
  }, [activetab]);
  const columns = [
    {
      accessorKey: 'refId',
      header: 'Reference ID',
      cell: ({ row }) => <div>{`${row.original.refId ? 'NOC-' + row.original.refId : 'NA'}`}</div>,
    },
    {
      accessorKey: 'employeeCode',
      header: 'Employee Code',
      cell: ({ row }) => <div>{row?.original?.employeeCode}</div>,
    },
    {
      accessorKey: 'username',
      header: 'Employee Name',
      cell: ({ row }) => (
        <div className=" w-[140px] truncate" title={row.original.username}>
          {row.original.username}
        </div>
      ),
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
      accessorKey: 'purposeName',
      header: 'Purpose',
      cell: ({ row }) => <div>{row.original.purposeName}</div>,
    },

    {
      accessorKey: 'post',
      header: 'Designation',
      cell: ({ row }) => <div>{row?.original?.post ? row?.original?.post : 'NA'}</div>,
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => <div>{row.original.department}</div>,
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
            setSelectedRequest(row.original);
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
      <div>
        <h1 className="text-3xl my-4">Request Under Process</h1>
        <div className="overflow-x-auto">
          <TableList
            data={request.sort((a, b) => {
              const dateA = a?.initiationDate ? new Date(a.initiationDate).getTime() : 0;
              const dateB = b?.initiationDate ? new Date(b.initiationDate).getTime() : 0;
              return dateB - dateA;
            })}
            columns={columns}
            rightElements={
              <Button
                variant="outline"
                onClick={() => getRequestByUnitId(selectedUnit, activetab)}
                className=" space-x-2 ml-3"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            }
            showFilter={false}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestUnderProcess;
