;; title: subscription-manager
;; version: 1.0.0
;; summary: Manages user subscriptions to AI Agents
;; description: Tracks compute cycle quotas, subscription tiers, and usage for AI interactions.

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u200))
(define-constant err-not-found (err u201))
(define-constant err-unauthorized (err u202))
(define-constant err-insufficient-funds (err u203))
(define-constant err-quota-exceeded (err u204))

;; Subscription Tiers
(define-constant TIER-FREE u0)
(define-constant TIER-PRO u1)

;; Data Maps
(define-map subscriptions
    { user: principal, agent-id: uint }
    {
        tier: uint,
        cycles-used: uint,
        cycles-limit: uint,
        expires-at: uint,
        is-active: bool
    }
)

;; Read-Only Functions
(define-read-only (get-subscription (user principal) (agent-id uint))
    (map-get? subscriptions { user: user, agent-id: agent-id })
)

(define-read-only (has-cycles-available (user principal) (agent-id uint) (requested-cycles uint))
    (match (map-get? subscriptions { user: user, agent-id: agent-id })
        sub (and 
                (get is-active sub)
                (> (get expires-at sub) stacks-block-height)
                (<= (+ (get cycles-used sub) requested-cycles) (get cycles-limit sub))
            )
        false
    )
)

;; Public Functions

;; Subscribe to an agent (simplified: direct payment to agent creator)
;; In a full implementation, this would read the price from agent-registry.
;; For Aegis demo, we pass the price and send it (could be verified against registry via tr).
(define-public (subscribe (agent-id uint) (tier uint) (price uint) (creator principal))
    (let
        (
            (duration u4320) ;; roughly 30 days in blocks
            (limit (if (is-eq tier TIER-PRO) u10000 u100)) ;; Pro=10k cycles, Free=100
        )
        ;; Transfer STX if not free
        (if (> price u0)
            (try! (stx-transfer? price tx-sender creator))
            true
        )
        
        (map-set subscriptions
            { user: tx-sender, agent-id: agent-id }
            {
                tier: tier,
                cycles-used: u0,
                cycles-limit: limit,
                expires-at: (+ stacks-block-height duration),
                is-active: true
            }
        )
        (ok true)
    )
)

;; Track usage (called by an authorized relayer or the escrow contract)
(define-public (track-usage (user principal) (agent-id uint) (cycles uint))
    (let
        (
            (sub (unwrap! (map-get? subscriptions { user: user, agent-id: agent-id }) err-not-found))
            (new-usage (+ (get cycles-used sub) cycles))
        )
        ;; For now, any user can call this, but ideally restricted to the oracle/escrow
        (asserts! (<= new-usage (get cycles-limit sub)) err-quota-exceeded)
        
        (map-set subscriptions
            { user: user, agent-id: agent-id }
            (merge sub { cycles-used: new-usage })
        )
        (ok new-usage)
    )
)
