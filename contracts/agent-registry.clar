;; title: agent-registry
;; version: 1.0.0
;; summary: Registry for AI Agents in the Aegis platform
;; description: Manages creation, updating, and querying of AI agents.

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))

;; Data Variables
(define-data-var agent-nonce uint u0)

;; Data Maps
(define-map agents
    { agent-id: uint }
    {
        creator: principal,
        name: (string-ascii 64),
        description: (string-utf8 256),
        endpoint: (string-ascii 256), ;; API endpoint for the agent
        is-active: bool,
        price-per-cycle: uint, ;; STX per compute cycle/invocation
        created-at: uint
    }
)

;; Read-Only Functions
(define-read-only (get-agent-info (agent-id uint))
    (map-get? agents { agent-id: agent-id })
)

;; Public Functions

;; Register a new AI Agent
(define-public (register-agent 
    (name (string-ascii 64)) 
    (description (string-utf8 256)) 
    (endpoint (string-ascii 256))
    (price-per-cycle uint)
)
    (let
        (
            (agent-id (+ (var-get agent-nonce) u1))
        )
        (map-set agents
            { agent-id: agent-id }
            {
                creator: tx-sender,
                name: name,
                description: description,
                endpoint: endpoint,
                is-active: true,
                price-per-cycle: price-per-cycle,
                created-at: stacks-block-height
            }
        )
        (var-set agent-nonce agent-id)
        (ok agent-id)
    )
)

;; Update agent details
(define-public (update-agent
    (agent-id uint)
    (new-name (string-ascii 64))
    (new-description (string-utf8 256))
    (new-endpoint (string-ascii 256))
    (new-price uint)
)
    (let
        (
            (agent (unwrap! (map-get? agents { agent-id: agent-id }) err-not-found))
        )
        (asserts! (is-eq tx-sender (get creator agent)) err-unauthorized)
        
        (map-set agents
            { agent-id: agent-id }
            (merge agent {
                name: new-name,
                description: new-description,
                endpoint: new-endpoint,
                price-per-cycle: new-price
            })
        )
        (ok true)
    )
)

;; Toggle agent status
(define-public (toggle-agent-status (agent-id uint))
    (let
        (
            (agent (unwrap! (map-get? agents { agent-id: agent-id }) err-not-found))
            (current-status (get is-active agent))
        )
        (asserts! (is-eq tx-sender (get creator agent)) err-unauthorized)
        
        (map-set agents
            { agent-id: agent-id }
            (merge agent {
                is-active: (not current-status)
            })
        )
        (ok (not current-status))
    )
)
