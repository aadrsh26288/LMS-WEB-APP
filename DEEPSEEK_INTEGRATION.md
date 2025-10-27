# DeepSeek AI Integration via OpenRouter

## Overview

This document describes the integration of DeepSeek AI model via OpenRouter API to handle out-of-scope questions in the Luma Learn LMS chat assistant.

## What Was Added

### 1. Dependencies
- **openai** package (v6.6.0) - Compatible with OpenRouter API

### 2. API Configuration
- **OpenRouter API Key** - Hardcoded directly in the application for immediate use

### 3. Code Changes

#### `/src/app/api/chat/route.ts`
- Added OpenAI SDK import and OpenRouter client initialization
- Modified `buildAssistantResponse` function to be async
- Added `isInScopeQuestion` helper function to determine if a question is LMS-related
- Integrated DeepSeek model for out-of-scope questions using `deepseek/deepseek-chat` model
- Added error handling for API failures
- Updated POST handler to await the async response

## How It Works

### Request Flow

1. **User sends a message** through the chat interface
2. **Pattern matching check**: The system first checks if the question matches any LMS-specific patterns:
   - Upload/materials/resources
   - Progress/status/reports
   - Office hours/scheduling
   - Announcements/communications
   - Support/troubleshooting
   - General navigation (courses, dashboard, etc.)

3. **Response routing**:
   - **In-scope questions**: Return pre-defined, context-specific responses about the LMS
   - **Out-of-scope questions**: Call DeepSeek model via OpenRouter API

4. **DeepSeek API call** (for out-of-scope questions):
   - Model: `deepseek/deepseek-chat`
   - System prompt: Identifies the assistant as part of Luma Learn LMS
   - Temperature: 0.7 (balanced creativity)
   - Max tokens: 500 (concise responses)

5. **Streaming response**: Tokens are streamed back to the client in real-time

## Configuration

### DeepSeek Model Settings

```typescript
{
  model: "deepseek/deepseek-chat",
  temperature: 0.7,
  max_tokens: 500,
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant in a Learning Management System (LMS) called Luma Learn..."
    },
    {
      role: "user",
      content: question
    }
  ]
}
```

### Configuration

The OpenRouter API key is pre-configured in the application. No environment setup is required.

## Examples

### In-Scope Question
**User**: "How do I upload course materials?"

**Response**: Uses pre-defined response about navigating to Courses area and using Upload Resource action.

### Out-of-Scope Question
**User**: "What is the capital of France?"

**Response**: DeepSeek model provides a general knowledge answer: "The capital of France is **Paris**! 😊"

## Out-of-Scope Handling

All out-of-scope questions are handled by the DeepSeek AI model via OpenRouter. The API key is pre-configured, so the assistant can immediately answer general knowledge questions while maintaining context about being part of the Luma Learn LMS.

## Error Handling

The integration includes comprehensive error handling:

### Authentication Failure (401)
If the API key is invalid or expired:
- Logs error to console with full error details
- Returns message: "I'd like to help with general questions, but the API authentication failed. The API key may be invalid or expired."

### Other API Errors
For any other API failures:
- Logs error to console for debugging
- Returns fallback message: "I apologize, but I'm having trouble processing your question right now. Please try asking something related to the LMS, or try again later."

## Testing

### Manual Testing with curl

#### Test out-of-scope question:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "What is the capital of France?"}]}' \
  --no-buffer
```

#### Test in-scope question:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "How do I upload course materials?"}]}' \
  --no-buffer
```

## Benefits

1. **Better User Experience**: Users can ask general questions without being limited to LMS-specific queries
2. **Graceful Fallback**: Out-of-scope questions are handled intelligently rather than with generic "I don't know" responses
3. **Maintained Context**: The DeepSeek system prompt ensures responses are still contextually aware of the LMS environment
4. **Cost-Effective**: Only calls the DeepSeek API when necessary (out-of-scope questions)
5. **Streaming Support**: Maintains the existing streaming response mechanism for smooth UX

## Future Enhancements

Possible improvements:
- Add conversation history to DeepSeek calls for better context
- Implement rate limiting for API calls
- Add analytics to track in-scope vs out-of-scope question ratio
- Fine-tune the pattern matching for better classification
- Add caching for common out-of-scope questions
