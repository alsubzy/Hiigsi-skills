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
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  Users,
  CreditCard,
  DollarSign,
  Activity,
  MoreHorizontal,
  Package,
  ChevronDown,
  Filter,
  Download,
  Eye,
  Search,
} from 'lucide-react';
import {
  customerActivityData,
  kpis,
  productActivityData,
  recentTransactions,
  QuanticoLogo,
} from '@/lib/placeholder-data';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const customersActive = [
  { country: 'United Kingdom', flag: '🇬🇧', value: 12628, percentage: 80, color: 'bg-green-500' },
  { country: 'United States', flag: '🇺🇸', value: 10628, percentage: 70, color: 'bg-blue-500' },
  { country: 'Sweden', flag: '🇸🇪', value: 8628, percentage: 60, color: 'bg-purple-500' },
  { country: 'Turkey', flag: '🇹🇷', value: 6628, percentage: 40, color: 'bg-yellow-500' },
  { country: 'Spain', flag: '🇪🇸', value: 3628, percentage: 30, color: 'bg-red-500' },
];

const productChartConfig = {
  value: {
    label: 'Total Activity',
  },
  'To Be Packed': {
    label: 'To Be Packed',
    color: '#3B82F6',
  },
  'Process Delivery': {
    label: 'Process Delivery',
    color: '#EC4899',
  },
  'Delivery Done': {
    label: 'Delivery Done',
    color: '#14B8A6',
  },
  Returned: {
    label: 'Returned',
    color: '#F97316',
  },
} satisfies ChartConfig;

const customerChartConfig = {
  paid: {
    label: 'Paid product',
    color: '#3B82F6',
  },
  checkout: {
    label: 'Checkout Product',
    color: '#A78BFA',
  },
} satisfies ChartConfig;

export default function Dashboard() {
  const totalActivity = productActivityData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <div className="text-2xl font-bold">{kpi.value}</div>
              </div>
               <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
            </CardHeader>
            <CardContent className='pt-0'>
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={kpi.chartData}>
                  <Line type="monotone" dataKey="value" stroke={kpi.change.startsWith('+') ? '#22c55e' : '#ef4444'} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <p className={`text-xs ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Product Activity</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">1W</Button>
              <Button variant="secondary" size="sm">1M</Button>
              <Button variant="outline" size="sm">3W</Button>
              <Button variant="outline" size="sm">YTD</Button>
              <Button variant="outline" size="sm">Total</Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={productChartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={productActivityData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="65%"
                  strokeWidth={5}
                  activeIndex={0}
                  activeShape={({ outerRadius = 0, ...props }) => (
                    <g>
                      <circle cx={props.cx} cy={props.cy} r={outerRadius} fill={props.fill} />
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={props.innerRadius}
                        fill="var(--card)"
                      />
                    </g>
                  )}
                >
                  {productActivityData.map((entry) => (
                    <Cell key={entry.name} fill={productChartConfig[entry.name as keyof typeof productChartConfig].color} />
                  ))}
                </Pie>
                <Legend content={<></>} />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-3xl font-bold"
                >
                  {totalActivity.toLocaleString()}
                </text>
                 <text
                  x="50%"
                  y="60%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-sm"
                >
                  Total Activity
                </text>
              </PieChart>
            </ChartContainer>
             <div className="flex flex-col gap-2 text-sm mt-4">
              {productActivityData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: productChartConfig[item.name as keyof typeof productChartConfig].color }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Customers Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={customerChartConfig} className="min-h-[250px] w-full">
              <BarChart data={customerActivityData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="paid" fill="var(--color-paid)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="checkout" fill="var(--color-checkout)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
              <div>
                  <CardTitle>Recent Transaction</CardTitle>
                  <CardDescription>24</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2"><Search className="h-4 w-4"/> Search</Button>
                <Button variant="outline" size="sm" className="gap-2"><Eye className="h-4 w-4"/> Hide</Button>
                <Button variant="outline" size="sm" className="gap-2">Customize <ChevronDown className="h-4 w-4"/></Button>
                <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4"/> Export</Button>
              </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product Item</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date Checkout</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.orderId}>
                    <TableCell className="font-medium text-primary">{tx.orderId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image src={tx.product.image} alt={tx.product.name} width={40} height={40} className="rounded-md" />
                        <div>
                          <div className="font-semibold">{tx.product.name}</div>
                          <div className="text-xs text-muted-foreground">{tx.product.desc}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{tx.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={tx.customer.avatar} />
                          <AvatarFallback>{tx.customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{tx.customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tx.payment.method === 'visa' && <CreditCard className="h-5 w-5"/>}
                        {tx.payment.method === 'mastercard' && <CreditCard className="h-5 w-5"/>}
                        {tx.payment.method === 'stripe' && <QuanticoLogo className="h-5 w-5 text-purple-600"/>}
                        <span className="font-medium">{tx.payment.method.charAt(0).toUpperCase() + tx.payment.method.slice(1)}</span>
                        <span>•••• {tx.payment.last4}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tx.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
