import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Save, X, User, Hash, Award, MessageSquare } from 'lucide-react';

const ReasonDialog = ({ isOpen, onClose, userData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReason, setEditedReason] = useState(userData?.reason || '');

  const handleEdit = () => {
    setIsEditing(true);
    setEditedReason(userData?.reason || '');
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...userData,
        reason: editedReason,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedReason(userData?.reason || '');
    setIsEditing(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        setIsEditing(false);
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-full md:max-w-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-xl"
      >
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white">
              <User className="w-4 h-4" />
            </div>
            Employee Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Employee Code */}
            <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Hash className="w-3 h-3 text-emerald-600" />
                <Label className="text-xs font-medium text-slate-600">Employee Code</Label>
              </div>
              <p className="text-sm font-mono text-slate-800 bg-emerald-50 px-2 py-1 rounded">
                {userData?.employeeCode || 'N/A'}
              </p>
            </div>

            {/* Position Grade */}
            <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-3 h-3 text-purple-600" />
                <Label className="text-xs font-medium text-slate-600">Position Grade</Label>
              </div>
              <p className="text-sm text-slate-800 bg-purple-50 px-2 py-1 rounded">
                {userData?.positionGrade || 'N/A'}
              </p>
            </div>

            {/* Employee Name */}
            <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-3 h-3 text-blue-600" />
                <Label className="text-xs font-medium text-slate-600">Employee Name</Label>
              </div>
              <p className="text-sm text-slate-800 bg-blue-50 px-2 py-1 rounded">{userData?.userName || 'N/A'}</p>
            </div>
          </div>

          {/* Reason Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-600" />
                <Label className="text-sm font-medium text-slate-700">Reason / Comments</Label>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="flex items-center gap-1 bg-blue-500 text-white border-0 hover:bg-blue-600 h-7 px-2 text-xs"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={editedReason}
                  onChange={(e) => setEditedReason(e.target.value)}
                  placeholder="Please provide a reason or comment..."
                  className="min-h-[80px] text-sm border border-orange-200 focus:border-orange-400 bg-orange-50 rounded resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white border-0 h-7 px-3 text-xs"
                  >
                    <Save className="h-3 w-3" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="flex items-center gap-1 border border-slate-300 hover:bg-slate-50 text-slate-600 h-7 px-3 text-xs"
                  >
                    <X className="h-3 w-3" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-orange-50 p-3 rounded border border-orange-200 min-h-[80px] text-sm">
                {userData?.reason ? (
                  <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{userData.reason}</p>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-slate-400 italic text-center text-xs">
                      No reason provided. Click "Edit" to add comments.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReasonDialog;
