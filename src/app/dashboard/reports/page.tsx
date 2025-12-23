'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Users,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Search,
  FileDown,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';

const enrollmentData = [
  { name: '2020', students: 800 },
  { name: '2021', students: 850 },
  { name: '2022', students: 950 },
  { name: '2023', students: 1020 },
  { name: '2024', students: 1100 },
];

const financialSummaryData = [
  { month: 'Jan', income: 45000, expense: 32000 },
  { month: 'Feb', income: 48000, expense: 35000 },
  { month: 'Mar', income: 52000, expense: 38000 },
  { month: 'Apr', income: 50000, expense: 36000 },
  { month: 'May', income: 55000, expense: 40000 },
  { month: 'Jun', income: 58000, expense: 42000 },
];

const reportsList = [
    { id: 'REP-001', name: 'Annual Financial Statement 2023', type: 'Finance', date: '2024-01-15', status: 'Generated' },
    { id: 'REP-002', name: 'Q3 Student Attendance Report', type: 'Academic', date: '2023-10-05', status: 'Generated' },
    { id: 'REP-003', name: 'Exam Performance Analysis - Mid-Term', type: 'Examination', date: '2023-11-20', status: 'Generated' },
    { id: 'REP-004', name: 'Enrollment Statistics 2020-2024', type: 'Administrative', date: '2024-02-10', status: 'Generated' },
    { id: 'REP-005', name: 'Q4 Expense Breakdown', type: 'Finance', date: '2024-01-05', status: 'Archived' },
];

export default function ReportsPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(2024, 5, 30), 0),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">Detailed insights into school performance.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
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
                    <span>Pick a date range</span>
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
            <Button>
                <FileDown className="mr-2 h-4 w-4" />
                Export Dashboard
            </Button>
        </div>
      </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1,100</div>
                    <p className="text-xs text-muted-foreground">+7.8% from last year</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Graduation Rate</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">96.5%</div>
                    <p className="text-xs text-muted-foreground">+1.2% from last year</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$308,000</div>
                    <p className="text-xs text-muted-foreground">+12% from last period</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$221,000</div>
                    <p className="text-xs text-muted-foreground">+5% from last period</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Student Enrollment Trend</CardTitle>
                    <CardDescription>Number of students over the last 5 years.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={enrollmentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{ borderRadius: 'var(--radius)' }} />
                            <Legend />
                            <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                    <CardDescription>Income vs. Expenses for the current year.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={financialSummaryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip contentStyle={{ borderRadius: 'var(--radius)' }} />
                            <Legend />
                            <Line type="monotone" dataKey="income" stroke="hsl(var(--primary))" strokeWidth={2} />
                            <Line type="monotone" dataKey="expense" stroke="hsl(var(--destructive))" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Generated Reports</CardTitle>
                <CardDescription>View, manage, and export all system reports.</CardDescription>
                <div className="flex items-center justify-between pt-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search reports..." className="pl-8" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="academic">Academic</SelectItem>
                                <SelectItem value="examination">Examination</SelectItem>
                                <SelectItem value="administrative">Administrative</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">Generate New Report</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Report Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reportsList.map(report => (
                            <TableRow key={report.id}>
                                <TableCell className="font-medium">{report.name}</TableCell>
                                <TableCell>{report.type}</TableCell>
                                <TableCell>{report.date}</TableCell>
                                <TableCell>
                                    <Badge variant={report.status === 'Archived' ? 'secondary' : 'default'}>
                                        {report.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                                            <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 <div className="flex items-center justify-end space-x-2 py-4">
                    <Button variant="outline" size="sm" ><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="text-sm text-muted-foreground">Page 1 of 3</span>
                    <Button variant="outline" size="sm"><ChevronRight className="h-4 w-4" /></Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
