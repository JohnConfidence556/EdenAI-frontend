// components/Navbar.js
// The navigation bar at the top of every page
// Shows the logo and church name

// Link is Next.js's version of an <a> tag
// It navigates between pages WITHOUT full page reload
// making the app feel fast and native
import Link from "next/link"

export default function Navbar() {
  return (
    // sticky top-0 = stays at top when you scroll
    // z-50 = sits above other elements (z-index)
    // w-full = full width
    // border-b = thin border at bottom
    // backdrop-blur-sm = slight blur effect on background
    <nav className="sticky top-0 z-50 w-full border-b border-shepherd-border bg-shepherd-dark/90 backdrop-blur-sm">

      {/* max-w-6xl = maximum width so content doesn't stretch too wide on big screens */}
      {/* mx-auto = center horizontally */}
      {/* px-6 py-4 = padding */}
      {/* flex = flexbox */}
      {/* items-center = align vertically centered */}
      {/* justify-between = push items to opposite ends */}
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT SIDE — Logo + Name */}
        <Link href="/" className="flex items-center gap-3">
          {/* The church emoji as a simple logo */}
          <span className="text-2xl">🕊️</span>

          {/* Church name */}
          {/* text-shepherd-text = our custom text color */}
          {/* font-bold = bold */}
          {/* text-lg = slightly large */}
          <span className="text-shepherd-text font-bold text-lg">
            Eden AI
          </span>
        </Link>

        {/* RIGHT SIDE — Start Chat Button */}
        <Link
          href="/chat"
          className="bg-shepherd-purple hover:bg-shepherd-purpleLight text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
        >
          Start Chatting
        </Link>

      </div>
    </nav>
  )
}