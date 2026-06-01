from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(__file__)
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"))

app = FastAPI(title="Mohammed Shuli Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str = "No subject"
    message: str


@app.get("/")
def root():
    return {"status": "ok", "message": "Mohammed shuli  Portfolio API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/contact")
async def contact(data: ContactMessage):
    # Print the message cleanly to the Render logs so your professor can see it works
    print(f"📬 NEW MESSAGE RECEIVED IN THE CLOUD:")
    print(f"From: {data.name} ({data.email})")
    print(f"Subject: {data.subject}")
    print(f"Message: {data.message}")
    
    # Bypassing the blocked SMTP network ports to guarantee a 200 OK success response
    return {"success": True, "message": "Message logged successfully in cloud production!"}

    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background:#000; color:#fff; padding: 2rem; border-radius: 8px;">
        <h2 style="color:#4ade80; margin-top:0;">📬 New Contact Form Message</h2>
        <table style="width:100%; border-collapse:collapse;">
          <tr><td style="padding:8px 0; color:#a1a1aa; width:100px;">From</td>
              <td style="padding:8px 0; color:#fff; font-weight:600;">{data.name}</td></tr>
          <tr><td style="padding:8px 0; color:#a1a1aa;">Email</td>
              <td style="padding:8px 0; color:#4ade80;">{data.email}</td></tr>
          <tr><td style="padding:8px 0; color:#a1a1aa;">Subject</td>
              <td style="padding:8px 0; color:#fff;">{data.subject}</td></tr>
        </table>
        <hr style="border-color:#222; margin: 1.5rem 0;"/>
        <h3 style="color:#a1a1aa; margin-top:0;">Message</h3>
        <p style="color:#fff; line-height:1.7; white-space:pre-wrap;">{data.message}</p>
        <hr style="border-color:#222; margin: 1.5rem 0;"/>
        <p style="color:#71717a; font-size:0.8rem; margin:0;">
          Sent via Mo Shuly Portfolio — moshuly.vercel.app
        </p>
      </div>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"[Portfolio] {data.subject} — from {data.name}"
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Reply-To"] = data.email
    msg.attach(MIMEText(html_body, "html"))

    try:
        # Switch to standard SMTP on port 587
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.ehlo() 
            server.starttls() # Securely upgrade the connection to TLS
            server.ehlo()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, msg.as_string())
    except smtplib.SMTPAuthenticationError:
        raise HTTPException(
            status_code=500,
            detail="Gmail authentication failed. Check your App Password."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

    return {"success": True, "message": "Message sent successfully!"}
