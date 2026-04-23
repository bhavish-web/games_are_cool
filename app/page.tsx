import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { GameCards } from "@/components/landing/GameCards";
import { StatsSection } from "@/components/landing/StatsSection";
import { ParticleBackground } from "@/components/shared/ParticleBackground";

export const metadata: Metadata = {
  title: "GameVault — Premium Browser Gaming Platform",
};

export default function HomePage() {
  return (
    <>
      <ParticleBackground />
      <div className="relative z-10">
        <Hero />
        <GameCards />
        <StatsSection />
      </div>
    </>
  );
}
