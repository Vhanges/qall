export function WalkthroughHero() {
  return (
    <section className="relative z-[45] overflow-hidden bg-dark-900">
      {/* Gradient backdrop — consistent with other page heroes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0A0E17 0%, #0d1e35 55%, #0d2240 100%)",
        }}
      />
      {/* Ambient orange glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[160px] opacity-[0.08] pointer-events-none bg-orange-500" />
      {/* Bottom fade into page background */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-56 bg-gradient-to-b from-transparent to-dark-900" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center pt-32 pb-32 min-h-[60vh] flex flex-col items-center justify-center">
        <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase text-orange-500 bg-orange-500/10 rounded-full mb-5">
          Product Walkthrough
        </span>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-dark-50 leading-[1.1] tracking-tight">
          See every flow.{" "}
          <span className="text-orange-500">Step by step.</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-white max-w-2xl leading-relaxed">
          Visual walkthroughs of the essential flows your team runs every day —
          from onboarding a client to distributing leads and importing a book of
          business.
        </p>
      </div>
    </section>
  );
}
