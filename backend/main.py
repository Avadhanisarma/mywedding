from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mount static files for the frontend
app.mount("/static", StaticFiles(directory="frontend"), name="static")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("frontend/index.html", "r") as f:
        return f.read()

@app.get("/api/chat")
async def chat(message: str):
    # Simple chatbot logic
    message = message.lower()
    if "venue" in message:
        venue_info = (
            "It's at Sri Lakshmi AC Convention Hall,Karmanghat Rd,Hyderabad"
            "📍 Google Maps Location: <a href=\"https://maps.app.goo.gl/BxoAcbXcZThCENZh8\" target=\"_blank\">Click here for directions</a>"
        )
        return {"response": venue_info}
    elif "date" in message or "time" in message:
        return {"response": [ "It's on August 13, 2025 ",
                            "Sumuhurtam at 3:34 AM (Early hours of August 14)"]}
    elif "tell me more" in message:
        return {
            "response": (
                "Please join us for the reception at the wedding venue from 7:00 PM onwards on August 13, 2025"
            )
        }
    elif "tell us more" in message:
        return {
            "response": [
                "🗓️ Block your calendar for August 13, 2025",
                "💼 Apply for leave — yep, we know it’s midweek... but this isn’t just another Wednesday. This is THE Wednesday",
                "We can’t wait to celebrate this special evening with you! 💃🕺",
            ]
        }
    else:
        return {"response": "Hello! I'm your wedding invitation chatbot. I can tell you about the venue, date, time, and RSVP details. What would you like to know?"}
