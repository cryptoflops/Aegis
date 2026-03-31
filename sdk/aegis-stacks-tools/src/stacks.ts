import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode,
    type ClarityValue,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet, type StacksNetwork } from '@stacks/network';

export let isMainnet = false;
export let network: StacksNetwork = new StacksTestnet();

export function setNetwork(mainnet: boolean) {
    isMainnet = mainnet;
    network = mainnet ? new StacksMainnet() : new StacksTestnet();
}

export interface CallResult {
    txId: string;
    success: boolean;
    error?: string;
}

export async function callContract(opts: {
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgs: ClarityValue[];
    senderKey: string;
    fee?: number;
}): Promise<CallResult> {
    try {
        const tx = await makeContractCall({
            contractAddress: opts.contractAddress,
            contractName: opts.contractName,
            functionName: opts.functionName,
            functionArgs: opts.functionArgs,
            senderKey: opts.senderKey,
            network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
            fee: opts.fee ?? 2000,
        });

        const result = await broadcastTransaction(tx, network);

        if ('error' in result) {
            return { txId: '', success: false, error: `${result.error} — ${result.reason ?? ''}` };
        }
        return { txId: result.txid, success: true };
    } catch (err) {
        return { txId: '', success: false, error: String(err) };
    }
}

export function jitter(minMs: number, maxMs: number): Promise<void> {
    const ms = Math.floor(Math.random() * (maxMs - minMs)) + minMs;
    return new Promise(r => setTimeout(r, ms));
}
