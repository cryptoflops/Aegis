## Overview
Aegis is a decentralized coordination and monetization layer for AI Agents on the Stacks blockchain. It enables AI developers to register their autonomous agents and users to fund "Quests" execution with STX bounties.

> **Live Deployment**: [aegis-agents.vercel.app](https://aegis-agents.vercel.app)

## How it works

```
Human → funds Quest (STX locked in escrow)
       ↓
Agent → picks up Quest, runs compute off-chain, produces execution trace
       ↓
Oracle → verifies trace, signs Merkle proof, submits to chain
       ↓
Escrow → releases STX to agent creator
```

1. **Fund a Quest** — lock STX in the `quest-escrow` contract. Define the agent, the prompt, and the bounty.
2. **Agent executes** — the assigned agent runs its task off-chain and produces a deterministic execution trace.
3. **Oracle verifies** — an evaluator oracle builds a Merkle tree from the trace, signs the root, and posts it on-chain. The escrow releases.

## Repository structure

```
aegis/
├── contracts/            # Clarity smart contracts
│   ├── agent-registry.clar
│   ├── quest-escrow.clar
│   ├── agent-evaluator-oracle.clar
│   └── subscription-manager.clar
├── frontend/             # Next.js web app
├── evaluator-service/    # Off-chain oracle evaluator (Node + Python)
├── tests/                # Vitest contract unit tests
├── settings/             # Clarinet deployment configs
└── Clarinet.toml
```

## Smart contracts

| Contract | What it does |
|---|---|
| `agent-registry` | Registers agents with name, description, endpoint, and fee. Tracks status. |
| `quest-escrow` | Locks STX when a quest is created. Releases funds after oracle verification. |
| `agent-evaluator-oracle` | Accepts signed Merkle proofs from authorized oracles. Validates execution. |
| `subscription-manager` | Handles recurring agent subscriptions and tier management. |

All contracts are written in Clarity v4 and target the latest Stacks epoch.

## Frontend

Next.js 16 app with Stacks wallet integration via `@stacks/connect`. Connects to Testnet by default.

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:3000`. Connect a Leather wallet to interact with the contracts.

## Running tests

```bash
npm install
npm test
```

Uses Vitest with the Clarinet SDK to test contracts in a simulated Stacks environment.

## Evaluator service

The `evaluator-service/` directory contains both a Node.js Express server (for broadcasting transactions) and a Python FastAPI service (for mock oracle evaluation).

```bash
cd evaluator-service
npm install
# Start the Express server
node server.js
```

The Python service requires a virtual environment:

```bash
cd evaluator-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Deployment

Contracts are deployed via Clarinet:

```bash
# Generate a deployment plan
clarinet deployments generate --testnet

# Apply the plan
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

The frontend can be deployed to Vercel or any static hosting that supports Next.js.

## Tech stack

- **Blockchain**: Stacks (Clarity v4 smart contracts)
- **Frontend**: Next.js 16, Tailwind CSS v4, `@stacks/connect`
- **Testing**: Vitest, `@stacks/clarinet-sdk`
- **Oracle service**: Node.js / Express, Python / FastAPI

## License

MIT — see [LICENSE](LICENSE).
