import { AnimatedMarqueeHero } from "@/components/ui/hero-3";

const DEMO_IMAGES = [
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
      tagline="SFIC 2026 · Gujarat SHG Credit Gateway"
      title={
        <>
          From Group Savings
          <br />
          to Enterprise Credit
        </>
      }
      description="Sakhi CreditLink diagnoses SHG cash flows, matches DAY-NRLM & PMFME schemes, and prepares bank-ready application packs."
      ctaText="Start Credit Application"
      images={DEMO_IMAGES}
    />
  );
};

export default AnimatedHeroDemo;
