# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure OpenAI API

Create a `.env` file in the project root:

```env
VITE_OPENAI_API_KEY=sk-proj-your-api-key-here
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_WHISPER_MODEL=whisper-1
```

Get your API key from: https://platform.openai.com/api-keys

## 3. Start Development Server

```bash
npm run dev
```

## 4. Use Voice Reporter

1. Navigate to the Operations view
2. Hold down the microphone button
3. Speak clearly: "Line 4 heater is overheating in Zone A, emergency shutdown needed"
4. Release the button
5. Wait for AI processing (transcription + analysis)
6. Ticket will be automatically created

## Example Voice Inputs

### Critical Priority

"The main pump station has failed completely, Zone B production line is down, immediate attention required"

### High Priority

"Assembly robot 3 in Zone C is making unusual noises and slowing down, needs inspection soon"

### Low Priority

"Conveyor belt in Zone A needs routine lubrication and maintenance check"

## Tips for Best Results

- Speak clearly and at normal pace
- Mention machine/equipment name
- Describe the issue or symptom
- Include location/zone if known
- State urgency if critical

## Architecture

```
Voice Input → MediaRecorder API → Blob
    ↓
OpenAI Whisper API → Text Transcription
    ↓
OpenAI GPT API → Structured Data
    ↓
Ticket Creation → Context State
```
