"use client";

import { motion } from "framer-motion";
import { Target, Rocket, Sparkles } from "lucide-react";
import { typography } from "@/lib/design-tokens";

const benefits = [
  {
    icon: Target,
    title: "Stay Focused",
    description:
      "Clear visual organization helps you prioritize what matters most.",
  },
  {
    icon: Rocket,
    title: "Move Faster",
    description:
      "Streamlined workflows mean you spend less time managing and more time doing.",
  },
  {
    icon: Sparkles,
    title: "Work Smarter",
    description:
      "Powerful features that adapt to your workflow, not the other way around.",
  },
];

const stats = [
  { value: "100K+", label: "Active Users" },
  { value: "1M+", label: "Tasks Completed" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

export function Benefits() {
  return (
    <section className="py-24 px-4 bg-white border-t border-gray-100 relative overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none opacity-60" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className={`${typography.h2} mb-6 text-gray-900`}>
          Why Teams Love TaskFlow
        </h2>
        <p className="text-xl text-gray-600 mb-20 max-w-2xl mx-auto">
          Join thousands of teams who have transformed their workflow with our
          simple, powerful tools.
        </p>

        <div className="grid md:grid-cols-3 gap-12 mb-24">
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2 text-gray-900">
                {stat.value}
              </div>
              <div className="text-gray-500 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
