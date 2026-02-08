"use client";

import { motion } from "framer-motion";
import { Layout, Zap, ShieldCheck, Box } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: Layout,
    title: "Kanban for pros",
    description:
      "Visual drag and drop interface. Move cards, assign members, and filter views instantly.",
  },
  {
    icon: Zap,
    title: "0.2s Interactions",
    description:
      "Optimized for speed. No loading spinners, no lag. Built on Next.js 15.",
  },
  {
    icon: Box,
    title: "Workspaces",
    description:
      "Manage multiple projects, clients, or teams from a single command center.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Ready",
    description:
      "Enterprise-grade security with SSO and role-based access control included.",
  },
];

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // optional gsap entry animation could go here
  }, []);

  return (
    <section className="py-32 px-4 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto" ref={containerRef}>
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Designed for engineering teams
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stop fighting your tools. TaskFlow works the way you code.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
