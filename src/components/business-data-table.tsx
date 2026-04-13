"use client";

import { useMutation } from "convex/react";
import {
  Building2,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Filter,
  MapPin,
  MoreHorizontal,
  Phone,
  Search,
  Trash,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { handleConvexError } from "@/hooks/use-convex-error";
import { localeRoute } from "@/lib/locale-paths";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface Business {
  _id: string;
  name?:
    | string
    | {
        english?: string;
        tagalog?: string;
      };
  category?: {
    primary?: string;
  };
  metadata?: {
    status?: string;
    target?: string;
    limit?: string;
    reviewer?: string;
    isVerified?: boolean;
  };
  contact?: {
    phone?: string;
  };
  address?: {
    street?: string;
    barangay?: string;
  };
}

interface BusinessDataTableProps {
  data: Business[];
}

export function BusinessDataTable({ data }: BusinessDataTableProps) {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [businessToDelete, setBusinessToDelete] = useState<Business | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const deleteBusiness = useMutation(api.businesses.admin.remove);
  const updateStatus = useMutation(api.businesses.admin.updateStatus);
  const toggleVerified = useMutation(api.businesses.admin.toggleVerified);
  const publicBasePath = localeRoute(pathname, "/business");
  const adminBasePath = localeRoute(pathname, "/businesses");

  // Filter data based on search and filters
  const filteredData = data.filter((business) => {
    const businessName =
      typeof business.name === "string"
        ? business.name
        : business.name?.english || business.name?.tagalog || "";
    const matchesSearch =
      businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (business.category?.primary ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || business.metadata?.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || business.category?.primary === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Get unique categories for filter
  const categories = Array.from(new Set(data.map((b) => b.category?.primary).filter(Boolean))) as string[];

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const handleDelete = async () => {
    if (!businessToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteBusiness({ id: businessToDelete._id as Id<"businesses"> });
      toast.success("Business deleted successfully.");
      setBusinessToDelete(null);
    } catch (error) {
      handleConvexError(error, "Failed to delete business");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      for (const id of selectedIds) {
        await deleteBusiness({ id: id as Id<"businesses"> });
      }
      toast.success(`${selectedIds.size} businesses deleted successfully.`);
      setSelectedIds(new Set());
      setShowBulkDelete(false);
    } catch (error) {
      handleConvexError(error, "Failed to delete businesses");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map((b) => b._id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleStatusChange = async (id: string, newStatus: "active" | "inactive" | "pending") => {
    try {
      await updateStatus({ id: id as Id<"businesses">, status: newStatus });
      toast.success("Status updated successfully");
    } catch (error) {
      handleConvexError(error, "Failed to update status");
    }
  };

  const handleToggleVerified = async (id: string) => {
    try {
      const result = await toggleVerified({ id: id as Id<"businesses"> });
      toast.success(result.isVerified ? "Business verified" : "Verification removed");
    } catch (error) {
      handleConvexError(error, "Failed to toggle verification");
    }
  };

  return (
    <>
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 mb-4 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <Button variant="destructive" size="sm" onClick={() => setShowBulkDelete(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
            Clear Selection
          </Button>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Directory
          </CardTitle>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              items={[{ label: "All Status", value: "all" }, { label: "Active", value: "active" }, { label: "Pending", value: "pending" }, { label: "Inactive", value: "inactive" }]}
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v ?? "all")}
            >
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              items={[{ label: "All Categories", value: "all" }, ...categories.map(c => ({ label: c, value: c }))]}
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v ?? "all")}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedIds.size === paginatedData.length && paginatedData.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-semibold">Business</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No businesses found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((business) => {
                    const addressText = [business.address?.street, business.address?.barangay]
                      .filter(Boolean)
                      .join(", ");

                    return (
                      <TableRow key={business._id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(business._id)}
                            onCheckedChange={() => toggleSelect(business._id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {typeof business.name === "string"
                                ? business.name
                                : business.name?.english ||
                                  business.name?.tagalog ||
                                  "Unnamed Business"}
                            </span>
                            {business.metadata?.isVerified && (
                              <div className="flex items-center gap-1 mt-1">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span className="text-xs text-green-600 font-medium">Verified</span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {business.category?.primary || "Uncategorized"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(business.metadata?.status)}
                            {getStatusBadge(business.metadata?.status)}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col text-sm text-muted-foreground">
                            {business.contact?.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{business.contact.phone}</span>
                              </div>
                            )}
                            {addressText && (
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-32" title={addressText}>
                                  {addressText}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>} />
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem render={<Link href={`${publicBasePath}/${business._id}`}><Eye className="h-4 w-4 mr-2" />View Details</Link>} />
                              <DropdownMenuItem render={<Link href={`${adminBasePath}/${business._id}/edit`}><Edit className="h-4 w-4 mr-2" />Edit Business</Link>} />
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onSelect={() => handleToggleVerified(business._id)}>
                                {business.metadata?.isVerified ? (
                                  <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Remove Verified
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Verified
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => handleStatusChange(business._id, "active")}
                              >
                                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                Set Active
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => handleStatusChange(business._id, "pending")}
                              >
                                <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                                Set Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => handleStatusChange(business._id, "inactive")}
                              >
                                <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                Set Inactive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onSelect={() => setBusinessToDelete(business)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={
                        currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber: number;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={businessToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setBusinessToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete business?</AlertDialogTitle>
            <AlertDialogDescription>
              {`This will permanently remove ${
                businessToDelete
                  ? typeof businessToDelete.name === "string"
                    ? businessToDelete.name
                    : businessToDelete.name?.english ||
                      businessToDelete.name?.tagalog ||
                      "this business"
                  : "this business"
              } from the directory.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBulkDelete} onOpenChange={setShowBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} businesses?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {selectedIds.size} selected businesses from the
              directory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                void handleBulkDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
