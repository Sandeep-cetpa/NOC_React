import React from 'react';
import { AlertTriangle } from 'lucide-react';

// shadcn/ui Table components (proper implementation)
const Table = ({ className, ...props }) => (
  <div className="relative w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className || ''}`} {...props} />
  </div>
);

const TableHeader = ({ className, ...props }) => <thead className={`[&_tr]:border-b ${className || ''}`} {...props} />;

const TableBody = ({ className, ...props }) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className || ''}`} {...props} />
);

const TableRow = ({ className, ...props }) => (
  <tr
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className || ''}`}
    {...props}
  />
);

const TableHead = ({ className, ...props }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${
      className || ''
    }`}
    {...props}
  />
);

const TableCell = ({ className, ...props }) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className || ''}`} {...props} />
);

// Responsive DataTable component using react-table pattern
const DataTable = ({ data, columns, errorRowIndexes = [], errorMessages = {} }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center p-8 text-muted-foreground">No data to display</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
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
                  className={`${hasError ? 'bg-red-50 border-l-4 border-l-red-500 hover:bg-red-100' : ''}`}
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
      </div>

      {/* Error Summary */}
      {errorRowIndexes.length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="font-medium text-red-800">{errorRowIndexes.length} row(s) contain errors</span>
          </div>
          {Object.keys(errorMessages).length > 0 && (
            <div className="space-y-1">
              {Object.entries(errorMessages).map(([rowIndex, message]) => (
                <div key={rowIndex} className="text-sm text-red-700">
                  <span className="font-medium">Row {Number(rowIndex) - 1}:</span> {message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main Employee Data Table Component
const ExcelDataPreview = ({ data = [], errorRowIndexes = [], errorMessages = {} }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center p-8 text-muted-foreground">No data to display</div>;
  }

  const headers = data[0] || [];
  const rows = data.slice(1) || [];

  const columns = [
    ...headers.map((header, index) => ({
      header: header,
      accessorKey: `col_${index}`,
      className: `min-w-[150px] bg-primary text-white ${index === headers.length - 1 ? 'rounded-tr-lg' : ''}`,
      cell: (row) => {
        const cellValue = row[index];
        return cellValue || <span className="text-gray-400 italic text-xs">Empty</span>;
      },
    })),
  ];

  return <DataTable data={rows} columns={columns} errorRowIndexes={errorRowIndexes} errorMessages={errorMessages} />;
};

export default ExcelDataPreview;
