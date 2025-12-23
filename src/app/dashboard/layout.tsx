'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Home,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { navItems, QuanticoLogo } from '@/lib/placeholder-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';

function NavLink({
  item,
  pathname,
}: {
  item: (typeof navItems)[0];
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(pathname.startsWith(item.href));
  const isParentActive = pathname.startsWith(item.href);

  if (item.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant={isParentActive ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-3 rounded-lg px-3"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
            <ChevronRight
              className={cn(
                'ml-auto h-4 w-4 transition-transform',
                isOpen && 'rotate-90'
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4">
          <nav className="grid gap-1 py-1">
            {item.children.map((child) => (
              <Link
                key={child.label}
                href={child.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname === child.href ? 'bg-muted text-primary' : ''
                )}
              >
                {child.label}
              </Link>
            ))}
          </nav>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      key={item.label}
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        pathname === item.href ? 'bg-secondary text-primary' : '',
        'font-medium'
      )}
    >
      <item.icon className="h-5 w-5" />
      {item.label}
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center gap-2 border-b px-4 lg:px-6">
            <QuanticoLogo />
            <div className='flex flex-col'>
              <span className="font-semibold">Quantico</span>
              <span className="text-xs text-muted-foreground">ID: CMP-1006</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start p-2 text-sm font-medium lg:p-4">
              {navItems.map((item) => (
                <NavLink key={item.label} item={item} pathname={pathname} />
              ))}
            </nav>
          </div>
          <div className="mt-auto flex flex-col gap-4 p-4">
            <Card className="bg-muted">
              <CardHeader className="p-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CircleHelp className="h-5 w-5" />
                  Need setup help?
                </CardTitle>
                <CardDescription className="text-xs">
                  Get your questions answered in a 1:1 call with our team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button size="sm" className="w-full">
                  Schedule a call
                </Button>
              </CardContent>
            </Card>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src="https://picsum.photos/seed/nathan/100/100" />
                <AvatarFallback>NS</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">Nathan Scott</span>
                <span className="text-xs text-muted-foreground">scott@example.com</span>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <MoreHorizontal className="h-5 w-5"/>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <div className="flex h-16 items-center gap-2 border-b px-4">
                <QuanticoLogo />
                 <div className='flex flex-col'>
                  <span className="font-semibold">Quantico</span>
                  <span className="text-xs text-muted-foreground">ID: CMP-1006</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <nav className="grid items-start p-4 text-sm font-medium">
                  {navItems.map((item) => (
                    <NavLink key={item.label} item={item} pathname={pathname} />
                  ))}
                </nav>
              </div>
              <div className="mt-auto flex flex-col gap-4 p-4">
                <Card className="bg-muted">
                  <CardHeader className="p-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CircleHelp className="h-5 w-5" />
                      Need setup help?
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Get your questions answered in a 1:1 call with our team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Button size="sm" className="w-full">
                      Schedule a call
                    </Button>
                  </CardContent>
                </Card>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src="https://picsum.photos/seed/nathan/100/100" />
                    <AvatarFallback>NS</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold">Nathan Scott</span>
                    <span className="text-xs text-muted-foreground">scott@example.com</span>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <MoreHorizontal className="h-5 w-5"/>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Link href="#" className="text-foreground"><Home className="h-5 w-5" /></Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/dashboard" className="text-foreground">Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Analytics</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex -space-x-2">
              <Avatar className="h-8 w-8 border-2 border-card">
                <AvatarImage src="https://picsum.photos/seed/user1/100" />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-card">
                <AvatarImage src="https://picsum.photos/seed/user2/100" />
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-card">
                <AvatarImage src="https://picsum.photos/seed/user3/100" />
                <AvatarFallback>U3</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-card">
                <AvatarFallback>+9</AvatarFallback>
              </Avatar>
            </div>
            <Button>Invite</Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
