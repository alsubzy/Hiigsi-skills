import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, FileText, Percent, Sparkles, Users } from "lucide-react";
import Link from "next/link";

const financeFeatures = [
    {
        title: "AI Fee Suggestions",
        description: "Use AI to propose new fee structures based on rich data.",
        icon: Sparkles,
        href: "/dashboard/finance/suggest-fees",
        cta: "Suggest Fees"
    },
    {
        title: "Student Invoicing",
        description: "Generate and manage invoices for student fees.",
        icon: FileText,
        href: "#",
        cta: "Manage Invoices"
    },
    {
        title: "Expense Management",
        description: "Track and manage all school-related expenses.",
        icon: Coins,
        href: "#",
        cta: "Track Expenses"
    },
    {
        title: "Discounts & Scholarships",
        description: "Manage discounts and scholarship programs for students.",
        icon: Percent,
        href: "#",
        cta: "Manage Discounts"
    }
]

export default function FinancePage() {
  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-2xl font-bold font-headline">Finance Dashboard</h1>
          <p className="text-muted-foreground">
            Manage all financial aspects of your institution.
          </p>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {financeFeatures.map((feature) => (
             <Card key={feature.title} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <feature.icon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                    <Button asChild className="w-full">
                        <Link href={feature.href}>{feature.cta}</Link>
                    </Button>
                </CardContent>
             </Card>
        ))}
      </div>
       <Card className="mt-6">
        <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
                More financial reports and tools are under development.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">We are working on features like payment gateway integration, detailed financial reports, and budgeting tools. Stay tuned!</p>
        </CardContent>
       </Card>
    </div>
  );
}
