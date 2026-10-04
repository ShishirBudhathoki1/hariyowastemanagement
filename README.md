# hariyowastemanagement

## AI Chat Setup

The Hariyo chat widget uses an OpenAI-compatible Chat Completions API. Add these settings to the project-root `.env`, using the endpoint and model name from your provider:

```env
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=your-chat-model
AI_API_KEY=your-server-side-api-key
```

`AI_BASE_URL` should be the provider's API root, usually ending in `/v1`.

Keep `AI_API_KEY` server-side: do not prefix it with `NEXT_PUBLIC_` or put it in browser code. Restart the Next.js server after changing `.env`. The chat will show a setup message until all three settings are present.