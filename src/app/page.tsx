const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Gallery", href: "#gallery" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
];

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
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold"
            >
              L
            </span>
            <span className="text-base font-semibold tracking-tight">Leonardo</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-zinc-400 transition hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="hidden rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:text-white sm:inline-flex"
            >
              Sign in
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.25),transparent_60%)]"
        />
        <div className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            New release — placeholder announcement
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Create production-quality
            <br />
            visuals with AI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-zinc-400">
            Generate, edit, and iterate on world-class images, illustrations, and
            assets. Built for creators, designers, and teams.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
            >
              Get started — it&apos;s free
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-100 transition hover:bg-white/10"
            >
              Watch demo
            </a>
          </div>

          {/* Hero visual placeholder */}
          <div className="mt-16 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 shadow-2xl">
            <div className="grid aspect-[16/9] grid-cols-3 gap-2 p-2">
              {galleryGradients.slice(0, 3).map((g, i) => (
                <div
                  key={i}
                  className={`rounded-xl bg-gradient-to-br ${g} opacity-90`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

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
              Made on Leonardo
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
                <span className="mb-4 inline-flex w-fit rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs font-medium text-violet-300 ring-1 ring-violet-500/40">
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
              <a
                href="#"
                className={`mt-8 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  tier.highlighted
                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                    : "border border-white/15 bg-white/5 text-zinc-100 hover:bg-white/10"
                }`}
              >
                {tier.cta}
              </a>
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
          <a
            href="#"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
          >
            Get started — it&apos;s free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold"
            >
              L
            </span>
            <span className="text-sm text-zinc-400">
              © {new Date().getFullYear()} Leonardo AI Project — placeholder
            </span>
          </div>
          <nav className="flex gap-6 text-sm text-zinc-500">
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
