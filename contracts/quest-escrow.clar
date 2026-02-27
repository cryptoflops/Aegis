;; title: quest-escrow
;; version: 1.0.0
;; summary: Escrow for AI Agent Quests
;; description: Locks STX bounties for quests, releasing them upon verified success from the evaluator oracle.

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u400))
(define-constant err-not-found (err u401))
(define-constant err-unauthorized (err u402))
(define-constant err-invalid-state (err u403))
(define-constant err-oracle-verification-failed (err u404))

;; Quest States
(define-constant STATE-OPEN u1)
(define-constant STATE-EVALUATING u2)
(define-constant STATE-COMPLETED u3)
(define-constant STATE-DISPUTED u4)
(define-constant STATE-REFUNDED u5)

;; Data Vars
(define-data-var quest-nonce uint u0)

;; Data Maps
(define-map quests
    { quest-id: uint }
    {
        creator: principal,
        agent-creator: principal,
        agent-id: uint,
        bounty: uint,
        state: uint,
        created-at: uint
    }
)

;; Public Functions

;; Create a new quest and lock STX bounty in this contract
(define-public (create-quest (agent-creator principal) (agent-id uint) (bounty uint))
    (let
        (
            (quest-id (+ (var-get quest-nonce) u1))
        )
        (asserts! (> bounty u0) err-invalid-state)
        
        ;; Transfer bounty to escrow contract
        ;; TODO: Fix as-contract - clarinet v3.11 parser issue with Clarity v4
        ;; (try! (stx-transfer? bounty tx-sender (as-contract tx-sender)))
        
        (map-set quests
            { quest-id: quest-id }
            {
                creator: tx-sender,
                agent-creator: agent-creator,
                agent-id: agent-id,
                bounty: bounty,
                state: STATE-OPEN,
                created-at: stacks-block-height
            }
        )
        (var-set quest-nonce quest-id)
        (ok quest-id)
    )
)

;; Mark quest as evaluating (agent has started working)
(define-public (mark-evaluating (quest-id uint))
    (let
        (
            (quest (unwrap! (map-get? quests { quest-id: quest-id }) err-not-found))
        )
        (asserts! (or (is-eq tx-sender (get creator quest)) (is-eq tx-sender (get agent-creator quest))) err-unauthorized)
        (asserts! (is-eq (get state quest) STATE-OPEN) err-invalid-state)
        
        (map-set quests
            { quest-id: quest-id }
            (merge quest { state: STATE-EVALUATING })
        )
        (ok true)
    )
)

;; Complete quest and release funds
;; Checks the `agent-evaluator-oracle` to see if the quest was verified successfully
(define-public (complete-quest (quest-id uint) (agent-id uint))
    (let
        (
            (quest (unwrap! (map-get? quests { quest-id: quest-id }) err-not-found))
            ;; This is a hardcoded cross-contract call to our oracle. 
            ;; In production we'd use a trait for upgradeability
            (evaluation (unwrap! (contract-call? .agent-evaluator-oracle get-evaluation quest-id agent-id) err-oracle-verification-failed))
        )
        (asserts! (is-eq (get state quest) STATE-EVALUATING) err-invalid-state)
        (asserts! (get verified evaluation) err-oracle-verification-failed)
        (asserts! (get is-successful evaluation) err-oracle-verification-failed)
        
        ;; Release funds to the agent creator
        ;; TODO: Fix as-contract - clarinet v3.11 parser issue with Clarity v4
        ;; (try! (as-contract (stx-transfer? (get bounty quest) tx-sender (get agent-creator quest))))
        
        (map-set quests
            { quest-id: quest-id }
            (merge quest { state: STATE-COMPLETED })
        )
        (ok true)
    )
)

;; Raise a dispute
(define-public (raise-dispute (quest-id uint))
    (let
        (
            (quest (unwrap! (map-get? quests { quest-id: quest-id }) err-not-found))
        )
        (asserts! (is-eq tx-sender (get creator quest)) err-unauthorized)
        (asserts! (or (is-eq (get state quest) STATE-OPEN) (is-eq (get state quest) STATE-EVALUATING)) err-invalid-state)
        
        (map-set quests
            { quest-id: quest-id }
            (merge quest { state: STATE-DISPUTED })
        )
        (ok true)
    )
)

;; Resolve dispute (Admin only)
(define-public (resolve-dispute (quest-id uint) (refund-user bool))
    (let
        (
            (quest (unwrap! (map-get? quests { quest-id: quest-id }) err-not-found))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (is-eq (get state quest) STATE-DISPUTED) err-invalid-state)
        
        (if refund-user
            (begin
                ;; TODO: Fix as-contract - clarinet v3.11 parser issue with Clarity v4
                ;; (try! (as-contract (stx-transfer? (get bounty quest) tx-sender (get creator quest))))
                (map-set quests { quest-id: quest-id } (merge quest { state: STATE-REFUNDED }))
                (ok true)
            )
            (begin
                ;; TODO: Fix as-contract - clarinet v3.11 parser issue with Clarity v4
                ;; (try! (as-contract (stx-transfer? (get bounty quest) tx-sender (get agent-creator quest))))
                (map-set quests { quest-id: quest-id } (merge quest { state: STATE-COMPLETED }))
                (ok true)
            )
        )
    )
)

;; Read Only
(define-read-only (get-quest (quest-id uint))
    (map-get? quests { quest-id: quest-id })
)
