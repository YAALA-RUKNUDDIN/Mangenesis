import { useState } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import EmptyState from './EmptyState';

/**
 * Enterprise DataTable component with search and column sorting
 */
export default function DataTable({
  columns = [],
  data = [],
  keyField = 'id',
  onRowClick,
  searchPlaceholder = 'Search records...',
  searchField = 'id',
  emptyMessage = 'No matching records found',
  className = '',
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    const val = row[searchField] || Object.values(row).join(' ');
    return String(val).toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    const res = aVal > bVal ? 1 : -1;
    return sortAsc ? res : -res;
  });

  return (
    <div className={`bg-[#0D111A] border border-[#243046] rounded-[12px] overflow-hidden flex flex-col ${className}`}>
      {/* Table Toolbar */}
      <div className="p-3 border-b border-[#1C2536] bg-[#0A0E16] flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#121824] border border-[#243046] rounded-[6px] text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Showing <span className="text-white font-bold">{sortedData.length}</span> of {data.length}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#121824] border-b border-[#243046] text-[11px] uppercase tracking-wider text-slate-400 font-mono select-none">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`py-2.5 px-3 font-semibold ${
                    col.sortable !== false ? 'cursor-pointer hover:text-white' : ''
                  }`}
                  style={{ width: col.width }}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {sortField === col.key && (
                      sortAsc ? <ChevronUp className="w-3 h-3 text-sky-400" /> : <ChevronDown className="w-3 h-3 text-sky-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C2536]">
            {sortedData.length > 0 ? (
              sortedData.map((row) => (
                <tr
                  key={row[keyField]}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-[#151D2C]' : 'hover:bg-[#121824]'
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-2.5 px-3">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-4">
                  <EmptyState title={emptyMessage} description="Try adjusting your filter or search query." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
