import { LandingAuthCheck } from "@/components/auth/LandingAuthCheck";
import { LandingButtons } from "@/components/landing/LandingButtons";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Trello } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignUpButton } from "@clerk/nextjs";
import { typography } from "@/lib/design-tokens";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Benefits } from "@/components/landing/Benefits";
import { SystemStatus } from "@/components/landing/SystemStatus";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <LandingAuthCheck />
      <Navbar />

      <Hero />
      <Features />
      <Benefits />

      {/* Pricing Section */}
      <section
        className="container mx-auto px-4 py-24 border-t border-gray-100"
        id="pricing"
      >
        <div className="text-center mb-16">
          <h2 className={`${typography.h2} text-gray-900 mb-4`}>
            Simple, Transparent Pricing
          </h2>
          <p className={`${typography.body} text-gray-600 max-w-2xl mx-auto`}>
            Start free and upgrade as you grow. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-white border-gray-200 text-gray-900 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8">
              <CardTitle className="text-2xl mb-2 font-bold text-gray-900">
                Free
              </CardTitle>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">1 Board</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Unlimited Tasks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Basic Features</span>
                </li>
              </ul>
              <SignUpButton mode="modal">
                <Button
                  className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                  size="lg"
                >
                  Get Started
                </Button>
              </SignUpButton>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-white border-blue-200 shadow-xl relative scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-blue-600 text-white px-4 py-1 hover:bg-blue-700 border-none">
                Most Popular
              </Badge>
            </div>
            <CardContent className="p-8">
              <CardTitle className="text-2xl mb-2 font-bold text-gray-900">
                Pro
              </CardTitle>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$4.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Unlimited Boards</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Advanced Features</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Priority Support</span>
                </li>
              </ul>
              <SignUpButton mode="modal">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200/50"
                  size="lg"
                >
                  Start Pro Trial
                </Button>
              </SignUpButton>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="bg-white border-gray-200 text-gray-900 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8">
              <CardTitle className="text-2xl mb-2 font-bold text-gray-900">
                Enterprise
              </CardTitle>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$19.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Custom Integrations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Dedicated Support</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full border-gray-200 text-gray-900 hover:bg-gray-50"
                size="lg"
              >
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 pt-24 pb-32">
        <div className="bg-blue-600 rounded-3xl p-12 sm:p-20 text-center text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className={`${typography.h2} mb-6 text-white`}>
              Ready to Ship Faster?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              See how TaskFlow can streamline your development workflow. Start
              free today - no credit card required.
            </p>
            {/* Client-side buttons to allow SSG for the page */}
            <LandingButtons />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 text-gray-600 py-16 border-t border-gray-200 relative overflow-hidden">
        {/* Subtle Footer Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <Link
                href="/"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-blue-600 p-1.5 rounded-lg">
                    <Trello className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    TaskFlow
                  </span>
                </div>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed">
                The modern task management platform for developer teams.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-6">Company</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 hover:translate-x-1 transition-all inline-block"
                  >
                    Enterprise
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-blue-600 hover:translate-x-1 transition-all inline-block"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 hover:translate-x-1 transition-all inline-block"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 hover:translate-x-1 transition-all inline-block"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-6">Resources</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 hover:translate-x-1 transition-all inline-block"
                  >
                    Docs
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/sambai-dev/taskflow-board"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 hover:translate-x-1 transition-all inline-block"
                  >
                    View on GitHub
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-6">Status</h3>
              <SystemStatus />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
