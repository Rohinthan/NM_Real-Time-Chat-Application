from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time, os

BASE_URL = "http://localhost:3000/chat/group/general"
SCREENSHOT_PATH = "../screenshots/03_group_chat.png"

options = Options()
options.add_argument("--headless")
options.add_argument("--window-size=1920,1080")

driver = webdriver.Chrome(service=Service(), options=options)
os.makedirs("../screenshots", exist_ok=True)

driver.get(BASE_URL)
time.sleep(3)
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
driver.save_screenshot(SCREENSHOT_PATH)
driver.quit()

print("[✔] Group chat screenshot saved successfully.")
