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
  Briefcase,
  Award,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Dot,
} from 'lucide-react';
import Image from 'next/image';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  TooltipProps,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

const statsCards = [
  {
    title: 'Students',
    value: '124,684',
    change: '+15%',
    icon: <Users className="h-6 w-6 text-indigo-500" />,
    bgColor: 'bg-indigo-50',
    changeColor: 'text-green-500',
  },
  {
    title: 'Teachers',
    value: '12,379',
    change: '-3%',
    icon: <GraduationCap className="h-6 w-6 text-amber-500" />,
    bgColor: 'bg-amber-50',
    changeColor: 'text-red-500',
  },
  {
    title: 'Staffs',
    value: '29,300',
    change: '-3%',
    icon: <Briefcase className="h-6 w-6 text-indigo-500" />,
    bgColor: 'bg-indigo-50',
    changeColor: 'text-red-500',
  },
  {
    title: 'Awards',
    value: '95,800',
    change: '+5%',
    icon: <Award className="h-6 w-6 text-amber-500" />,
    bgColor: 'bg-amber-50',
    changeColor: 'text-green-500',
  },
];

const studentGenderData = [
  { name: 'Boys', value: 45414, color: '#FFC107' },
  { name: 'Girls', value: 40270, color: '#3B82F6' },
];

const attendanceData = [
  { day: 'Mon', present: 65, absent: 58 },
  { day: 'Tue', present: 75, absent: 40 },
  { day: 'Wed', present: 45, absent: 55, label: '95%\nPresent' },
  { day: 'Thu', present: 72, absent: 48 },
  { day: 'Fri', present: 70, absent: 65 },
];

const earningsData = [
  { name: 'Jan', income: 400000, expense: 240000 },
  { name: 'Feb', income: 300000, expense: 139800 },
  { name: 'Mar', income: 200000, expense: 980000 },
  { name: 'Apr', income: 278000, expense: 390800 },
  { name: 'May', income: 189000, expense: 480000 },
  { name: 'Jun', income: 239000, expense: 380000 },
  { name: 'Jul', income: 349000, expense: 430000 },
  { name: 'Aug', income: 650000, expense: 350000 },
  { name: 'Sep', income: 837000, expense: 500000 },
  { name: 'Oct', income: 720000, expense: 600000 },
  { name: 'Nov', income: 850000, expense: 550000 },
  { name: 'Dec', income: 950000, expense: 650000 },
];

const agendaItems = [
    { time: '08:00 AM', grade: 'All Grade', title: 'Homeroom & Announcement', color: 'bg-yellow-200' },
    { time: '10:00 AM', grade: 'Grade 3-5', title: 'Math Review & Practice', color: 'bg-yellow-200' },
    { time: '10:30 AM', grade: 'Grade 6-8', title: 'Science Experiment & Discussion', color: 'bg-blue-200' },
];

const messages = [
  { name: 'Dr. Lila Ramirez', message: 'Please ensure the monthly attendance report is accurate before the April 30th deadline.', time: '9:00 AM', avatar: 'https://picsum.photos/seed/lila/40' },
  { name: 'Ms. Heather Morris', message: "Don't forget the staff training on digital tools scheduled for May 5th at 3 PM in the...", time: '10:15 AM', avatar: 'https://picsum.photos/seed/heather/40' },
  { name: 'Mr. Carl Jenkins', message: 'Budget review meeting for the next fiscal year is on April 28th at 10 AM.', time: '2:00 PM', avatar: 'https://picsum.photos/seed/carl/40' },
  { name: 'Officer Dan Brooks', message: 'Review the updated security protocols effective May 1st. Familiarize yourself with...', time: '3:10 PM', avatar: 'https://picsum.photos/seed/dan/40' },
  { name: 'Ms. Tina Goldberg', message: 'Reminder: Major IT system upgrade on May 8th from 1 PM to 4 PM.', time: '5:00 PM', avatar: 'https://picsum.photos/seed/tina/40' },
];

const studentActivities = [
    { title: 'Regional Robotics Champion', description: 'Winning tools triumph in engineering contest', icon: <Award className="h-5 w-5 text-blue-500" /> },
];

const noticeBoardItems = [
    { title: 'Math Olympiad Competition', date: '04/18/2030', author: 'By Ms. Jackson', subject: 'Math Teacher', image: 'https://picsum.photos/seed/math/50', views: 325 }
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Card key={card.title} className={`${card.bgColor} border-0`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="p-3 rounded-full bg-white">{card.icon}</div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                {card.change.startsWith('+') ? <ArrowUp className="h-4 w-4 text-green-500" /> : <ArrowDown className="h-4 w-4 text-red-500" />}
                <span className={card.changeColor}>{card.change}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-sm text-muted-foreground">{card.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-2">
          {/* Student Gender Chart */}
          <Card className="rounded-[20px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Students</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="relative h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={studentGenderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {studentGenderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex w-full justify-around">
                <div className="text-center">
                  <p className="text-muted-foreground flex items-center">
                    <Dot className="text-yellow-400 h-6 w-6" /> Boys (47%)
                  </p>
                  <p className="text-lg font-bold">45,414</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground flex items-center">
                    <Dot className="text-blue-500 h-6 w-6" /> Girls (53%)
                  </p>
                  <p className="text-lg font-bold">40,270</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Chart */}
          <Card className="rounded-[20px]">
             <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Attendance</CardTitle>
              <div className="flex items-center gap-2">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        Weekly
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Daily</DropdownMenuItem>
                      <DropdownMenuItem>Monthly</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        Grade 3
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Grade 1</DropdownMenuItem>
                      <DropdownMenuItem>Grade 2</DropdownMenuItem>
                      <DropdownMenuItem>Grade 4</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-400"></span>Total Present</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-300"></span>Total Absent</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={attendanceData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px' }}
                    cursor={{fill: 'transparent'}}
                    formatter={(value, name, props) => {
                         if (props.payload.label) {
                            return [props.payload.label.replace('\n', ' '), '']
                         }
                         return [value, name === 'present' ? 'Present' : 'Absent'];
                    }}
                    labelFormatter={() => ''}
                  />
                  <Bar dataKey="present" fill="#FFC107" radius={[10, 10, 0, 0]} barSize={10} />
                  <Bar dataKey="absent" fill="#A0C4FF" radius={[10, 10, 0, 0]} barSize={10}/>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

           {/* Earnings Chart */}
           <Card className="rounded-[20px] md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Earnings</CardTitle>
            </CardHeader>
            <CardContent className="pl-0">
                 <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-400"></span>Income</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-400"></span>Expense</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={earningsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}K`} dx={-10} />
                  <Tooltip 
                    content={(props) => <CustomTooltip {...props} />} 
                    wrapperStyle={{ outline: 'none' }}
                  />
                  <Line type="monotone" dataKey="income" stroke="#22D3EE" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="expense" stroke="#818CF8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Mini Cards & Messages */}
          <div className="space-y-6">
             <Card className="rounded-[20px] overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <Users className="h-6 w-6 text-blue-500"/>
                    </div>
                    <div>
                        <div className="text-xl font-bold">24,680</div>
                        <div className="text-sm text-muted-foreground">Olympic Students</div>
                    </div>
                    <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">+15%</Badge>
                </CardContent>
             </Card>
             <Card className="rounded-[20px] overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                        <Award className="h-6 w-6 text-yellow-500"/>
                    </div>
                    <div>
                        <div className="text-xl font-bold">3,000</div>
                        <div className="text-sm text-muted-foreground">Competition</div>
                    </div>
                    <Badge variant="secondary" className="ml-auto bg-red-100 text-red-700">-8%</Badge>
                </CardContent>
             </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Calendar */}
          <Card className="rounded-[20px]">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-lg">September 2030</CardTitle>
               <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 text-center text-sm text-muted-foreground">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
              </div>
              <div className="grid grid-cols-7 text-center text-sm mt-2">
                {Array.from({length: 35}, (_, i) => {
                    const day = i - 4;
                    const isCurrentMonth = day > 0 && day <= 30;
                    const isToday = day === 22;
                    return (
                        <div key={i} className={`p-2 ${!isCurrentMonth ? 'text-muted-foreground opacity-50' : ''} ${isToday ? 'bg-blue-500 text-white rounded-full' : ''}`}>
                            {isCurrentMonth ? day : ''}
                        </div>
                    )
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-[20px]">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-lg">Agenda</CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {agendaItems.map(item => (
                    <div key={item.title} className={`p-3 rounded-lg ${item.color} flex items-start gap-4`}>
                        <div className="text-xs font-semibold">{item.time}</div>
                        <div>
                            <div className="text-xs text-muted-foreground">{item.grade}</div>
                            <div className="font-semibold">{item.title}</div>
                        </div>
                    </div>
                ))}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="rounded-[20px]">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-lg">Messages</CardTitle>
              <Button variant="link" className="text-sm">View All</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.name} className="flex items-start gap-4">
                  <Image src={msg.avatar} alt={msg.name} width={40} height={40} className="rounded-full" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">{msg.name}</p>
                        <p className="text-xs text-muted-foreground">{msg.time}</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Activity */}
            <Card className="rounded-[20px] lg:col-span-1">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="text-lg">Student Activity</CardTitle>
                    <Button variant="link" className="text-sm">View All</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {studentActivities.map(activity => (
                        <div key={activity.title} className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">{activity.icon}</div>
                            <div>
                                <p className="font-semibold">{activity.title}</p>
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Notice Board */}
            <Card className="rounded-[20px] lg:col-span-2">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="text-lg">Notice Board</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4"/></Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {noticeBoardItems.map(item => (
                        <div key={item.title} className="flex items-center gap-4">
                            <Image src={item.image} alt={item.title} width={80} height={80} className="rounded-lg" />
                            <div className="flex-1">
                                <p className="font-semibold">{item.title}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                                    <span>{item.date}</span>
                                    <span>{item.author} ({item.subject})</span>
                                    <span>{item.views}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
       </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length && label === 'Sep') {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <p className="text-sm text-muted-foreground">Sep 14, 2030</p>
        <p className="text-sm flex items-center gap-1 font-semibold">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            <span className="text-muted-foreground">Income:</span> ${payload[0].value?.toLocaleString()}
        </p>
        <p className="text-sm flex items-center gap-1 font-semibold">
            <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
            <span className="text-muted-foreground">Expense:</span> ${payload[1].value?.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};
