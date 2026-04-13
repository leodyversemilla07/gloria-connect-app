"use client";

import { useQuery } from "convex/react";
import { ArrowLeft, Building2, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BusinessCard, { type PublicBusinessDigest } from "@/components/business-card";
import { useI18n } from "@/components/i18n-provider";
import LanguageToggle from "@/components/language-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "../../../../../convex/_generated/api";

function getCategoriesFromBusinesses(
  businesses: PublicBusinessDigest[],
  t: (key: string) => string,
) {
  const set = new Set<string>();
  businesses.forEach((b) => {
    set.add(b.categoryPrimary);
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

export default function BusinessesPage() {
  const businesses = useQuery(api.businesses.getPublic);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { language, messages, setLanguage, t } = useI18n();

  if (!businesses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background tropical-bg">
        <span className="text-muted-foreground text-lg">{t("loading")}</span>
      </div>
    );
  }

  const categories = getCategoriesFromBusinesses(businesses, t);
  const getName = (business: PublicBusinessDigest) =>
    typeof business.name === "string" ? business.name : business.name.english;
  const getDescription = (business: PublicBusinessDigest) =>
    typeof business.description === "string" ? business.description : business.description.english;
  const getCategory = (business: PublicBusinessDigest) => {
    const cat = categories.find((c) => c.id === business.categoryPrimary);
    return language === "en" ? cat?.name : cat?.nameTagalog;
  };
  const filteredBusinesses = businesses.filter((business: PublicBusinessDigest) => {
    const name = getName(business).toLowerCase();
    const description = getDescription(business).toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || business.categoryPrimary === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  function getTodayHours(business: PublicBusinessDigest) {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ] as const;
    const today = days[new Date().getDay()];
    const hours = business.operatingHours[today];
    if (!hours) return "";
    if (hours.closed) return t("closed");
    return `${hours.open} - ${hours.close}`;
  }

  const text = {
    ...messages,
    featured: t("featured"),
  };

  return (
    <div className="min-h-screen antialiased font-sans bg-background tropical-bg">
      {/* Header */}
      <header className="shadow-sm border-b sticky top-0 z-50 bg-card/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-4 md:py-0 gap-4 md:gap-0">
            <Button
              render={<Link href={`/${language}`}><ArrowLeft className="h-5 w-5" /><span className="font-medium">{t("backToHome")}</span></Link>}
              nativeButton={false}
              variant="link"
              className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-start text-primary hover:text-primary/80"
            />
            <LanguageToggle language={language} setLanguage={setLanguage} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-6 w-6" />
            <span className="text-sm font-medium opacity-80">Gloria, Oriental Mindoro</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center font-[family-name:var(--font-playfair)]">
            {t("title")}
          </h1>
          <p className="text-lg sm:text-xl opacity-90 mb-8 text-center max-w-2xl mx-auto">
            {t("subtitle")}
          </p>

          {/* Search and Filter Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-foreground bg-white/95 backdrop-blur border-0 shadow-lg text-lg"
                />
              </div>
              <Select
                items={[{ label: t("category.all"), value: "all" }, ...categories.map(c => ({ label: language === "en" ? c.name : c.nameTagalog, value: c.id }))]}
                value={selectedCategory}
                onValueChange={(v) => setSelectedCategory(v ?? "all")}
              >
                <SelectTrigger className="w-full sm:w-56 h-14 text-foreground bg-white/95 backdrop-blur border-0 shadow-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {language === "en" ? category.name : category.nameTagalog}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <p className="text-center text-white/70 text-sm">
              {filteredBusinesses.length}{" "}
              {filteredBusinesses.length === 1 ? "business" : "businesses"} found
            </p>
          </div>
        </div>
      </section>

      {/* Decorative Wave */}
      <div className="relative -mt-1">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 md:h-16"
          aria-hidden="true"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="currentColor"
            className="text-background"
          />
        </svg>
      </div>

      {/* All Businesses */}
      <section className="py-8 md:py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 font-[family-name:var(--font-playfair)]">
            {t("allBusinesses")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 stagger-children">
            {filteredBusinesses.map((business, idx) => (
              <BusinessCard
                key={business._id}
                business={business}
                idx={idx}
                language={language as "en" | "fil"}
                getName={getName}
                getDescription={getDescription}
                getCategory={getCategory}
                getTodayHours={getTodayHours}
                getBarangay={(b) => b.barangay}
                text={text as Record<string, string>}
              />
            ))}
          </div>

          {filteredBusinesses.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">{t("noBusinessesFound")}</p>
              <Button
                variant="link"
                className="mt-4 text-primary"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
