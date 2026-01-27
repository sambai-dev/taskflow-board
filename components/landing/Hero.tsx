"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { typography, animation } from "@/lib/design-tokens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { isSignedIn } = useUser();

  useEffect(() => {
    // GSAP parallax effect on hero visual
    const ctx = gsap.context(() => {
      gsap.to(".hero-visual", {
        y: 100,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white to-blue-50 pt-20"
    >
      <motion.h1
        {...animation.fadeIn}
        className={`${typography.hero} text-center mb-6 text-gray-900 max-w-4xl`}
      >
        Organize Your Work, <span className="text-blue-600">Ship Faster</span>
      </motion.h1>

      <motion.p
        {...animation.fadeIn}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`${typography.body} text-gray-600 text-center max-w-2xl mb-10`}
      >
        The visual workspace where teams plan, organize, and collaborate.
        Simple, flexible, and powerful.
      </motion.p>

      <motion.div
        {...animation.fadeIn}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        {isSignedIn ? (
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow text-lg"
            >
              Go to Dashboard
            </motion.button>
          </Link>
        ) : (
          <SignUpButton mode="modal">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow text-lg"
            >
              Get Started Free
            </motion.button>
          </SignUpButton>
        )}

        <Link
          href="/pricing"
          className="group flex items-center gap-2 px-8 py-4 text-blue-600 font-semibold text-lg hover:bg-blue-50 rounded-lg transition-colors"
        >
          View Pricing
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* Single-color board mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="hero-visual mt-20 w-full max-w-5xl px-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-blue-100 relative overflow-hidden">
          {/* Window controls decoration */}
          <div className="flex gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-400/20" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
            <div className="w-3 h-3 rounded-full bg-green-400/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center mb-1">
                  <div
                    className={`h-4 rounded w-1/3 ${i === 1 ? "bg-blue-200" : "bg-blue-100"}`}
                  />
                  <div className="h-4 w-4 rounded-full bg-blue-100" />
                </div>

                {/* Task Cards */}
                {[1, 2].map((j) => (
                  <div
                    key={j}
                    className="bg-white p-3 rounded-lg shadow-sm border border-blue-50"
                  >
                    <div className="h-2 bg-blue-100 rounded mb-2 w-3/4" />
                    <div className="h-2 bg-blue-50 rounded mb-2 w-full" />
                    <div className="h-2 bg-blue-50 rounded w-1/2" />
                  </div>
                ))}
                {i === 1 && (
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-50">
                    <div className="h-2 bg-blue-100 rounded mb-2 w-3/4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Gradient Overlay for "infinite scroll" feel or depth */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </section>
  );
}
