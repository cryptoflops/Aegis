import hashlib
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Aegis Evaluator Service")

# -- Models --

class EvaluationRequest(BaseModel):
    quest_id: int
    agent_id: int
    agent_output: str

class EvaluationResponse(BaseModel):
    quest_id: int
    agent_id: int
    confidence: int # 0-100
    features_hash: str
    merkle_root: str
    merkle_proof: List[str]

# -- Mock ML Oracle Logic --

def compute_hash(data: str) -> str:
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

def combine_hashes(hash1: str, hash2: str) -> str:
    # Mimicking clarity's concat and sha256
    return hashlib.sha256((hash1 + hash2).encode('utf-8')).hexdigest()

@app.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_quest(req: EvaluationRequest):
    """
    In a real app, this would send `req.agent_output` to an LLM evaluator to score it 0-100.
    For this prototype, we'll mock a successful evaluation based on string length.
    """
    if len(req.agent_output) < 10:
        confidence = 40
    else:
        confidence = 90
        
    # Generate mock features hash
    features_data = f"quest:{req.quest_id}|agent:{req.agent_id}|conf:{confidence}"
    features_hash = compute_hash(features_data)
    
    # We create a simple Merkle Tree for the proof.
    # Leaf: hash of the features
    leaf_hash = compute_hash(features_hash)
    
    # We mock a small tree
    sibling_hash_1 = compute_hash("mock_sibling_1")
    sibling_hash_2 = compute_hash("mock_sibling_2")
    
    # Root
    intermediate = combine_hashes(leaf_hash, sibling_hash_1)
    merkle_root = combine_hashes(intermediate, sibling_hash_2)
    
    # The proof to go from leaf to root
    proof = [sibling_hash_1, sibling_hash_2]
    
    # In a full Stacks app, we'd also trigger a transaction here calling
    # `submit-evaluation` on the `agent-evaluator-oracle.clar` contract.
    # For now, we return the data so the user can see it.

    return EvaluationResponse(
        quest_id=req.quest_id,
        agent_id=req.agent_id,
        confidence=confidence,
        features_hash=features_hash,
        merkle_root=merkle_root,
        merkle_proof=proof
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
