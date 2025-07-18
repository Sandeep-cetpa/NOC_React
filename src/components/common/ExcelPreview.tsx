import React, { useEffect, useState } from 'react';
import { AlertTriangle, Upload, File, X, Check } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

// Enhanced shadcn/ui Table components with better styling
const Table = ({ className, ...props }) => (
  <div className="relative w-full overflow-auto rounded-lg border border-gray-200 shadow-sm">
    <table className={`w-full caption-bottom text-sm ${className || ''}`} {...props} />
  </div>
);

const TableHeader = ({ className, ...props }) => (
  <thead className={`bg-gradient-to-r from-blue-600 to-blue-700 ${className || ''}`} {...props} />
);

const TableBody = ({ className, ...props }) => (
  <tbody className={`divide-y divide-gray-200 bg-white ${className || ''}`} {...props} />
);

const TableRow = ({ className, ...props }) => (
  <tr className={`transition-colors hover:bg-gray-50 ${className || ''}`} {...props} />
);

const TableHead = ({ className, ...props }) => (
  <th
    className={`px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider ${className || ''}`}
    {...props}
  />
);

const TableCell = ({ className, ...props }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className || ''}`} {...props} />
);

// Enhanced File Upload Component
const FileUploadCell = ({ onFileChange, currentFile, rowIndex }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleFileChange = (file) => {
    if (file) {
      onFileChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const removeFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (currentFile) {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
        <File className="h-4 w-4 text-green-600" />
        <span className="text-sm text-green-800 truncate max-w-[120px]" title={currentFile.name}>
          {currentFile.name}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={removeFile}
          className="h-6 w-6 p-0 text-green-600 hover:text-red-600 hover:bg-red-50"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-1 transition-all duration-200 cursor-pointer ${
        isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <Input
        ref={fileInputRef}
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileChange(file);
        }}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-1 text-center pointer-events-none">
        <Upload className="h-5 w-5 text-gray-400" />
        <span className="text-xs text-gray-500">{isDragOver ? 'Drop file' : 'Upload'}</span>
      </div>
    </div>
  );
};

// Enhanced DataTable component
const DataTable = ({ data, columns, errorRowIndexes = [], errorMessages = {} }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <File className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow className={'hover:bg-primary'}>
            {columns.map((column, index) => (
              <TableHead key={index} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => {
            const rowNumber = rowIndex + 2; // because errorRowIndexes are 1-based
            const hasError = errorRowIndexes.includes(rowNumber);
            return (
              <TableRow
                key={rowIndex}
                className={`${
                  hasError ? 'bg-red-50 border-l-4 border-l-red-500 hover:bg-red-100' : 'hover:bg-blue-50'
                }`}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={`${hasError ? 'text-red-900' : ''} ${column.cellClassName || ''}`}
                  >
                    {column.cell ? column.cell(row, rowNumber) : row[column.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Enhanced Error Summary */}
      {errorRowIndexes.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-red-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800 text-lg">Data Validation Errors</h3>
              <p className="text-red-700 text-sm">
                {errorRowIndexes.length} row{errorRowIndexes.length > 1 ? 's' : ''} contain
                {errorRowIndexes.length === 1 ? 's' : ''} errors that need attention
              </p>
            </div>
          </div>

          {Object.keys(errorMessages).length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-red-800 border-b border-red-200 pb-2">Error Details:</h4>
              {Object.entries(errorMessages).map(([rowIndex, message]) => (
                <div key={rowIndex} className="bg-white rounded-md p-3 border border-red-200">
                  <div className="flex items-start gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Row {Number(rowIndex) - 1}
                    </span>
                    <span className="text-sm text-red-700">{message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Enhanced Main Component
const ExcelDataPreview = ({
  data = [],
  errorRowIndexes = [],
  errorMessages = {},
  isUploadButton = false,
  setExcelData = (value) => {},
  excelData,
}) => {
  if (!data || data.length === 0) {
    return null;
  }
  const transformExcelData = (data) => {
    if (!data || data.length < 2) return [];

    const headers = data[0];
    const rows = data.slice(1);

    return rows.map((row) => {
      const rowObj = {};

      headers.forEach((header, index) => {
        rowObj[header] = row[index] ?? '';
      });
      // Add file placeholder
      rowObj.uploadFile = null;
      return rowObj;
    });
  };

  useEffect(() => {
    if (data.length > 0) {
      const transformed = transformExcelData(data);
      setExcelData(transformed);
    }
  }, [data, setExcelData]);

  if (!excelData || excelData.length === 0) return null;

  const headers = data[0] || [];
  const rows = data.slice(1) || [];

  const columns = [
    ...headers.map((header, index) => ({
      header: header,
      accessorKey: `col_${index}`,
      className: ` min-w-[150px] ${index === 0 ? 'rounded-tl-lg' : ''} ${
        index === headers.length - 1 && !isUploadButton ? 'rounded-tr-lg' : ''
      }`,
      cell: (row) => {
        const cellValue = row[index];
        return cellValue ? (
          <span className="font-medium">{cellValue}</span>
        ) : (
          <span className="text-gray-400 italic text-xs bg-gray-50 px-2 py-1 rounded">Empty</span>
        );
      },
    })),
    ...(isUploadButton
      ? [
          {
            header: (
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Files
              </div>
            ),
            accessorKey: 'uploadFile',
            className: 'min-w-[200px] rounded-tr-lg',
            cell: (row, rowIndex) => (
              <FileUploadCell
                onFileChange={(file) => {
                  setExcelData((prevData) => {
                    const updated = [...prevData];
                    if (updated[rowIndex - 2]) {
                      updated[rowIndex - 2].uploadFile = file;
                    }
                    return updated;
                  });
                }}
                currentFile={excelData[rowIndex - 2]?.uploadFile}
                rowIndex={rowIndex}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mt-2">
            {rows.length} row{rows.length > 1 ? 's' : ''} • {headers.length} column{headers.length > 1 ? 's' : ''}
          </p>
        </div>
        {errorRowIndexes?.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-100 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">
              {errorRowIndexes?.length} Error{errorRowIndexes?.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      <DataTable data={rows} columns={columns} errorRowIndexes={errorRowIndexes} errorMessages={errorMessages} />
    </div>
  );
};

export default ExcelDataPreview;
