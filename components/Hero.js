// components/Hero.js
// The big headline section — first thing users see
// This sets the tone and drives them to start chatting

import Link from "next/link"

export default function Hero() {
  return (
    // py-32 = large vertical padding (breathing room)
    // px-6 = horizontal padding
    // text-center = everything centered
    <section className="py-32 px-6 text-center">

      {/* max-w-4xl = limit width so text doesn't stretch too wide */}
      {/* mx-auto = center the container */}
      <div className="max-w-4xl mx-auto">

        {/* BADGE — small pill above the headline */}
        {/* inline-flex = shrinks to fit content */}
        <div className="inline-flex items-center gap-2 bg-shepherd-purple/20 border border-shepherd-purple/30 text-shepherd-purpleLight px-4 py-2 rounded-full text-sm font-medium mb-8">
          <span>✨</span>
          <span>Spirit-led conversations, available 24/7</span>
        </div>

        {/* MAIN HEADLINE */}
        {/* text-6xl = very large */}
        {/* md:text-7xl = even larger on medium screens (responsive) */}
        {/* font-bold = bold */}
        {/* text-shepherd-text = our text color */}
        {/* leading-tight = tighter line height */}
        {/* mb-6 = space below */}
        <h1 className="text-6xl md:text-7xl font-bold text-shepherd-text leading-tight mb-6">
          Your church.{" "}
          {/* text-transparent = makes text transparent */}
          {/* bg-clip-text = clips background to text shape */}
          {/* bg-gradient-to-r = gradient going right */}
          {/* This creates a gradient colored text effect */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-shepherd-purple to-shepherd-gold">
            Always with you.
          </span>
        </h1>

        {/* SUBHEADLINE */}
        <p className="text-xl text-shepherd-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Chat with Eden — your GenZ-friendly AI companion
          that knows the church, the sermons, and genuinely
          cares about your walk with God. 🙏
        </p>

        {/* CTA BUTTONS */}
        {/* flex = side by side */}
        {/* flex-col sm:flex-row = stack on mobile, side by side on larger screens */}
        {/* gap-4 = space between buttons */}
        {/* justify-center = center the buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          {/* PRIMARY BUTTON */}
          <Link
            href="/chat"
            className="bg-shepherd-purple hover:bg-shepherd-purpleLight text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors duration-200"
          >
            Start Chatting →
          </Link>

          {/* SECONDARY BUTTON */}
          <Link
            href="/welcome"
            className="border border-shepherd-border text-shepherd-text hover:border-shepherd-purple px-8 py-4 rounded-full font-semibold text-lg transition-colors duration-200"
          >
            New Member? Join here
          </Link>

        </div>

      </div>
    </section>
  )
}