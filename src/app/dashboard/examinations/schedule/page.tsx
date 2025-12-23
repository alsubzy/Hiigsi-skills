'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DayProps, Day as DayComponent } from 'react-day-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { academicClasses } from '@/lib/placeholder-data';

const initialExamSchedule = [
  { id: 'exs1', subject: 'Mathematics', classId: 'c3', date: new Date(2024, 9, 15), time: '09:00 AM - 11:00 AM' },
  { id: 'exs2', subject: 'Science', classId: 'c3', date: new Date(2024, 9, 16), time: '09:00 AM - 11:00 AM' },
  { id: 'exs3', subject: 'English', classId: 'c3', date: new Date(2024, 9, 17), time: '09:00 AM - 11:00 AM' },
  { id: 'exs4', subject: 'Physics', classId: 'c5', date: new Date(2024, 11, 10), time: '01:00 PM - 03:00 PM' },
  { id: 'exs5', subject: 'Chemistry', classId: 'c5', date: new Date(2024, 11, 11), time: '01:00 PM - 03:00 PM' },
];


export default function ExamSchedulePage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = React.useState<string>('c3');
  const [examSchedule, setExamSchedule] = React.useState<typeof initialExamSchedule>([]);

  React.useEffect(() => {
    // Initialize schedule on the client to avoid hydration issues with Dates
    setExamSchedule(initialExamSchedule);
  }, []);


  const filteredExams = examSchedule.filter(exam => exam.classId === selectedClass);

  const examsForSelectedDate = date
    ? filteredExams.filter(e => format(e.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
    : [];

  function Day(props: DayProps) {
    const { date, displayMonth } = props;
    const [hasExam, setHasExam] = React.useState(false);

    React.useEffect(() => {
      if (!date || !displayMonth) return;
      try {
        const isCurrentMonth = date.getMonth() === displayMonth.getMonth();
        if (isCurrentMonth) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const examExists = filteredExams.some((e: any) => format(e.date, 'yyyy-MM-dd') === formattedDate);
            setHasExam(examExists);
        } else {
            setHasExam(false);
        }
      } catch (error) {
        setHasExam(false);
      }
    }, [date, displayMonth, filteredExams]);
    
    if (!date) {
      return <DayComponent {...props} />;
    }

    return (
        <div className="relative">
            <DayComponent {...props} />
            {hasExam && (
            <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            )}
        </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Exam Schedule</CardTitle>
                <CardDescription>View the schedule for upcoming examinations.</CardDescription>
              </div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {academicClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              components={{
                Day,
              }}
            />
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Exams for {date ? format(date, 'MMMM d, yyyy') : 'Today'}</CardTitle>
          </CardHeader>
          <CardContent>
            {examsForSelectedDate.length > 0 ? (
              <ul className="space-y-4">
                {examsForSelectedDate.map(exam => (
                  <li key={exam.id} className="rounded-lg border p-4 space-y-2">
                    <p className="font-semibold">{exam.subject}</p>
                    <p className="text-sm text-muted-foreground">{exam.time}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-10">
                <p>No exams scheduled for this day.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
