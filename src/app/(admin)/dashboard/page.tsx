"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BusinessDataTable } from "@/components/business-data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell } from "recharts";
import { Building2, CheckCircle, Clock, XCircle, TrendingUp, Users, Plus, Eye } from "lucide-react";

export default function AdminDashboard() {
  const businesses = useQuery(api.businesses.get);
  const stats = useQuery(api.analytics.getDashboardStats);
  const { t } = useI18n();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const language = "en";

  const totalBusinesses = stats?.totalBusinesses || 0;
  const verifiedBusinesses = stats?.verifiedBusinesses || 0;
  const statusCounts = {
    active: stats?.statusCounts.find((item) => item.name === "active")?.value || 0,
    pending: stats?.statusCounts.find((item) => item.name === "pending")?.value || 0,
    inactive: stats?.statusCounts.find((item) => item.name === "inactive")?.value || 0,
  };

  const percentOfTotal = (value: number) => (totalBusinesses > 0 ? ((value / totalBusinesses) * 100).toFixed(1) : "0.0");
  const activePercentage = percentOfTotal(statusCounts.active);
  const pendingPercentage = percentOfTotal(statusCounts.pending);
  const inactivePercentage = percentOfTotal(statusCounts.inactive);

  const statusChartData = [
    { name: "Active", value: statusCounts.active, percentage: activePercentage, color: "#22c55e" },
    { name: "Pending", value: statusCounts.pending, percentage: pendingPercentage, color: "#f59e0b" },
    { name: "Inactive", value: statusCounts.inactive, percentage: inactivePercentage, color: "#ef4444" },
  ];

  const recentBusinesses = stats?.recentActivity || [];

  if (!businesses || !stats) {
    return (
      <div className="min-h-screen antialiased font-sans bg-background text-foreground flex flex-1 flex-col">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center px-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="ml-auto">
              <Skeleton className="h-9 w-40" />
            </div>
          </div>
        </div>

        <main className="@container/main flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-4" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-4 w-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const text = {
    en: {
      title: t("adminDashboard"),
      subtitle: t("adminBusinesses"),
      addBusiness: t("adminAddBusiness"),
      searchPlaceholder: t("adminSearchBusinesses"),
      allCategories: t("adminAllCategories"),
      businessName: t("adminBusinesses"),
      businessNameTagalog: t("adminBusinesses"),
      category: t("adminCategory"),
      description: t("adminBusinessStatus"),
      descriptionTagalog: t("adminBusinessStatus"),
      address: t("adminBusinessStatus"),
      phone: t("adminBusinessStatus"),
      hours: t("adminBusinessStatus"),
      rating: t("adminBusinessStatus"),
      featured: t("adminVerified"),
      status: t("adminStatus"),
      active: t("adminActive"),
      pending: t("adminPendingReview"),
      inactive: t("adminInactive"),
      save: t("adminSave"),
      cancel: t("adminCancel"),
      edit: t("adminEdit"),
      delete: t("adminDelete"),
      confirmDelete: t("adminConfirmDelete"),
      businessSaved: t("adminBusinessSaved"),
      businessDeleted: t("adminBusinessDeleted"),
      backToHome: t("backToHome"),
      verified: t("adminVerified"),
      unverified: t("adminUnverified"),
      toggleStatus: t("adminStatus"),
      toggleVerified: t("adminVerified"),
      closed: t("closed"),
    },
    tl: {
      title: t("adminDashboard"),
      subtitle: t("adminBusinesses"),
      addBusiness: t("adminAddBusiness"),
      searchPlaceholder: t("adminSearchBusinesses"),
      allCategories: t("adminAllCategories"),
      businessName: t("adminBusinesses"),
      businessNameTagalog: t("adminBusinesses"),
      category: t("adminCategory"),
      description: t("adminBusinessStatus"),
      descriptionTagalog: t("adminBusinessStatus"),
      address: t("adminBusinessStatus"),
      phone: t("adminBusinessStatus"),
      hours: t("adminBusinessStatus"),
      rating: t("adminBusinessStatus"),
      featured: t("adminVerified"),
      status: t("adminStatus"),
      active: t("adminActive"),
      pending: t("adminPendingReview"),
      inactive: t("adminInactive"),
      save: t("adminSave"),
      cancel: t("adminCancel"),
      edit: t("adminEdit"),
      delete: t("adminDelete"),
      confirmDelete: t("adminConfirmDelete"),
      businessSaved: t("adminBusinessSaved"),
      businessDeleted: t("adminBusinessDeleted"),
      backToHome: t("backToHome"),
      verified: t("adminVerified"),
      unverified: t("adminUnverified"),
      toggleStatus: t("adminStatus"),
      toggleVerified: t("adminVerified"),
      closed: t("closed"),
    },
  };

  return (
    <div className="min-h-screen antialiased font-sans bg-background text-foreground flex flex-1 flex-col">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center px-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">{text[language].title}</h1>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <Button asChild size="sm" className="bg-primary text-primary-foreground">
                <Link href={`/${locale}/admin/businesses/add`}>
                  <Plus className="h-4 w-4 mr-2" />
                  {text[language].addBusiness}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <main className="@container/main flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground">{text[language].subtitle}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBusinesses}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{verifiedBusinesses}</div>
                <p className="text-xs text-muted-foreground">
                  {percentOfTotal(verifiedBusinesses)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{statusCounts.inactive}</div>
                <p className="text-xs text-muted-foreground">
                  Need attention
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Business Status Distribution</CardTitle>
                <CardDescription>
                  Overview of business statuses across the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    active: {
                      label: "Active",
                      color: "#22c55e",
                    },
                    pending: {
                      label: "Pending",
                      color: "#f59e0b",
                    },
                    inactive: {
                      label: "Inactive",
                      color: "#ef4444",
                    },
                  }}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    {data.name}
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    {data.value} ({data.percentage}%)
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Pie
                      data={statusChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      strokeWidth={5}
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Businesses</CardTitle>
                <CardDescription>
                  Latest business registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBusinesses.map((business) => (
                    <div key={business.id} className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {business.name || "Unnamed Business"}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              business.status === "active"
                                ? "default"
                                : business.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {business.status || "unknown"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(business.dateAdded).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={`/${locale}/admin/businesses`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View All Businesses
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/${locale}/admin/analytics`}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/${locale}/admin/users`}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

          <BusinessDataTable data={businesses} />
        </main>
      </div>
  );
}
