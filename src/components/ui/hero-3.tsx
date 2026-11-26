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
  secondaryActions?: React.ReactNode;
}

const ActionButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className="mt-7 min-h-[44px] px-7 py-3 rounded-full bg-[#0F5E4E] text-white font-semibold transition-colors hover:bg-[#0A4539] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E4E] focus-visible:ring-offset-2"
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
  secondaryActions,
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
        "relative w-full min-h-[720px] h-[88vh] overflow-hidden bg-[#FAF8F4] flex flex-col items-center justify-center text-center px-4",
        className
      )}
    >
      <div className="z-10 flex flex-col items-center max-w-4xl pb-44 md:pb-52">
        {/* Tagline */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="mb-4 inline-block rounded-full border border-[#DFDBD0] bg-white px-4 py-1.5 text-[13px] font-medium text-[#475467]"
        >
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
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#141A23] leading-[1.08]"
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
          className="mt-5 max-w-2xl text-[15.5px] md:text-lg text-[#475467] leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Call to Action Button */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.45 }}
          className="flex flex-col items-center gap-3"
        >
          <ActionButton onClick={onCtaClick}>{ctaText}</ActionButton>
          {secondaryActions}
        </motion.div>
      </div>

      {/* Animated SHG Group Photo Marquee */}
      <div className="absolute bottom-0 left-0 w-full h-48 md:h-64 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_85%,transparent)]">
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
              className="relative aspect-[3/4] h-44 md:h-60 flex-shrink-0"
              style={{
                rotate: `${index % 2 === 0 ? -2 : 5}deg`,
              }}
            >
              <img
                src={src}
                alt={`Sakhi Mandal SHG group enterprise ${index + 1}`}
                width={360}
                height={480}
                className="w-full h-full object-cover rounded-lg border border-[#DFDBD0]"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
