import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import pkg from '@stacks/network';
const { STACKS_TESTNET, STACKS_MAINNET } = pkg;

// Get the mnemonic from the environment variable (safer than hardcoding)
const mnemonic = process.env.MNEMONIC;

if (!mnemonic) {
    console.error("❌ Error: MNEMONIC environment variable is missing.");
    console.error("Please run the script like this: MNEMONIC=\"your 24 words\" node get-keys.mjs");
    process.exit(1);
}

async function extractKeys() {
    try {
        console.log("🔐 Deriving keys from mnemonic...\n");

        // Generate the Stacks wallet instance
        const wallet = await generateWallet({
            secretKey: mnemonic,
            password: 'password' // We only need the raw key material, password doesn't matter here
        });

        // The first account is the default one (Account 0) used in Leather usually
        const account = wallet.accounts[0];

        console.log("=== Stacks Testnet Address ===");
        console.log(getStxAddress({ account, network: STACKS_TESTNET }));

        console.log("\n=== Stacks Mainnet Address ===");
        console.log(getStxAddress({ account, network: STACKS_MAINNET }));

        console.log("\n=== Raw Private Key (64 characters) ===");
        console.log(account.stxPrivateKey.substring(0, 64));

        console.log("\n⚠️ IMPORTANT: NEVER share this private key with anyone or put it in code!");

    } catch (error) {
        console.error("Error generating wallet:", error.message);
    }
}

extractKeys();
