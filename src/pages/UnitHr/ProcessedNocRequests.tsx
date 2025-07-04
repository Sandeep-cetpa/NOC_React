import React, { useEffect, useState } from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axiosInstance from '@/services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { RequestDetailsDialog } from '@/components/dialogs/ViewDetailsDialog';
import Loader from '@/components/ui/loader';
import TableList from '@/components/ui/data-table';
import { format } from 'date-fns';
import { statusConfig } from '@/lib/helperFunction';
import { Badge } from '@/components/ui/badge';
import UnitHrNOCDetailDialog from '@/components/dialogs/UnitHrNOCDetailDialog';
const ProcessedNocRequests = () => {
  const userRoles = useSelector((state: RootState) => state.user.Roles);
  const [isLoading, setIsloading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [open, setOpen] = useState(false);
  const assiedUnits = userRoles?.find((ele) => ele.roleId === 3);
  const [selectedUnit, setSelectedUnit] = useState<string>(assiedUnits?.unitsAssigned?.[0]?.unitId?.toString() || '');
  const [allRequest, setAllRequest] = useState([]);
  const getAllRequests = async (unitId: string) => {
    try {
      setIsloading(true);
      const response = await axiosInstance.get(`/UnitHR/NOC/Report?UnitId=${unitId}`);
      if (response.data.success) {
        setAllRequest(response.data.data);
        setIsloading(false);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsloading(false);
    }
  };
  useEffect(() => {
    if (assiedUnits?.unitsAssigned?.length > 0) {
      const firstUnit = assiedUnits.unitsAssigned[0];
      const unitIdString = firstUnit.unitId.toString();
      setSelectedUnit(unitIdString);
      getAllRequests(unitIdString);
    }
  }, []);
  useEffect(() => {
    if (selectedUnit !== '') {
      getAllRequests(selectedUnit);
    }
  }, [selectedUnit]);
  const handleUnitSelection = (unitId: string) => {
    setSelectedUnit(unitId);
  };
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
            setOpen(true);
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
    <div className=" p-6">
      <div>
        <h1 className="font text-3xl mb-3">Processed Requests</h1>

        <div className="mt-3">
          <TableList
            data={allRequest?.sort((a, b) => {
              const dateA = a?.initiationDate ? new Date(a.initiationDate).getTime() : 0;
              const dateB = b?.initiationDate ? new Date(b.initiationDate).getTime() : 0;
              return dateB - dateA;
            })}
            columns={columns}
            rightElements={
              <>
                <div className="flex rounded-xl">
                  <div className="flex space-y-2">
                    <Select value={selectedUnit} onValueChange={handleUnitSelection}>
                      <SelectTrigger id="unit-select" className="w-[200px]">
                        <SelectValue placeholder="Choose a unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {assiedUnits?.unitsAssigned?.map((unit) => (
                          <SelectItem key={unit.unitId} value={unit.unitId.toString()}>
                            {unit?.unitName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" onClick={() => getAllRequests(selectedUnit)} className=" space-x-2 ml-3">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </>
            }
            showFilter={false}
          />
        </div>
        <UnitHrNOCDetailDialog
          setUnitHrData={{}}
          AccecptButtonName={'Forward to CGM'}
          rejectButtonName={'Reject'}
          nocData={selectedRequest}
          isOpen={open}
          onOpenChange={setOpen}
          isEditable={false}
        />
        {/* <RequestDetailsDialog open={open} setOpen={setOpen} request={selectedRequest} /> */}
      </div>
    </div>
  );
};

export default ProcessedNocRequests;
