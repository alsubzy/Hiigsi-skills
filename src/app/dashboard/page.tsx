'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  GraduationCap,
  DollarSign,
  ClipboardCheck,
} from 'lucide-react';
import { enrollmentData } from '@/lib/placeholder-data';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

const kpis = [
  {
    title: 'Total Students',
    value: '1,254',
    icon: Users,
    description: '+20.1% from last month',
  },
  {
    title: 'Total Staff',
    value: '82',
    icon: GraduationCap,
    description: '+1.5% from last month',
  },
  {
    title: 'Monthly Revenue',
    value: '$52,345',
    icon: DollarSign,
    description: '+12% from last month',
  },
  {
    title: 'Attendance Rate',
    value: '96.8%',
    icon: ClipboardCheck,
    description: 'Today\'s average rate',
  },
];

const chartConfig = {
  "Total Students": {
    label: "Total Students",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Enrollment Trends</CardTitle>
            <CardDescription>
              A yearly overview of student enrollment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart data={enrollmentData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
                <Bar dataKey="Total Students" fill="var(--color-Total-Students)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
