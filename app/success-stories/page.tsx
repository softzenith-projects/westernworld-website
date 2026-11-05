import type { Metadata } from "next";
import VideoStories from "@/components/VideoStories";
import WallOfWins from "@/components/WallOfWins";
import { CtaBand } from "@/components/blocks";
import { SCORECARDS, VISA_POSTERS, VISA_WINS } from "@/content/testimonials";

export const metadata: Metadata = {
  title: "Success stories",
  description: "4,000+ study visas and 5,000+ tourist visas: Western World students with their visas, congratulations posters and IELTS results, photographed at our office.",
};

export default function SuccessStoriesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark py-14 lg:py-20">
        <div className="map-grid absolute inset-0 opacity-30 [filter:invert(1)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4">
          <p className="tag text-sun">Success stories</p>
          <h1 className="mt-3 max-w-4xl text-4xl leading-[1.02] font-semibold text-white sm:text-6xl">
            4,000+ study visas and 5,000+ tourist visas. Here are {VISA_WINS.length} of them on camera.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            Every photo was taken at our office on the day a student collected their passport, plus {VISA_POSTERS.length} congratulations
            posters and {SCORECARDS.length} IELTS scorecards. Every one a real student.
          </p>

          <div className="mt-12"><WallOfWins /></div>

          <div className="mt-20 border-t border-white/10 pt-12">
            <h2 className="mb-8 text-3xl font-semibold text-white">Student video stories</h2>
            <VideoStories />
          </div>
        </div>
      </section>
      <CtaBand title="Your photo could be next." text="Book a free counselling session and start your journey." course="Free counselling" />
    </>
  );
}
