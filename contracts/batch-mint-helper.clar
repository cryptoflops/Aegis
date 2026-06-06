;; Batch Mint Helper Contract

(define-public (batch-mint-aegis (entries (list 100 { recipient: principal, amount: uint })))
  (ok (map mint-aegis-single entries))
)

(define-private (mint-aegis-single (entry { recipient: principal, amount: uint }))
  (contract-call? .aegis-token mint (get amount entry) (get recipient entry))
)

(define-public (batch-mint-questdao (entries (list 100 { recipient: principal, amount: uint })))
  (ok (map mint-questdao-single entries))
)

(define-private (mint-questdao-single (entry { recipient: principal, amount: uint }))
  (contract-call? .questdao-token mint (get amount entry) (get recipient entry))
)

(define-public (batch-mint-gmonstacks (entries (list 100 { recipient: principal, amount: uint })))
  (ok (map mint-gmonstacks-single entries))
)

(define-private (mint-gmonstacks-single (entry { recipient: principal, amount: uint }))
  (contract-call? .gmonstacks-token mint (get amount entry) (get recipient entry))
)

(define-public (batch-mint-builderbadge (entries (list 100 { recipient: principal, amount: uint })))
  (ok (map mint-builderbadge-single entries))
)

(define-private (mint-builderbadge-single (entry { recipient: principal, amount: uint }))
  (contract-call? .builderbadge-token mint (get amount entry) (get recipient entry))
)

(define-public (batch-mint-questplatform (entries (list 100 { recipient: principal, amount: uint })))
  (ok (map mint-questplatform-single entries))
)

(define-private (mint-questplatform-single (entry { recipient: principal, amount: uint }))
  (contract-call? .questplatform-token mint (get amount entry) (get recipient entry))
)
