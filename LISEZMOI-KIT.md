# Correctif du kit front : cycle de vie du compte + session perdue sur 403

À copier par-dessus le dépôt `modulekit-web-kit` (les chemins sont ceux du dépôt), puis :
`npm test` (23 tests) et `node tools/check-imports.mjs`.

## Ce qui change
- **auth** : nouvelles fonctions `forgotPassword`, `resetPassword`, `changePassword`, `verifyEmail`,
  `resendVerification`, `logoutAll` (+ `logoutAll` dans `useAuth()`), endpoints dans `authEndpoints`
  (surchargeables par `configureAuthEndpoints`), `defaultMapUser` expose `emailVerified`.
  Les endpoints sont isolés dans `endpoints.js` (sans dépendance, testable) ; l'API publique existante ne change pas.
- **http** : `configureApi({ unauthorizedErrorCodes: [...] })`. Un 403 dont le champ `code` figure dans la liste
  est traité comme une session perdue (`onUnauthorized`), comme une 401. Liste vide par défaut : comportement inchangé.
- **docs/CONTRAT-BACKEND.md** : documente ces endpoints et ce comportement.

## Rétrocompatibilité
Rien n'est retiré ni renommé. Une application qui n'utilise pas ces fonctions n'est pas affectée.
