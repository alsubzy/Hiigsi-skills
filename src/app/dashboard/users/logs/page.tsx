'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const logData = [
  { id: 1, user: 'Nathan Scott', action: 'User Login', module: 'Authentication', timestamp: '2024-05-21 10:30:15' },
  { id: 2, user: 'Jane Doe', action: 'Updated Grades', module: 'Academics', timestamp: '2024-05-21 09:45:00' },
  { id: 3, user: 'Admin', action: 'Deleted User', module: 'User Management', timestamp: '2024-05-20 15:12:45' },
  { id: 4, user: 'John Smith', action: 'Viewed Invoice', module: 'Finance', timestamp: '2024-05-20 14:00:22' },
  { id: 5, user: 'Laura Taylor', action: 'Created Exam', module: 'Examination', timestamp: '2024-05-19 11:05:10' },
  { id: 6, user: 'Nathan Scott', action: 'Changed Password', module: 'Settings', timestamp: '2024-05-19 08:20:00' },
  { id: 7, user: 'Admin', action: 'Assigned Role', module: 'User Management', timestamp: '2024-05-18 18:00:00' },
  { id: 8, user: 'Jane Doe', action: 'User Logout', module: 'Authentication', timestamp: '2024-05-18 17:30:00' },
];

export default function UserActivityLogsPage() {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2024, 4, 18),
        to: addDays(new Date(2024, 4, 21), 0),
    });
    const [currentPage, setCurrentPage] = React.useState(1);
    const logsPerPage = 5;

    const totalPages = Math.ceil(logData.length / logsPerPage);
    const paginatedLogs = logData.slice(
        (currentPage - 1) * logsPerPage,
        currentPage * logsPerPage
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
        <CardTitle>User Activity Logs</CardTitle>
        <div className="flex items-center justify-between pt-4 gap-2">
            <div className="relative w-full max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search logs..."
                className="pl-8"
                />
            </div>
            <div className="flex items-center gap-2">
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Pick a date</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
                 <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="login">User Login</SelectItem>
                        <SelectItem value="update">Updated Grades</SelectItem>
                        <SelectItem value="delete">Deleted User</SelectItem>
                    </SelectContent>
                </Select>
                 <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Apply Filters
                 </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length > 0 ? (
                paginatedLogs.map(log => (
                    <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.module}</TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                    No activity logs found for the selected period.
                    </TableCell>
                </TableRow>
            )}
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
