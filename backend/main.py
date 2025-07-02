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
            "Our wedding will be held at Sri Lakshmi AC Convention Hall, "
            "10-1 42, 98/8, Karmanghat Rd, opp. Indra Nagendra Theater, "
            "Saroornagar, Brindavan Colony, Hyderabad, Telangana 500035. "
            "📍 Google Maps Location: <a href=\"https://maps.app.goo.gl/BxoAcbXcZThCENZh8\" target=\"_blank\">Click here for directions</a>"
        )
        return {"response": venue_info}
    elif "date" in message or "time" in message:
        return {"response": "The wedding is on August 13, 2025 - Sumuhurtam at 3:34 AM (Early hours of August 14)"}
    elif "tell me more" in message:
        return {
            "response": (
                "Please join us for the reception at the wedding venue from 7:00 PM onwards on August 13, 2025. 🎉\n\n"
                "We can’t wait to celebrate this special evening with you! 💃🕺"
            )
        }
    elif "tell us more" in message:
        return {
            "response": [
                "You clicked Tell me more? Ohhh you're in now! 😎",
                "🗓️ Block your calendar for August 13, 2025. No excuses. No rescheduling.",
                "💼 Apply for leave — yep, we know it’s midweek... but this isn’t just another Wednesday. This is THE Wednesday.",
                "📞 Cancel your meetings, snooze your team chats, and throw those ‘Do Not Disturb’ signs like confetti. 🎊",
                "🎟️ Book your tickets ASAP — before prices surge and you're left watching  reels from your desk! 😜"
            ]
        }
    else:
        return {"response": "Hello! I'm your wedding invitation chatbot. I can tell you about the venue, date, time, and RSVP details. What would you like to know?"}
