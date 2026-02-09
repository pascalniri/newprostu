export default function CampusMap() {
  return (
    <div className="min-h-[60vh] w-full bg-white flex flex-col gap-2 items-start justify-start p-4 rounded-lg border border-[#E5E7EB]">
      <h1 className="text-lg font-semibold">Campus Map</h1>
      <div className="bg-[#F6F3ED] w-full h-full flex-1 rounded-lg p-2"></div>
      <p className="text-gray-500 text-xs">Tip: Select a university below to enter its community.</p>
    </div>
  );
}
