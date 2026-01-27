"use client";

import { motion } from "framer-motion";
import { Target, Rocket, Sparkles } from "lucide-react";
import { typography } from "@/lib/design-tokens";

const benefits = [
  {
    icon: Target,
    title: "Stay Focused",
    description:
      "Opinionated Kanban for engineering work: statuses, priorities, and fields tuned for real dev workflows.",
  },
  {
    icon: Rocket,
    title: "Move Faster",
    description:
      "Snappy board interactions with Next.js App Router and optimistic UI.",
  },
  {
    icon: Sparkles,
    title: "Work Smarter",
    description:
      "Typed API layer, schema validation, and 106+ passing tests keep the board reliable as features evolve.",
  },
];

export function Benefits() {
  return (
    <section className="py-24 px-4 bg-white border-t border-gray-100 relative overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none opacity-60" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className={`${typography.h2} mb-6 text-gray-900`}>
          Why Engineers Love TaskFlow
        </h2>
        <p className="text-xl text-gray-600 mb-20 max-w-2xl mx-auto">
          Built as a production-ready portfolio project – fully typed, tested,
          and deployed with modern tooling.
        </p>

        <div className="grid md:grid-cols-3 gap-12">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-100 shadow-sm">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className={`${typography.h3} mb-3 text-gray-900`}>
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
