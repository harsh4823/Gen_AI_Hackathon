import requests
import json
import base64
from io import BytesIO
import os
from dotenv import load_dotenv
from PIL import Image
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from fastapi import FastAPI, File, UploadFile, HTTPException
import uvicorn
import shutil
import tempfile
load_dotenv()

if "GOOGLE_API_KEY" not in os.environ:
    raise ValueError("GOOGLE_API_KEY environment variable not set. Please set it in the .env file.")
if "HUGGINGFACEHUB_API_TOKEN" not in os.environ:
    raise ValueError("HUGGINGFACEHUB_API_TOKEN environment variable not set. Please set it in the .env file.")

HF_API_TOKEN = os.environ.get("HUGGINGFACEHUB_API_TOKEN")

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash", 
    temperature=0.3,  # Lower temperature for more consistent JSON output
)

def transcribe_audio(audio_path: str) -> str:

    headers = {
                "Authorization": f"Bearer {HF_API_TOKEN}",
                "Content-Type": "audio/mpeg" 
            }
    
    MODEL_ID = "openai/whisper-large-v3"
    API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"
    
    with open(audio_path, "rb") as f:
        audio_data = f.read()

    response = requests.post(API_URL, headers=headers, data=audio_data)
    json_data = response.json()

    return json_data['text']

def translate_text(text:str, target_language:str="English") ->str:

    prompt_template = ChatPromptTemplate.from_template(
        """You are a multilingual translator with over a decade of experience in accurately translating diverse texts across various languages. Your specialty lies in not just converting words, but also capturing the nuances, tone, and context of the original message to ensure it resonates in the target language.

        Your task is to translate the following text into the specified language. Here is the text you need to translate:  
        - Text: {text}  
        - Target Language: {language}  

        ---
        The translated output should be presented clearly and fluently, maintaining the original meaning while adapting to the linguistic and cultural context of the target language.
        ---
        Please ensure that the translation adheres to formal language conventions, uses appropriate terminology, and reflects the intended tone of the original text.
        ---

        Example of a translation:  
        Original: "Hello, how are you?"  
        Translation (Spanish): "Hola, ¿cómo estás?"

        ---

        Be cautious of idiomatic expressions that may not directly translate and ensure that the translation does not lose the essence of the original message. Avoid overly literal translations that may sound awkward in the target language."""
    )

    translation_chain = prompt_template | llm | StrOutputParser()

    return translation_chain.invoke({
        "text": text,
        "language": target_language
    })

def image_to_text(image_path: str) -> str:

    with Image.open(image_path) as img:
        img.thumbnail((800, 800))
        buffered = BytesIO()
        if img.mode == 'RGBA': 
            img = img.convert('RGB')
        img.save(buffered, format="JPEG")
        image_data = base64.b64encode(buffered.getvalue()).decode("utf-8")
     
    text_extraction_prompt = ChatPromptTemplate.from_messages([
        ("human", [
            {
                "type": "text", 
                "text": """Analyze this handcrafted product image and provide a detailed description including:
                - Main product and its purpose
                - Materials used (if visible)
                - Colors and design elements
                - Craftsmanship quality
                - Unique features or decorative elements
                
                Keep the description professional and marketing-friendly."""
            }, 
            {
                "type": "image_url", 
                "image_url": "data:image/jpeg;base64,{image_data}"
            }
        ])
    ])
    
    text_extraction_chain = text_extraction_prompt | llm | StrOutputParser()
    return text_extraction_chain.invoke({
        "image_data": image_data
    })

text_extraction_prompt = ChatPromptTemplate.from_template(
    """Extract key product information from these artisan notes and format as JSON.

    Notes: "{artisan_notes}"

    Please extract and return ONLY a valid JSON object with these fields:
    {{
        "materials": ["list of materials mentioned"],
        "techniques": ["crafting techniques used"],
        "origin": "place of origin if mentioned",
        "story": "brief story or background",
        "special_features": ["unique aspects mentioned"]
    }}

    JSON:"""
)

synthesis_prompt = ChatPromptTemplate.from_template(
    """Create a professional product listing in JSON format using the provided information.

    Visual Description: {image_description}
    Extracted Details: {extracted_details}

    Create a compelling product listing with ONLY this JSON structure:
    {{
        "title": "attractive product title",
        "description": "detailed marketing description (2-3 sentences)",
        "key_features": ["feature1", "feature2", "feature3"],
        "materials": ["material1", "material2"],
        "care_instructions": "brief care instructions"
    }}

    Return ONLY the JSON object, no additional text:"""
)

def main(image_path: str, audio_path: str):
    print("\n🚀 Starting the FREE AI Artisan Assistant...")

    print("\n[Stage 1: Processing Voice Note with FREE APIs]")
    transcribed_text = transcribe_audio(audio_path)
    translated_text = translate_text(transcribed_text, target_language="English")
    print(f"\nTranslated Audio Text: \n{translated_text}")

    print("\n[Stage 2: Extracting Image Description with FREE APIs]")
    image_description = image_to_text(image_path)
    print(f"\nImage Description: \n{image_description}")

    print("\n[Stage 3: Extracting Key Details from Artisan Notes with FREE APIs]")
    extracted_details = text_extraction_prompt | llm | StrOutputParser()
    extracted_json = extracted_details.invoke({
        "artisan_notes": translated_text
    })
    print(f"\nExtracted Details JSON: \n{extracted_json}")

    print("\n[Stage 4: Synthesizing Final Product Listing with FREE APIs]")
    synthesis_chain = synthesis_prompt | llm | StrOutputParser()
    final_listing = synthesis_chain.invoke({
        "image_description": image_description,
        "extracted_details": extracted_json,
    })

    print(f"\nFinal Product Listing JSON: \n{final_listing[4:]}")
    print("\n✅ AI Artisan Assistant process completed.")

    return json.loads(final_listing[7:-3].replace('\n', ' '))


main(image_path="gold_kettle.jpg", audio_path="audio.mp3")

# FastAPI app
app = FastAPI(title="AI Artisan Assistant API")
@app.post("/create-listing/")
async def create_listing_endpoint(image: UploadFile = File(...), audio: UploadFile = File(...)):
    """
    Accepts an image and an audio file, processes them through the AI pipeline,
    and returns a complete JSON product listing.
    """
    # Create a temporary directory to store uploaded files
    temp_dir = tempfile.mkdtemp()
    try:
        # Define temporary file paths
        image_path = os.path.join(temp_dir, image.filename)
        audio_path = os.path.join(temp_dir, audio.filename)

        # Save uploaded files to the temporary paths
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        with open(audio_path, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)
        
        # Run the main processing logic
        final_listing = main(image_path, audio_path)
        
        return {"product_listing": final_listing}

    except Exception as e:
        # If any error occurs, return an HTTP 500 error
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        # Clean up the temporary directory and its contents
        shutil.rmtree(temp_dir)

# --- 5. RUN THE SERVER (for direct execution) ---

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)