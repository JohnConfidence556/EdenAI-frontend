// components/HowItWorks.js
// Simple 3-step explanation of how to use Shepherd

const steps = [
  {
    number: "01",
    title: "Join or return",
    description: "New? Tell us your name and contact. Returning? Just drop your phone number.",
  },
  {
    number: "02",
    title: "Start your conversation",
    description: "Ask anything — church programs, spiritual questions, prayer requests. Eden is here.",
  },
  {
    number: "03",
    title: "Get real support",
    description: "For deep needs, Eden connects you directly to the Apostle via WhatsApp.",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* SECTION HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-shepherd-text mb-4">
            How it works
          </h2>
          <p className="text-shepherd-muted text-lg">
            Three simple steps to get started 🙏
          </p>
        </div>

        {/* STEPS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">

              {/* STEP NUMBER */}
              {/* The big number in the background */}
              <div className="text-7xl font-bold text-shepherd-purple/20 mb-4">
                {step.number}
              </div>

              {/* TITLE */}
              <h3 className="text-xl font-bold text-shepherd-text mb-3">
                {step.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-shepherd-muted leading-relaxed">
                {step.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}