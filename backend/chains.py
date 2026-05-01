from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage
from dotenv import load_dotenv
from knowledge_base import load_knowledge_base, search_knowledge_base

load_dotenv()

llm = ChatGroq(model="meta-llama/llama-4-scout-17b-16e-instruct", temperature=0.7)

# Load knowledge base ONCE at startup — not on every request
k_base = load_knowledge_base()

system_prompt = """
You are Eden, a warm, proactive, and Spirit-led AI companion for {church_name}. 
Your vibe is grounded, approachable, and Nigerian—think of yourself as a supportive older sibling or a mentor in the faith. 

STRICT GUIDELINES ON TONE & FORMATTING:
1. NO ROBOTIC MARKDOWN: Never use asterisks (**) or bullet points (*) for formatting. Use plain text and clear line breaks to create a clean, mobile-friendly look.
2. CONVERSATIONAL FLOW: Do not wait to be interrogated. Always end your response with a thoughtful, open-ended question to help the member further. 
3. EMOJI USAGE: Use emojis naturally (😂,🙏, ✨, 🙌) to show warmth and energy, but keep it balanced. If they are laughing, laugh with them!
4. KNOWLEDGE LIMITS: Use the provided {context} to answer. If the information isn't there, humbly say you don't know and offer to connect them with a leader.
5. THE "SHEPHERD" VOICE: Stay punchy, simple, and jargon-free. If a user is going through a hard time, pray for them directly in the chat.

Stay intentional. Stay real. Always initiate the next step in their journey. ✨
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{message}")
])

parser = StrOutputParser()
chain = prompt | llm | parser

# In-memory session store
session_store = {}


def get_session_history(session_id: str):
    if session_id not in session_store:
        session_store[session_id] = []
    return session_store[session_id]


def save_to_history(session_id: str, human_msg: str, ai_msg: str):
    history = get_session_history(session_id)
    history.append(HumanMessage(content=human_msg))
    history.append(AIMessage(content=ai_msg))

    # Trim to last 20 messages
    if len(history) > 20:
        session_store[session_id] = history[-20:]


def run_chat(message: str, session_id: str, user_name: str = "Member"):
    # Use already-loaded knowledge base
    context = search_knowledge_base(k_base, message)

    # Get session history
    history = get_session_history(session_id)

    # Build inputs — keys must match prompt placeholders exactly
    inputs = {
        "message": message,
        "history": history,
        "context": context,
        "church_name": "Proclaiming Jesus Power Ministry",
    }

    # Run the chain — returns a plain string because of StrOutputParser
    ai_reply = chain.invoke(inputs)

    # Save to history
    save_to_history(session_id, message, ai_reply)

    return ai_reply