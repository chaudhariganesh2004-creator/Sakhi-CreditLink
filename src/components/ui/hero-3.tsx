"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  images: string[];
  className?: string;
  onCtaClick?: () => void;
  ctaClassName?: string;
}

const ActionButton = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={cn(
      "mt-8 px-8 py-3.5 rounded-full bg-[var(--sakhi-forest,#0D4F3C)] text-white font-semibold shadow-lg transition-colors hover:bg-[var(--sakhi-forest-deep,#0A3D2E)] focus:outline-none focus:ring-2 focus:ring-[var(--sakhi-forest,#0D4F3C)]/50",
      className
    )}
  >
    {children}
  </motion.button>
);

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  images,
  className,
  onCtaClick,
  ctaClassName,
}) => {
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 },
    },
  };

  const duplicatedImages = [...images, ...images];

  return (
    <section
      className={cn(
        "relative w-full min-h-[760px] h-[92vh] overflow-hidden flex flex-col items-center justify-center text-center px-4",
        className
      )}
    >
      <div className="z-10 flex flex-col items-center max-w-4xl pb-36 md:pb-44">
        {/* Tagline */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="mb-5 inline-flex items-center gap-2 rounded-full ios-pill px-4 py-1.5 text-sm font-medium text-[var(--sakhi-slate)]"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot" />
          {tagline}
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="font-display text-5xl md:text-7xl tracking-tight text-[var(--sakhi-slate)] leading-[1.06]"
        >
          {typeof title === "string"
            ? title.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={FADE_IN_ANIMATION_VARIANTS}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))
            : title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.35 }}
          className="mt-6 max-w-2xl text-base md:text-lg text-[var(--sakhi-muted)] leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Call to Action Button */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.45 }}
        >
          <ActionButton onClick={onCtaClick} className={ctaClassName}>
            {ctaText}
          </ActionButton>
        </motion.div>
      </div>

      {/* Animated Image Marquee */}
      <div className="absolute bottom-0 left-0 w-full h-56 md:h-72 [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_85%,transparent)]">
        <motion.div
          className="flex gap-4 w-max"
          animate={{
            x: ["-50%", "0%"],
            transition: {
              ease: "linear",
              duration: 40,
              repeat: Infinity,
            },
          }}
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] h-48 md:h-64 flex-shrink-0"
              style={{
                rotate: `${index % 2 === 0 ? -2 : 5}deg`,
              }}
            >
              <img
                src={src}
                alt={`SHG enterprise showcase ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl shadow-lg border border-white/70"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
