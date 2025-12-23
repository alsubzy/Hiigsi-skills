import {
  LayoutDashboard,
  BarChart2,
  Package,
  ShoppingBag,
  Users,
  Banknote,
  Settings,
  HelpCircle,
  Home,
  AreaChart,
  Boxes,
  FileText,
  Ticket,
  Contact,
  Star,
  Receipt,
} from 'lucide-react';
import { cn } from './utils';

export const navItems = [
  { href: '/dashboard/home', label: 'Home', icon: Home },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      { href: '/dashboard', label: 'Analytics' },
      { href: '/dashboard/sales', label: 'Sales Overview' },
      { href: '/dashboard/products-overview', label: 'Top Products' },
      { href: '/dashboard/stock', label: 'Stock Status' },
    ],
  },
  {
    href: '/dashboard/analytics',
    label: 'Analytics',
    icon: AreaChart,
  },
  { href: '/dashboard/products', label: 'Products', icon: Boxes },
  { href: '/dashboard/categories', label: 'Categories', icon: FileText },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/dashboard/taxes', label: 'Taxes', icon: Ticket },
  { href: '/dashboard/customers', label: 'Customers', icon: Contact },
  { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/payments', label: 'Payments', icon: Receipt },
];

export const kpis = [
  {
    title: 'Nominal Balance',
    value: '7,500.00 USD',
    change: '+1.19%',
    chartData: [
      { value: 10 }, { value: 20 }, { value: 15 }, { value: 30 },
      { value: 25 }, { value: 40 }, { value: 35 },
    ],
  },
  {
    title: 'Total Stock Product',
    value: '3,142 ITEMS',
    change: '+0.29%',
    chartData: [
      { value: 10 }, { value: 15 }, { value: 12 }, { value: 20 },
      { value: 18 }, { value: 25 }, { value: 22 },
    ],
  },
  {
    title: 'Nominal Revenue',
    value: '21,430.00 USD',
    change: '+0.29%',
     chartData: [
      { value: 5 }, { value: 15 }, { value: 10 }, { value: 25 },
      { value: 20 }, { value: 35 }, { value: 30 },
    ],
  },
  {
    title: 'Nominal Expense',
    value: '12,980.00 USD',
    change: '-0.15%',
    chartData: [
      { value: 40 }, { value: 30 }, { value: 35 }, { value: 20 },
      { value: 25 }, { value: 15 }, { value: 10 },
    ],
  },
];

export const productActivityData = [
    { name: 'To Be Packed', value: 110000, fill: '#3B82F6' },
    { name: 'Process Delivery', value: 98000, fill: '#EC4899' },
    { name: 'Delivery Done', value: 140000, fill: '#14B8A6' },
    { name: 'Returned', value: 67236, fill: '#F97316' },
];

export const customerActivityData = [
    { month: 'Apr 2025', paid: 900, checkout: 1100 },
    { month: 'May 2025', paid: 1500, checkout: 1800 },
    { month: 'Jun 2025', paid: 1200, checkout: 1000 },
    { month: 'Jul 2025', paid: 1100, checkout: 1400 },
    { month: 'Aug 2025', paid: 900, checkout: 1200 },
    { month: 'Sep 2025', paid: 1600, checkout: 1900 },
    { month: 'Oct 2025', paid: 1300, checkout: 1500 },
];

export const recentTransactions = [
    {
        orderId: 'AR-47380416-61',
        product: { name: 'Meta Quest 3', desc: '512Gb - White', image: 'https://picsum.photos/seed/quest3/40' },
        price: '$499.00',
        customer: { name: 'Liam Smith', avatar: 'https://picsum.photos/seed/liam/40' },
        date: '02 Apr 2025, 8:15 am',
        payment: { method: 'visa', last4: '4321' },
        email: 'smith@example.com'
    },
    {
        orderId: 'AR-30631995-17',
        product: { name: 'iPhone 15 Pro Max', desc: '512Gb - eSIM', image: 'https://picsum.photos/seed/iphone15/40' },
        price: '$1,399.00',
        customer: { name: 'Lily Thompson', avatar: 'https://picsum.photos/seed/lily/40' },
        date: '06 Apr 2025, 6:45 pm',
        payment: { method: 'mastercard', last4: '8890' },
        email: 'thom@example.com'
    },
    {
        orderId: 'AR-79609316-32',
        product: { name: 'MacBook Air M3 (13")', desc: 'M3 chip - Ultra-light', image: 'https://picsum.photos/seed/macbook/40' },
        price: '$1,299.00',
        customer: { name: 'Lucas Young', avatar: 'https://picsum.photos/seed/lucas/40' },
        date: '10 Apr 2025, 11:30 am',
        payment: { method: 'visa', last4: '1023' },
        email: 'young@example.com'
    },
    {
        orderId: 'AR-17288760-13',
        product: { name: 'AirPods Pro', desc: '2nd Gen - USB-C case', image: 'https://picsum.photos/seed/airpods/40' },
        price: '$229.00',
        customer: { name: 'Isabella Garcia', avatar: 'https://picsum.photos/seed/isabella/40' },
        date: '14 Apr 2025, 7:50 pm',
        payment: { method: 'visa', last4: '5678' },
        email: 'garcia@example.com'
    },
    {
        orderId: 'AR-24593385-96',
        product: { name: 'Apple Vision Pro', desc: 'AR Headset', image: 'https://picsum.photos/seed/visionpro/40' },
        price: '$3,499.00',
        customer: { name: 'Amelia Davis', avatar: 'https://picsum.photos/seed/amelia/40' },
        date: '18 Apr 2025, 9:05 am',
        payment: { method: 'mastercard', last4: '3301' },
        email: 'davis@example.com'
    },
     {
        orderId: 'AR-57722590-75',
        product: { name: 'Oura Ring 4', desc: 'Health Wearable', image: 'https://picsum.photos/seed/ouraring/40' },
        price: '$399.00',
        customer: { name: 'Caleb Turner', avatar: 'https://picsum.photos/seed/caleb/40' },
        date: '22 Apr 2025, 10:10 pm',
        payment: { method: 'stripe', last4: '9823' },
        email: 'turner@example.com'
    },
];

export function QuanticoLogo({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white', className)}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 12H18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 6V18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.6568 6.34315L6.34315 17.6568" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.6568 17.6568L6.34315 6.34315" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
