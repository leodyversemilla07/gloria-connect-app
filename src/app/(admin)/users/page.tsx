import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminUsersPage() {
  return (
    <section className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 md:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <Button asChild>
            <Link href="#">Create User</Link>
          </Button>
        </div>
        <Table className="bg-white border rounded min-w-full text-sm">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Juan Dela Cruz</TableCell>
              <TableCell>juan@email.com</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>
                <Button variant="link" size="sm" className="text-blue-600 mr-2 p-0 h-auto">Edit</Button>
                <Button variant="link" size="sm" className="text-red-600 p-0 h-auto">Delete</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Maria Santos</TableCell>
              <TableCell>maria@email.com</TableCell>
              <TableCell>Inactive</TableCell>
              <TableCell>
                <Button variant="link" size="sm" className="text-blue-600 mr-2 p-0 h-auto">Edit</Button>
                <Button variant="link" size="sm" className="text-red-600 p-0 h-auto">Delete</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
  );
}
