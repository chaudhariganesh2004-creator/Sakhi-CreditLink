import { AnimatedMarqueeHero } from "@/components/ui/hero-3";

const SHG_DEMO_IMAGES = [
  "/images/shg-hero.jpg",
  "/images/shg-food.jpg",
  "/images/shg-dairy.jpg",
  "/images/shg-tailoring.jpg",
  "/images/shg-hero.jpg",
  "/images/shg-food.jpg",
  "/images/shg-dairy.jpg",
  "/images/shg-tailoring.jpg",
];

const AnimatedHeroDemo = () => {
  return (
    <AnimatedMarqueeHero
      tagline="SEVA First Innovation · PS000311 · Gujarat SHG Credit Gateway"
      title={
        <>
          From Credit Targets
          <br />
          to Real Bank Access
        </>
      }
      description="Sakhi CreditLink helps Sakhi Mandals verify LokOS identity, size working capital vs Capex against RBI's 6× corpus norm, match Gujarat & GLPC schemes, and track bank SLAs."
      ctaText="Enter as SHG / Bank Sakhi"
      images={SHG_DEMO_IMAGES}
    />
  );
};

export default AnimatedHeroDemo;
