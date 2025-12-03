# OpenAI Integration Setup

## Environment Configuration

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Fill in your OpenAI API key in the `.env` file:
   ```env
   VITE_OPENAI_API_KEY=sk-proj-your-actual-api-key-here
   VITE_OPENAI_MODEL=gpt-4o-mini
   VITE_WHISPER_MODEL=whisper-1
   ```

## Getting Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it into your `.env` file

## How It Works

The voice-to-ticket system uses two OpenAI APIs:

### 1. Whisper API (Speech-to-Text)

- Converts voice recordings to text transcriptions
- Model: `whisper-1`
- Input: Audio blob from browser MediaRecorder
- Output: Text transcription

### 2. GPT API (Text Analysis)

- Analyzes transcribed text to extract structured ticket information
- Model: `gpt-4o-mini` (configurable)
- Extracts:
  - Machine name
  - Zone/location
  - Issue summary
  - Priority level (critical/high/low)
  - Action plan

### Priority Guidelines

The AI determines priority based on:

- **Critical**: Safety hazards, complete failures, production stoppage
- **High**: Significant performance issues, potential failures
- **Low**: Minor issues, maintenance requests, routine checks

## API Costs

- **Whisper API**: ~$0.006 per minute of audio
- **GPT-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens

Typical voice report (30 seconds):

- Whisper: ~$0.003
- GPT analysis: ~$0.0001
- **Total: ~$0.003 per report**

## Browser Permissions

The application requires microphone access. Users will be prompted to allow microphone access when first using the voice reporter.

## Troubleshooting

### "Failed to access microphone"

- Ensure browser has microphone permissions
- Check that no other application is using the microphone
- Try a different browser (Chrome/Edge recommended)

### "Failed to transcribe audio"

- Verify your OpenAI API key is valid
- Check that your OpenAI account has credits
- Ensure audio recording duration is sufficient (minimum 1 second)

### "Failed to process issue report"

- Check API key permissions
- Verify internet connectivity
- Review browser console for detailed error messages

## Development

The implementation consists of:

- `src/lib/openai.ts` - OpenAI API integration
- `src/lib/audioRecorder.ts` - Browser audio recording
- `src/views/OperationsView.tsx` - Voice input UI and workflow

## Security Notes

- API keys are stored in `.env` file (git-ignored)
- Never commit `.env` to version control
- The OpenAI SDK runs in the browser with `dangerouslyAllowBrowser: true`
- For production, consider implementing a backend proxy to secure API keys
