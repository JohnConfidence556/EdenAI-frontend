// pages/chat.js
// The main chat interface for Shepherd
// This is where members talk to the AI

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import Navbar from "../components/Navbar"

export default function ChatPage() {

  // ============================================
  // STATE
  // ============================================

  // Array of message objects
  // Each message looks like:
  // { role: "user", content: "Hello" }
  // { role: "ai", content: "Hey! How can I help?" }
  const [messages, setMessages] = useState([])

  // What the user is currently typing
  const [input, setInput] = useState("")

  // Whether AI is currently responding
  const [isTyping, setIsTyping] = useState(false)

  // Whether a sensitive topic was detected
  // Triggers the WhatsApp referral banner
  const [showWhatsApp, setShowWhatsApp] = useState(false)

  // The current user's name (loaded from localStorage)
  const [userName, setUserName] = useState("")

  // ============================================
  // REFS
  // ============================================

  // Points to the bottom of the chat
  // We scroll to this after every new message
  const bottomRef = useRef(null)

  // Points to the input field
  // We focus it after sending so user can type again
  const inputRef = useRef(null)

  const router = useRouter()

  // ============================================
  // EFFECTS
  // ============================================

  // Runs once when page loads
  // Loads user info and shows a welcome message
  useEffect(() => {
    // Get user's name and phone from localStorage
    const name = localStorage.getItem("shepherdName")
    const phone = localStorage.getItem("shepherdPhone")

    // If no phone found this person hasn't registered
    // Send them to the welcome page
    if (!phone) {
      router.push("/welcome")
      return
    }

    // Save name to state
    setUserName(name || "Friend")

    // Show a welcome message from Shepherd
    // This appears immediately when chat loads
    const welcomeMessage = {
      role: "ai",
      content: `Hey ${name || "Friend"}! 👋 I'm Eden, your church companion. What's on your heart today? Whether it's about our programs, something from the Word, or just a question — I'm here. 🙏`
    }

    setMessages([welcomeMessage])

  }, []) // empty array = run once on mount


  // Runs every time messages array changes
  // Scrolls chat to the bottom automatically
  useEffect(() => {
    // scrollIntoView scrolls the page to make
    // this element visible
    // behavior: "smooth" makes it animate
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ============================================
  // SEND MESSAGE FUNCTION
  // ============================================

  async function sendMessage() {

    // Don't send if input is empty or AI is typing
    if (!input.trim() || isTyping) return

    // The user's message
    const userMessage = {
      role: "user",
      content: input.trim()
    }

    // Add user message to chat immediately
    // User sees their own message right away
    setMessages(prev => [...prev, userMessage])

    // Clear the input field
    setInput("")

    // Show typing indicator
    setIsTyping(true)

    // Hide WhatsApp banner (will show again if needed)
    setShowWhatsApp(false)

    try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: input.trim(),
        session_id: localStorage.getItem("shepherdPhone") || "default",
        user_phone: localStorage.getItem("shepherdPhone")
      })
    })

    if (!response.ok) {
      throw new Error("API request failed")
    }

    const data = await response.json()

    // Add AI message
    setMessages(prev => [...prev, {
      role: "ai",
      content: data.reply
    }])

    // Show WhatsApp banner if sensitive
    if (data.is_sensitive) {
      setShowWhatsApp(true)
      setWhatsAppNumber(data.whatsapp_number)
    }

    } catch (err) {
      // If something goes wrong show an error message
      setMessages(prev => [...prev, {
        role: "ai",
        content: "Sorry, something went wrong. Please try again 🙏"
      }])
    } finally {
      setIsTyping(false)
      // Refocus the input so user can type again
      inputRef.current?.focus()
    }
  }

  // ============================================
  // HANDLE KEYBOARD
  // Send message when Enter is pressed
  // New line when Shift+Enter is pressed
  // ============================================

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      // Prevent default behavior (new line in textarea)
      e.preventDefault()
      sendMessage()
    }
    // If Shift+Enter — do nothing special
    // textarea handles new line naturally
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    // h-screen = exactly the screen height
    // overflow-hidden = no scrolling on the outer container
    // flex flex-col = stack children vertically
    <div className="h-screen bg-shepherd-dark flex flex-col overflow-hidden">

      <Navbar />

      {/* WHATSAPP REFERRAL BANNER */}
      {/* Only shows when sensitive topic detected */}
      {showWhatsApp && (
        <div className="bg-green-500/10 border-b border-green-500/30 px-6 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">

            <p className="text-green-400 text-sm">
              💙 The Apostle would love to speak with you personally about this.
            </p>

            <a
              href="https://wa.me/YOUR_CHURCH_WHATSAPP_NUMBER"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-200"
            >
              Chat on WhatsApp →
            </a>

          </div>
        </div>
      )}

      {/* CHAT MESSAGES AREA */}
      {/* flex-1 = takes all available space between navbar and input */}
      {/* overflow-y-auto = scrollable when messages overflow */}
      <div className="flex-1 overflow-y-auto px-4 py-6">

        {/* max-w-3xl centers the chat on wide screens */}
        <div className="max-w-3xl mx-auto space-y-6">

          {/* RENDER ALL MESSAGES */}
          {messages.map((message, index) => (
            <div key={index}>

              {/* AI MESSAGE — left aligned */}
              {message.role === "ai" && (
                <div className="flex items-start gap-3">

                  {/* AI Avatar */}
                  <div className="w-8 h-8 bg-shepherd-purple rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    🕊️
                  </div>

                  {/* AI Bubble */}
                  <div className="bg-shepherd-card border border-shepherd-border rounded-2xl rounded-tl-sm px-4 py-3 max-w-lg">
                    <p className="text-shepherd-text text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>

                </div>
              )}

              {/* USER MESSAGE — right aligned */}
              {message.role === "user" && (
                // justify-end pushes everything to the right
                <div className="flex justify-end">
                  <div className="bg-shepherd-purple rounded-2xl rounded-tr-sm px-4 py-3 max-w-lg">
                    <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              )}

            </div>
          ))}

          {/* TYPING INDICATOR */}
          {/* Shows when AI is generating a response */}
          {isTyping && (
            <div className="flex items-start gap-3">

              {/* AI Avatar */}
              <div className="w-8 h-8 bg-shepherd-purple rounded-full flex items-center justify-center text-sm flex-shrink-0">
                🕊️
              </div>

              {/* Animated typing dots */}
              <div className="bg-shepherd-card border border-shepherd-border rounded-2xl rounded-tl-sm px-4 py-4">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-shepherd-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-shepherd-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-shepherd-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>

            </div>
          )}

          {/* INVISIBLE DIV AT BOTTOM */}
          {/* We scroll to this after every message */}
          <div ref={bottomRef}></div>

        </div>
      </div>

      {/* INPUT AREA */}
      {/* Pinned to bottom of screen */}
      <div className="border-t border-shepherd-border bg-shepherd-dark px-4 py-4">
        <div className="max-w-3xl mx-auto">

          {/* INPUT ROW */}
          <div className="flex items-end gap-3">

            {/* TEXTAREA */}
            {/* We use textarea instead of input */}
            {/* so users can type multi-line messages */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="flex-1 bg-shepherd-card border border-shepherd-border rounded-2xl px-4 py-3 text-shepherd-text placeholder-shepherd-muted focus:outline-none focus:border-shepherd-purple transition-colors duration-200 resize-none"
            />

            {/* SEND BUTTON */}
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="bg-shepherd-purple hover:bg-shepherd-purpleLight disabled:opacity-50 disabled:cursor-not-allowed text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0"
            >
              {/* Send arrow icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>

          </div>

          {/* HELPER TEXT */}
          <p className="text-shepherd-muted text-xs text-center mt-2">
            Shepherd is an AI companion. For urgent matters contact the church directly.
          </p>

        </div>
      </div>

    </div>
  )
}