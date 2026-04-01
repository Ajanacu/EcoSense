##EcoSense — AI Energy Optimizer

## Problem Statement
With rising energy costs and growing environmental concerns, households often struggle to understand their electricity consumption. Generic energy-saving tips are rarely effective because they do not account for a user's specific geographical location, local state tariffs, household size, or specific high-load appliances. There is a lack of accessible, personalized tools that can accurately break down phantom loads and translate kilowatt-hour (kWh) reductions into tangible financial savings or environmental impact.
## Project Description
**EcoSense** is a comprehensive, offline-capable home energy optimization dashboard built with React, Vite, and Tailwind CSS. It is designed specifically for Indian households to track, simulate, and reduce their energy footprint natively in the browser without requiring external API keys.
Key features include:
*   **Dynamic Usage Dashboard**: Visualizes estimated monthly bills and 7-day forecasts using Chart.js based on the user's selected state tariff and specific appliance footprint.
*   **Community Insights**: Benchmarks the household's efficiency percentile against state averages to generate specific, hard-coded strategies tailored to their profile (e.g., AC optimizations, Geyser timings).
*   **Carbon Tracker & Solar Estimator**: Translates raw energy data into actionable metrics, showing CO₂ offset equivalents (like trees planted or flights avoided) and calculating exact ROI for potential rooftop solar installations.
*   **Interactive Bill Simulator & Gamification**: Allows users to interactively simulate the financial impact of changing their daily usage and rewards them with unlocking badges for hitting reduction milestones, wrapped in a premium modern Glassmorphism UI.
---
## Google AI Usage
### Tools / Models Used
- **Google Gemini** (Web Interface / Chat)
- **Antigravity** (Google DeepMind's Agentic AI Assistant)
### How Google AI Was Used
This entire project was conceptualized, designed, and programmed through the integration of AI tools. 
1. **Ideation & Prompt Engineering**: **Google Gemini** was utilized extensively during the planning phase to map out the application's core logic, compile accurate Indian state tariffs, identify heavy-load appliance benchmarks, and meticulously design the initial application architecture and prompts.
2. **AI-Assisted Development**: **Antigravity** (Google's Agentic Coding Assistant) was deployed within the IDE to autonomously build the React application from the ground up. Antigravity handled the execution of the full UI/UX overhaul, implementing the complex state management, Chart.js integrations, and the stunning Tailwind v4 Glassmorphism visual design across all application pages.

## Proof of Google AI Usage
<img width="1920" height="1080" alt="Screenshot 2026-04-01 053558" src="https://github.com/user-attachments/assets/72b339f1-c518-41bf-8a4a-1386f9de6356" />


---

## Screenshots 
Add project screenshots:

![Screenshot1](./assets/screenshot1.png)  
![Screenshot2](./assets/screenshot2.png)

---

## Demo Video
Upload your demo video to Google Drive and paste the shareable link here(max 3 minutes).
[Watch Demo](#)

---

## Installation Steps

```bash
# Clone the repository
git clone <your-repo-link>

# Go to project folder
cd project-name

# Install dependencies
npm install

# Run the project
npm start
