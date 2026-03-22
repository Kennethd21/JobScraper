import requests
from bs4 import BeautifulSoup
import csv
import time

def scrape_jobs():
    # URL to scrape
    url = "https://realpython.github.io/fake-jobs/"
    
    # Headers to mimic a real browser request (avoids some basic blocking)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        # Send HTTP GET request
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise error for bad status codes (e.g., 404)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the URL: {e}")
        return

    # Parse the HTML content
    soup = BeautifulSoup(response.text, "html.parser")

    # Find the container that holds all job cards
    results_container = soup.find("div", id="ResultsContainer")
    
    if not results_container:
        print("Could not find the results container. The page structure might have changed.")
        return

    # Find all individual job cards
    job_cards = results_container.find_all("div", class_="card-content")

    job_data = []

    print(f"Found {len(job_cards)} job listings. Extracting data...")

    for card in job_cards:
        # Extract Job Title
        # We look for the <h2> tag with class "title"
        title_tag = card.find("h2", class_="title")
        title = title_tag.text.strip() if title_tag else "N/A"

        # Extract Company Name
        # We look for the <h3> tag with class "company"
        company_tag = card.find("h3", class_="company")
        company = company_tag.text.strip() if company_tag else "N/A"

        # Extract Location
        # We look for the <p> tag with class "location"
        location_tag = card.find("p", class_="location")
        location = location_tag.text.strip() if location_tag else "N/A"

        # Extract Detail Page URL
        # The detail link is usually in the footer of the card, identified by text "Apply" or looking at the href.
        # The structure typically has two 'a' tags: one for 'Learn' (detail) and one for 'Apply'.
        # On this specific site, the first link in the footer is usually the Detail link (or 'Learn').
        # However, specifically for this site, there is a footer with multiple links.
        # Let's target the specific 'Apply' button which links to the detail page on this specific fake job site.
        
        footer = card.find("footer", class_="card-footer")
        detail_url = "N/A"
        
        if footer:
            # Find all links in the footer
            links = footer.find_all("a")
            if links:
                # Logic for this specific site:
                # The first link is usually the "Learn" link (detail page).
                # The second link is the "Apply" link (external).
                # We want the detail page URL.
                detail_url = links[0].get("href", "N/A")

        # Append clean data to list
        job_data.append({
            "Job Title": title,
            "Company Name": company,
            "Location": location,
            "Detail URL": detail_url
        })

    # Save data to CSV
    save_to_csv(job_data)

def save_to_csv(data, filename="jobs.csv"):
    if not data:
        print("No data to save.")
        return

    # Define CSV headers
    headers = ["Job Title", "Company Name", "Location", "Detail URL"]

    try:
        with open(filename, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=headers)
            writer.writeheader()
            writer.writerows(data)
        print(f"Successfully saved {len(data)} jobs to '{filename}'")
    except IOError as e:
        print(f"Error writing to CSV: {e}")

if __name__ == "__main__":
    scrape_jobs()