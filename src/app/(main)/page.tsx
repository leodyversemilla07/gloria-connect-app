"use client"

import { useState } from "react"
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Search, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BusinessCard from "@/components/business-card"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "@/components/ui/navigation-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Logo from "@/components/logo"

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

export default function HomePage() {
  // Convex tasks demo
  const businesses = useQuery(api.businesses.get);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [language, setLanguage] = useState<"en" | "tl">("en");

  // Handle loading state
  if (!businesses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-muted-foreground text-lg">Loading...</span>
      </div>
    );
  }

  // Helper to get translated field
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

  // Mark first 3 as featured for demo
  const featuredBusinesses = filteredBusinesses.slice(0, 3);

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
      title: "Gloria Local Connect",
      subtitle: "Discover Local Businesses in Gloria, Oriental Mindoro",
      searchPlaceholder: "Search businesses...",
      featuredTitle: "Featured Businesses",
      allBusinesses: "All Businesses",
      viewDetails: "View Details",
      callNow: "Call Now",
      getDirections: "Get Directions",
      open: "Open",
      closed: "Closed",
      rating: "Rating",
    },
    tl: {
      title: "Gloria Local Connect",
      subtitle: "Tuklasin ang mga Lokal na Negosyo sa Gloria, Oriental Mindoro",
      searchPlaceholder: "Maghanap ng mga negosyo...",
      featuredTitle: "Mga Tampok na Negosyo",
      allBusinesses: "Lahat ng Negosyo",
      viewDetails: "Tingnan ang Detalye",
      callNow: "Tumawag Ngayon",
      getDirections: "Kumuha ng Direksyon",
      open: "Bukas",
      closed: "Sarado",
      rating: "Rating",
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-4 md:py-0 gap-4 md:gap-0">
            <div className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-start">
              <Logo size={40} link="/" className="hidden lg:inline-block" />
              <h1 className="text-xl font-bold text-foreground">{text[language].title}</h1>
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "tl" : "en")}
                className="flex items-center space-x-1"
              >
                <Globe className="h-4 w-4" />
                <span>{language === "en" ? "TL" : "EN"}</span>
              </Button>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/">{language === "en" ? "Home" : "Tahanan"}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/businesses">{language === "en" ? "All Businesses" : "Lahat ng Negosyo"}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/about">{language === "en" ? "About" : "Tungkol"}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  {/* TODO: Add authentication navigation (Login/Register/Dashboard) when user and loading state are available */}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">{text[language].title}</h2>
          <p className="text-lg sm:text-xl mb-6 md:mb-8 opacity-90">{text[language].subtitle}</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder={text[language].searchPlaceholder}
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
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 md:mb-8">{text[language].featuredTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {featuredBusinesses.map((business, idx) => (
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
          </div>
        </section>
      )}

      {/* All Businesses */}
      <section className="py-8 md:py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 md:mb-8">{text[language].allBusinesses}</h3>
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

      {/* Footer */}
      <footer className="bg-background text-foreground py-8 md:py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4 justify-center md:justify-start">
                <Logo size={40} />
                <h3 className="text-lg font-semibold">{text[language].title}</h3>
              </div>
              <p className="text-muted-foreground text-center md:text-left">
                {language === "en"
                  ? "Connecting Gloria's community with local businesses since 2024."
                  : "Nag-uugnay sa komunidad ng Gloria sa mga lokal na negosyo simula 2024."}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-center md:text-left">
                {language === "en" ? "Quick Links" : "Mga Mabilis na Link"}
              </h4>
              <ul className="space-y-2 text-muted-foreground text-center md:text-left">
                <li>
                  <Link href="/" className="hover:text-foreground">
                    {language === "en" ? "Home" : "Tahanan"}
                  </Link>
                </li>
                <li>
                  <Link href="/businesses" className="hover:text-foreground">
                    {language === "en" ? "All Businesses" : "Lahat ng Negosyo"}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    {language === "en" ? "About" : "Tungkol"}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-center md:text-left">{language === "en" ? "Contact" : "Makipag-ugnayan"}</h4>
              <p className="text-muted-foreground text-center md:text-left">
                Gloria, Oriental Mindoro
                <br />
                Philippines
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>
              &copy; 2024 Gloria Local Connect.{" "}
              {language === "en" ? "All rights reserved." : "Lahat ng karapatan ay nakalaan."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
