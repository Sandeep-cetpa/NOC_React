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
import { Search, FileText, ExternalLink, GraduationCap, Briefcase } from 'lucide-react'

interface NocRequest {
  employeeCode: string
  designation: string
  name: string
  purpose: string
  icon: React.ReactNode
}

const PendingNocRequests = () => {
  // Sample data - replace with actual data fetching logic
  const requests: NocRequest[] = [
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "Higher Education",
      icon: <GraduationCap className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "External Employment",
      icon: <Briefcase className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "Passport",
      icon: <FileText className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "External Leave",
      icon: <ExternalLink className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "Higher Education",
      icon: <GraduationCap className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "External Employment",
      icon: <Briefcase className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "Passport",
      icon: <FileText className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "External Leave",
      icon: <ExternalLink className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "Higher Education",
      icon: <GraduationCap className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "External Employment",
      icon: <Briefcase className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "Passport",
      icon: <FileText className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "External Leave",
      icon: <ExternalLink className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "Higher Education",
      icon: <GraduationCap className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "External Employment",
      icon: <Briefcase className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "Passport",
      icon: <FileText className="h-4 w-4" />
    },
    {
      employeeCode: "101757",
      designation: "JR EXEC",
      name: "BASABA DALAI",
      purpose: "External Leave",
      icon: <ExternalLink className="h-4 w-4" />
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">NOC Requests History</CardTitle>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px] text-white">Employee Code</TableHead>
                <TableHead className='text-white'>Designation</TableHead>
                <TableHead className='text-white'>Name</TableHead>
                <TableHead className='text-white'>Purpose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request, index) => (
                <TableRow key={index}>
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
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing 1 to 4 of 4 entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 text-sm border rounded-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                disabled
              >
                Previous
              </button>
              <button
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                1
              </button>
              <button
                className="px-3 py-1 text-sm border rounded-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PendingNocRequests