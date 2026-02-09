"use client";

import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";
import UpdatePasswordDialog from "@/dialogs/update-password";

export function AdminNav({
  user,
  loadingMe,
  getUser,
}: {
  user: any;
  loadingMe: boolean;
  getUser: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [openDialog, setOpenDialog] = useState(false);

  const navItems = [
    { label: "Submissions", path: "/admin" },
    { label: "Lookups", path: "/admin/lookups" },
  ];

  return (
    <section className="w-full bg-white  p-4 rounded-lg border border-[#E5E7EB] ">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
        <span className="w-10 h-10 rounded-md bg-[#F6F3ED] flex items-center justify-center text-black font-bold">
          A
        </span>
        <span className="flex flex-col">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </span>
      </div>
      <div className="flex items-center gap-4">
        {navItems.map((item) => (
          <h1
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`font-medium cursor-pointer px-4 py-2 rounded ${
              pathname === item.path
                ? "text-black font-semibold bg-[#F6F3ED]"
                : "text-gray-600 hover:text-gray-700"
            }`}
          >
            {item.label}
          </h1>
        ))}
        <div
          onClick={() => setOpenDialog(true)}
          className="border border-gray-200 hover:border-gray-400 rounded-full p-2 pr-6 w-[200px] cursor-pointer transition-all duration-300 ease-in-out"
        >
          {loadingMe ? (
            <Skeleton className="w-[180px] h-8 rounded-full" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#F6F3ED] flex items-center justify-center text-black font-bold">
                {user?.email.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <h1 className="text-[10px] font-medium">{user?.email}</h1>
                <p className="text-[10px] font-medium text-gray-500">
                  {user?.role || "Not Available"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      {openDialog && <UpdatePasswordDialog open={openDialog} setOpen={setOpenDialog} />}
    </section>
  );
}
