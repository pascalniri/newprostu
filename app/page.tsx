import ApprovedQuestionsResources from "@/components/approved-questions-resources";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/ui/navigation";

export default function Home() {
  return (
    <main>
      <Navigation />

      {/* Hero Section */}
      <div className="relative bg-[#00274C] text-white min-h-[60vh] flex items-center pt-40 flex-col w-full">
        {/* Top Fade Grid Background */}
        <div className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        linear-gradient(to right, #e2e8f011 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f011 1px, transparent 1px)
      `,
            backgroundSize: "20px 30px",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          }}
        />
        <div className="z-5 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome to UMich Questions & <br /> Answers Hub
          </h1>
          <p className="text-sm mx-auto max-w-2xl text-gray-200">
            Ask questions, share your knowledge, and collaborate with fellow
            students. Whether you're seeking help or offering expertise, this is
            your space to grow together.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button variant="secondary">Get Started</Button>
            <Button variant="tertiary">Learn More</Button>
          </div>
        </div>
      </div>
      <ApprovedQuestionsResources />
    </main>
  );
}
