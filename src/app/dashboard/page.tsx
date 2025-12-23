'use client';

import {
  Card,
  CardContent,
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
  MoreHorizontal,
  ArrowRight,
  Heart,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  PenSquare,
  Users2,
  LogOut,
  Settings
} from 'lucide-react';
import {
  progressCards,
  continueWatching,
  yourLessons,
  mentorData
} from '@/lib/placeholder-data';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
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
import Link from 'next/link';

const chartConfig = {
  value: {
    label: 'Visitors',
  },
} satisfies ChartConfig;

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="col-span-1 lg:col-span-2 space-y-6">
        <Card className="bg-primary text-primary-foreground" style={{backgroundColor: '#6A67F3'}}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">ONLINE COURSE</p>
                <h2 className="text-3xl font-bold max-w-md mt-2">Sharpen Your Skills with Professional Online Courses</h2>
              </div>
              <div className="hidden sm:block">
                <Image src="https://picsum.photos/seed/sparkles/100/100" alt="Sparkles" width={80} height={80} />
              </div>
            </div>
            <Button variant="secondary" className="mt-6 bg-white text-primary hover:bg-white/90">
              Join Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {progressCards.map((card) => (
            <Card key={card.title}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                   <div className="p-3 rounded-lg" style={{backgroundColor: card.bgColor, color: card.iconColor}}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-4">{card.progress} watched</p>
                <h3 className="text-lg font-semibold">{card.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Continue Watching</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {continueWatching.map((course) => (
              <Card key={course.title}>
                <CardContent className="p-0">
                  <div className="relative">
                    <Image src={course.image} alt={course.title} width={300} height={150} className="w-full h-32 object-cover rounded-t-lg" />
                    <Button variant="secondary" size="icon" className="absolute top-2 right-2 h-8 w-8 bg-white/50 backdrop-blur-sm">
                      <Heart className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <Badge variant="outline" className="mb-2" style={{color: course.tagColor, borderColor: course.tagColor, backgroundColor: course.tagBgColor }}>{course.tag}</Badge>
                    <h4 className="font-semibold">{course.title}</h4>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={course.mentor.avatar} />
                        <AvatarFallback>{course.mentor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{course.mentor.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
           <h3 className="text-xl font-bold mb-4">Your Lesson</h3>
            <Card>
                <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>MENTOR</TableHead>
                        <TableHead>TYPE</TableHead>
                        <TableHead>DESC</TableHead>
                        <TableHead>ACTION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {yourLessons.map((lesson) => (
                        <TableRow key={lesson.mentor.name}>
                            <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                <AvatarImage src={lesson.mentor.avatar} alt={lesson.mentor.name} />
                                <AvatarFallback>{lesson.mentor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                <div className="font-semibold">{lesson.mentor.name}</div>
                                <div className="text-xs text-muted-foreground">{lesson.mentor.date}</div>
                                </div>
                            </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" style={{color: lesson.type.color, borderColor: lesson.type.color, backgroundColor: lesson.type.bgColor }}>{lesson.type.label}</Badge>
                            </TableCell>
                            <TableCell>{lesson.desc}</TableCell>
                            <TableCell>
                            <Button variant="ghost" size="icon">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

      </div>
      <div className="col-span-1 space-y-6">
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Statistic</h3>
                    <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-card">
                            <AvatarImage src="https://picsum.photos/seed/jason/100" />
                            <AvatarFallback>JR</AvatarFallback>
                        </Avatar>
                        <Badge className="absolute -top-1 -right-2 bg-primary">32%</Badge>
                    </div>
                    <h4 className="font-semibold mt-4">Good Morning Jason 🔥</h4>
                    <p className="text-xs text-muted-foreground">Continue your learning to achieve your target!</p>
                </div>
                 <ChartContainer config={chartConfig} className="h-[120px] w-full mt-4">
                    <BarChart accessibilityLayer data={[{'1-10 Aug': 45}, {'11-20 Aug': 55}, {'21-30 Aug': 30}]}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis hide/>
                        <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="value" fill="#6A67F3" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Your mentor</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-5 w-5" /></Button>
                </div>
                <div className="space-y-4">
                    {mentorData.map(mentor => (
                        <div key={mentor.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={mentor.avatar} />
                                    <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{mentor.name}</p>
                                    <p className="text-xs text-muted-foreground">{mentor.role}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Follow</Button>
                        </div>
                    ))}
                </div>
                <Button variant="link" className="w-full mt-2">See All</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}