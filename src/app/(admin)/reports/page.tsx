"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileDown, 
  FileText, 
  Filter,
  Download,
  Table as TableIcon
} from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { Skeleton } from "@/components/ui/skeleton";
import type { Doc } from "../../../../convex/_generated/dataModel";

export default function AdminReportsPage() {
  const businesses = useQuery(api.businesses.get);
  const { t } = useI18n();

  if (!businesses) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const exportToCSV = () => {
    const headers = ["Name", "Category", "Phone", "Email", "Status", "Verified", "Date Added"];
    const rows = businesses.map(b => [
      typeof b.name === 'string' ? b.name : b.name.english,
      b.category.primary,
      b.contact.phone,
      b.contact.email || "",
      b.metadata.status,
      b.metadata.isVerified ? "Yes" : "No",
      new Date(b.metadata.dateAdded).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `gloria_connect_businesses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("adminReportsTitle") || "Reports"}</h1>
            <p className="text-muted-foreground text-sm">{t("adminReportsSubtitle") || "Generate and export business directory reports"}</p>
          </div>
        </div>
        <Button onClick={exportToCSV} className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          {t("adminExportCSV") || "Export CSV"}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TableIcon className="h-5 w-5 text-muted-foreground" />
                {t("adminBusinessSummary") || "Business Summary Report"}
              </CardTitle>
              <CardDescription>
                {t("adminReportDescription") || "A comprehensive list of all businesses with their key information"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("adminBusiness") || "Business"}</TableHead>
                  <TableHead>{t("adminCategory") || "Category"}</TableHead>
                  <TableHead>{t("adminContact") || "Contact"}</TableHead>
                  <TableHead>{t("adminStatus") || "Status"}</TableHead>
                  <TableHead>{t("adminVerified") || "Verified"}</TableHead>
                  <TableHead className="text-right">{t("adminDate") || "Date Added"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business._id}>
                    <TableCell className="font-medium">
                      {typeof business.name === 'string' ? business.name : business.name.english}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {t(`category.${business.category.primary.toLowerCase()}`) || business.category.primary}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex flex-col">
                        <span>{business.contact.phone}</span>
                        {business.contact.email && <span className="text-muted-foreground">{business.contact.email}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          business.metadata.status === "active" ? "default" : 
                          business.metadata.status === "pending" ? "secondary" : "destructive"
                        }
                        className="capitalize text-[10px]"
                      >
                        {t(`admin${business.metadata.status.charAt(0).toUpperCase() + business.metadata.status.slice(1)}`) || business.metadata.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {business.metadata.isVerified ? (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                          {t("adminYes") || "Yes"}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          {t("adminNo") || "No"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(business.metadata.dateAdded).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
