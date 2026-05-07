const features = [
  {
    title: "Generate from prompts",
    body: "Turn natural-language descriptions into high-quality images in seconds.",
  },
  {
    title: "Refine and edit",
    body: "Iterate with in-painting, masking, and transformation tools.",
  },
  {
    title: "Custom models",
    body: "Train models on your own style or brand for consistent output.",
  },
  {
    title: "Production-ready assets",
    body: "Export at any resolution, with licensing built for commercial use.",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "Free",
    blurb: "Try the platform and explore community work.",
    perks: ["Daily generation credits", "Public gallery access", "Community models"],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Creator",
    price: "$12 / mo",
    blurb: "For individuals shipping work regularly.",
    perks: ["Monthly credit pool", "Private generations", "Priority queue"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Studio",
    price: "$36 / mo",
    blurb: "For freelancers and small teams.",
    perks: ["Higher credit pool", "All premium models", "Commercial license"],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Team",
    price: "Talk to us",
    blurb: "Custom volume, SSO, and support.",
    perks: ["Unlimited usage", "Shared workspaces", "API access"],
    cta: "Contact sales",
    highlighted: false,
  },
];

import { HeroParallax } from "@/components/HeroParallax";
import { PillCircleHoverLink } from "@/components/PillCircleHoverLink";
import StarBorder from "@/components/StarBorder";
import { SiteHeader } from "@/components/SiteHeader";

const galleryGradients = [
  "from-violet-500 via-fuchsia-500 to-rose-500",
  "from-cyan-400 via-blue-500 to-indigo-600",
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-amber-300 via-orange-500 to-rose-500",
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-sky-400 via-violet-500 to-fuchsia-500",
  "from-lime-400 via-emerald-500 to-teal-600",
  "from-rose-400 via-red-500 to-orange-500",
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <SiteHeader />

      <HeroParallax
        staticLines={{
          line1: "This is Dark Star",
          line2: "A vibe-coded experiment.",
        }}
        actions={
          <>
            <StarBorder
              glow="brand"
              speed="6.5s"
              thickness={0}
              className="inline-flex rounded-full"
              innerClassName="rounded-full [&_a]:inline-flex"
            >
              <PillCircleHoverLink
                variant="secondary"
                href="#"
                className="min-h-[3.25rem] border border-white/20 bg-transparent px-8 py-3.5 text-lg font-semibold"
              >
                The Center
              </PillCircleHoverLink>
            </StarBorder>
            <PillCircleHoverLink
              href="#"
              className="min-h-[3.25rem] border border-white/10 bg-white px-8 py-3.5 text-lg font-semibold"
              labelClassName="text-zinc-950"
            >
              Of the Universe
            </PillCircleHoverLink>
          </>
        }
        stickyScrollScreens={7}
        backgroundDrift={64}
        backgroundScale={0.08}
      />

      {/* Trust strip */}
      <section className="border-y border-white/5 bg-zinc-900/30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-6">
          <span className="text-xs uppercase tracking-widest text-zinc-500">
            Trusted by teams at
          </span>
          {["Acme", "Globex", "Initech", "Umbrella", "Soylent"].map((name) => (
            <span
              key={name}
              className="text-base font-semibold tracking-tight text-zinc-500"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto w-full max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-violet-400">Features</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to create
          </h2>
          <p className="mt-4 text-zinc-400">
            A complete suite of AI-powered creative tools, all in one platform.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-white/10 bg-zinc-900/40 p-6 transition hover:border-white/20"
            >
              <div className="mb-4 grid size-10 place-items-center rounded-lg bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 ring-1 ring-white/10">
                <span className="size-2 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="bg-zinc-900/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Made on Dark Star
            </h2>
            <p className="mt-4 text-zinc-400">
              A glimpse of what creators are making. Replace these tiles with real
              imagery later.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {galleryGradients.map((g, i) => (
              <div
                key={i}
                className={`aspect-square rounded-xl bg-gradient-to-br ${g}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto w-full max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Pricing
          </h2>
          <p className="mt-4 text-zinc-400">Pick a plan that fits your workflow.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border p-6 ${
                tier.highlighted
                  ? "border-violet-500/60 bg-gradient-to-b from-violet-500/10 to-zinc-900/40 ring-1 ring-violet-500/40"
                  : "border-white/10 bg-zinc-900/40"
              }`}
            >
              {tier.highlighted && (
                <span className="mb-4 inline-flex min-h-8 w-fit items-center rounded-full bg-violet-500/20 px-3.5 py-1.5 text-sm font-semibold text-violet-300 ring-1 ring-violet-500/40">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="mt-1 text-sm text-zinc-400">{tier.blurb}</p>
              <p className="mt-6 text-3xl font-semibold tracking-tight">
                {tier.price}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-zinc-300">
                {tier.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-violet-400"
                    >
                      <path
                        fill="currentColor"
                        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4L9 11.6l6.3-6.3a1 1 0 0 1 1.4 0Z"
                      />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
              {tier.highlighted ? (
                <PillCircleHoverLink
                  variant="primary"
                  href="#"
                  className="mt-8 min-h-[3.25rem] justify-center rounded-full border border-transparent bg-white px-7 py-3.5 text-lg font-semibold"
                  labelClassName="text-zinc-950"
                >
                  {tier.cta}
                </PillCircleHoverLink>
              ) : (
                <StarBorder
                  glow="brand"
                  speed="6.5s"
                  thickness={0}
                  className="mt-8 inline-flex w-full justify-center rounded-full"
                  innerClassName="rounded-full [&_a]:inline-flex"
                >
                  <PillCircleHoverLink
                    variant="secondary"
                    href="#"
                    className="min-h-[3.25rem] justify-center rounded-full border border-white/15 bg-transparent px-7 py-3.5 text-lg font-semibold"
                  >
                    {tier.cta}
                  </PillCircleHoverLink>
                </StarBorder>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/15 via-zinc-900/40 to-fuchsia-500/10 p-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to start creating?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-300">
            Join the placeholder community of creators building world-class assets
            with AI.
          </p>
          <PillCircleHoverLink
            href="#"
            className="mt-8 min-h-[3.375rem] justify-center rounded-full border border-transparent bg-white px-8 py-3.5 text-lg font-semibold"
            labelClassName="text-zinc-950"
          >
            Get started — it&apos;s free
          </PillCircleHoverLink>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="scroll-mt-24 border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[8px] font-bold leading-none tracking-tight"
            >
              DS
            </span>
            <span className="text-sm text-zinc-400">
              © {new Date().getFullYear()} Dark Star — placeholder
            </span>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-lg font-semibold text-zinc-500">
            <a href="#" className="transition hover:text-white">
              Terms
            </a>
            <a href="#" className="transition hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition hover:text-white">
              Docs
            </a>
            <a href="#" className="transition hover:text-white">
              Status
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
