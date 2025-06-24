import React, { useState } from 'react';
import { Building2, Users, Info, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const NOCProcessInfo = () => {
  const [flowType, setFlowType] = useState('corporate');

  const corporateSteps = [
    'You submit your NOC application',
    'Corporate HR reviews your application',
    'D & AR (Disciplinary & Appeal) verification',
    'Vigilance department clearance',
    'Vigilance Admin approval',
    'Corporate HR final review',
    'GM HR approval',
    'NOC approved and completed',
  ];

  const nonCorporateSteps = [
    'You submit your NOC application',
    'Unit HR preliminary review',
    'CGM (Chief General Manager) approval',
    'Corporate HR reviews your application',
    'D & AR (Disciplinary & Appeal) verification',
    'Vigilance department clearance',
    'Vigilance Admin approval',
    'Corporate HR final review',
    'GM HR approval',
    'NOC approved and completed',
  ];

  const steps = flowType === 'corporate' ? corporateSteps : nonCorporateSteps;

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4 px-6 sm:py-4 px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-xl font-bold text-gray-800">Your NOC Process</h2>
                <p className="text-gray-600 text-sm">Step-by-step approval workflow</p>
              </div>
            </div>
            {/* Toggle Buttons */}
            <div className="bg-white p-1 rounded-xl shadow-sm">
              <div className="flex">
                <Button
                  onClick={() => setFlowType('corporate')}
                  variant="ghost"
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium
                    ${
                      flowType === 'corporate' ? 'bg-purple-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Building2 size={16} />
                  Corporate
                </Button>
                <Button
                  onClick={() => setFlowType('non-corporate')}
                  variant="ghost"
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium
                    ${
                      flowType === 'non-corporate'
                        ? 'bg-teal-500 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Users size={16} />
                  Non-Corporate
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Process Description */}
        <div className="py-2 px-6 sm:py-3 px-8">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Process Overview</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your No Objection Certificate application will go through the following approval process. Each step
              ensures compliance with company policies and thorough verification.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">Approval Steps:</h3>
            {/* Desktop/Tablet View */}
            <div className="hidden sm:block">
              <div className="grid gap-4">
                {steps.map((step, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center gap-4 py-0 px-0 rounded-xl hover:bg-gray-50 transition-colors">
                      {/* Step Number */}
                      <div
                        className={`
                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${flowType === 'corporate' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}
                      `}
                      >
                        {index + 1}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed">{step}</p>
                      </div>

                      {/* Completion Icon */}
                      <div className="flex-shrink-0">
                        {index === steps.length - 1 ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span
                    className={`
                    flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center
                    ${flowType === 'corporate' ? 'bg-purple-500 text-white' : 'bg-teal-500 text-white'}
                  `}
                  >
                    {index + 1}
                  </span>
                  <p className="text-gray-700 text-sm leading-relaxed flex-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NOCProcessInfo;
