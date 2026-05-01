// pages/welcome.js
// Onboarding form for first time members
// Collects name, email and phone number

// useState — for tracking form field values
// useRouter — Next.js hook for navigating between pages
import { useState } from "react"
import { useRouter } from "next/router"
import Navbar from "../components/Navbar"

export default function WelcomePage() {

  // ============================================
  // STATE — one state variable per form field
  // Each tracks what the user has typed
  // ============================================

  // formData stores all three field values together
  // in one object instead of three separate states
  // This is cleaner when you have multiple fields
  const [formData, setFormData] = useState({
    name:  "",
    email: "",
    phone: ""
  })

  // Tracks whether the form is being submitted
  // Used to show a loading state on the button
  const [isLoading, setIsLoading] = useState(false)

  // Stores any error message to show the user
  const [error, setError] = useState("")

  // useRouter gives us access to Next.js navigation
  // router.push("/chat") navigates to the chat page
  const router = useRouter()

  // ============================================
  // HANDLE INPUT CHANGE
  // Called every time the user types in any field
  // ============================================

  function handleChange(e) {
    // e is the event object — contains info about what happened
    // e.target is the input element that was typed in
    // e.target.name is the name attribute of that input
    // e.target.value is what was typed

    // ...formData spreads the existing values
    // then we overwrite just the field that changed
    // Example: if name field changes:
    // { name: "Chidi", email: "", phone: "" }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // ============================================
  // HANDLE SUBMIT
  // Called when user clicks the submit button
  // ============================================

  async function handleSubmit(e) {
    // e.preventDefault() stops the browser from
    // doing its default form behavior (page reload)
    // Without this the page would refresh on submit
    e.preventDefault()

    // Basic validation — check all fields are filled
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all fields 🙏")
      return  // stop here — don't continue
    }

    // Validate phone number — must be at least 10 digits
    // .replace() removes all non-digit characters
    // then we check the length
    const phoneDigits = formData.phone.replace(/\D/g, "")
    if (phoneDigits.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    // Validate email — must contain @ and a dot
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setError("Please enter a valid email address")
      return
    }

    // Clear any previous errors
    setError("")

    // Show loading state
    setIsLoading(true)

    try {
      // For now we just log the data
      // Later this will send to our FastAPI backend
      // Replace the console.log line with:
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!data.success) {
        setError(data.message)
        return
      }

      // Save phone to localStorage so the app
      // remembers this user on future visits
      // localStorage is the browser's built-in storage
      // It persists even after the browser is closed
      localStorage.setItem("shepherdPhone", formData.phone)
      localStorage.setItem("shepherdName", formData.name)

      // Navigate to the chat page
      router.push("/chat")

    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      // finally always runs whether try succeeded or failed
      // We always want to stop the loading state
      setIsLoading(false)
    }
  }

  // ============================================
  // CHECK IF FORM IS COMPLETE
  // Used to disable the button until all fields filled
  // ============================================

  // Boolean — true only when ALL three fields have content
  const isFormComplete = formData.name && formData.email && formData.phone

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-shepherd-dark">
      <Navbar />

      {/* CENTER THE FORM on the page */}
      <div className="flex items-center justify-center px-6 py-20">

        {/* FORM CARD */}
        {/* max-w-md = medium max width — good for forms */}
        {/* w-full = takes full width up to max-w-md */}
        <div className="w-full max-w-md">

          {/* HEADER */}
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🕊️</div>
            <h1 className="text-3xl font-bold text-shepherd-text mb-2">
              Welcome to Eden
            </h1>
            <p className="text-shepherd-muted">
              Let us know who you are so we can serve you better 🙏
            </p>
          </div>

          {/* THE FORM */}
          {/* onSubmit connects the form to our handleSubmit function */}
          <form
            onSubmit={handleSubmit}
            className="bg-shepherd-card border border-shepherd-border rounded-2xl p-8 space-y-6"
          >

            {/* NAME FIELD */}
            <div>
              {/* Label tells the user what this field is for */}
              {/* htmlFor must match the input's id */}
              {/* (htmlFor is JSX's version of HTML's 'for') */}
              <label
                htmlFor="name"
                className="block text-shepherd-text font-medium mb-2"
              >
                Your name
              </label>
              <input
                id="name"
                name="name"              // must match formData key
                type="text"
                placeholder="e.g. Chidi Okeke"
                value={formData.name}    // React controls this value
                onChange={handleChange}  // update state on every keystroke
                className="w-full bg-shepherd-dark border border-shepherd-border rounded-xl px-4 py-3 text-shepherd-text placeholder-shepherd-muted focus:outline-none focus:border-shepherd-purple transition-colors duration-200"
              />
            </div>

            {/* EMAIL FIELD */}
            <div>
              <label
                htmlFor="email"
                className="block text-shepherd-text font-medium mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. chidi@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-shepherd-dark border border-shepherd-border rounded-xl px-4 py-3 text-shepherd-text placeholder-shepherd-muted focus:outline-none focus:border-shepherd-purple transition-colors duration-200"
              />
            </div>

            {/* PHONE FIELD */}
            <div>
              <label
                htmlFor="phone"
                className="block text-shepherd-text font-medium mb-2"
              >
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g. 08012345678"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-shepherd-dark border border-shepherd-border rounded-xl px-4 py-3 text-shepherd-text placeholder-shepherd-muted focus:outline-none focus:border-shepherd-purple transition-colors duration-200"
              />
              {/* Small helper text below the field */}
              <p className="text-shepherd-muted text-sm mt-1">
                We use this to remember you on future visits
              </p>
            </div>

            {/* ERROR MESSAGE */}
            {/* Only shows when error state has content */}
            {/* This is conditional rendering — very important React concept */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              // disabled when form incomplete OR loading
              disabled={!isFormComplete || isLoading}
              className="w-full bg-shepherd-purple hover:bg-shepherd-purpleLight disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
            >
              {/* Show different text based on loading state */}
              {isLoading ? "Joining..." : "Join Eden 🙏"}
            </button>

            {/* RETURNING USER LINK */}
            <p className="text-center text-shepherd-muted text-sm">
              Already a member?{" "}
              {/* This is an inline Link inside a paragraph */}
              
                <a
                href="/returning"
                className="text-shepherd-purple hover:text-shepherd-purpleLight transition-colors duration-200"
              >
                Click here to continue
              </a>
            </p>

          </form>
        </div>
      </div>
    </div>
  )
}