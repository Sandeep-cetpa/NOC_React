import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search, FileText, ExternalLink, GraduationCap, Briefcase, X, Download } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

interface NocRequest {
  employeeCode: string
  designation: string
  name: string
  purpose: string
  icon: React.ReactNode
  details: {
    proofOfFund: string
    country: string
    purpose: string
    from: string
    to: string
    leaveType: string
    passportNumber: string
    validity: string
    estimatedExpenditure: string
    sourceOfFund: string
    foreignVisit: string
    basicPay: string
    iprDate: string
    iprFile: string
    unitHrRemarks: string
    pertainingToPresentUnit: string
    pertainingToPastUnit: string
  }
}

const ProcessedRequestByCgm = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedRequest, setSelectedRequest] = React.useState<NocRequest | null>(null)

  // Sample data - replace with actual data fetching logic
  const requests: NocRequest[] = [
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "Tourism",
      icon: <Briefcase className="h-4 w-4" />,
      details: {
        proofOfFund: "1145_20241015_file2.pdf",
        country: "Japan",
        purpose: "Tourism",
        from: "2024-10-31",
        to: "2024-11-08",
        leaveType: "LAP",
        passportNumber: "123456789",
        validity: "2024-11-30",
        estimatedExpenditure: "50000",
        sourceOfFund: "Self",
        foreignVisit: "test",
        basicPay: "5000000",
        iprDate: "10-Oct-2024",
        iprFile: "1145_20241015_file2.pdf",
        unitHrRemarks: "bb",
        pertainingToPresentUnit: "bb",
        pertainingToPastUnit: "bb"
      }
    }
  ]

  const handleRowClick = (request: NocRequest) => {
    setSelectedRequest(request)
    setIsDialogOpen(true)
  }

  const handleFileClick = (fileName: string) => {
    // Implement file download logic here
    console.log('Downloading file:', fileName)
  }

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
              <Input
                placeholder="Search..."
                className="pl-8 w-[250px]"
              />
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
              <Button
                variant="outline"
                size="sm"
                disabled
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

     
    </div>
  )
}

export default ProcessedRequestByCgm