import { useUniversities } from "@/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import formatDate from "@/lib/utils/date-formatter";
import { Button } from "./ui/button";

export default function Universities() {
  const { universities, isLoading } = useUniversities();
  const router = useRouter();

  return (
    <section className="w-full flex flex-col items-start justify-center">
      <div className="w-full flex items-center justify-between mb-4">
        <h1 className="text-[15px] font-semibold ">Manage Universities</h1>
        <Button
          onClick={() => router.push("/admin/universities/create")}
          className="bg-[#F6F3ED] hover:bg-[#F6F3ED]/80 text-black border border-gray-200"
        >
          Create University
        </Button>
      </div>

      {isLoading ? (
        <div className="w-full border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Topic</TableHead>
                <TableHead className="font-semibold">School</TableHead>
                <TableHead className="font-semibold">Submitted</TableHead>
                <TableHead className="font-semibold">University</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[80px] rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Skeleton className="h-8 w-[70px]" />
                      <Skeleton className="h-8 w-[70px]" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : universities.length === 0 ? (
        <div className="w-full text-center py-12 text-gray-500">
          No universities found
        </div>
      ) : (
        <div className="w-full border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Abbreviation</TableHead>
                <TableHead className="font-semibold">Color Primary</TableHead>
                <TableHead className="font-semibold">Color Secondary</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Created At</TableHead>
                <TableHead className="font-semibold">Updated At</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universities.map((university) => (
                <TableRow
                  key={university.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    router.push(`/admin/universities/${university.id}`)
                  }
                >
                  <TableCell className="font-medium max-w-xs truncate">
                    {university.name}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {university.abbreviation}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {university.color_primary}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600 max-w-xs truncate">
                    {university.color_secondary}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs text-white px-2 py-1 rounded ${university.is_active === true ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {university.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {formatDate(university.created_at)}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {formatDate(university.updated_at)}
                  </TableCell>
                  <TableCell
                    className="flex justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer">
                      <Eye size={16} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
