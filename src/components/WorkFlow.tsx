import React, { useState } from 'react';
import {
  User,
  Building2,
  Shield,
  ShieldCheck,
  UserCheck,
  Crown,
  CheckCircle,
  ArrowRight,
  Users,
  Award,
  Eye,
  UserCog,
  Briefcase,
  ArrowDown,
  Clock,
  Info,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const WorkflowFlow = () => {
  const corporateFlow = [
    {
      id: 'user',
      name: 'User',
      icon: User,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50 border-blue-200',
      description: 'Employee initiates NOC request',
      estimatedTime: '1 day',
    },
    {
      id: 'corporate-hr',
      name: 'Corporate HR',
      icon: Building2,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50 border-purple-200',
      description: 'Corporate HR reviews application',
      estimatedTime: '1-2 days',
    },
    {
      id: 'dar',
      name: 'D&AR',
      icon: Award,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50 border-orange-200',
      description: 'Disciplinary & Appeal Review',
      estimatedTime: '2-3 days',
    },
    {
      id: 'vigilance',
      name: 'Vigilance',
      icon: Eye,
      color: 'bg-red-500',
      lightColor: 'bg-red-50 border-red-200',
      description: 'Vigilance department verification',
      estimatedTime: '2-3 days',
    },
    {
      id: 'vigilance-admin',
      name: 'Vigilance Admin',
      icon: ShieldCheck,
      color: 'bg-red-600',
      lightColor: 'bg-red-50 border-red-300',
      description: 'Vigilance administrative approval',
      estimatedTime: '1-2 days',
    },
    {
      id: 'corporate-hr-final',
      name: 'Corporate HR',
      icon: Building2,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50 border-purple-200',
      description: 'Corporate HR final review',
      estimatedTime: '1 day',
    },
    {
      id: 'gm-hr',
      name: 'GM HR',
      icon: Crown,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50 border-indigo-200',
      description: 'General Manager HR approval',
      estimatedTime: '1-2 days',
    },
    {
      id: 'completed',
      name: 'Completed',
      icon: CheckCircle,
      color: 'bg-green-500',
      lightColor: 'bg-green-50 border-green-200',
      description: 'NOC process completed',
      estimatedTime: 'Instant',
    },
  ];

  const nonCorporateFlow = [
    {
      id: 'user',
      name: 'User',
      icon: User,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50 border-blue-200',
      description: 'Employee initiates NOC request',
      estimatedTime: '1 day',
    },
    {
      id: 'unit-hr',
      name: 'Unit HR',
      icon: Users,
      color: 'bg-teal-500',
      lightColor: 'bg-teal-50 border-teal-200',
      description: 'Unit HR will preliminary review',
      estimatedTime: '1-2 days',
    },
    {
      id: 'cgm',
      name: 'CGM',
      icon: Briefcase,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50 border-amber-200',
      description: 'Chief General Manager review',
      estimatedTime: '2-3 days',
    },
    {
      id: 'corporate-hr',
      name: 'Corporate HR',
      icon: Building2,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50 border-purple-200',
      description: 'Corporate HR reviews application',
      estimatedTime: '1-2 days',
    },
    {
      id: 'dar',
      name: 'D&AR',
      icon: Award,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50 border-orange-200',
      description: 'Disciplinary & Appeal Review',
      estimatedTime: '2-3 days',
    },
    {
      id: 'vigilance',
      name: 'Vigilance',
      icon: Eye,
      color: 'bg-red-500',
      lightColor: 'bg-red-50 border-red-200',
      description: 'Vigilance department verification',
      estimatedTime: '2-3 days',
    },
    {
      id: 'vigilance-admin',
      name: 'Vigilance Admin',
      icon: ShieldCheck,
      color: 'bg-red-600',
      lightColor: 'bg-red-50 border-red-300',
      description: 'Vigilance administrative approval',
      estimatedTime: '1-2 days',
    },
    {
      id: 'corporate-hr-final',
      name: 'Corporate HR',
      icon: Building2,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50 border-purple-200',
      description: 'Corporate HR final review and action',
      estimatedTime: '1 day',
    },
    {
      id: 'gm-hr',
      name: 'GM HR',
      icon: Crown,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50 border-indigo-200',
      description: 'General Manager HR approval',
      estimatedTime: '1-2 days',
    },
    {
      id: 'completed',
      name: 'Completed',
      icon: CheckCircle,
      color: 'bg-green-500',
      lightColor: 'bg-green-50 border-green-200',
      description: 'NOC process has been completed',
      estimatedTime: 'Instant',
    },
  ];
  const [flowType, setflowType] = useState('corporate');
  const flow = flowType === 'corporate' ? corporateFlow : nonCorporateFlow;

  const StepCard = ({ step, index, isLast, isEndOfRow }) => {
    const IconComponent = step.icon;

    return (
      <div className="flex flex-col items-center group">
        {/* Step Card */}
        <div
          className={`
          relative p-3 rounded-xl transition-all duration-300 
          ${step.lightColor} border-2 shadow-sm hover:shadow-lg hover:scale-105 
          cursor-pointer w-full max-w-[210px] min-h-[120px] flex flex-col justify-between
        `}
        >
          {/* Step Number Badge */}
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-700 shadow-sm">
            {index + 1}
          </div>

          {/* Icon */}
          <div
            className={`
            w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
            ${step.color} text-white shadow-md
          `}
          >
            <IconComponent size={28} />
          </div>

          {/* Content */}
          <div className="text-center space-y-2">
            <h4 className="font-bold text-lg text-gray-800">{step.name}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
          </div>
        </div>
        {isLast && (
          <div className="mt-4 mb-4 flex items-center justify-center">
            <div className="hidden md:flex items-center">
              <CheckCircle className="text-gray-400" size={24} />
            </div>
          </div>
        )}
        {/* Connector */}
        {!isLast && (
          <div className="mt-4 mb-4 flex items-center justify-center">
            {isEndOfRow ? (
              <div className="flex flex-col items-center">
                <ArrowDown className="text-gray-400" size={24} />
                <div className="text-xs text-gray-500 mt-1">Next</div>
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <ArrowRight className="text-gray-400" size={24} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          {/* <div className={`p-3 rounded-full ${flowType === 'corporate' ? 'bg-purple-500' : 'bg-teal-500'} text-white`}>
            {flowType === 'corporate' ? <Building2 size={24} /> : <Users size={24} />}
          </div> */}
          <Button
            className="text-sm"
            onClick={() => {
              if (flowType === 'corporate') {
                setflowType('Non-Corporate User');
              } else {
                setflowType('corporate');
              }
            }}
          >
            {flowType === 'corporate' ? 'Corporate User' : 'Non-Corporate User'} Workflow
          </Button>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline" className="text-sm flex items-center gap-1">
            <Info size={12} />
            {flow.length} Steps Total
          </Badge>
        </div>
      </div>

      {/* Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:grid-cols-6 place-items-center">
        {flow.map((step, index) => (
          <StepCard key={step.id} step={step} index={index} isLast={index === flow.length - 1} isEndOfRow={false} />
        ))}
      </div>
    </div>
  );
};

export default WorkflowFlow;
