import { Building, Calendar, CheckCircle, FileText, User, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

// Request Details Dialog Component
export const RequestDetailsDialog = ({ request, setOpen, open }) => {
  if (!request) {
    return null;
  }
  const formatDate = (dateString) => {
    if (!dateString) return 'NA';
    try {
      const date = new Date(dateString);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
      return dateString;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variant =
      status?.toLowerCase() === 'approved'
        ? 'default'
        : status?.toLowerCase() === 'rejected'
        ? 'destructive'
        : 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Request Details - {request.username}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Employee Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Employee Code:</span>
                  <span>{request.employeeCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{request.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Post:</span>
                  <span>{request.post || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Department:</span>
                  <span>{request.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Unit:</span>
                  <span>{request.unitName}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Request Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Purpose:</span>
                  <span>{request.purposeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.currentStatus)}
                    {getStatusBadge(request.currentStatus)}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Initiation Date:</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(request.initiationDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Reference ID:</span>
                  <span>{request.refId}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Details */}
          {request.inputs && request.inputs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Application Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {request.inputs.map((input, index) => (
                    <div key={index} className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">
                        {input.fieldName.replace(/_/g, ' ').replace(/\*/g, '')}:
                      </span>
                      <div className="p-2 bg-gray-50 rounded border">
                        {input.fieldType === 'File' ? (
                          <span className="text-blue-600 underline cursor-pointer">{input.value}</span>
                        ) : (
                          <span>{input.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Officer Remarks */}
          {request.officerRemarksR && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Officer Remarks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {request.officerRemarksR.unitHrReamarks && (
                  <div>
                    <span className="font-medium text-sm">Unit HR Remarks:</span>
                    <p className="mt-1 p-3 bg-blue-50 rounded border text-sm">
                      {request.officerRemarksR.unitHrReamarks}
                    </p>
                  </div>
                )}
                {request.rejectedRemarks && (
                  <div>
                    <span className="font-medium text-sm text-red-600">Rejection Remarks:</span>
                    <p className="mt-1 p-3 bg-red-50 rounded border text-sm text-red-700">{request.rejectedRemarks}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
