'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { timetableData as initialTimetableData, timeSlots, users as allUsers } from '@/lib/placeholder-data';
import type { TimetableEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function TeacherTimetablePage() {
  const teachers = allUsers.filter(u => u.role === 'Teacher');
  const [selectedTeacher, setSelectedTeacher] = React.useState<string>(teachers[0].name);

  // Function to filter timetable data for the selected teacher
  const getTeacherTimetable = () => {
    return initialTimetableData.map(dayEntry => {
      const newDayEntry: TimetableEntry = { day: dayEntry.day };
      timeSlots.forEach(time => {
        const slot = dayEntry[time];
        if (typeof slot === 'object' && slot.teacher === selectedTeacher) {
          newDayEntry[time] = slot;
        } else if (time === '12:00') {
            newDayEntry[time] = 'Lunch';
        }
      });
      return newDayEntry;
    });
  };

  const teacherTimetable = getTeacherTimetable();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Teacher Timetable</CardTitle>
            <CardDescription>View the weekly schedule for a specific teacher.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline">Print Timetable</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Day</TableHead>
                {timeSlots.map(time => (
                  <TableHead key={time} className="text-center">{time}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {teacherTimetable.map(row => (
                <TableRow key={row.day}>
                  <TableCell className="font-semibold">{row.day}</TableCell>
                  {timeSlots.map(time => {
                    const entry = row[time];
                    const isLunch = time === '12:00';
                    return (
                      <TableCell 
                        key={time} 
                        className={`p-1 text-center h-24 border ${isLunch ? 'bg-muted/50' : ''}`}
                      >
                        {typeof entry === 'object' ? (
                          <div className="flex flex-col items-center justify-center h-full text-xs bg-primary/10 rounded-md">
                            <p className="font-bold text-sm">{entry.subject}</p>
                            <p className="text-muted-foreground">Grade 7</p>
                          </div>
                        ) : isLunch ? (
                          <div className="flex items-center justify-center h-full font-semibold">LUNCH</div>
                        ) : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

    