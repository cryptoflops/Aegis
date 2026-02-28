import {
    makeContractCall,
    makeSTXTokenTransfer,
    broadcastTransaction,
    AnchorMode,
    standardPrincipalCV
} from '@stacks/transactions';
import pkg from '@stacks/network';
const { STACKS_TESTNET } = pkg;
import crypto from 'crypto';

// Replace with your actual deployer mnemonic or private key environment variables
let rawDeployerKey = process.env.DEPLOYER_KEY ? process.env.DEPLOYER_KEY.replace(/[^a-fA-F0-9]/g, '') : null;

if (!rawDeployerKey) {
    console.error("Please set DEPLOYER_KEY environment variable");
    process.exit(1);
}

// Stacks requires compressed keys appended with '01'
const DEPLOYER_KEY = rawDeployerKey.length === 64 ? rawDeployerKey + '01' : rawDeployerKey;

const network = STACKS_TESTNET;
const CONTRACT_ADDRESS = "ST1TN1ERKXEM2H9TKKWGPGZVNVNEKS92M7MAMP23P";
const CONTRACT_NAME = "agent-evaluator-oracle";

async function setupOracle() {
    console.log("=== Aegis Oracle Setup ===");

    // 1. In a real app, generate a new wallet. For this script, we'll guide the user to provide the oracle address.
    const oracleAddress = process.env.ORACLE_ADDRESS ? process.env.ORACLE_ADDRESS.trim().split(/\s+/)[0].replace(/['"]/g, '') : null;
    if (!oracleAddress) {
        console.error("Please set ORACLE_ADDRESS to the STX address of your new oracle wallet.");
        process.exit(1);
    }
    console.log(`📡 Target Oracle Address: ${oracleAddress}`);

    try {
        // 2. Fund the Oracle with some STX for gas fees (e.g., 5 STX = 5,000,000 microSTX)
        console.log("💸 Funding Oracle wallet...");
        const transferOptions = {
            recipient: oracleAddress,
            amount: 5000000n, // 5 STX
            senderKey: DEPLOYER_KEY,
            network,
            anchorMode: AnchorMode.Any,
        };
        const transferTx = await makeSTXTokenTransfer(transferOptions);
        const transferResult = await broadcastTransaction({ transaction: transferTx, network });
        if (transferResult.error) {
            console.error("Funding failed:", transferResult.error);
        } else {
            console.log(`✅ Funding Tx Broadcasted: ${transferResult.txid}`);
        }

        const currentNonce = transferTx.auth.spendingCondition.nonce;

        // 3. Authorize the Oracle in the smart contract
        console.log("🔐 Authorizing Oracle in smart contract...");
        const authOptions = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: "authorize-oracle",
            functionArgs: [
                standardPrincipalCV(oracleAddress)
            ],
            senderKey: DEPLOYER_KEY,
            validateWithAbi: true,
            network,
            nonce: currentNonce + 1n,
            anchorMode: AnchorMode.Any,
        };

        const authTx = await makeContractCall(authOptions);
        const authResult = await broadcastTransaction({ transaction: authTx, network });

        if (authResult.error) {
            console.error("Authorization failed:", authResult.error, authResult.reason);
        } else {
            console.log(`✅ Authorization Tx Broadcasted: ${authResult.txid}`);
        }

        console.log("🎉 Setup complete! Wait a few minutes for transactions to confirm on Explorer.");

    } catch (error) {
        console.error("Error setting up Oracle:", error);
    }
}

setupOracle();
