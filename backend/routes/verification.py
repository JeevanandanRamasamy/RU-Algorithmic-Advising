import random
import smtplib
from flask import Blueprint, request, jsonify
import os
from dotenv import load_dotenv
import time  # ⏳ For OTP expiration
import re

verification_bp = Blueprint("verification", __name__)  # Create a Blueprint
verification_codes = {}  # Temporary storage for OTPs (use a database later)

# Load environment variables
load_dotenv()
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASSWORD")


def send_email(email, code):
    print(f"{EMAIL_USER} : {EMAIL_PASS}")

    subject = "Your Verification Code"
    body = f"Your verification code is: {code}"

    message = f"Subject: {subject}\n\n{body}"

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, email, message)
        return True
    except Exception as e:
        print("Error sending email:", e)
        return False


# Route to send a verification code
@verification_bp.route("/api/send-verification", methods=["POST"])
def send_verification():
    data = request.json
    netid = data.get("username")

    if not netid:
        return jsonify({"success": False, "message": "Invalid NetID"}), 400
    email = f"{netid}@scarletmail.rutgers.edu"

    code = str(random.randint(100000, 999999))  # Generate 6-digit OTP
    print(code)
    verification_codes[netid] = {"code": code, "timestamp": time.time()}
    success = send_email(email, code)  # Send OTP via email

    if success:
        return jsonify({"success": True, "message": "Verification code sent!"})
    else:
        return jsonify({"success": False, "message": "Failed to send email."}), 500


# Route to verify the OTP
@verification_bp.route("/api/verify-code", methods=["POST"])
def verify_code():
    data = request.json
    netid = data.get("username")
    code = data.get("code")

    # Check if OTP exists for the given email
    otp_entry = verification_codes.get(netid)
    if not otp_entry:
        return jsonify({"success": False, "message": "Invalid or expired OTP"}), 400

    # Check if OTP is older than 10 minutes (600 seconds)
    if time.time() - otp_entry["timestamp"] > 600:
        del verification_codes[netid]  # Remove expired OTP
        return jsonify({"success": False, "message": "OTP expired"}), 400

    # Check if OTP matches
    if otp_entry["code"] == code:
        del verification_codes[netid]  # Remove OTP after successful verification
        return jsonify({"success": True, "message": "Email verified!"})

    return jsonify({"success": False, "message": "Invalid code"}), 400
