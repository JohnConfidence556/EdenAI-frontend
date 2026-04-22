// pages/index.js
// The homepage — assembles all the sections together

// Import all the components we built
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Features from "../components/Features"
import HowItWorks from "../components/HowItWorks"
import Footer from "../components/Footer"

export default function HomePage() {
  return (
    // min-h-screen = full screen height minimum
    // bg-shepherd-dark = our dark background color
    <div className="min-h-screen bg-shepherd-dark">

      {/* Each component sits one below the other */}
      {/* Like stacking blocks */}
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />

    </div>
  )
}