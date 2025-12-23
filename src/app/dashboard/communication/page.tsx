import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Rss, MessageSquare, Bell, ArrowRight } from "lucide-react";

const communicationFeatures = [
    { title: 'Announcements', icon: Rss, href: '/dashboard/communication/announcements', description: 'Broadcast messages to all users.' },
    { title: 'Messaging', icon: MessageSquare, href: '/dashboard/communication/messaging', description: 'Send and receive direct messages.' },
    { title: 'Notifications', icon: Bell, href: '/dashboard/communication/notifications', description: 'View system and user notifications.' },
];

export default function CommunicationPage() {
  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Communication Hub</h1>
            <p className="text-muted-foreground">Engage with teachers, parents, and students through announcements and messages.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {communicationFeatures.map(feature => (
                 <Link href={feature.href} key={feature.title}>
                    <Card className="hover:bg-muted/50 transition-colors h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base font-medium">{feature.title}</CardTitle>
                            <feature.icon className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                             <div className="flex items-center pt-4 text-sm font-medium text-primary">
                                Go to {feature.title} <ArrowRight className="h-4 w-4 ml-2" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
  );
}
