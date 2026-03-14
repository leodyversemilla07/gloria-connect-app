"use client"

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { useI18n } from "./i18n-provider";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BusinessCard from "@/components/business-card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 9;

function getCategoriesFromBusinesses(businesses: Doc<"businesses">[], t: (key: string) => string) {
  const set = new Set<string>();
  businesses.forEach((b) => {
    if (b.category?.primary) set.add(b.category.primary);
  });
  const arr = Array.from(set);
  arr.sort();
  return [
    { id: "all", name: t("category.all"), nameTagalog: t("category.all") },
    ...arr.map((id) => ({
      id,
      name: t(`category.${id}`) || id.charAt(0).toUpperCase() + id.slice(1),
      nameTagalog: t(`category.${id}`) || id.charAt(0).toUpperCase() + id.slice(1),
    })),
  ];
}

export default function HomePage() {
  const businesses = useQuery(api.businesses.get);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { language, messages, setLanguage, t } = useI18n();

  type Business = Doc<"businesses">;
  const categories = getCategoriesFromBusinesses(businesses ?? [], t);
  const getName = (b: Business) => typeof b.name === 'string' ? b.name : b.name?.english || "";
  const getDescription = (b: Business) => typeof b.description === 'string' ? b.description : b.description?.english || "";
  const getCategory = (b: Business) => {
    const cat = categories.find((c) => c.id === b.category?.primary);
    return language === "en" ? cat?.name : cat?.nameTagalog;
  };

  const filteredBusinesses = (businesses ?? []).filter((business: Business) => {
    const name = getName(business).toLowerCase();
    const description = getDescription(business).toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || business.category?.primary === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE);
  const paginatedBusinesses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBusinesses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBusinesses, currentPage]);

  const featuredBusinesses = filteredBusinesses.slice(0, 3);

  if (!businesses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-muted-foreground text-lg">{t("loading")}</span>
      </div>
    );
  }

  function getTodayHours(business: Business) {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
    const today = days[new Date().getDay()];
    const hours = business.operatingHours?.[today as keyof typeof business.operatingHours];
    if (!hours) return "";
    if (hours.closed) return t("closed");
    return `${hours.open} - ${hours.close}`;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const text = {
    ...messages,
    featured: t("featured"),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} messages={messages as Record<string, string>} setLanguage={setLanguage} currentPath="/" />
      <main>
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">Gloria Local Connect</h2>
            <p className="text-lg sm:text-xl mb-6 md:mb-8 opacity-90">{t("subtitle")}</p>
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="pl-10 h-12 text-foreground bg-card border border-border focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-48 h-12 text-foreground bg-card border border-border focus:ring-2 focus:ring-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                        className="bg-card text-foreground hover:bg-accent focus:bg-accent focus:text-foreground"
                      >
                        {language === "en" ? category.name : category.nameTagalog}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {featuredBusinesses.length > 0 && (
          <section className="py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 md:mb-8">{t("featuredTitle")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {featuredBusinesses.map((business, idx) => (
                  <BusinessCard
                    key={business._id}
                    business={business}
                    idx={idx}
                    language={language as "en" | "fil"}
                    getName={getName}
                    getDescription={getDescription}
                    getCategory={getCategory}
                    getTodayHours={getTodayHours}
                    text={text as Record<string, string>}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-8 md:py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 md:mb-8">{t("allBusinesses")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {paginatedBusinesses.map((business, idx) => (
                <BusinessCard
                  key={business._id}
                  business={business}
                  idx={idx}
                  language={language as "en" | "fil"}
                  getName={getName}
                  getDescription={getDescription}
                  getCategory={getCategory}
                  getTodayHours={getTodayHours}
                  text={text as Record<string, string>}
                />
              ))}
            </div>
            
            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">{t("noBusinessesFound")}</p>
              </div>
            ) : totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer language={language} messages={messages as Record<string, string>} />
    </div>
  );
}
