import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Navigation() {
    const router = useRouter();
    return (
         <section className="w-full bg-white flex items-center justify-between p-4 rounded-lg border border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <span className="w-12 h-12 rounded-lg bg-[#F6F3ED]"></span>
          <span className="flex flex-col ">
            <h1 className="text-lg font-semibold">College Q&A Hub</h1>
            <p className="text-gray-500">Ask, answer, and share resources</p>
          </span>
        </div>
        <div className="flex items-center gap-10">
          <select
            name="grade-level"
            id="grade-level"
            className="p-2 w-32 rounded border border-[#E5E7EB] bg-[#F6F3ED]"
          >
            <option value="all">All</option>
            <option value="10th">10th</option>
            <option value="11th">11th</option>
            <option value="12th">12th</option>
          </select>

          <div className="flex items-center gap-4">
            <h1 onClick={() => router.push("/")} className="font-semibold cursor-pointer">Home</h1>
            <h1 onClick={() => router.push("/ask-share")} className="font-semibold cursor-pointer">Ask/Share</h1>
            <Button onClick={() => router.push("/admin/login")} className="cursor-pointer">Login</Button>
          </div>
        </div>
      </section>
    );
}