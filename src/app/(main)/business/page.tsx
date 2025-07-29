"use client"

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import BusinessCard from "@/components/business-card";
import LanguageToggle from "@/components/language-toggle";
import { useI18n } from "../i18n-provider";

function getCategoriesFromBusinesses(businesses: Doc<"businesses">[], messages: Record<string, string>) {
  const set = new Set<string>();
  businesses.forEach((b) => {
    if (b.category?.primary) set.add(b.category.primary);
  });
  const arr = Array.from(set);
  arr.sort();
  return [
    { id: "all", name: messages["category.all"], nameTagalog: messages["category.all"] },
    ...arr.map((id) => ({
      id,
      name: messages[`category.${id}`] || id.charAt(0).toUpperCase() + id.slice(1),
      nameTagalog: messages[`category.${id}`] || id.charAt(0).toUpperCase() + id.slice(1),
    })),
  ];
}

export default function BusinessesPage() {
  const businesses = useQuery(api.businesses.get);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { language, messages, setLanguage } = useI18n();

  if (!businesses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500 text-lg">{messages["loading"] || "Loading..."}</span>
      </div>
    );
  }

  type Business = Doc<"businesses">;
  const categories = getCategoriesFromBusinesses(businesses, messages);
  const getName = (business: Business) => business.name || "";
  const getDescription = (business: Business) => business.description || "";
  const getCategory = (business: Business) => {
    const cat = categories.find((c) => c.id === business.category?.primary);
    return language === "en" ? cat?.name : cat?.nameTagalog;
  };
  const filteredBusinesses = businesses.filter((business: Business) => {
    const name = getName(business).toLowerCase();
    const description = getDescription(business).toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || business.category?.primary === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  function getTodayHours(business: Business) {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
    const today = days[new Date().getDay()];
    const hours = business.operatingHours?.[today as keyof typeof business.operatingHours];
    if (!hours) return "";
    if (hours.closed) return messages["closed"] || "Closed";
    return `${hours.open} - ${hours.close}`;
  }

  return (
    <div className="min-h-screen antialiased font-sans bg-background text-foreground">
      {/* Header */}
      <header className="shadow-sm border-b sticky top-0 z-50 bg-card text-card-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-4 md:py-0 gap-4 md:gap-0">
            <Button
              asChild
              variant="link"
              className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-start"
            >
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">{messages["backToHome"] || "Back to Home"}</span>
              </Link>
            </Button>
            <LanguageToggle language={language} setLanguage={setLanguage} />
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-8 md:py-12 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">{messages["title"] || "All Businesses"}</h1>
          <p className="text-lg sm:text-xl opacity-90 mb-6 md:mb-8">{messages["subtitle"] || "Discover all local businesses in Gloria, Oriental Mindoro"}</p>

          {/* Search and Filter Bar */}
          <div className="max-w-4xl">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder={messages["searchPlaceholder"] || "Search businesses..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-foreground bg-background border-border"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 h-12 text-foreground bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {language === "en" ? category.name : category.nameTagalog}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* All Businesses */}
      <section className="py-8 md:py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 md:mb-8">{messages["allBusinesses"] || messages["title"] || "All Businesses"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                text={{
                  ...messages,
                  featured: messages["featured"] || (language === "en" ? "Featured" : "Itinatampok"),
                }}
              />
            ))}
          </div>

          {filteredBusinesses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {messages["noBusinesses"] || messages["noBusinessesFound"] || (language === "en"
                  ? "No businesses found matching your search."
                  : "Walang nahanap na negosyo na tumugma sa inyong paghahanap.")}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
