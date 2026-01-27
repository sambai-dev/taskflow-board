"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Trello, Zap, Users, Palette, Lock, BarChart3 } from "lucide-react";
import { typography, animation } from "@/lib/design-tokens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: Trello,
    title: "Drag & Drop Tasks",
    description:
      "Effortlessly organize your work with intuitive drag-and-drop functionality across boards and columns.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "See changes instantly as your team collaborates. Stay synchronized without refreshing.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Work together seamlessly with your team. Share boards and manage projects collectively.",
  },
  {
    icon: Palette,
    title: "Customizable Boards",
    description:
      "Personalize your workspace with custom colors, labels, and board configurations.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your data is protected with enterprise-grade security and authentication.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description:
      "Monitor your projects with built-in analytics and progress tracking features.",
  },
];

export function Features() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll(".feature-card");

    if (cards) {
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
        },
      });
    }
  }, []);

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`${typography.h2} text-gray-900 mb-4`}>
            Everything You Need
          </h2>
          <p className={`${typography.body} text-gray-600 max-w-2xl mx-auto`}>
            Powerful features designed to help you and your team work more
            efficiently.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                className="feature-card p-8 rounded-2xl border border-blue-100 bg-white"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className={`${typography.h3} mb-3 text-gray-900`}>
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
