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
import { SignedIn, SignedOut, SignUpButton, useUser } from "@clerk/nextjs";
import { animation } from "@/lib/design-tokens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-36 pb-20 bg-white"
    >
      {/* --- BACKGROUND LAYERS --- */}

      {/* 1. Flat White Base (No Gradient) - Vanta Style */}
      {/* Grid Pattern Only */}

      {/* Subtle Grid Pattern for Technical Feel */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* 3. Ambient "Ghost" Board (Depth Layer) - Light Mode Version */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[140%] max-w-[1200px] h-[800px] opacity-[0.2] grayscale blur-[1px]"
          style={{
            transform: "perspective(1000px) rotateX(20deg) rotateY(0deg)",
            maskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 80%, transparent)",
          }}
        >
          {/* Abstract Columns - Slate Borders */}
          <div className="grid grid-cols-3 gap-8 h-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border-x border-slate-100 h-full flex flex-col gap-6 p-4"
              >
                {/* Fake Cards - Slate */}
                {[1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    className="h-32 rounded-xl border border-slate-100 bg-slate-50/50"
                  />
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* --- FOREGROUND CONTENT --- */}

      <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto text-center">
        {/* Version Badge - Clean White/Gray (No Lavender) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm text-slate-600"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="font-semibold text-slate-900">v0.1.1</span>
          <span className="w-px h-3 bg-slate-200 mx-1" />
          <span className="text-slate-500">TaskFlow Board</span>
        </motion.div>

        <motion.h1
          {...animation.fadeIn}
          className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-950 mb-8 leading-[1.1] md:leading-[1.05]"
        >
          Ship{" "}
          <span className="text-blue-600 relative inline-block">
            2x faster
            {/* Dynamic Underline */}
            <svg
              className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path
                d="M0 5 Q 50 10 100 5"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
            </svg>
          </span>{" "}
          with <br className="hidden md:block" />
          developer-first tools
        </motion.h1>

        <motion.p
          {...animation.fadeIn}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl md:text-2xl text-slate-600 max-w-2xl mb-12 leading-relaxed"
        >
          The Kanban board that speaks your language. Syncs with git, automates
          your chores, and gets out of your way.
        </motion.p>

        <motion.div
          {...animation.fadeIn}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-center relative z-20"
        >
          {/* Main CTA - Brand Blue (Active Anchor) */}
          <div className="relative z-20">
            <SignedIn>
              <Link href="/dashboard">
                <button className="group relative px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg flex items-center gap-2 shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:bg-blue-500 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="group relative px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg flex items-center gap-2 shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:bg-blue-500 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]">
                  Start Building - Free
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </SignUpButton>
            </SignedOut>
          </div>

          <Link
            href="/pricing"
            className="flex items-center gap-2 px-8 py-4 text-slate-500 font-medium text-lg hover:text-slate-900 transition-colors"
          >
            See plans
          </Link>
        </motion.div>
      </div>

      {/* --- HERO VISUAL / PRODUCT SHOT --- */}
      <motion.div
        initial={{ opacity: 0, y: 100, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.4, type: "spring", bounce: 0.2 }}
        className="mt-20 w-full max-w-6xl px-4 relative z-10 perspective-1000"
      >
        {/* Floating Chips - Light Mode */}
        <FloatingBadge
          text="Merged PR #402"
          icon={<GitCommitHorizontal className="w-4 h-4 text-slate-600" />}
          className="absolute -top-12 -left-4 md:left-10 md:-top-8 rotate-[-6deg]"
          delay={1}
        />
        <FloatingBadge
          text="Tests Passed (142/142)"
          icon={<CheckCircle2 className="w-4 h-4 text-blue-600" />}
          className="absolute -top-6 -right-4 md:right-20 md:-top-16 rotate-[4deg]"
          delay={1.5}
        />

        {/* Main Glassmorphic Container - Light Mode */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl ring-1 ring-gray-900/5 shadow-[0_50px_100px_-20px_rgba(50,50,93,0.15)] overflow-hidden transform-style-3d">
          {/* Window Header - Monochrome */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-200/50 bg-gray-50/80">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
            </div>
            <div className="bg-white/50 px-3 py-1 rounded-md text-xs text-gray-400 font-mono flex-1 text-center border border-gray-200/50">
              taskflow.app
            </div>
          </div>

          {/* Application UI Mockup - Light Mode Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/30 min-h-[400px]">
            {/* Column 1: Backlog */}
            <div className="bg-gray-100/40 rounded-xl p-4 flex flex-col gap-3 group/col">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 font-semibold text-sm">
                  Backlog
                </span>
                <span className="text-xs bg-gray-200/50 text-gray-600 px-2 py-0.5 rounded-full">
                  4
                </span>
              </div>
              {/* Card */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200/60 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    Feat
                  </span>
                </div>
                <p className="text-gray-800 text-sm font-medium mb-3">
                  Implement dark mode
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200/60 opacity-60">
                <div className="h-2 w-12 bg-gray-100 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
              </div>
            </div>

            {/* Column 2: In Progress - Highlighted */}
            <div className="bg-blue-50/30 rounded-xl p-4 flex flex-col gap-3 ring-1 ring-blue-100/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-700 font-semibold text-sm">
                  In Progress
                </span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  2
                </span>
              </div>

              {/* Active Card */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white p-4 rounded-xl border-l-[3px] border-l-blue-500 border-y border-r border-gray-200/60 shadow-lg shadow-blue-900/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                    High
                  </span>
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 rounded-full bg-blue-100 border border-white"></div>
                    <div className="w-5 h-5 rounded-full bg-slate-100 border border-white"></div>
                  </div>
                </div>
                <p className="text-gray-900 text-sm font-medium mb-4">
                  Optimize rendering engine
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <GitCommitHorizontal className="w-3 h-3" />
                  <span>24a8b...9c</span>
                </div>
              </motion.div>
            </div>

            {/* Column 3: Done */}
            <div className="bg-gray-100/40 rounded-xl p-4 flex flex-col gap-3 hidden md:flex">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600 font-semibold text-sm">
                  Done
                </span>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                  12
                </span>
              </div>
              <div className="bg-white/60 p-4 rounded-xl border border-gray-200/40">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-medium">Completed</span>
                </div>
                <p className="text-gray-400 line-through text-sm">
                  Fix unexpected padding
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Fade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none" />
        </div>
      </motion.div>

      {/* Decorative Glow Behind Hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-400/20 blur-[120px] rounded-full -z-10 mix-blend-multiply pointer-events-none" />
    </section>
  );
}

// Helper Component for floating chips
function FloatingBadge({
  text,
  icon,
  className,
  delay,
}: {
  text: string;
  icon: React.ReactNode;
  className?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className={`z-20 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-100 text-sm font-medium text-gray-700 whitespace-nowrap"
      >
        {icon}
        {text}
      </motion.div>
    </motion.div>
  );
}
