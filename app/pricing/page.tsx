import { PricingTable } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="py-12 container mx-auto px-4">
        <div className="mb-8">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Link>
          </Button>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 text-xl">
            Select the perfect plan for your needs
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <PricingTable newSubscriptionRedirectUrl="/dashboard" />
        </div>
      </div>
    </div>
  );
}
