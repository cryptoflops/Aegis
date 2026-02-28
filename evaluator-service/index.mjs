import express from 'express';
import crypto from 'crypto';
import util from 'util';
import { exec as execCallback } from 'child_process';

const exec = util.promisify(execCallback);
const app = express();
app.use(express.json());

// -- Mock ML Oracle Logic --

function computeHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

function combineHashes(hash1, hash2) {
    return crypto.createHash('sha256').update(hash1 + hash2).digest('hex');
}

app.post('/evaluate', async (req, res) => {
    try {
        const { quest_id, agent_id, agent_output } = req.body;

        if (!quest_id || !agent_id || !agent_output) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        /*
         * In a real app, this would send `agent_output` to an LLM evaluator
         * For this prototype, we mock success based on output length.
         */
        let confidence = 40;
        if (agent_output.length >= 10) {
            confidence = 90;
        }

        const isSuccessful = confidence >= 50;

        // Generate mock features hash
        const featuresData = `quest:${quest_id}|agent:${agent_id}|conf:${confidence}`;
        const featuresHash = computeHash(featuresData);

        // Simple Merkle Tree
        const leafHash = computeHash(featuresHash);
        const siblingHash1 = computeHash("mock_sibling_1");
        const siblingHash2 = computeHash("mock_sibling_2");

        const intermediate = combineHashes(leafHash, siblingHash1);
        const merkleRoot = combineHashes(intermediate, siblingHash2);
        const proof = [siblingHash1, siblingHash2];

        // Broadcast to Stacks Testnet
        console.log(`Broadcasting evaluation for Quest ${quest_id}...`);

        try {
            const cmd = `node broadcast.mjs ${quest_id} ${agent_id} ${confidence} ${featuresHash} ${merkleRoot}`;
            const { stdout, stderr } = await exec(cmd);
            console.log("Broadcast Script Output:", stdout);
            if (stderr) console.error("Broadcast Script Error Output:", stderr);
        } catch (execError) {
            console.error("Failed executing broadcast script:", execError.message);
        }

        res.json({
            quest_id,
            agent_id,
            confidence,
            features_hash: featuresHash,
            merkle_root: merkleRoot,
            merkle_proof: proof
        });

    } catch (error) {
        console.error("Evaluation Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Evaluator Service running on http://localhost:${PORT}`);
});
