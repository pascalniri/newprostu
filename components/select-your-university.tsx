import { Skeleton } from "./ui/skeleton";

export default function SelectYourUniversity({
  submissions,
  isLoading,
  universities,
}: {
  submissions: any[];
  isLoading: boolean;
  universities: any[];
}) {
  return (
    <div className="min-h-[60vh] w-full bg-white flex flex-col gap-2 items-start justify-start p-4 rounded-lg border border-[#E5E7EB]">
      <h1 className="text-lg font-semibold">Select Your University</h1>
      {isLoading ? (
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="w-full h-10" />
          <div className="grid grid-cols-2 gap-2 w-full">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-10" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full border border-[#E5E7EB] rounded p-3 mb-2"
          />
          <div className="grid grid-cols-2 gap-2 w-full">
            {universities.map((university) => (
              <div
                key={university.id}
                className="flex items-center justify-between bg-[#F6F3ED] p-3 rounded cursor-pointer hover:bg-[#F6F3ED]/80 font-semibold"
              >
                <p>{university.name}</p>
                <p>{university.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
