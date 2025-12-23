'use client';

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { users as allUsers } from '@/lib/placeholder-data';

const performanceData = [
  { name: 'Jan', score: 85 }, { name: 'Feb', score: 88 }, { name: 'Mar', score: 92 },
  { name: 'Apr', score: 90 }, { name: 'May', score: 95 }, { name: 'Jun', score: 91 },
];

const evaluationHistory = [
    { id: 'ev1', date: '2024-05-15', evaluatedBy: 'Dr. Evelyn Reed', summary: 'Excellent student engagement and lesson planning.', rating: 'Outstanding' },
    { id: 'ev2', date: '2023-11-20', evaluatedBy: 'Dr. Evelyn Reed', summary: 'Good classroom management. Needs improvement in parent communication.', rating: 'Satisfactory' },
];

export default function PerformanceEvaluationPage() {
  const teachers = allUsers.filter(u => u.role === 'Teacher');
  const [selectedTeacher, setSelectedTeacher] = React.useState<string>(teachers[0].name);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Teacher Performance Evaluation</CardTitle>
              <CardDescription>Track and analyze teacher performance over time.</CardDescription>
            </div>
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="hsl(var(--primary))" name="Monthly Performance Score" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Evaluation History</CardTitle>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Evaluation Record
                </Button>
              </div>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Evaluated By</TableHead>
                          <TableHead>Summary</TableHead>
                          <TableHead>Overall Rating</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {evaluationHistory.map(record => (
                          <TableRow key={record.id}>
                              <TableCell>{record.date}</TableCell>
                              <TableCell>{record.evaluatedBy}</TableCell>
                              <TableCell className="max-w-sm truncate">{record.summary}</TableCell>
                              <TableCell>
                                  <Badge variant={record.rating === 'Outstanding' ? 'default' : 'secondary'}>
                                      {record.rating}
                                  </Badge>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
    </div>
  );
}

    