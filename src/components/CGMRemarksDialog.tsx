import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, 
  Download, 
  FileText, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Plane, 
  User, 
  Building2,
  MessageSquare,
  ArrowRight,
  RotateCcw,
  Send,
  Clock,
  Shield,
  Briefcase
} from 'lucide-react';

const CGMRemarksDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  
  // Mock data for demonstration
  const selectedRequest = {
    id: "CGM-2025-001247",
    status: "Under Review",
    submittedDate: "2025-06-01",
    applicant: "Dr. Rajesh Kumar",
    department: "Research & Development",
    details: {
      proofOfFund: "proof_of_fund_document.pdf",
      country: "United States, Canada",
      purpose: "International Conference on AI & Machine Learning - Speaker Invitation",
      from: "2025-07-15",
      to: "2025-07-25",
      leaveType: "Earned Leave",
      passportNumber: "A1234567",
      validity: "2030-12-31",
      estimatedExpenditure: "₹2,50,000",
      sourceOfFund: "Personal Savings + Conference Sponsorship",
      foreignVisit: "Yes - UK (2022), Germany (2023) for research collaboration",
      basicPay: "₹85,000",
      iprDate: "2025-06-01",
      iprFile: "ipr_clearance_certificate.pdf",
      unitHrRemarks: "Employee demonstrates exceptional performance with consistent research publications. No disciplinary concerns. Recommended for approval.",
      pertainingToPresentUnit: "No pending administrative actions. Current performance rating: Outstanding.",
      pertainingToPastUnit: "Clean service record across all previous assignments. No adverse remarks."
    }
  };

  const handleFileClick = (filename) => {
    console.log('Opening file:', filename);
  };

  const DataField = ({ icon: Icon, label, value, isFile = false, required = false, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-500" />
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {isFile ? (
        <div 
          className="text-sm text-blue-700 hover:text-blue-900 cursor-pointer flex items-center gap-2 p-2 rounded border hover:bg-blue-50 transition-colors"
          onClick={() => handleFileClick(value)}
        >
          <Download className="h-4 w-4" />
          <span className="font-medium">{value}</span>
        </div>
      ) : (
        <div className="text-sm text-slate-900 p-2 bg-slate-50 rounded border">
          {value}
        </div>
      )}
    </div>
  );

  const StatusBadge = ({ status }) => {
    const statusColors = {
      "Under Review": "bg-amber-100 text-amber-800 border-amber-200",
      "Approved": "bg-green-100 text-green-800 border-green-200",
      "Rejected": "bg-red-100 text-red-800 border-red-200"
    };
    
    return (
      <Badge className={`${statusColors[status]} border font-medium`}>
        <Clock className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0">
        {/* Header */}
        <DialogHeader className="px-8 py-6 border-b bg-slate-50">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-semibold text-slate-900">
                CGM Review Dashboard
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>Request ID: <span className="font-mono font-medium">{selectedRequest.id}</span></span>
                <Separator orientation="vertical" className="h-4" />
                <span>Submitted: {selectedRequest.submittedDate}</span>
                <Separator orientation="vertical" className="h-4" />
                <StatusBadge status={selectedRequest.status} />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-slate-600"
              onClick={() => setIsDialogOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1">
          <div className="p-8 space-y-8">
            {/* Applicant Information */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-slate-600" />
                  Applicant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DataField 
                  icon={User} 
                  label="Name" 
                  value={selectedRequest.applicant}
                  required
                />
                <DataField 
                  icon={Building2} 
                  label="Department" 
                  value={selectedRequest.department}
                  required
                />
                <DataField 
                  icon={CreditCard} 
                  label="Basic Pay" 
                  value={selectedRequest.details.basicPay}
                  required
                />
              </CardContent>
            </Card>

            {/* Travel Details */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Plane className="h-5 w-5 text-slate-600" />
                  Travel Authorization Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DataField 
                    icon={MapPin} 
                    label="Destination Country(s)" 
                    value={selectedRequest.details.country}
                    required
                  />
                  <DataField 
                    icon={Briefcase} 
                    label="Leave Type" 
                    value={selectedRequest.details.leaveType}
                    required
                  />
                  <DataField 
                    icon={Calendar} 
                    label="Departure Date" 
                    value={selectedRequest.details.from}
                    required
                  />
                  <DataField 
                    icon={Calendar} 
                    label="Return Date" 
                    value={selectedRequest.details.to}
                    required
                  />
                </div>
                <DataField 
                  icon={FileText} 
                  label="Purpose of Travel" 
                  value={selectedRequest.details.purpose}
                  required
                  className="md:col-span-2"
                />
              </CardContent>
            </Card>

            {/* Documentation & Compliance */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-slate-600" />
                  Documentation & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DataField 
                    icon={FileText} 
                    label="Passport Number" 
                    value={selectedRequest.details.passportNumber}
                    required
                  />
                  <DataField 
                    icon={Calendar} 
                    label="Passport Validity" 
                    value={selectedRequest.details.validity}
                    required
                  />
                  <DataField 
                    icon={Calendar} 
                    label="IPR Clearance Date" 
                    value={selectedRequest.details.iprDate}
                  />
                  <DataField 
                    icon={Plane} 
                    label="Previous Foreign Travel" 
                    value={selectedRequest.details.foreignVisit}
                    required
                  />
                </div>
                <DataField 
                  icon={Download} 
                  label="IPR Clearance Certificate" 
                  value={selectedRequest.details.iprFile}
                  isFile={true}
                />
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-slate-600" />
                  Financial Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DataField 
                    icon={CreditCard} 
                    label="Estimated Expenditure" 
                    value={selectedRequest.details.estimatedExpenditure}
                    required
                  />
                  <DataField 
                    icon={Building2} 
                    label="Source of Funding" 
                    value={selectedRequest.details.sourceOfFund}
                    required
                  />
                </div>
                <DataField 
                  icon={Download} 
                  label="Proof of Fund Documentation" 
                  value={selectedRequest.details.proofOfFund}
                  isFile={true}
                  required
                />
              </CardContent>
            </Card>

            {/* HR Assessment */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5 text-slate-600" />
                  HR Assessment & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Unit HR Recommendation</h4>
                      <p className="text-sm text-blue-800">{selectedRequest.details.unitHrRemarks}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-500" />
                      <label className="text-sm font-medium text-slate-700">Current Unit Assessment</label>
                    </div>
                    <div className="text-sm text-slate-900 p-3 bg-green-50 border border-green-200 rounded">
                      {selectedRequest.details.pertainingToPresentUnit}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-500" />
                      <label className="text-sm font-medium text-slate-700">Previous Unit Record</label>
                    </div>
                    <div className="text-sm text-slate-900 p-3 bg-green-50 border border-green-200 rounded">
                      {selectedRequest.details.pertainingToPastUnit}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Action Panel */}
        <div className="border-t bg-white px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
            <div className="text-sm text-slate-600">
              <span className="font-medium">Review Status:</span> Pending CGM Approval
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 hover:bg-slate-50"
              >
                <FileText className="h-4 w-4" />
                View Audit Trail
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <RotateCcw className="h-4 w-4" />
                Return to Unit HR
              </Button>
              <Button 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                <Send className="h-4 w-4" />
                Approve & Forward
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CGMRemarksDialog;