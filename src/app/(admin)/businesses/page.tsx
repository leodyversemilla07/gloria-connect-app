"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { BusinessDataTable } from "../../../components/business-data-table";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function AdminBusinessesPage() {
  const businesses = useQuery(api.businesses.get);

  return (
    <div className="min-h-screen antialiased font-sans bg-background text-foreground flex flex-1 flex-col">
        <main className="@container/main flex flex-1 flex-col gap-2 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">All Businesses</h1>
            <Button asChild size="lg" className="bg-primary text-primary-foreground">
              <Link href="/admin/businesses/add">+ Add New Business</Link>
            </Button>
          </div>
          <BusinessDataTable data={businesses ?? []} />
        </main>
      </div>
  );
}
