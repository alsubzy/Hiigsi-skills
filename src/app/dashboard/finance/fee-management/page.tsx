'use client';

import * as React from 'react';
import { MoreHorizontal, PlusCircle, Wallet } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const categorySchema = z.object({
    name: z.string().min(2, 'Category name is required.'),
    description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const structureSchema = z.object({
    classId: z.string().min(1, 'Class is required.'),
    categoryId: z.string().min(1, 'Category is required.'),
    amount: z.coerce.number().min(0, 'Amount must be positive.'),
    frequency: z.string().min(1, 'Frequency is required.'),
});

type StructureFormValues = z.infer<typeof structureSchema>;

export default function FeeManagementPage() {
    const { toast } = useToast();
    const [categories, setCategories] = React.useState<any[]>([]);
    const [structures, setStructures] = React.useState<any[]>([]);
    const [classes, setClasses] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);
    const [isStructureDialogOpen, setIsStructureDialogOpen] = React.useState(false);

    const categoryForm = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: '', description: '' },
    });

    const structureForm = useForm<StructureFormValues>({
        resolver: zodResolver(structureSchema),
        defaultValues: { classId: '', categoryId: '', amount: 0, frequency: 'Term' },
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [catRes, structRes, classRes] = await Promise.all([
                fetch('/api/finance/fees'),
                fetch('/api/finance/fees/structures'), // I need to create this API
                fetch('/api/academics/classes')
            ]);
            if (catRes.ok) setCategories(await catRes.json());
            if (structRes.ok) setStructures(await structRes.json());
            if (classRes.ok) setClasses(await classRes.json());
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const onCategorySubmit = async (data: CategoryFormValues) => {
        try {
            const res = await fetch('/api/finance/fees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                toast({ title: 'Category Created' });
                fetchData();
                categoryForm.reset();
                setIsCategoryDialogOpen(false);
            }
        } catch (error) {
            toast({ title: 'Error', variant: 'destructive' });
        }
    };

    const onStructureSubmit = async (data: StructureFormValues) => {
        try {
            const res = await fetch('/api/finance/fees/structures', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                toast({ title: 'Fee Structure Created' });
                fetchData();
                structureForm.reset();
                setIsStructureDialogOpen(false);
            }
        } catch (error) {
            toast({ title: 'Error', variant: 'destructive' });
        }
    };

    if (isLoading) return <div>Loading finance data...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fee Categories */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Fee Categories</CardTitle>
                            <CardDescription>Define types of fees (e.g., Tuition, Library).</CardDescription>
                        </div>
                        <Button size="sm" onClick={() => setIsCategoryDialogOpen(true)}><PlusCircle className="h-4 w-4 mr-2" /> Add</Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category Name</TableHead>
                                    <TableHead>Description</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map(cat => (
                                    <TableRow key={cat.id}>
                                        <TableCell className="font-medium">{cat.name}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{cat.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Fee Structures */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Fee Structures</CardTitle>
                            <CardDescription>Set fee amounts per class.</CardDescription>
                        </div>
                        <Button size="sm" onClick={() => setIsStructureDialogOpen(true)}><PlusCircle className="h-4 w-4 mr-2" /> Set Fee</Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {structures.map(struct => (
                                    <TableRow key={struct.id}>
                                        <TableCell>{classes.find(c => c.id === struct.classId)?.name || 'N/A'}</TableCell>
                                        <TableCell>{categories.find(c => c.id === struct.categoryId)?.name || 'N/A'}</TableCell>
                                        <TableCell className="font-bold">${struct.amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Category Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Add Fee Category</DialogTitle></DialogHeader>
                    <Form {...categoryForm}>
                        <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
                            <FormField control={categoryForm.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={categoryForm.control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <DialogFooter><Button type="submit">Create Category</Button></DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Structure Dialog */}
            <Dialog open={isStructureDialogOpen} onOpenChange={setIsStructureDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Set Fee Structure</DialogTitle></DialogHeader>
                    <Form {...structureForm}>
                        <form onSubmit={structureForm.handleSubmit(onStructureSubmit)} className="space-y-4">
                            <FormField control={structureForm.control} name="classId" render={({ field }) => (
                                <FormItem><FormLabel>Class</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger></FormControl>
                                        <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
                                    <FormMessage /></FormItem>
                            )} />
                            <FormField control={structureForm.control} name="categoryId" render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                                        <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
                                    <FormMessage /></FormItem>
                            )} />
                            <FormField control={structureForm.control} name="amount" render={({ field }) => (
                                <FormItem><FormLabel>Amount ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <DialogFooter><Button type="submit">Set Fee</Button></DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
