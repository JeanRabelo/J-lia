import undetected_chromedriver as uc
import time
import sys

# Configure Chrome options and initialize the driver
options = uc.ChromeOptions()
driver = uc.Chrome(
    options=options,
    driver_executable_path="../../chromedriver"
)

# URLs for login and post-login detection
login_url = "https://www.quintoandar.com.br/auth/login"
post_login_url = "https://www.quintoandar.com.br/"

# Navigate to the login page
driver.get(login_url)
print(f"Please log in at {login_url}...")

# Wait for the user to complete login by checking the current URL
while True:
    current_url = driver.current_url
    if current_url == post_login_url:
        break
    time.sleep(1)

# Once logged in, notify the user, wait a bit, then clean up
print("User logged in")
time.sleep(15)
driver.quit()
sys.exit()

