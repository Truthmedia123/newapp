import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Download, 
  Upload, 
  Users, 
  UserCheck, 
  UserX, 
  Clock,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  rsvpStatus: 'pending' | 'accepted' | 'declined';
  plusOne: boolean;
  plusOneName?: string;
  dietaryRestrictions?: string;
  group?: string;
  invitationSent: boolean;
  notes?: string;
}

interface GuestStats {
  totalInvited: number;
  accepted: number;
  declined: number;
  pending: number;
  withPlusOne: number;
}

export default function GuestDashboard() {
  const [guests, setGuests] = useState<Guest[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+91 9876543210',
      rsvpStatus: 'accepted',
      plusOne: true,
      plusOneName: 'Jane Smith',
      dietaryRestrictions: 'Vegetarian',
      group: 'Family',
      invitationSent: true,
      notes: 'Childhood friend'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      email: 'maria@example.com',
      rsvpStatus: 'pending',
      plusOne: false,
      group: 'Work',
      invitationSent: true
    },
    {
      id: '3',
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+91 9876543211',
      rsvpStatus: 'declined',
      plusOne: true,
      group: 'Friends',
      invitationSent: true,
      notes: 'Unable to travel'
    },
    {
      id: '4',
      name: 'Sarah Brown',
      email: 'sarah@example.com',
      rsvpStatus: 'accepted',
      plusOne: false,
      dietaryRestrictions: 'Gluten-free',
      group: 'Family',
      invitationSent: true
    }
  ]);

  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isAddingGuest, setIsAddingGuest] = useState(false);

  // Calculate stats
  const stats: GuestStats = useMemo(() => {
    return {
      totalInvited: guests.length,
      accepted: guests.filter(g => g.rsvpStatus === 'accepted').length,
      declined: guests.filter(g => g.rsvpStatus === 'declined').length,
      pending: guests.filter(g => g.rsvpStatus === 'pending').length,
      withPlusOne: guests.filter(g => g.plusOne).length
    };
  }, [guests]);

  // Column helper for type safety
  const columnHelper = createColumnHelper<Guest>();

  // Define columns
  const columns = useMemo<ColumnDef<Guest, any>[]>(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <div className="font-medium">
          {info.getValue()}
          {info.row.original.plusOne && (
            <div className="text-xs text-gray-500">
              + {info.row.original.plusOneName || 'Guest'}
            </div>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => (
        <div className="text-sm text-gray-600">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: (info) => (
        <div className="text-sm text-gray-600">{info.getValue() || '-'}</div>
      ),
    }),
    columnHelper.accessor('rsvpStatus', {
      header: 'RSVP Status',
      cell: (info) => {
        const status = info.getValue();
        const variants = {
          accepted: 'bg-green-100 text-green-800',
          declined: 'bg-red-100 text-red-800',
          pending: 'bg-yellow-100 text-yellow-800'
        };
        return (
          <Badge className={variants[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('group', {
      header: 'Group',
      cell: (info) => (
        <Badge variant="outline">{info.getValue() || 'Other'}</Badge>
      ),
    }),
    columnHelper.accessor('dietaryRestrictions', {
      header: 'Dietary',
      cell: (info) => (
        <div className="text-sm text-gray-600 max-w-24 truncate">
          {info.getValue() || '-'}
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingGuest(info.row.original)}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDeleteGuest(info.row.original.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ),
    }),
  ], []);

  // Filter guests based on status
  const filteredData = useMemo(() => {
    let filtered = guests;
    if (statusFilter !== 'all') {
      filtered = guests.filter(guest => guest.rsvpStatus === statusFilter);
    }
    return filtered;
  }, [guests, statusFilter]);

  // Initialize table
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Handle guest deletion
  const handleDeleteGuest = (id: string) => {
    if (confirm('Are you sure you want to delete this guest?')) {
      setGuests(prev => prev.filter(guest => guest.id !== id));
    }
  };

  // Handle guest update
  const handleUpdateGuest = (updatedGuest: Guest) => {
    setGuests(prev => prev.map(guest => 
      guest.id === updatedGuest.id ? updatedGuest : guest
    ));
    setEditingGuest(null);
  };

  // Handle guest addition
  const handleAddGuest = (newGuest: Omit<Guest, 'id'>) => {
    const guest: Guest = {
      ...newGuest,
      id: Date.now().toString()
    };
    setGuests(prev => [...prev, guest]);
    setIsAddingGuest(false);
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      'Name,Email,Phone,RSVP Status,Plus One,Plus One Name,Dietary Restrictions,Group,Notes',
      ...guests.map(guest => 
        [
          guest.name,
          guest.email,
          guest.phone || '',
          guest.rsvpStatus,
          guest.plusOne ? 'Yes' : 'No',
          guest.plusOneName || '',
          guest.dietaryRestrictions || '',
          guest.group || '',
          guest.notes || ''
        ].map(field => `"${field}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guest-list.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Import from CSV
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
      
      const importedGuests: Guest[] = lines.slice(1)
        .filter(line => line.trim())
        .map((line, index) => {
          const values = line.split(',').map(v => v.replace(/"/g, ''));
          return {
            id: `imported-${index}`,
            name: values[0] || '',
            email: values[1] || '',
            phone: values[2] || undefined,
            rsvpStatus: (values[3] as Guest['rsvpStatus']) || 'pending',
            plusOne: values[4] === 'Yes',
            plusOneName: values[5] || undefined,
            dietaryRestrictions: values[6] || undefined,
            group: values[7] || undefined,
            invitationSent: false,
            notes: values[8] || undefined
          };
        });

      setGuests(prev => [...prev, ...importedGuests]);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Guest List Management</h2>
        <p className="text-gray-600">Manage your wedding guest list and track RSVPs</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{stats.totalInvited}</div>
            <div className="text-sm text-gray-600">Total Invited</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserX className="h-8 w-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
            <div className="text-sm text-gray-600">Declined</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.withPlusOne}</div>
            <div className="text-sm text-gray-600">With Plus One</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle>Guest List</CardTitle>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search guests..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
              </select>
              <Button onClick={() => setIsAddingGuest(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Guest
              </Button>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="border-b">
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="text-left p-3 font-medium text-gray-900"
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <div className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className="ml-2">
                              {header.column.getIsSorted() === 'asc' ? '↑' : 
                               header.column.getIsSorted() === 'desc' ? '↓' : '↕'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="p-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} guests
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guest Form Modal would go here - simplified for brevity */}
      {(editingGuest || isAddingGuest) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingGuest ? 'Edit Guest' : 'Add New Guest'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input placeholder="Guest name" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="guest@example.com" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input placeholder="+91 9876543210" />
                </div>
                <div className="flex space-x-4">
                  <Button onClick={() => { setEditingGuest(null); setIsAddingGuest(false); }}>
                    Cancel
                  </Button>
                  <Button onClick={() => { setEditingGuest(null); setIsAddingGuest(false); }}>
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}