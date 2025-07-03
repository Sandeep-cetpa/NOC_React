import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  CheckCircle2,
  Clock,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

const RequestCountStatusWise = ({ allRequest }) => {
  const allStatus = useSelector((state: RootState) => state.allStatus.allStatus);
  const statusCountMap: Record<string, number> = {};
  allRequest?.forEach((req) => {
    const name = req.currentStatus;
    statusCountMap[name] = (statusCountMap[name] || 0) + 1;
  });
  // Step 2: Merge with the statuses list
  const statusSummary = allStatus.map((status) => ({
    statusName: status.statusName,
    count: statusCountMap[status.statusName] || 0,
  }));

  const iconMap = {
    'Total Users': Users,
    'Completed Tasks': CheckCircle2,
    'Pending Review': Clock,
    'In Progress': BarChart3,
    'Failed Tasks': AlertTriangle,
    Revenue: DollarSign,
    default: Activity,
  };

  const getIconBgColor = (status) => {
    switch (status) {
      case 'positive':
        return 'bg-green-100 text-green-600';
      case 'negative':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="">
      <div className=" mx-auto space-y-8">
        {/* Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {statusSummary
            .filter((status) => status.count > 0)
            .map((status) => {
              const IconComponent = iconMap[status.statusName] || iconMap.default;

              return (
                <Card
                  key={status.statusName}
                  className="hover:shadow-md transition-all bg-gradient-to-r from-stone-50 to-zinc-100 hover:bg-white transition-shadow duration-200 border-0 shadow-sm"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">{status.statusName}</CardTitle>
                    <div className={`p-2 rounded-md ${getIconBgColor(status.status)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-gray-900">{status.count}</div>
                        <p className="text-xs text-gray-500">{status.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default RequestCountStatusWise;
