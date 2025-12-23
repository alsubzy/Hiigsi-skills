import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Badge } from '@/components/ui/badge';
  import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { MoreHorizontal, PlusCircle } from 'lucide-react';
  import { users } from '@/lib/placeholder-data';
  import { cn } from '@/lib/utils';
  
  export default function UsersPage() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-headline">User Management</h1>
            <p className="text-muted-foreground">
              Manage all staff, parent, and student accounts.
            </p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              A list of all users in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Email
                  </TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Last Login
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === 'Active' ? 'default' : 'destructive'
                        }
                        className={cn(
                          user.status === 'Active'
                            ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:bg-green-500/10 dark:text-green-400'
                            : 'bg-gray-500/20 text-gray-700 hover:bg-gray-500/30 dark:bg-gray-500/10 dark:text-gray-400'
                        )}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
  