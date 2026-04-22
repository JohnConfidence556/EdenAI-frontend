// components/Footer.js
// Simple footer with church name and copyright

export default function Footer() {
  return (
    <footer className="border-t border-shepherd-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* LEFT — Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🕊️</span>
          <span className="text-shepherd-text font-semibold">Eden AI</span>
        </div>

        {/* CENTER — Copyright */}
        <p className="text-shepherd-muted text-sm">
          © 2026 Eden AI. Built with love for the Kingdom. 🙏
        </p>

        {/* RIGHT — WhatsApp link */}
        <a
          href="https://wa.me/YOUR_CHURCH_NUMBER"
          target="_blank"
          rel="noopener noreferrer"
          className="text-shepherd-muted hover:text-shepherd-text text-sm transition-colors duration-200"
        >
          Contact Apostle →
        </a>

      </div>
    </footer>
  )
}