import { CheckCircle, FileText } from 'lucide-react';
import React from 'react';

const EmptyFormStateForEmployeeNoc = () => {
  return (
    <div className="border-2 border-blue-200 rounded-lg bg-white">
      <div className="p-8">
        <div className="border-0  ">
          <div>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-900 mb-3">Getting Started</h3>
                <p className="text-blue-700 text-lg leading-relaxed">
                  Follow the simple steps above to create a comprehensive NOC request. Select a purpose and employee to
                  begin the process.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/70 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">!</span>
                    </div>
                    <h4 className="font-semibold text-blue-900">Important Notes</h4>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• Ensure all required fields are filled accurately</li>
                    <li>• Upload supporting documents where necessary</li>
                    <li>• Review information before final submission</li>
                  </ul>
                </div>

                <div className="bg-white/70 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-blue-900">Next Steps</h4>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• Track request status in real-time</li>
                    <li>• Receive notifications on status updates</li>
                    <li>• Download approved NOC certificate</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyFormStateForEmployeeNoc;
