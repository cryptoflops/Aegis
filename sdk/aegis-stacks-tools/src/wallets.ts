import { readFileSync } from 'node:fs';
import { mnemonicToSeedSync } from 'bip39';
import { HDKey } from '@scure/bip32';
import { getAddressFromPrivateKey, TransactionVersion } from '@stacks/transactions';
import { decrypt } from './crypto.js';
import { isMainnet } from './stacks.js';

export interface WalletAccount {
    index: number;
    address: string;
    privateKey: string; // compressed hex: 64-char key + '01'
}

export function loadWallets(password: string): WalletAccount[] {
    const raw = JSON.parse(readFileSync('wallets.json', 'utf8'));
    const mnemonic = decrypt(raw.mnemonic_encrypted as string, password);
    const seed = mnemonicToSeedSync(mnemonic);
    const root = HDKey.fromMasterSeed(seed);
    const ver = isMainnet ? TransactionVersion.Mainnet : TransactionVersion.Testnet;

    return (raw.wallets as Array<{ index: number; address: string }>).map(({ index, address }) => {
        const child = root.derive(`m/44'/5757'/${index}'/0/0`);
        if (!child.privateKey) throw new Error(`Key derivation failed at index ${index}`);
        const privateKey = Buffer.from(child.privateKey).toString('hex') + '01';

        const derived = getAddressFromPrivateKey(privateKey, ver);
        if (derived !== address) {
            throw new Error(`Address mismatch at index ${index}: got ${derived}, expected ${address}`);
        }
        return { index, address, privateKey };
    });
}
