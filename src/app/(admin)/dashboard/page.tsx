"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "@/components/data-table";



export default function AdminDashboard() {
  const businesses = useQuery(api.businesses.get);

  // Removed searchTerm and selectedCategory, not needed for dashboard
  const [language] = useState<"en" | "tl">("en");

  // Handle loading state
  if (!businesses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500 text-lg">Loading...</span>
      </div>
    );
  }

  // Dashboard summary stats
  const totalBusinesses = businesses.length;
  const verifiedBusinesses = businesses.filter((b) => b.metadata?.isVerified).length;
  // const unverifiedBusinesses = businesses.filter((b) => !b.metadata?.isVerified).length; // Not used
  const statusCounts = {
    active: businesses.filter((b) => b.metadata?.status === "active").length,
    pending: businesses.filter((b) => b.metadata?.status === "pending").length,
    inactive: businesses.filter((b) => b.metadata?.status === "inactive").length,
  };

  // Map all businesses to DataTable schema
  const allBusinessesTableData = businesses.map((b, idx) => ({
    id: idx + 1, // DataTable expects a numeric id
    header: b.name?.english || b.name?.tagalog || "-",
    type: b.category?.primary || "-",
    status: b.metadata?.status ? b.metadata.status.charAt(0).toUpperCase() + b.metadata.status.slice(1) : "-",
    target: b.metadata?.target || "-",
    limit: b.metadata?.limit || "-",
    reviewer: b.metadata?.reviewer || "Assign reviewer",
  }));

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
      {/* Dashboard Main */}
      <main className="@container/main flex flex-1 flex-col gap-2 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">{text[language].title}</h1>
        <p className="text-lg sm:text-xl opacity-90 mb-6 md:mb-8">{text[language].subtitle}</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-primary">{totalBusinesses}</span>
            <span className="text-muted-foreground mt-1">Total Businesses</span>
          </div>
          <div className="bg-card rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-green-600">{verifiedBusinesses}</span>
            <span className="text-muted-foreground mt-1">Verified</span>
          </div>
          <div className="bg-card rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-yellow-600">{statusCounts.pending}</span>
            <span className="text-muted-foreground mt-1">Pending</span>
          </div>
          <div className="bg-card rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-500">{statusCounts.inactive}</span>
            <span className="text-muted-foreground mt-1">Inactive</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button asChild size="lg" className="bg-primary text-primary-foreground">
            <Link href="/admin/businesses/add">+ Add New Business</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/admin/businesses">View All Businesses</Link>
          </Button>
        </div>

        {/* All Businesses as Table */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">All Businesses</h2>
          <DataTable data={allBusinessesTableData} />
        </div>
      </main>
    </div>
  );
}
