# Omnis Demo - Frontend Only

🎯 **This repository has been simplified to run the frontend without requiring any backend services or AI agents.**

The Omnis Demo frontend now runs in **demo mode** with intelligent mock responses, providing the full user experience without complex backend setup.

## Quick Start

1. **Navigate to the frontend directory:**
   ```bash
   cd omnis-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser

5. **Login with demo credentials:**
   - Email: `pedro.clem@kyndryl.com`
   - Password: `pedro.clem`

## Alternative Quick Start

Use the provided startup script:
```bash
./start-frontend.sh
```

## What's Included

✅ **Complete Frontend Experience** - All original UI/UX preserved  
✅ **Intelligent Mock Responses** - Context-aware AI responses  
✅ **Dashboard Integration** - All visualizations and analytics work  
✅ **Multi-scenario Support** - Health, security, logistics demos  
✅ **Zero Backend Dependencies** - No Docker, databases, or servers needed  

## Demo Features

### Supported Use Cases
- **Autonomous Truck Performance** - Ask about truck performance to trigger dashboards
- **Health & Medical Analysis** - Healthcare data insights and tracking
- **Border Control & Security** - Security monitoring and compliance
- **Natural Disaster Response** - Emergency management and risk assessment

### Test Prompts
Try these to see different features:
- "Show today's autonomous truck performance with insights from Gatik, NVIDIA, and Applied Intuition"
- "What's the current health situation?"
- "Show me border security status"
- "Any natural disaster alerts?"

## Project Structure

```
L-G-ESGDemo/
├── omnis-ui/                    # Main Next.js frontend application
│   ├── app/                     # Next.js app router pages
│   ├── components/              # React components
│   ├── lib/                     # Utilities and providers
│   │   ├── mock-letta-chat-provider.tsx  # Mock chat functionality
│   │   └── mock-letta-client.ts          # Mock API client
│   └── ...
├── README.md                    # This file
├── README-frontend-only.md      # Detailed setup instructions
├── CHANGES-SUMMARY.md           # Complete list of modifications
└── start-frontend.sh           # Quick start script
```

## Key Features

- **Instant Setup** - Ready to demo in under 5 minutes
- **Full Functionality** - All UI components and interactions work
- **Smart Responses** - Context-aware mock AI responses
- **Dashboard Triggers** - Specific keywords activate visualizations
- **Portable** - Runs anywhere Node.js is available

## For Developers

This version demonstrates how to:
- Create intelligent mock responses for AI chat interfaces
- Maintain full UI/UX while removing backend dependencies
- Implement context-aware demo modes
- Preserve dashboard and visualization functionality

---

**Note:** The original backend components (Docker, Letta agent, Supabase) have been removed. If you need the full-stack version, please check the git history or contact the development team.
