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
    ...arr.map((id) => {
      const key = `category.${id.toLowerCase()}`;
      const translated = t(key);
      return {
        id,
        name: translated === key ? id.charAt(0).toUpperCase() + id.slice(1) : translated,
        nameTagalog: translated === key ? id.charAt(0).toUpperCase() + id.slice(1) : translated,
      };
    }),
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
    <div className="min-h-screen bg-background tropical-bg leaf-pattern">
      <Header language={language} messages={messages as Record<string, string>} setLanguage={setLanguage} currentPath="/" />
      <main>
        <section className="hero-gradient text-white py-12 md:py-20 lg:py-24 relative overflow-hidden">
          {/* Decorative elements - responsive sizes */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-48 md:w-64 lg:w-80 h-48 md:h-64 lg:h-80 bg-white/30 rounded-full blur-2xl md:blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-56 md:w-72 lg:w-96 h-56 md:h-72 lg:h-96 bg-white/20 rounded-full blur-2xl md:blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-80 lg:w-96 h-64 md:h-80 lg:h-96 bg-primary/20 rounded-full blur-2xl md:blur-3xl hidden sm:block"></div>
          </div>
          
          {/* Floating decorative shapes - hidden on small screens */}
          <div className="absolute top-16 md:top-20 right-8 md:right-20 w-3 h-3 md:w-4 md:h-4 bg-white/20 rounded-full animate-float hidden lg:block"></div>
          <div className="absolute bottom-24 md:bottom-32 left-4 md:left-16 w-2 h-2 md:w-3 md:h-3 bg-white/30 rounded-full animate-float hidden lg:block" style={{ animationDelay: '1s' }}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 rounded-full mb-4 sm:mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs sm:text-sm font-medium">Gloria, Oriental Mindoro</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 lg:mb-6 font-[family-name:var(--font-playfair)] tracking-tight px-2">
              {t("title")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 lg:mb-10 opacity-90 max-w-xl md:max-w-2xl mx-auto leading-relaxed px-4">
              {t("subtitle")}
            </p>
            <div className="max-w-xl md:max-w-2xl mx-auto px-2 sm:px-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative group">
                  <div className="absolute -inset-0.5 bg-white/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                    <Input
                      type="text"
                      placeholder={t("searchPlaceholder")}
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      className="pl-10 sm:pl-12 h-12 sm:h-14 text-foreground bg-white/95 backdrop-blur border-0 shadow-lg text-base"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-40 md:w-48 lg:w-52 h-12 sm:h-14 text-foreground bg-white/95 backdrop-blur border-0 shadow-lg text-base">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
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
          <section className="py-10 md:py-16 lg:py-20 relative">
            <div className="absolute left-0 top-0 w-48 md:w-64 h-48 md:h-64 bg-primary/5 rounded-full blur-2xl md:blur-3xl"></div>
            <div className="absolute right-0 bottom-0 w-48 md:w-64 h-48 md:h-64 bg-secondary/5 rounded-full blur-2xl md:blur-3xl"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-8 md:mb-12">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4 font-[family-name:var(--font-playfair)]">
                  {t("featuredTitle")}
                </h3>
                <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 stagger-children">
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
                    getBarangay={(b) => b.address?.barangay || ""}
                    text={messages as Record<string, string>}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-10 md:py-16 lg:py-20 bg-muted/20 relative">
          <div className="absolute inset-0 leaf-pattern opacity-30 md:opacity-50"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4 font-[family-name:var(--font-playfair)]">
                {t("allBusinesses")}
              </h3>
              <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 stagger-children">
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
                  getBarangay={(b) => b.address?.barangay || ""}
                  text={messages as Record<string, string>}
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
