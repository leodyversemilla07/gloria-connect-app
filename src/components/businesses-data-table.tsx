"use client"

import * as React from "react"
import { z } from "zod"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Eye, Pencil, Trash2, MoreVertical } from "lucide-react"
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender, SortingState, ColumnDef, VisibilityState } from "@tanstack/react-table"
import Link from "next/link"

export const businessSchema = z.object({
    id: z.string(),
    name: z.object({
        english: z.string(),
        tagalog: z.string(),
    }),
    category: z.object({
        primary: z.string(),
        secondary: z.array(z.string()),
    }),
    contact: z.object({
        phone: z.string(),
        email: z.string(),
        website: z.string(),
    }),
    address: z.object({
        street: z.string(),
        barangay: z.string(),
        coordinates: z.object({
            latitude: z.number(),
            longitude: z.number(),
        }),
    }),
    metadata: z.object({
        dateAdded: z.string(),
        lastUpdated: z.string(),
        isVerified: z.boolean(),
        status: z.enum(["active", "pending", "inactive"]),
        target: z.string().optional(),
        limit: z.string().optional(),
        reviewer: z.string().optional(),
    }),
})

export type Business = z.infer<typeof businessSchema>

const columns: ColumnDef<Business>[] = [
    {
        accessorKey: "name",
        header: "Business Name",
        cell: ({ row }) => row.original.name.english || row.original.name.tagalog || "-",
    },
    {
        accessorKey: "category.primary",
        header: "Category",
        cell: ({ row }) => <Badge variant="outline">{row.original.category.primary}</Badge>,
    },
    {
        accessorKey: "contact.phone",
        header: "Phone",
        cell: ({ row }) => row.original.contact.phone || "-",
    },
    {
        accessorKey: "contact.email",
        header: "Email",
        cell: ({ row }) => row.original.contact.email || "-",
    },
    {
        accessorKey: "metadata.status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={
                row.original.metadata.status === "active"
                    ? "default"
                    : row.original.metadata.status === "pending"
                        ? "secondary"
                        : "outline"
            }>
                {row.original.metadata.status.charAt(0).toUpperCase() + row.original.metadata.status.slice(1)}
            </Badge>
        ),
    },
    {
        accessorKey: "metadata.isVerified",
        header: "Is Verified",
        cell: ({ row }) => row.original.metadata.isVerified ? "Yes" : "No",
    },
    {
        accessorKey: "metadata.dateAdded",
        header: "Date Added",
        cell: ({ row }) => new Date(row.original.metadata.dateAdded).toLocaleDateString(),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="px-2 py-1">
                        <MoreVertical className="w-5 h-5" />
                        <span className="sr-only">Open actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => alert(`View business: ${row.original.id}`)}>
                        <Eye className="w-4 h-4 mr-2" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/businesses/${row.original.id}/edit`}>
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this business?')) {
                                alert(`Delete business: ${row.original.id}`)
                            }
                        }}
                        className="text-red-600"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

interface BusinessesDataTableProps {
  data?: Business[];
  onView?: (biz: Business) => void;
  onEdit?: (biz: Business) => void;
  onDelete?: (biz: Business) => void;
}

export function BusinessesDataTable({ data, onView, onEdit, onDelete }: BusinessesDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  // Columns with handlers
  const actionColumns: ColumnDef<Business>[] = columns.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="px-2 py-1">
                <MoreVertical className="w-5 h-5" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(row.original)}>
                <Eye className="w-4 h-4 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
                <Pencil className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(row.original)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      };
    }
    return col;
  });

  const table = useReactTable({
    data: data || [],
    columns: actionColumns,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (!data || data.length === 0) {
    return <div className="w-full text-center py-8 text-muted-foreground">No businesses found.</div>
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border bg-background">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">No businesses found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="text-muted-foreground text-sm">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            First
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            Last
          </Button>
        </div>
      </div>
    </div>
  )
}
