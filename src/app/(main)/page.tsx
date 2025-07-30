"use client"

import { useState } from "react";
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

export default function HomePage() {
  const businesses = useQuery(api.businesses.get);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { language, messages, setLanguage } = useI18n();

  if (!businesses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-muted-foreground text-lg">{messages["loading"] || "Loading..."}</span>
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
  const featuredBusinesses = filteredBusinesses.slice(0, 3);
  function getTodayHours(business: Business) {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
    const today = days[new Date().getDay()];
    const hours = business.operatingHours?.[today as keyof typeof business.operatingHours];
    if (!hours) return "";
    if (hours.closed) return messages["closed"] || "Closed";
    return `${hours.open} - ${hours.close}`;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} messages={messages} setLanguage={setLanguage} currentPath="/" />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">Gloria Local Connect</h2>
            <p className="text-lg sm:text-xl mb-6 md:mb-8 opacity-90">{messages["subtitle"] || "Discover Local Businesses in Gloria, Oriental Mindoro"}</p>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder={messages["searchPlaceholder"] || "Search businesses..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-foreground bg-card border border-border focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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

        {/* Featured Businesses */}
        {featuredBusinesses.length > 0 && (
          <section className="py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 md:mb-8">{messages["featuredTitle"] || "Featured Businesses"}</h3>
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
                    text={{
                      ...messages,
                      featured: messages["featured"] || (language === "en" ? "Featured" : "Tampok"),
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Businesses */}
        <section className="py-8 md:py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 md:mb-8">{messages["allBusinesses"] || "All Businesses"}</h3>
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
                    featured: messages["featured"] || (language === "en" ? "Featured" : "Tampok"),
                  }}
                />
              ))}
            </div>
            {filteredBusinesses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {messages["noBusinessesFound"] || (language === "en"
                    ? "No businesses found matching your search."
                    : "Walang nahanap na negosyo na tumugma sa inyong paghahanap.")}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer language={language} messages={messages} />
    </div>
  );
}
