;; title: agent-evaluator-oracle
;; version: 1.0.0
;; summary: Oracle for verifying AI Agent quest executions
;; description: Allows an authorized off-chain entity to submit evaluation results and Merkle proofs for AI agent tasks.

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u300))
(define-constant err-unauthorized (err u301))
(define-constant err-invalid-proof (err u302))
(define-constant err-not-found (err u303))

;; Data Variables
(define-data-var oracle-admin principal contract-owner)
(define-data-var min-confidence-threshold uint u85) ;; 85% confidence required to pass a quest

;; Data Maps
(define-map authorized-oracles principal bool)

;; Evaluation Results
(define-map evaluations
    { quest-id: uint, agent-id: uint }
    {
        confidence: uint,        ;; 0-100 scale
        is-successful: bool,     ;; True if confidence >= threshold
        merkle-root: (buff 32),  ;; Merkle root for proof verification
        features-hash: (buff 32),;; Evaluation metadata hash
        verified: bool           ;; Has the user provided the Merkle proof to unlock?
    }
)

;; Verification Proofs (Stored when a user successfully verifies)
(define-map verification-proofs
    { quest-id: uint, agent-id: uint }
    {
        merkle-proof: (list 10 (buff 32)),
        leaf-data: (buff 256),
        verified-at: uint
    }
)

;; Admin Functions

(define-public (set-oracle-admin (new-admin principal))
    (begin
        (asserts! (is-eq tx-sender (var-get oracle-admin)) err-owner-only)
        (ok (var-set oracle-admin new-admin))
    )
)

(define-public (authorize-oracle (oracle principal))
    (begin
        (asserts! (is-eq tx-sender (var-get oracle-admin)) err-owner-only)
        (ok (map-set authorized-oracles oracle true))
    )
)

;; Oracle Functions

;; Submit outcome of an AI quest from off-chain ML service
(define-public (submit-evaluation
    (quest-id uint)
    (agent-id uint)
    (confidence uint)
    (features-hash (buff 32))
    (merkle-root (buff 32))
)
    (let
        (
            (is-successful (>= confidence (var-get min-confidence-threshold)))
        )
        (asserts! (default-to false (map-get? authorized-oracles tx-sender)) err-unauthorized)
        
        (map-set evaluations
            { quest-id: quest-id, agent-id: agent-id }
            {
                confidence: confidence,
                is-successful: is-successful,
                merkle-root: merkle-root,
                features-hash: features-hash,
                verified: false
            }
        )
        (ok is-successful)
    )
)

;; Verify prediction with Merkle proof (Called by users/escrow to unlock funds)
(define-public (verify-evaluation
    (quest-id uint)
    (agent-id uint)
    (merkle-proof (list 10 (buff 32)))
    (leaf-data (buff 256))
)
    (let
        (
            (evaluation (unwrap! (map-get? evaluations { quest-id: quest-id, agent-id: agent-id }) err-not-found))
            (merkle-root (get merkle-root evaluation))
            (computed-root (compute-merkle-root leaf-data merkle-proof))
        )
        ;; Verify Merkle proof
        (asserts! (is-eq computed-root merkle-root) err-invalid-proof)
        
        ;; Mark as verified
        (map-set evaluations
            { quest-id: quest-id, agent-id: agent-id }
            (merge evaluation { verified: true })
        )
        
        ;; Record proof
        (map-set verification-proofs
            { quest-id: quest-id, agent-id: agent-id }
            {
                merkle-proof: merkle-proof,
                leaf-data: leaf-data,
                verified-at: stacks-block-height
            }
        )
        
        (ok (get is-successful evaluation))
    )
)

;; Read-Only
(define-read-only (get-evaluation (quest-id uint) (agent-id uint))
    (map-get? evaluations { quest-id: quest-id, agent-id: agent-id })
)

;; Private Helpers

;; Compute Merkle root from leaf and proof
(define-private (compute-merkle-root (leaf (buff 256)) (proof (list 10 (buff 32))))
    (let
        (
            (leaf-hash (sha256 leaf))
        )
        (fold merkle-step proof leaf-hash)
    )
)

;; Merkle proof step
(define-private (merkle-step (proof-element (buff 32)) (current-hash (buff 32)))
    (sha256 (concat current-hash proof-element))
)
