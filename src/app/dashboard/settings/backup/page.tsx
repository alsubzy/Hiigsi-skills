'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, History, PlayCircle, RotateCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const backupHistory = [
    { id: 'bkp1', date: '2024-07-20 10:00 AM', status: 'Completed', size: '256 MB', initiatedBy: 'Admin' },
    { id: 'bkp2', date: '2024-07-19 10:00 AM', status: 'Completed', size: '254 MB', initiatedBy: 'System' },
    { id: 'bkp3', date: '2024-07-18 09:45 AM', status: 'Failed', size: 'N/A', initiatedBy: 'System' },
];

export default function BackupRestorePage() {
    const { toast } = useToast();
    const [isBackingUp, setIsBackingUp] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    const handleBackup = () => {
        setIsBackingUp(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsBackingUp(false);
                    toast({ title: 'Backup Complete', description: 'Your data has been successfully backed up.' });
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Backup & Restore</CardTitle>
                    <CardDescription>Manage database backups and restore previous versions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 border rounded-lg flex flex-col items-center text-center">
                            <Database className="h-12 w-12 text-primary mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Create a New Backup</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Immediately create a full backup of the application database.
                            </p>
                            <Button onClick={handleBackup} disabled={isBackingUp}>
                                {isBackingUp ? 'Backing Up...' : 'Start Backup'}
                            </Button>
                             {isBackingUp && <Progress value={progress} className="w-full mt-4" />}
                        </div>
                        <div className="p-6 border rounded-lg flex flex-col items-center text-center">
                             <PlayCircle className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Automated Backups</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                The system is configured to perform automated daily backups.
                            </p>
                            <Button variant="outline">Configure Schedule</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Backup History</CardTitle>
                    <CardDescription>Review past backups and restore or download them.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Initiated By</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {backupHistory.map(backup => (
                                <TableRow key={backup.id}>
                                    <TableCell>{backup.date}</TableCell>
                                    <TableCell>{backup.status}</TableCell>
                                    <TableCell>{backup.size}</TableCell>
                                    <TableCell>{backup.initiatedBy}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Download</Button>
                                        <Button variant="destructive" size="sm" disabled={backup.status === 'Failed'}><RotateCcw className="mr-2 h-4 w-4" /> Restore</Button>
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
    