import { makeContractCall, broadcastTransaction, AnchorMode, stringAsciiCV, uintCV, boolCV, bufferCV, listCV, validateStacksAddress } from '@stacks/transactions';
import pkg from '@stacks/network';
const { STACKS_MAINNET, STACKS_TESTNET } = pkg;
import fs from 'fs';

// This script expects arguments:
// node broadcast.mjs <quest_id> <agent_id> <confidence> <is_successful> <merkle_root_hex> <features_hash_hex>

const args = process.argv.slice(2);
if (args.length < 5) {
    console.error("Usage: node broadcast.mjs <quest_id> <agent_id> <confidence> <features_hash_hex> <merkle_root_hex>");
    process.exit(1);
}

const questId = parseInt(args[0], 10);
const agentId = parseInt(args[1], 10);
const confidence = parseInt(args[2], 10);
const featuresHashHex = args[3];
const merkleRootHex = args[4];

const isMainnet = process.env.STACKS_NETWORK === 'mainnet';
const network = isMainnet ? STACKS_MAINNET : STACKS_TESTNET;

// The deployer address of the smart contracts
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "SP1TN1ERKXEM2H9TKKWGPGZVNVNEKS92M7M3CKVJJ";
const CONTRACT_NAME = "agent-evaluator-oracle";
const FUNCTION_NAME = "submit-evaluation";

// The private key of the oracle (For this prototype, we'll use a hardcoded devnet/testnet key or pull from env)
// IMPORTANT: In production, the Oracle needs its own funded wallet. 
// For this tutorial, we read it from ORACLE_KEY env variable, falling back to a dummy key that WILL fail if used.
const ORACLE_PRIVATE_KEY = process.env.ORACLE_KEY || "753b7cc01a1a2e86221266a154af73a4606d2529e58ea0c8540822bb2b4ed34d01";

async function broadcastEvaluation() {
    try {
        const txOptions = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: FUNCTION_NAME,
            functionArgs: [
                uintCV(questId),
                uintCV(agentId),
                uintCV(confidence),
                bufferCV(Buffer.from(featuresHashHex, 'hex')),
                bufferCV(Buffer.from(merkleRootHex, 'hex'))
            ],
            senderKey: ORACLE_PRIVATE_KEY,
            validateWithAbi: true,
            network,
            anchorMode: AnchorMode.Any,
        };

        const transaction = await makeContractCall(txOptions);
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        console.log(JSON.stringify({
            success: !broadcastResponse.error,
            txid: broadcastResponse.txid,
            error: broadcastResponse.error,
            reason: broadcastResponse.reason
        }));

    } catch (error) {
        console.error(JSON.stringify({
            success: false,
            error: error.message,
            stack: error.stack
        }));
    }
}

broadcastEvaluation();
