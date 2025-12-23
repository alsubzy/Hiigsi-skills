'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Home, GraduationCap, Briefcase, BarChart2, Edit, FileText } from 'lucide-react';
import { students as allStudents, academicClasses, sections } from '@/lib/placeholder-data';
import { Student } from '@/lib/types';

const feeHistory = [
  { id: 'inv1', term: 'First Term 2024', amount: '$550.00', status: 'Paid', date: '2024-01-15' },
  { id: 'inv2', term: 'Second Term 2024', amount: '$550.00', status: 'Paid', date: '2024-04-10' },
  { id: 'inv3', term: 'Third Term 2024', amount: '$550.00', status: 'Pending', date: '2024-08-01' },
];

const examResults = [
    { subject: 'Mathematics', score: 'A', grade: '92%' },
    { subject: 'Science', score: 'A-', grade: '88%' },
    { subject: 'English', score: 'B+', grade: '85%' },
    { subject: 'History', score: 'A', grade: '95%' },
    { subject: 'Art', score: 'A+', grade: '98%' },
]

export default function StudentProfilePage() {
    const searchParams = useSearchParams();
    const studentId = searchParams.get('studentId');
    const [student, setStudent] = React.useState<Student | null>(null);

    React.useEffect(() => {
        if (studentId) {
            const foundStudent = allStudents.find(s => s.id === studentId);
            setStudent(foundStudent || null);
        }
    }, [studentId]);

    if (!student) {
        return (
            <Card className="flex items-center justify-center h-96">
                <CardContent>
                    <p>Select a student to view their profile.</p>
                </CardContent>
            </Card>
        );
    }
    
    const getClassName = (classId: string) => academicClasses.find(c => c.id === classId)?.name;
    const getSectionName = (sectionId: string) => sections.find(s => s.id === sectionId)?.name;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center space-x-6">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="text-3xl">{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <CardTitle className="text-3xl">{student.name}</CardTitle>
                        <CardDescription className="text-base">
                            ID: {student.studentId} | {getClassName(student.classId)} - {getSectionName(student.sectionId)}
                        </CardDescription>
                         <Badge variant={student.status === 'Active' ? 'default' : 'destructive'}>{student.status}</Badge>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Export Profile</Button>
                        <Button><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
                    </div>
                </CardHeader>
            </Card>

            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="fees">Fees & Payments</TabsTrigger>
                    <TabsTrigger value="results">Exam Results</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <Card>
                        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                            <InfoItem icon={User} label="Parent/Guardian" value={student.parentName} />
                            <InfoItem icon={GraduationCap} label="Admission Date" value={student.admissionDate} />
                            <InfoItem icon={Mail} label="Email Address" value={student.email} />
                            <InfoItem icon={Phone} label="Phone Number" value={student.phone} />
                            <InfoItem icon={Home} label="Address" value={student.address} />
                            <InfoItem icon={BarChart2} label="Gender" value={student.gender} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="attendance">
                    <Card>
                        <CardHeader><CardTitle>Attendance Record</CardTitle></CardHeader>
                        <CardContent>
                             <div className="flex items-center justify-center text-muted-foreground h-48">
                                <p>Attendance chart and details will be shown here.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="fees">
                    <Card>
                        <CardHeader><CardTitle>Fee & Payment History</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Term</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {feeHistory.map(fee => (
                                        <TableRow key={fee.id}>
                                            <TableCell>{fee.term}</TableCell>
                                            <TableCell>{fee.amount}</TableCell>
                                            <TableCell><Badge variant={fee.status === 'Paid' ? 'default' : 'secondary'}>{fee.status}</Badge></TableCell>
                                            <TableCell>{fee.date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="results">
                    <Card>
                        <CardHeader><CardTitle>Exam Results</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Grade</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {examResults.map(result => (
                                        <TableRow key={result.subject}>
                                            <TableCell className="font-medium">{result.subject}</TableCell>
                                            <TableCell>{result.score}</TableCell>
                                            <TableCell>{result.grade}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 text-muted-foreground mt-1" />
        <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    </div>
)
