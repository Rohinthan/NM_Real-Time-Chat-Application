from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import os

# ---------- CONFIGURATION ----------
BASE_URL = "http://localhost:3000"  # Change if hosted online
SCREENSHOT_DIR = "../screenshots"   # Save to screenshots folder outside automation/
DELAY = 3  # Seconds to wait after page load

# ---------- PAGES TO CAPTURE ----------
PAGES = [
    ("01_login_page.png", "/login"),
    ("02_chat_one_to_one.png", "/chat/user1"),
    ("03_group_chat.png", "/chat/group/general"),
    ("04_upload_feature.png", "/chat/upload"),
    ("05_offline_mode.png", "/chat/offline"),
]

# ---------- CHROME OPTIONS ----------
options = Options()
options.add_argument("--headless")  # Run without opening Chrome window
options.add_argument("--window-size=1920,1080")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")

# ---------- START DRIVER ----------
service = Service()  # Uses default system ChromeDriver
driver = webdriver.Chrome(service=service, options=options)

# Create screenshot folder if not exists
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

# ---------- LOGIN (Example Flow) ----------
def perform_login():
    print("[+] Logging in...")
    driver.get(BASE_URL + "/login")
    time.sleep(2)
    
    try:
        driver.find_element(By.ID, "username").send_keys("demo_user")
        driver.find_element(By.ID, "password").send_keys("demo_pass")
        driver.find_element(By.ID, "login-btn").click()
        time.sleep(2)
        print("[✔] Login successful (simulated).")
    except Exception as e:
        print("[!] Login fields not found, skipping...")

# ---------- CAPTURE PAGES ----------
def capture_page(filename, route):
    full_url = BASE_URL + route
    print(f"[+] Opening {full_url}")
    driver.get(full_url)
    time.sleep(DELAY)
    
    # Scroll to bottom for full view
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(1)
    
    file_path = os.path.join(SCREENSHOT_DIR, filename)
    driver.save_screenshot(file_path)
    print(f"[📸] Saved screenshot: {file_path}")

# ---------- MAIN EXECUTION ----------
if __name__ == "__main__":
    print("=== Real-Time Chat App Screenshot Automation ===\n")

    perform_login()

    for filename, route in PAGES:
        capture_page(filename, route)

    driver.quit()
    print("\n[✔] All screenshots captured successfully!")
