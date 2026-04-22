// components/Features.js
// Shows what Shepherd can do — 3 feature cards

// This is the data for our feature cards
// Keeping data separate from the JSX is clean practice
// Makes it easy to add/remove features without touching the layout
const features = [
  {
    icon: "⛪",
    title: "Church Info, Instantly",
    description:
      "Service times, programs, events, how to join — Eden knows everything about the church and answers in seconds.",
  },
  {
    icon: "📖",
    title: "Sermon Recommendations",
    description:
      "Struggling with something? Eden finds the exact message the Apostle taught that speaks to your situation.",
  },
  {
    icon: "🤝",
    title: "Real Support, Real Care",
    description:
      "When things get serious, Eden knows when to step back and connect you directly with the Apostle.",
  },
]

export default function Features() {
  return (
    // py-20 = vertical padding
    // px-6 = horizontal padding
    <section className="py-20 px-6">

      <div className="max-w-6xl mx-auto">

        {/* SECTION HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-shepherd-text mb-4">
            What Eden does
          </h2>
          <p className="text-shepherd-muted text-lg max-w-xl mx-auto">
            More than a chatbot. A companion that actually knows your church.
          </p>
        </div>

        {/* FEATURE CARDS GRID */}
        {/* grid = CSS grid layout */}
        {/* grid-cols-1 = one column on mobile */}
        {/* md:grid-cols-3 = three columns on medium screens */}
        {/* gap-6 = space between cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* .map() loops through the features array */}
          {/* For each feature it creates a card */}
          {/* 'feature' is the current item in the loop */}
          {/* 'index' is the position (0, 1, 2...) */}
          {features.map((feature, index) => (

            // key={index} is required when rendering lists
            // React uses it to track which item is which
            // Always add a key when using .map() in JSX
            <div
              key={index}
              className="bg-shepherd-card border border-shepherd-border rounded-2xl p-8 hover:border-shepherd-purple transition-colors duration-200"
            >
              {/* ICON */}
              <div className="text-4xl mb-4">{feature.icon}</div>

              {/* TITLE */}
              <h3 className="text-xl font-bold text-shepherd-text mb-3">
                {feature.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-shepherd-muted leading-relaxed">
                {feature.description}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  )
}