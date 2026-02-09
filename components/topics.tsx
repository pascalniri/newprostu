import { useTopics } from "@/hooks";
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

export default function Topics() {
  const { topics, isLoading } = useTopics();
  const router = useRouter();

  return (
    <section className="w-full flex flex-col items-start justify-center">
      <h1 className="text-[15px] font-semibold mb-4">Manage Topics</h1>

      {isLoading ? (
        <div className="w-full border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Created At</TableHead>
                <TableHead className="font-semibold">Updated At</TableHead>
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
                    <Skeleton className="h-6 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
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
      ) : topics.length === 0 ? (
        <div className="w-full text-center py-12 text-gray-500">
          No topics found
        </div>
      ) : (
        <div className="w-full border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Created At</TableHead>
                <TableHead className="font-semibold">Updated At</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow
                  key={topic.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/admin/topics/${topic.id}`)}
                >
                  <TableCell className="font-medium max-w-xs truncate">
                    {topic.name}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {topic.description}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs text-white px-2 py-1 rounded ${topic.is_active === true ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {topic.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {formatDate(topic.created_at)}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {formatDate(topic.updated_at)}
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
