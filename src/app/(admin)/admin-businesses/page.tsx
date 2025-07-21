"use client";



import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuthToken } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

import { BusinessesDataTable } from "../../../components/businesses-data-table";
import type { Business } from "../../../components/businesses-data-table";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "../../../components/ui/sheet";

export default function AdminBusinessesPage() {
  const token = useAuthToken();
  const router = useRouter();
  const isLoading = token === undefined;
  const isAuthenticated = !!token;
  const { isAdmin } = useQuery(api.users.getIsAdmin, {}) ?? { isAdmin: undefined };
  const businesses = useQuery(api.businesses.get);
  const [selectedBusiness, setSelectedBusiness] = React.useState<Business | null>(null);
  const [showDelete, setShowDelete] = React.useState(false);
  const [showView, setShowView] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  React.useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin === false) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  // Handler for viewing a business
  const handleView = (biz: Business) => {
    setSelectedBusiness(biz);
    setShowView(true);
  };

  // Handler for editing a business (navigate to edit page)
  const handleEdit = (biz: Business) => {
    router.push(`/admin-businesses/${biz.id}/edit`);
  };

  // Handler for deleting a business
  const handleDelete = () => {
    setShowDelete(true);
  };

  // TODO: Implement real mutation for delete and edit
  const confirmDelete = () => {
    // Call delete mutation here
    setShowDelete(false);
    // Optionally refetch data
  };

  if (isLoading || !isAuthenticated || isAdmin === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500 text-lg">Loading...</span>
      </div>
    );
  }

  if (isAdmin === false) {
    return null; // Optionally, show a message or redirect handled by useEffect
  }

  return (
    <div className="min-h-screen antialiased font-sans bg-background text-foreground flex flex-1 flex-col">
      <main className="@container/main flex flex-1 flex-col gap-2 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">All Businesses</h1>
          <Button asChild size="lg" className="bg-primary text-primary-foreground">
            <Link href="/admin/businesses/add">+ Add New Business</Link>
          </Button>
        </div>
        <BusinessesDataTable
          data={(businesses ?? []).map((b) => ({
            id: (b._id as unknown as string) ?? '',
            name: {
              english: b.name?.english ?? '',
              tagalog: b.name?.tagalog ?? '',
            },
            category: {
              primary: b.category?.primary ?? '',
              secondary: b.category?.secondary ?? [],
            },
            contact: {
              phone: b.contact?.phone ?? '',
              email: b.contact?.email ?? '',
              website: b.contact?.website ?? '',
            },
            address: {
              street: b.address?.street ?? '',
              barangay: b.address?.barangay ?? '',
              coordinates: {
                latitude: b.address?.coordinates?.latitude ?? 0,
                longitude: b.address?.coordinates?.longitude ?? 0,
              },
            },
            metadata: {
              dateAdded: b.metadata?.dateAdded ?? '',
              lastUpdated: b.metadata?.lastUpdated ?? '',
              isVerified: b.metadata?.isVerified ?? false,
              status: b.metadata?.status ?? 'pending',
            },
          }))}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* View Sheet */}
        <Sheet open={showView} onOpenChange={setShowView}>
          <SheetContent className="max-w-lg w-full p-6">
            <SheetHeader>
              <SheetTitle className="text-2xl mb-2">Business Details</SheetTitle>
            </SheetHeader>
            {selectedBusiness && (
              <div className="bg-muted/40 rounded-lg p-4 mb-4 border space-y-3">
                <div className="text-lg font-semibold">{selectedBusiness.name.english || selectedBusiness.name.tagalog}</div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="font-medium">Category:</span> {selectedBusiness.category.primary}
                  <span className="font-medium ml-4">Status:</span> <span className="capitalize">{selectedBusiness.metadata.status}</span>
                  <span className="font-medium ml-4">Verified:</span> {selectedBusiness.metadata.isVerified ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>}
                </div>
                <hr className="my-2" />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Phone:</span> {selectedBusiness.contact.phone}</div>
                  <div><span className="font-medium">Email:</span> {selectedBusiness.contact.email}</div>
                  <div><span className="font-medium">Date Added:</span> {new Date(selectedBusiness.metadata.dateAdded).toLocaleDateString()}</div>
                  <div><span className="font-medium">Barangay:</span> {selectedBusiness.address.barangay}</div>
                </div>
              </div>
            )}
            <div className="flex justify-end mt-4">
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>

        {/* Delete Sheet */}
        <Sheet open={showDelete} onOpenChange={setShowDelete}>
          <SheetContent className="max-w-md w-full p-6">
            <SheetHeader>
              <SheetTitle className="text-2xl mb-2 text-red-600">Delete Business</SheetTitle>
              <SheetDescription>
                <div className="flex items-center gap-2 text-red-700 font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Are you sure you want to delete this business?
                </div>
              </SheetDescription>
            </SheetHeader>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>

      </main>
    </div>
  );
}
