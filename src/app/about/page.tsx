import type { Metadata } from "next";

import { SiteHeader } from "@/components/SiteHeader";

import { AboutHorizontalExperience } from "./AboutHorizontalExperience";

export const metadata: Metadata = {
  title: "About — Dark Star",
  description:
    "What Dark Star is, who it is for, and how this experiment fits together.",
};

export default function AboutPage() {
  return (
    <div className="relative flex flex-col">
      <SiteHeader />
      <AboutHorizontalExperience />
    </div>
  );
}
