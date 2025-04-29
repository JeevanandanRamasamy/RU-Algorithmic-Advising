import sys
import os

# Add backend/ to sys.path so imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from getpass import getpass
from werkzeug.security import generate_password_hash
from app import create_app
from services.user_service import UserService

app = create_app()

def prompt_admin_details():
    print("🔧 Admin Account Creation")
    username = input("Username (max 6 chars): ").strip()

    if len(username) > 6:
        print("❌ Username must be at most 6 characters.")
        sys.exit(1)

    if UserService.check_account_exists(username):
        print("❌ This username already exists.")
        sys.exit(1)

    password = getpass("Password (min 6 chars): ")
    if len(password) < 6:
        print("❌ Password must be at least 6 characters.")
        sys.exit(1)

    confirm_password = getpass("Confirm password: ")
    if password != confirm_password:
        print("❌ Passwords do not match.")
        sys.exit(1)

    first_name = input("First Name: ").strip()
    last_name = input("Last Name: ").strip()

    if not all([first_name, last_name]):
        print("❌ First and Last name are required.")
        return None
    
    hashed_password = generate_password_hash(password)

    return {
        "username": username,
        "password": hashed_password,
        "first_name": first_name,
        "last_name": last_name,
        "role": "admin",
    }

if __name__ == "__main__":
    app = create_app()

    with app.app_context():
        user_data = prompt_admin_details()
        if user_data is None:
            print("🚫 Aborting admin creation.")
            sys.exit(1)

        result = UserService.insert_new_account(user_data)

        if isinstance(result, str):
            print(f"❌ Failed to create admin account: {result}")
        else:
            print(f"✅ Admin account '{user_data['username']}' created successfully.")