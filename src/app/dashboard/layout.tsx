'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  ChevronRight,
  Home,
  Menu,
  MoreHorizontal,
  Search,
} from 'lucide-react';
import Image from 'next/image';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { navItems } from '@/lib/placeholder-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import React from 'react';
import { NavItem } from '@/lib/types';
import { Logo } from '@/components/logo';

function NavLink({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const isParentActive =
    !!item.href && pathname.startsWith(item.href) && item.href !== '/';
  const isActive = pathname === item.href;
  const [isOpen, setIsOpen] = useState(isParentActive);

  useEffect(() => {
    setIsOpen(isParentActive);
  }, [isParentActive, pathname]);

  if (item.children && item.children.length > 0) {
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
        <CollapsibleContent className="pl-6">
          <nav className="grid gap-1 py-1">
            {item.children.map((child) => (
              <Link
                key={child.label}
                href={child.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-sm',
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
        isActive ? 'bg-secondary text-primary' : '',
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
            <Logo />
            <div className="flex flex-col">
              <span className="font-semibold text-lg">Hiigsi</span>
              <span className="text-xs text-muted-foreground">
                ID: SCH-2025
              </span>
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
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold">Need support?</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Contact our admin for assistance.
                </p>
                <Button size="sm" className="w-full mt-3">
                  Contact Admin
                </Button>
              </CardContent>
            </Card>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-auto items-center justify-start gap-3 p-2"
                >
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src="https://picsum.photos/seed/principal/100" />
                    <AvatarFallback>PA</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Principal</span>
                    <span className="text-xs text-muted-foreground">
                      admin@hiigsi.com
                    </span>
                  </div>
                  <MoreHorizontal className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Principal Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                <Logo />
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">Hiigsi</span>
                  <span className="text-xs text-muted-foreground">
                    ID: SCH-2025
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="grid items-start text-sm font-medium">
                  {navItems.map((item) => (
                    <NavLink key={item.label} item={item} pathname={pathname} />
                  ))}
                </nav>
              </div>
              <div className="mt-auto flex flex-col gap-4 p-4 border-t">
                 <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold">Need support?</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact our admin for assistance.
                    </p>
                    <Button size="sm" className="w-full mt-3">
                      Contact Admin
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="w-full appearance-none bg-background pl-10 md:w-2/3 lg:w-1/3"
                  placeholder="Search..."
                />
              </div>
            </form>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src="https://picsum.photos/seed/principal/100" />
                    <AvatarFallback>PA</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Principal Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
