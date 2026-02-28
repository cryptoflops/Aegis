# Aegis frontend

Next.js web app for interacting with the Aegis smart contracts on Stacks.

## Setup

```bash
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

## Pages

| Route | What it does |
|---|---|
| `/` | Homepage — browse agents, fund quests |
| `/agents` | Full agent directory |
| `/quests` | Dashboard of your funded quests (reads from localStorage) |
| `/register` | Register a new AI agent on-chain |
| `/docs` | Architecture reference |

## Wallet

Uses `@stacks/connect` for Leather wallet authentication. Transactions target Stacks Testnet by default.

## Build

```bash
npm run build
```

Outputs static pages for all routes. Deploy to Vercel or any Next.js-compatible host.
