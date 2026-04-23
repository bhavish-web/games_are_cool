"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Gamepad2, Trophy, Zap, Star } from "lucide-react";

const STATS = [
  { icon: Gamepad2, value: 5, suffix: "", label: "Premium Games", color: "text-purple-400" },
  { icon: Trophy, value: 8, suffix: "+", label: "Achievements", color: "text-yellow-400" },
  { icon: Zap, value: 3, suffix: "", label: "Difficulty Levels", color: "text-blue-400" },
  { icon: Star, value: 100, suffix: "%", label: "Browser Native", color: "text-green-400" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black font-display gradient-text mb-2">
              Built for Champions
            </h2>
            <p className="text-muted-foreground">
              Everything you need for the ultimate browser gaming experience
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-white/5 
                                border border-white/10 flex items-center justify-center
                                group-hover:border-white/20 transition-all duration-300`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`text-4xl sm:text-5xl font-black font-display ${stat.color} mb-2`}>
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
