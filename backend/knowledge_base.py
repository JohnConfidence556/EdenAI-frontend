from langchain_community.document_loaders import DirectoryLoader, TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpointEmbeddings
from langchain_community.vectorstores import FAISS
from dotenv import load_dotenv
import os

# creating the embeddings model
load_dotenv()


embedding_model = HuggingFaceEndpointEmbeddings(
    model="sentence-transformers/all-MiniLM-L6-v2",
    huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_API_TOKEN"),
    # This is the magic line! It tells the API to wait if the model is loading
    task="feature-extraction"
)



# Loading document

def load_document():
    # define the path to the document
    docs_path = "documents/"

    # checking if the directory exists to avoid error
    if not os.path.exists(docs_path):
        print(f" Error: The directory {docs_path} does not exist.")
        return []
    
    # set up the loader
    # glob="*.txt" ensures we only grab text files
    # loader_cls=TextLoader tells it exactly how to read them

    loader = DirectoryLoader(
        docs_path,
        glob="*.txt",
        show_progress=True,
        loader_cls=TextLoader
    )

    # loading the documents
    docs = loader.load()
    return docs

# Next is to split the documents

def build_knowledge_base():
    # call the document loading function first to get the raw documents
    raw_docs = load_document()
    
    # split the documents into smaller chunks using the RecursiveCharacterTextSplitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = 500,
        chunk_overlap = 100
    )

    chunks = text_splitter.split_documents(raw_docs)
    print(f"Created {len(chunks)} chunks from {len(raw_docs)} documents.")

    # since i have loaded the embeddings model at the top, i can directly use it here to create the vector store
    
    vector_store = FAISS.from_documents(chunks, embedding_model)

    # save locally the vector store for later use
    vector_store.save_local("vector_store")
    print(f"Vector store saved! Created {len(chunks)} chunks.")

    return vector_store 


def load_knowledge_base():
    """
    Loads the saved FAISS vector store from disk and returns a retriever.
    """
    # Check if the vector store actually exists
    if not os.path.exists("vector_store"):
        print("Error: 'vector_store' folder not found. Run build_knowledge_base() first.")
        return None

    # Load the vector store
    # allow_dangerous_deserialization=True is required for loading local .pkl files
    vector_store = FAISS.load_local(
        "vector_store", 
        embedding_model, 
        allow_dangerous_deserialization=True
    )

    # Create a retriever
    # search_kwargs={"k": 3} ensures we only get the top 3 most relevant chunks
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    
    print("✅ Knowledge base loaded and retriever is ready.")
    return retriever


def search_knowledge_base(retriever, query: str):
    """
    Takes a retriever and a question.
    Returns a formatted string of the top 3 relevant chunks with their sources.
    """
    # Get relevant documents from the retriever
    docs = retriever.invoke(query)
    
    # Format the results into a single string
    context_parts = []
    for i, doc in enumerate(docs):
        # Extract the filename from metadata
        source = os.path.basename(doc.metadata.get("source", "Unknown Source"))
        
        # Format each chunk with a header
        content = f"--- Source: {source} (Result {i+1}) ---\n{doc.page_content}"
        context_parts.append(content)
    
    # Join all parts with double newlines
    formatted_context = "\n\n".join(context_parts)
    
    return formatted_context





if __name__ == "__main__":
    print("🚀 Starting build process...")
    # This calls your function
    retriever = build_knowledge_base() 
    if retriever:
        print("📁 Look in your folder now. You should see 'vector_store'!")