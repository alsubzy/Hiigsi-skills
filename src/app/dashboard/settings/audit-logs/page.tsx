'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const logData = [
  { id: 'log1', user: 'Principal', userAvatar: 'https://picsum.photos/seed/principal/40', action: 'Updated School Profile', module: 'Settings', ip: '192.168.1.1', timestamp: '2024-07-21 10:30:15' },
  { id: 'log2', name: 'Jane Doe', userAvatar: 'https://picsum.photos/seed/jane/40', action: 'Updated Grades for Grade 7', module: 'Academics', ip: '10.0.0.5', timestamp: '2024-07-21 09:45:00' },
  { id: 'log3', user: 'Principal', userAvatar: 'https://picsum.photos/seed/principal/40', action: 'Deleted User: John Smith', module: 'User Management', ip: '192.168.1.1', timestamp: '2024-07-20 15:12:45' },
  { id: 'log4', name: 'John Smith', userAvatar: 'https://picsum.photos/seed/john/40', action: 'Viewed Invoice #INV-003', module: 'Finance', ip: '172.16.0.10', timestamp: '2024-07-20 14:00:22' },
  { id: 'log5', name: 'Laura Taylor', userAvatar: 'https://picsum.photos/seed/laura/40', action: 'Created Exam: Mid-Term', module: 'Examination', ip: '10.0.0.8', timestamp: '2024-07-19 11:05:10' },
];

export default function AuditLogsPage() {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: addDays(new Date(), -7),
        to: new Date(),
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
        <CardDescription>Track all system and user activities for security and compliance.</CardDescription>
        <div className="flex items-center justify-between pt-4 gap-2">
            <div className="relative w-full max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search by user or action..." className="pl-8" />
            </div>
            <div className="flex items-center gap-2">
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn("w-[260px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? ( date.to ? (<> {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")} </>) : (format(date.from, "LLL dd, y"))) : (<span>Pick a date</span>)}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2}/>
                    </PopoverContent>
                </Popover>
                 <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Module" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Modules</SelectItem>
                        <SelectItem value="authentication">Authentication</SelectItem>
                        <SelectItem value="academics">Academics</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="settings">Settings</SelectItem>
                    </SelectContent>
                </Select>
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
              <TableHead>IP Address</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logData.map(log => (
                <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.user || log.name}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.module}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
          <span className="text-sm text-muted-foreground">
            Page 1 of 10
          </span>
          <Button variant="outline" size="sm" disabled><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}

    