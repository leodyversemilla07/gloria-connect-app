"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { BusinessDataTable } from "@/components/business-data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/components/i18n-provider";
import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import type { Doc } from "../../../../../convex/_generated/dataModel";

export default function AdminBusinessesPage() {
  const businesses = useQuery(api.businesses.get);
  const { t } = useI18n();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const localeMatch = pathname.match(/^\/(en|fil)(\/|$)/);
  const adminBasePath = localeMatch ? `/${localeMatch[1]}/admin/businesses` : "/en/admin/businesses";

  const getCategories = () => {
    if (!businesses) return [];
    const categories = new Set<string>();
    businesses.forEach((b) => {
      if (b.category?.primary) categories.add(b.category.primary);
    });
    return Array.from(categories).sort().map(id => ({
      id,
      name: t(`category.${id.toLowerCase()}`) || id,
    }));
  };

  const filteredBusinesses = (businesses ?? []).filter((business: Doc<"businesses">) => {
    const name = typeof business.name === 'string' 
      ? business.name 
      : business.name?.english || business.name?.tagalog || "";
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (business.description && (
        typeof business.description === 'string'
          ? business.description.toLowerCase().includes(searchTerm.toLowerCase())
          : (business.description.english?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             business.description.tagalog?.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
    
    const matchesStatus = statusFilter === "all" || business.metadata?.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || business.category?.primary === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = getCategories();

  return (
    <div className="min-h-screen antialiased font-sans bg-background text-foreground flex flex-1 flex-col">
      <main className="@container/main flex flex-1 flex-col gap-2 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{t("adminAllBusinesses")}</h1>
          <Button asChild size="lg" className="bg-primary text-primary-foreground">
            <Link href={`${adminBasePath}/add`}>+ {t("adminAddBusiness")}</Link>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={t("adminSearchBusinesses")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder={t("adminStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("adminStatus")}</SelectItem>
              <SelectItem value="active">{t("adminActive")}</SelectItem>
              <SelectItem value="pending">{t("adminPendingReview")}</SelectItem>
              <SelectItem value="inactive">{t("adminInactive")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t("adminCategory")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("adminAllCategories")}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <BusinessDataTable data={filteredBusinesses} />
      </main>
    </div>
  );
}
