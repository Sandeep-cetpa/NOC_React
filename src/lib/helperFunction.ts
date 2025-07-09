import { RootState } from '@/app/store';
import { gradeHierarchy, hiddenFieldsForExIndiaLeaveSponsored, hiddenFieldsForExIndiaLeaveThirdParty } from '@/config';
import { format, parse } from 'date-fns';

import {
  User,
  Users,
  XCircle,
  Briefcase,
  Clock,
  AlertCircle,
  ShieldCheck,
  Calendar,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
export function statusConfig(status: string) {
  switch (status) {
    case 'Raised By User':
      return {
        label: 'Raised By User',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: User,
      };
    case 'Under Unit HR':
      return {
        label: 'Under Unit HR',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: Users,
      };
    case 'Rejected':
      return {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
      };
    case 'Under CGM':
      return {
        label: 'Under CGM',
        color: 'bg-pink-100 text-pink-800 border-pink-200',
        icon: Briefcase,
      };
    case 'Under Corporate HR':
      return {
        label: 'Under Corporate HR',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
      };
    case 'Under D and AR':
      return {
        label: 'Under D and AR',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: AlertCircle,
      };
    case 'Under Vigilance':
      return {
        label: 'Under Vigilance',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: ShieldCheck,
      };
    case 'Under GM HR':
      return {
        label: 'Under GM HR',
        color: 'bg-teal-100 text-teal-800 border-teal-200',
        icon: Calendar,
      };
    case 'Completed':
      return {
        label: 'Completed',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
      };
    case 'Under GM Cadre':
      return {
        label: 'Under GM Cadre',
        color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        icon: Calendar,
      };
    case 'Approved':
      return {
        label: 'Approved',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
      };
    default:
      return {
        label: status, // fallback: show whatever status came
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: HelpCircle,
      };
  }
}

export const setSessionItem = (key: string, value: any) => {
  const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
  sessionStorage.setItem(key, valueToStore);
};

export const getSessionItem = (key: string): any => {
  const value = sessionStorage.getItem(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  return null;
};

export const removeSessionItem = (key: string) => {
  sessionStorage.removeItem(key);
};

export const clearSessionStorage = () => {
  sessionStorage.clear();
};

export const setCookie = (name: string, value: any) => {
  const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
  document.cookie = `${name}=${valueToStore}; path=/`;
};

export const getCookie = (name: string): any => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length, c.length);
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
  }
  return null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};

export const getDay = (dateString) => {
  const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
  return format(parsedDate, 'dd');
};

export const getShortMonth = (dateString) => {
  const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
  return format(parsedDate, 'MMM');
};

export const findEmployeeDetails = (employees: any, empCode: string) => {
  const employee = employees.find((emp) => emp?.empCode === empCode);
  if (employee) {
    return {
      employee,
    };
  } else {
    return null;
  }
};

export const formatTaskStatus = (status: string) => {
  const statusMapping = {
    Created: 'New',
    InProgress: 'In Progress',
    AwaitingInfo: 'Awaiting Info',
    Resolved: 'Resolved',
    Closed: 'Closed',
  };

  return statusMapping[status] || 'Unknown Status';
};

export const getPriorityColor = (priority?: string): string => {
  const colors: Record<string, string> = {
    critical: 'font-bold bg-red-50 text-red-600',
    high: 'font-bold bg-orange-50 text-orange-600',
    medium: 'font-bold bg-yellow-50 text-yellow-600',
    low: 'font-bold bg-green-50 text-green-700 ',
  };
  return colors[priority?.toLowerCase()] || 'bg-gray-500 text-gray-700';
};

export const getStatusColor = (status?: string): string => {
  const colors: Record<string, string> = {
    completed: 'bg-green-600 text-white text-xs font-bold',
    'in progress': 'bg-yellow-600 text-white text-xs font-bold',
    'awaiting info': 'bg-purple-600 text-white text-xs font-bold',
    created: 'bg-blue-600 text-white text-xs font-bold',
    resolved: 'bg-blue-600 text-white text-xs font-bold',
    closed: 'bg-red-600 text-white text-xs font-bold',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-500 text-gray-300 text-xs font-bold';
};

export const adjustforUTC = (date) => {
  const utcDate = new Date(date);
  const offset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const istDate = new Date(utcDate.getTime() + offset);
  return istDate.toISOString().replace('Z', '+05:30');
};

// Helper function to extract unique units from employee list
export const extractUniqueUnits = (employees) => {
  // Create a Map to track unique units by unitId
  const uniqueUnitsMap = new Map();

  // Process each employee
  employees.forEach((employee) => {
    // Only add if both unitId and unitName exist
    if (employee.unitId && employee.unitName) {
      uniqueUnitsMap.set(employee.unitId, {
        unitId: employee.unitId,
        unitName: employee.unitName?.trim(),
      });
    }
  });

  // Convert Map values to array
  return Array.from(uniqueUnitsMap.values());
};

export const extractUniqueDepartments = (employees) => {
  // Create a Set to track unique department values
  const uniqueDepartmentsSet = new Set();

  // Create an array to hold unique department objects
  const uniqueDepartments = [];

  // Process each employee
  employees.forEach((employee) => {
    // Only add if department exists and hasn't been added yet
    if (employee.department && !uniqueDepartmentsSet.has(employee.department)) {
      uniqueDepartmentsSet.add(employee.department);

      uniqueDepartments.push({
        departmentName: employee.department?.trim()?.toUpperCase(),
      });
    }
  });

  return uniqueDepartments;
};

export const getStatusText = (statusId: number): string => {
  switch (statusId) {
    case 1:
      return 'Created';
    case 2:
      return 'In Progress';
    case 3:
      return 'Closed';

    default:
      return 'Undefined';
  }
};

export const getGridClass = (width: string): string => {
  const gridClasses = {
    full: 'col-span-12',
    half: 'col-span-12 sm:col-span-6',
    third: 'col-span-12 sm:col-span-4',
    quarter: 'col-span-12 sm:col-span-6 md:col-span-3',
    'two-thirds': 'col-span-12 sm:col-span-8',
    'three-quarters': 'col-span-12 sm:col-span-9',
  };
  return gridClasses[width] || gridClasses.full;
};

export function formatLabel(input) {
  if (!input) return;
  const cleanInput = input?.replace('*', '');
  return cleanInput
    .replace(/_/g, ' ') // Replace underscores with spaces
    .toLowerCase() // Convert to lowercase
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letter of each word
}
export const validateForm = (selectedForm, formData, setSubmitStatus, isUnitHrPage, userGrade) => {
  if (!selectedForm) {
    return false;
  }
  // Find user grade order
  const userGradeInfo = gradeHierarchy.find((grade) => grade.label === userGrade);
  const userGradeOrder = userGradeInfo ? userGradeInfo.order : null;

  // Check if IPR fields are mandatory (E2 and above - order <= 12)
  const isIPRMandatory = userGradeOrder !== null && userGradeOrder <= 12;

  let requiredFields = selectedForm.fields.filter((field) => field.fieldName.endsWith('*'));
  const is122True = formData[122];
  const is142True = formData[142];
  let fieldsToIgnore = [];

  // if (is122True) {
  //   fieldsToIgnore = [142, 122];
  // } else if (is142True) {
  //   fieldsToIgnore = [123, 122, 124, 125, 126, 142];
  // }
  if (is122True) {
    fieldsToIgnore.push(142, 122);
  }

  if (is142True) {
    fieldsToIgnore.push(123, 122, 124, 125, 126, 142);
  }

  // Add fieldId 153 if purposeId is 53
  if (selectedForm?.purposeId === 53) {
    fieldsToIgnore.push(153);
  }
  requiredFields = requiredFields.filter((field) => {
    const fieldId = parseInt(field.fieldId);
    return !fieldsToIgnore.includes(fieldId);
  });

  const value134 = formData[134];
  const isPurpose49 = Number(selectedForm.purposeId) === 49;

  const missingFields = requiredFields.filter((field) => {
    const fieldId = parseInt(field.fieldId);
    if (isPurpose49) {
      if (value134 === '18' && hiddenFieldsForExIndiaLeaveSponsored.includes(fieldId)) {
        return false;
      }
      if (value134 === '20' && hiddenFieldsForExIndiaLeaveThirdParty.includes(fieldId)) {
        return false;
      }
    }
    const fileKey = `File${fieldId}`;
    if (formData.hasOwnProperty(fileKey)) {
      const fileValue = formData[fileKey];
      return !fileValue || (Array.isArray(fileValue) && fileValue.length === 0);
    }
    const value = formData[fieldId];
    return !value;
  });

  const extraMissingFields = [];

  // IPR fields validation based on user grade
  if (isIPRMandatory && selectedForm.purposeId !== 53) {
    if (!formData.iprFile) {
      extraMissingFields.push({ fieldName: 'IPR File', fieldId: 'iprFile' });
    }
    if (!formData.iprDate) {
      extraMissingFields.push({ fieldName: 'IPR Date', fieldId: 'iprDate' });
    }
  }
  if (selectedForm?.purposeId === 53) {
    if (!formData.BulkExcel) {
      extraMissingFields.push({ fieldName: 'Upload Excel', fieldId: 'BulkExcel' });
    }
  }

  // Purpose 47 specific validations
  if (selectedForm.purposeId === 47 && isUnitHrPage && formData?.isDirector && !formData?.doj) {
    extraMissingFields.push({ fieldName: 'Date Of Joining', fieldId: 'doj' });
  }
  if (selectedForm.purposeId === 47 && isUnitHrPage && formData?.isDirector && !formData?.dor) {
    extraMissingFields.push({ fieldName: 'Date Of Retirement', fieldId: 'dor' });
  }
  if (selectedForm.purposeId === 47 && isUnitHrPage && formData?.isDirector && !formData?.remarks) {
    extraMissingFields.push({ fieldName: 'Remarks', fieldId: 'remarks' });
  }
  if (selectedForm.purposeId === 47 && formData?.isDirector && !formData?.FatherName) {
    extraMissingFields.push({ fieldName: "Father's Name", fieldId: 'FatherName' });
  }

  const allMissing = [...missingFields.map((f) => parseInt(f.fieldId)), ...extraMissingFields.map((f) => f.fieldId)];
  const allMissingWithFiledName = [...missingFields, ...extraMissingFields];

  if (allMissing.length > 0) {
    const fieldNames = allMissingWithFiledName.map((f) => formatLabel(f.fieldName)).join(', ');
    setSubmitStatus({
      type: 'error',
      message: `Please fill in the required fields: ${fieldNames}`,
    });
  }

  return allMissing;
};
export function getObjectFromSessionStorage(key) {
  const item = sessionStorage.getItem(key);
  if (item) {
    try {
      return JSON.parse(item);
    } catch (e) {
      console.error('Error parsing JSON from sessionStorage:', e);
      return null;
    }
  }
  return null;
}
