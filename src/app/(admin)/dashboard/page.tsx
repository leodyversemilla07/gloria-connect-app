"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BusinessDataTable } from "@/components/business-data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell } from "recharts";
import { Building2, CheckCircle, Clock, XCircle, TrendingUp, Users, Plus, Eye } from "lucide-react";

export default function AdminDashboard() {
  const businesses = useQuery(api.businesses.get);

  // Removed searchTerm and selectedCategory, not needed for dashboard
  const [language] = useState<"en" | "tl">("en");

  // Dashboard summary stats
  const totalBusinesses = businesses?.length || 0;
  const verifiedBusinesses = businesses?.filter((b) => b.metadata?.isVerified).length || 0;
  const statusCounts = businesses ? {
    active: businesses.filter((b) => b.metadata?.status === "active").length,
    pending: businesses.filter((b) => b.metadata?.status === "pending").length,
    inactive: businesses.filter((b) => b.metadata?.status === "inactive").length,
  } : { active: 0, pending: 0, inactive: 0 };

  // Calculate additional metrics
  const activePercentage = totalBusinesses > 0 ? ((statusCounts.active / totalBusinesses) * 100).toFixed(1) : "0";
  const pendingPercentage = totalBusinesses > 0 ? ((statusCounts.pending / totalBusinesses) * 100).toFixed(1) : "0";
  const inactivePercentage = totalBusinesses > 0 ? ((statusCounts.inactive / totalBusinesses) * 100).toFixed(1) : "0";

  // Chart data for business status distribution
  const statusChartData = [
    { name: "Active", value: statusCounts.active, percentage: activePercentage, color: "#22c55e" },
    { name: "Pending", value: statusCounts.pending, percentage: pendingPercentage, color: "#f59e0b" },
    { name: "Inactive", value: statusCounts.inactive, percentage: inactivePercentage, color: "#ef4444" },
  ];

  // Recent businesses (last 5)
  const recentBusinesses = businesses
    ? businesses
        .sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0))
        .slice(0, 5)
    : [];

  // Handle loading state
  if (!businesses) {
    return (
      <div className="min-h-screen antialiased font-sans bg-background text-foreground flex flex-1 flex-col">
        {/* Dashboard Header */}
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

        {/* Dashboard Main */}
        <main className="@container/main flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Summary Cards Skeleton */}
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

          {/* Charts and Recent Activity Skeleton */}
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
      title: "Admin Dashboard",
      subtitle: "Manage business listings for Gloria Local Connect",
      addBusiness: "Add New Business",
      searchPlaceholder: "Search businesses...",
      allCategories: "All Categories",
      businessName: "Business Name",
      businessNameTagalog: "Business Name (Tagalog)",
      category: "Category",
      description: "Description",
      descriptionTagalog: "Description (Tagalog)",
      address: "Address",
      phone: "Phone Number",
      hours: "Operating Hours",
      rating: "Rating",
      featured: "Featured",
      status: "Status",
      active: "Active",
      pending: "Pending",
      inactive: "Inactive",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this business?",
      businessSaved: "Business saved successfully!",
      businessDeleted: "Business deleted successfully!",
      backToHome: "Back to Home",
      verified: "Verified",
      unverified: "Unverified",
      toggleStatus: "Click to cycle status",
      toggleVerified: "Click to toggle verification",
      closed: "Closed",
    },
    tl: {
      title: "Admin Dashboard",
      subtitle: "Pamahalaan ang mga listahan ng negosyo para sa Gloria Local Connect",
      addBusiness: "Magdagdag ng Bagong Negosyo",
      searchPlaceholder: "Maghanap ng mga negosyo...",
      allCategories: "Lahat ng Kategorya",
      businessName: "Pangalan ng Negosyo",
      businessNameTagalog: "Pangalan ng Negosyo (Tagalog)",
      category: "Kategorya",
      description: "Paglalarawan",
      descriptionTagalog: "Paglalarawan (Tagalog)",
      address: "Address",
      phone: "Numero ng Telepono",
      hours: "Oras ng Operasyon",
      rating: "Rating",
      featured: "Tampok",
      status: "Katayuan",
      active: "Aktibo",
      pending: "Naghihintay",
      inactive: "Hindi Aktibo",
      save: "I-save",
      cancel: "Kanselahin",
      edit: "I-edit",
      delete: "Tanggalin",
      confirmDelete: "Sigurado ka bang gusto mong tanggalin ang negosyong ito?",
      businessSaved: "Matagumpay na na-save ang negosyo!",
      businessDeleted: "Matagumpay na natanggal ang negosyo!",
      backToHome: "Bumalik sa Tahanan",
      verified: "Berkipikado",
      unverified: "Hindi Berkipikado",
      toggleStatus: "I-click para baguhin ang katayuan",
      toggleVerified: "I-click para baguhin ang beripikasyon",
      closed: "Sarado",
    },
  };

  return (
    <div className="min-h-screen antialiased font-sans bg-background text-foreground flex flex-1 flex-col">
        {/* Dashboard Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center px-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">{text[language].title}</h1>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <Button asChild size="sm" className="bg-primary text-primary-foreground">
                <Link href="/admin/businesses/add">
                  <Plus className="h-4 w-4 mr-2" />
                  {text[language].addBusiness}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Main */}
        <main className="@container/main flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground">{text[language].subtitle}</p>
          </div>

          {/* Summary Cards */}
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
                  {((verifiedBusinesses / totalBusinesses) * 100).toFixed(1)}% of total
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

          {/* Charts and Recent Activity */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Status Distribution Chart */}
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

            {/* Recent Activity */}
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
                    <div key={business._id} className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {typeof business.name === 'string'
                            ? business.name
                            : business.name?.english || business.name?.tagalog || "Unnamed Business"}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              business.metadata?.status === "active"
                                ? "default"
                                : business.metadata?.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {business.metadata?.status || "unknown"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {business.category?.primary || "Uncategorized"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-auto font-medium">
                        {business.metadata?.isVerified && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
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
                <Link href="/admin/businesses">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Businesses
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/analytics">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/users">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

          {/* All Businesses Table */}
          <BusinessDataTable data={businesses} />
        </main>
      </div>
  );
}
