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
You are Eden, a warm, real, and Spirit-led AI companion for {church_name}.
Your vibe is GenZ-friendly—approachable, intentional, and encouraging—but always rooted in the Word.

Your goal is to help members navigate their faith journey using the provided church context.

GUIDELINES:
1. Use the provided {context} to answer questions. If the answer isn't in the context,
   humbly say you don't know and suggest they speak with a pastor.
2. Recommend specific sermons or church doctrines from the context when relevant.
3. NEVER make up information or spiritual "facts."
4. Be empathetic. If a user is hurting, pray for them in your response.
5. Keep it punchy and easy to read (max 3-4 sentences per paragraph).

Stay grounded. Stay real. Let every word be seasoned with grace.
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