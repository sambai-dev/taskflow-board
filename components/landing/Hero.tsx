"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  ArrowRight,
  GitCommitHorizontal,
  Circle,
  CheckCircle2,
} from "lucide-react";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { animation } from "@/lib/design-tokens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { isSignedIn } = useUser();

  useEffect(() => {
    // GSAP functionality removed for static hero visual
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center px-4 overflow-hidden pt-36 pb-20 bg-white"
    >
      {/* Light Mode Static Gradient Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 0%, #f0f7ff 0%, #ffffff 100%),
            radial-gradient(circle at 50% 30%, rgba(59, 130, 246, 0.05), transparent 50%)
          `,
        }}
      />

      {/* Subtle Grid Pattern for Technical Feel */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Social Proof Badge - Light Mode */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm text-blue-800 pointer-events-none shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-semibold">v0.1.0</span> - Now open for early
          access
        </motion.div>

        <motion.h1
          {...animation.fadeIn}
          className="text-5xl md:text-7xl font-extrabold text-center mb-6 text-gray-900 tracking-tight leading-[1.15] max-w-5xl"
        >
          Ship <span className="text-blue-600">2x faster</span> with
          developer-first task management
        </motion.h1>

        <motion.p
          {...animation.fadeIn}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mb-10 leading-relaxed"
        >
          The Kanban board that syncs with your git commits. No Jira bloat, just
          speed. Built for teams who ship daily.
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
                className="px-8 py-4 bg-gray-900 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-lg"
              >
                Go to Dashboard
              </motion.button>
            </Link>
          ) : (
            <SignUpButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-900 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-lg"
              >
                Start Building - Free
              </motion.button>
            </SignUpButton>
          )}

          <Link
            href="/pricing"
            className="group flex items-center gap-2 px-8 py-4 text-gray-600 font-medium text-lg hover:text-gray-900 transition-colors"
          >
            See plans
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* Browser Mockup / Product Demo - Light Mode */}
      <motion.div
        initial={{ opacity: 0, y: 100, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
        className="hero-visual mt-20 w-full max-w-6xl px-4 perspective-1000"
        style={{ perspective: "1000px" }}
      >
        <div className="bg-white rounded-xl ring-1 ring-gray-200 shadow-2xl relative overflow-hidden transform-style-3d rotate-x-12">
          {/* Window Header */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="bg-white px-3 py-1 rounded-md text-xs text-gray-400 font-mono flex-1 text-center border border-gray-200 shadow-sm">
              taskflow.app/board/v0.1
            </div>
          </div>

          {/* Application UI Mockup */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/30">
            {/* Column 1: Backlog */}
            <div className="bg-gray-100/50 rounded-lg p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 font-medium text-sm">
                  Backlog
                </span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  4
                </span>
              </div>
              {/* Card 1 */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    Feat
                  </span>
                </div>
                <p className="text-gray-800 text-sm font-medium mb-3 group-hover:text-blue-600 transition-colors">
                  Implement dark mode toggle
                </p>
                <div className="flex items-center justify-between">
                  <GitCommitHorizontal className="w-4 h-4 text-gray-400" />
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-100 to-blue-100 border border-white" />
                </div>
              </div>
              {/* Card 2 */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    Chore
                  </span>
                </div>
                <p className="text-gray-800 text-sm font-medium mb-3">
                  Update dependency versions
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">#294</span>
                  <div className="w-6 h-6 rounded-full bg-gray-100 border border-white" />
                </div>
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="bg-blue-50/50 rounded-lg p-4 flex flex-col gap-3 border border-blue-100/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-700 font-medium text-sm">
                  In Progress
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  2
                </span>
              </div>
              {/* Card Active */}
              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-md relative">
                <div className="absolute left-0 top-4 bottom-4 w-1 bg-blue-500 rounded-r-full" />
                <p className="text-gray-900 text-sm font-medium mb-3 pl-2">
                  Optimize dashboard rendering
                </p>
                <div className="flex items-center justify-between pl-2">
                  <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                    <Circle className="w-3 h-3 fill-blue-600" />
                    <span>Running tests...</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white" />
                </div>
              </div>
            </div>

            {/* Column 3: Done */}
            <div className="bg-gray-100/50 rounded-lg p-4 flex flex-col gap-3 hidden md:flex">
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-600 font-medium text-sm">Done</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  12
                </span>
              </div>
              {/* Card Done */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm opacity-60 hover:opacity-100 transition-opacity">
                <p className="text-gray-500 text-sm font-medium mb-3 line-through decoration-gray-300">
                  Fix landing page CLS
                </p>
                <div className="flex items-center justify-between">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-400">Merged 2h ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gradient Overlay for Fade Effect */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </section>
  );
}
