'use client';

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
  Users,
  GraduationCap,
  TrendingUp,
  DollarSign,
  Clock,
  Calendar,
  BookOpen,
  Award,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';

// Sample data for charts
const dailyOverviewData = [
  { name: 'Mon', value: 20 },
  { name: 'Tue', value: 35 },
  { name: 'Wed', value: 25 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 38 },
  { name: 'Sat', value: 30 },
  { name: 'Sun', value: 28 },
];

const categoryData = [
  { name: 'Present', value: 6248, color: '#6366F1' },
  { name: 'Absent', value: 1752, color: '#E5E7EB' },
  { name: 'Late', value: 500, color: '#F59E0B' },
];

const transactionData = [
  { id: '01', date: '20 January 2025', item: 'Grade 10 - Section A', amount: '$9.8', status: 'Paid', change: '+15%' },
  { id: '02', date: '19 January 2025', item: 'Grade 9 - Section B', amount: '$7.2', status: 'Paid', change: '+8%' },
  { id: '03', date: '18 January 2025', item: 'Grade 11 - Section C', amount: '$8.5', status: 'Pending', change: '-3%' },
  { id: '04', date: '17 January 2025', item: 'Grade 8 - Section A', amount: '$6.9', status: 'Paid', change: '+12%' },
  { id: '05', date: '16 January 2025', item: 'Grade 12 - Section D', amount: '$5.4', status: 'Paid', change: '+20%' },
];

export default function Dashboard() {
  const totalRevenue = '$189,374';
  const timeSpent = '00:01:30';
  const totalUnits = '6,248 Units';

  return (
    <div className="space-y-6 px-1">
      {/* Top Stats Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card - with gradient */}
        <Card className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 border-0 text-white shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/90">TOTAL REVENUE</CardTitle>
              <DollarSign className="h-4 w-4 text-white/70" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRevenue}</div>
            <p className="text-xs text-white/80 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        {/* Time Tracking */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">ACTIVE SESSION</CardTitle>
              <Clock className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{timeSpent}</div>
            <p className="text-xs text-muted-foreground mt-1">Current session duration</p>
          </CardContent>
        </Card>

        {/* Students */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">TOTAL STUDENTS</CardTitle>
              <Users className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">8,234</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+5.2%</span> from last year
            </p>
          </CardContent>
        </Card>

        {/* Teachers */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">STAFF MEMBERS</CardTitle>
              <GraduationCap className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">324</div>
            <p className="text-xs text-muted-foreground mt-1">Teaching & support staff</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Charts (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Overview Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Daily Overview</CardTitle>
                <Badge variant="secondary" className="text-xs">Last 7 days</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dailyOverviewData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366F1"
                    strokeWidth={3}
                    dot={{ fill: '#6366F1', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Product Transaction Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Class Performance</CardTitle>
                <Badge variant="outline" className="text-xs">Monthly</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="text-xs font-medium text-muted-foreground">ID</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">DATE</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">CLASS</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground text-right">SCORE</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground text-center">STATUS</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground text-center">TREND</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium text-sm">#{row.id}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.date}</TableCell>
                      <TableCell className="text-sm">{row.item}</TableCell>
                      <TableCell className="text-sm font-semibold text-right">{row.amount}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={row.status === 'Paid' ? 'default' : 'secondary'}
                          className={`text-xs ${row.status === 'Paid' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'}`}
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`text-xs font-medium ${row.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {row.change}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Attendance Donut (1/3 width) */}
        <div className="space-y-6">
          {/* Attendance Categories */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Data Categories</CardTitle>
              <CardDescription className="text-xs">Attendance statistics</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-foreground">{totalUnits.split(' ')[0]}</div>
                  <div className="text-xs text-muted-foreground">Units</div>
                </div>
              </div>
              <div className="mt-6 space-y-2 w-full">
                {categoryData.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-muted-foreground">{cat.name}</span>
                    </div>
                    <span className="font-semibold">{cat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Mini Cards */}
          <div className="space-y-3">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">TOTAL COURSES</div>
                    <div className="text-xl font-bold">45</div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">+3</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">ACHIEVEMENTS</div>
                    <div className="text-xl font-bold">128</div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">+12</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">ACTIVE EVENTS</div>
                    <div className="text-xl font-bold">8</div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Live</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
