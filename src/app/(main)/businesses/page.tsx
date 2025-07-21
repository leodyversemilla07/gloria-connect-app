"use client"

import { useState } from "react"
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { Search, Globe, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import BusinessCard from "@/components/business-card"

// Map of known categories and their translations
const knownCategories: Record<string, { name: string; nameTagalog: string }> = {
  restaurants: { name: "Restaurants", nameTagalog: "Mga Kainan" },
  lodging: { name: "Lodging", nameTagalog: "Mga Tuluyan" },
  transportation: { name: "Transportation", nameTagalog: "Transportasyon" },
  tourism: { name: "Tourism", nameTagalog: "Turismo" },
  healthcare: { name: "Healthcare", nameTagalog: "Kalusugan" },
  retail: { name: "Retail", nameTagalog: "Tindahan" },
  technology: { name: "Technology", nameTagalog: "Teknolohiya" },
  food: { name: "Food", nameTagalog: "Pagkain" },
  hardware: { name: "Hardware", nameTagalog: "Hardware" },
  bakery: { name: "Bakery", nameTagalog: "Panaderya" },
  services: { name: "Services", nameTagalog: "Serbisyo" },
};

function getCategoriesFromBusinesses(businesses: Doc<"businesses">[], language: "en" | "tl") {
  const set = new Set<string>();
  businesses.forEach((b) => {
    if (b.category?.primary) set.add(b.category.primary);
  });
  const arr = Array.from(set);
  arr.sort();
  return [
    { id: "all", name: language === "en" ? "All Categories" : "Lahat ng Kategorya", nameTagalog: "Lahat ng Kategorya" },
    ...arr.map((id) => ({
      id,
      name: knownCategories[id]?.name || id.charAt(0).toUpperCase() + id.slice(1),
      nameTagalog: knownCategories[id]?.nameTagalog || id.charAt(0).toUpperCase() + id.slice(1),
    })),
  ];
}

export default function BusinessesPage() {
  const businesses = useQuery(api.businesses.get);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [language, setLanguage] = useState<"en" | "tl">("en");

  // Handle loading state
  if (!businesses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500 text-lg">Loading...</span>
      </div>
    );
  }

  type Business = Doc<"businesses">;

  // Dynamically get categories from business data
  const categories = getCategoriesFromBusinesses(businesses, language);

  const getName = (business: Business) =>
    language === "en"
      ? business.name?.english || ""
      : business.name?.tagalog || business.name?.english || "";
  const getDescription = (business: Business) =>
    language === "en"
      ? business.description?.english || ""
      : business.description?.tagalog || business.description?.english || "";
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

  // Helper to get today's open hours
  function getTodayHours(business: Business) {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
    const today = days[new Date().getDay()];
    const hours = business.operatingHours?.[today as keyof typeof business.operatingHours];
    if (!hours) return "";
    if (hours.closed) return language === "en" ? text.en.closed : text.tl.closed;
    return `${hours.open} - ${hours.close}`;
  }

  const text = {
    en: {
      title: "All Businesses",
      subtitle: "Discover all local businesses in Gloria, Oriental Mindoro",
      searchPlaceholder: "Search businesses...",
      backToHome: "Back to Home",
      viewDetails: "View Details",
      callNow: "Call Now",
      getDirections: "Get Directions",
      noBusinesses: "No businesses found matching your search.",
      closed: "Closed",
    },
    tl: {
      title: "Lahat ng Negosyo",
      subtitle: "Tuklasin ang lahat ng lokal na negosyo sa Gloria, Oriental Mindoro",
      searchPlaceholder: "Maghanap ng mga negosyo...",
      backToHome: "Bumalik sa Tahanan",
      viewDetails: "Tingnan ang Detalye",
      callNow: "Tumawag Ngayon",
      getDirections: "Kumuha ng Direksyon",
      noBusinesses: "Walang nahanap na negosyo na tumugma sa inyong paghahanap.",
      closed: "Sarado",
    },
  };

  return (
    <div className="min-h-screen antialiased font-sans bg-background text-foreground">
      {/* Header */}
      <header className="shadow-sm border-b sticky top-0 z-50 bg-card text-card-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-4 md:py-0 gap-4 md:gap-0">
            <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary w-full md:w-auto justify-center md:justify-start">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">{text[language].backToHome}</span>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "tl" : "en")}
              className="flex items-center space-x-1 w-full md:w-auto justify-center md:justify-end"
            >
              <Globe className="h-4 w-4" />
              <span>{language === "en" ? "TL" : "EN"}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-8 md:py-12 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">{text[language].title}</h1>
          <p className="text-lg sm:text-xl opacity-90 mb-6 md:mb-8">{text[language].subtitle}</p>

          {/* Search and Filter Bar */}
          <div className="max-w-4xl">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder={text[language].searchPlaceholder}
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
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 md:mb-8">{text[language].title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredBusinesses.map((business, idx) => (
              <BusinessCard
                key={business._id}
                business={business}
                idx={idx}
                language={language}
                getName={getName}
                getDescription={getDescription}
                getCategory={getCategory}
                getTodayHours={getTodayHours}
                text={text}
              />
            ))}
          </div>

          {filteredBusinesses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {language === "en"
                  ? "No businesses found matching your search."
                  : "Walang nahanap na negosyo na tumugma sa inyong paghahanap."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
