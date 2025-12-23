'use client';

import * as React from 'react';
import { MoreHorizontal, PlusCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const staffData = [
  { id: 'S001', name: 'Dr. Evelyn Reed', avatar: 'https://picsum.photos/seed/evelyn/100', position: 'Principal', department: 'Administration', status: 'Active' },
  { id: 'S002', name: 'Mr. David Chen', avatar: 'https://picsum.photos/seed/davidc/100', position: 'Math Teacher', department: 'Academics', status: 'Active' },
  { id: 'S003', name: 'Ms. Maria Garcia', avatar: 'https://picsum.photos/seed/mariag/100', position: 'Librarian', department: 'Library', status: 'On Leave' },
  { id: 'S004', name: 'Mr. Samuel Jones', avatar: 'https://picsum.photos/seed/samuel/100', position: 'Accountant', department: 'Finance', status: 'Active' },
  { id: 'S005', name: 'Mrs. Helen Chu', avatar: 'https://picsum.photos/seed/helen/100', position: 'Science Teacher', department: 'Academics', status: 'Resigned' },
  { id: 'S006', name: 'Mr. Ben Carter', avatar: 'https://picsum.photos/seed/ben/100', position: 'IT Administrator', department: 'Administration', status: 'Active' },
  { id: 'S007', name: 'Ms. Chloe Adams', avatar: 'https://picsum.photos/seed/chloe/100', position: 'Art Teacher', department: 'Academics', status: 'Active' },
];

export default function StaffManagementPage() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const staffPerPage = 5;

    const totalPages = Math.ceil(staffData.length / staffPerPage);
    const paginatedStaff = staffData.slice(
        (currentPage - 1) * staffPerPage,
        currentPage * staffPerPage
    );

    const handleNextPage = () => {
        if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        }
    };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Management</CardTitle>
        <CardDescription>Manage all staff members, their roles, and status.</CardDescription>
         <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search staff..."
                className="pl-8"
                />
            </div>
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="academics">Academics</SelectItem>
                    <SelectItem value="administration">Administration</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="library">Library</SelectItem>
                </SelectContent>
            </Select>
             <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                    <SelectItem value="resigned">Resigned</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <Button className="ml-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Staff
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStaff.map(staff => (
              <TableRow key={staff.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={staff.avatar} alt={staff.name} />
                      <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-sm text-muted-foreground">{staff.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{staff.position}</TableCell>
                <TableCell>{staff.department}</TableCell>
                <TableCell>
                  <Badge variant={
                    staff.status === 'Active' ? 'default' : 
                    staff.status === 'On Leave' ? 'secondary' : 'destructive'
                  }>
                    {staff.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                      <DropdownMenuItem>Disable Staff</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         <div className="flex items-center justify-end space-x-2 py-4">
            <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
