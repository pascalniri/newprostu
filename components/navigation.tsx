import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useUniversities } from "@/hooks/useUniversities";

export default function Navigation() {
  const router = useRouter();
  const { universities, isLoading } = useUniversities();
  return (
    <section className="w-full bg-white flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-4 rounded-lg border border-[#E5E7EB]">
      <div className="flex items-center gap-2">
        <span className="w-12 h-12 rounded-lg bg-[#F6F3ED]"></span>
        <span className="flex flex-col ">
          <h1 className="text-lg font-semibold">College Q&A Hub</h1>
          <p className="text-gray-500">Ask, answer, and share resources</p>
        </span>
      </div>
      <div className="flex items-center md:justify-end justify-between w-full md:w-auto gap-10">
        <Select>
          <SelectTrigger className="p-2 w-32 rounded border border-[#E5E7EB] bg-[#F6F3ED]">
            <SelectValue placeholder="Select University" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading">Loading...</SelectItem>
            ) : (
              universities.map((uni) => (
                <SelectItem key={uni.id} value={uni.id}>
                  {uni.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-4">
          <h1
            onClick={() => router.push("/")}
            className="font-semibold cursor-pointer"
          >
            Home
          </h1>
          <h1
            onClick={() => router.push("/ask-share")}
            className="font-semibold cursor-pointer"
          >
            Ask/Share
          </h1>
          <Button
            onClick={() => router.push("/admin/login")}
            className="cursor-pointer"
          >
            Login
          </Button>
        </div>
      </div>
    </section>
  );
}
