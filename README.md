# Aura: AI-Powered Digital Wealth Advisor (Avatar-Based)

Aura is a high-fidelity, interactive, avatar-based wealth advisory and portfolio management dashboard designed to seamlessly integrate into mobile banking applications. Built using React, Vite, and Google Gemini API, Aura delivers personalized, data-driven financial advice with a real-time conversational visual interface.

---

## 🌟 Key Features

1. **Interactive Conversational AI Avatar ("Aura")**:
   - Custom SVG-animated avatar with multiple visual states: `idle` (breathing/blinking), `listening` (soundwaves pulsating), `thinking` (particle rings rotating), and `speaking` (lip-sync movements).
   - **Speech-to-Text (STT)**: Tap the microphone icon to speak to Aura directly using Web Speech recognition.
   - **Text-to-Speech (TTS)**: Check "Enable Voice Responses" to hear Aura talk out loud with high-quality voice synthesis.
2. **Personalized Spending & Inflow Analytics**:
   - Live visual breakdown of monthly spending categories (Rent, Food, Bills, Shopping).
   - Dynamic charts displaying net portfolio worth, active debt, and monthly savings.
3. **Interactive Risk Profiler**:
   - 4-question step-by-step risk tolerance assessment.
   - Suggests target asset allocation models (Conservative, Balanced, Aggressive) along with expected return rates.
4. **Drift Detection & Portfolio Rebalancer**:
   - Tracks portfolio drift (actual holdings vs. target allocation).
   - "One-Click Rebalance" option triggers trade simulation orders to align portfolio back to target instantly.
5. **Goal Feasibility Planner**:
   - Configure financial goals (e.g. Retirement, Emergency Fund, Dream Home).
   - Trigger a custom AI feasibility check where Aura calculates compounding interest and savings pace to advise on target dates or savings adjustments.

---

## 🛠️ Technical Stack

- **Frontend Core**: React 19 + Vite (built for 60fps performance)
- **Styling**: Vanilla CSS with futuristic glassmorphism, glowing hover states, and smooth keyframe animations
- **AI Brain**: Google Gemini 2.5 Flash API (utilizing Generative Language REST endpoints)
- **Voice Services**: Native HTML5 Web Speech API (no external voice subscription bloat)
- **Icons & Fonts**: FontAwesome v6, Google Fonts (Outfit, Inter)

---

## 🚀 How to Run Locally

### 1. Install Dependencies
Ensure you have Node.js installed, then run:
```bash
cd digital-wealth-avatar
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open the local URL displayed (usually `http://localhost:5173`) in your web browser.

### 3. Usage & Modes
- **Mobile Simulator**: Toggle the "Mobile Simulator" button at the top right to simulate how Aura integrates directly into a mobile banking app.
- **Desktop View**: Toggle "Desktop View" to view a full widescreen wealth management dashboard.
- **Talk to Aura**: Chat using the keyboard, or click the mic button to speak. Turn on "Enable Voice Responses" to hear the voice synthesis.

---

## 📦 How to Deploy

### Option 1: GitHub Pages (Free Widescreen Static Deploy)
1. Install `gh-pages` helper package:
   ```bash
   npm install gh-pages --save-dev
   ```
2. Add the following scripts to your `package.json`:
   ```json
   "homepage": "https://<your-github-username>.github.io/digital-wealth-avatar",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run deployment command:
   ```bash
   npm run deploy
   ```

### Option 2: Firebase Hosting (Spark Free Tier)
1. Initialize Firebase inside the directory:
   ```bash
   npx firebase-tools init
   ```
   - Select **Hosting**.
   - Set the public directory to `dist`.
   - Configure as a single-page app: `Yes`.
2. Deploy to Firebase:
   ```bash
   npx firebase-tools deploy
   ```

---

## 📊 Presentation Deck

A professional presentation deck explaining the problem statement, AI architecture, and business opportunity is available in the root folder:
- **Presentation**: `Aura_Wealth_Advisor_Presentation.pptx`
- *Note: You can open this file in PowerPoint and select 'Save As PDF' to generate the presentation in PDF format for final submission.*
