import React from 'react';
import { Construction, AlertTriangle, Clock, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const ManageGreyList = () => {
  return (
    <div className="min-h-[screen-40px] bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
            <h1 className="text-3xl font-bold text-gray-900">Manage Grey List</h1>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              Under Development
            </Badge>
          </div>
          <p className="text-gray-600 text-lg">
            Vigilance administration tool for managing grey-listed entities and personnel.
          </p>
        </div>

        {/* Development Status Alert */}
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <Construction className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            This page is currently under development. New features and functionality will be available soon.
          </AlertDescription>
        </Alert>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Coming Soon Features */}
          <Card className="border-dashed border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Grey List Management
              </CardTitle>
              <CardDescription>Add, remove, and manage grey-listed entities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Coming Soon</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <Wrench className="h-5 w-5 text-blue-500" />
                Review & Approval
              </CardTitle>
              <CardDescription>Review grey list entries and manage approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Coming Soon</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <Construction className="h-5 w-5 text-green-500" />
                Reports & Analytics
              </CardTitle>
              <CardDescription>Generate reports and view grey list analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Coming Soon</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageGreyList;
