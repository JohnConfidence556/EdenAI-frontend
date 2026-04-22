from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model = "meta-llama/llama-4-scout-17b-16e-instruct", temperature = 0)

SENSITIVE_KEYWORDS = [
    "depression", "suicide", "abuse", "marriage", 
    "addiction", "self harm", "give up", "hopeless",
    "killing myself", "hurt myself", "divorce"
]


# Sensitive topic prompt
detector_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a sensitive content classifier for a church app.
    Classify the user message as 'sensitive' or 'normal'.
    
    'sensitive' topics include: mental health crises, thoughts of self-harm, 
    abuse, extreme marital distress, or severe addiction.
    
    'normal' topics include: prayer requests, Bible questions, church events, 
    general life advice, or greetings.
    
    Respond with ONLY the word 'sensitive' or 'normal'."""),
    ("human", "{message}")
])


# Build the internal chain
detector_chain = detector_prompt | llm | StrOutputParser()

# Function: is_sensitive(message)
def is_sensitive(message: str) -> bool:
    try:
        # Step A: Keyword Check (Fast/No API Cost)
        message_lower = message.lower()
        if any(word in message_lower for word in SENSITIVE_KEYWORDS):
            return True
        
        # Step B: LLM Classifier (Deep Understanding)
        response = detector_chain.invoke({"message": message})
        
        # Clean the response and check
        if response.strip().lower() == "sensitive":
            return True
        
        return False
        
    except Exception as e:
        # Fallback: If AI fails, don't crash the app
        print(f"Detector Error: {e}")
        return False