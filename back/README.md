### Stripe test :

# Test de config (Cle publique)
```bash
curl http://localhost:3000/api/stripe/config
```

# Test Login 
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@gmail.com","password":"password123"}' \
  | jq -r '.data.accessToken')
```

# Test Creation paiement : 
```bash
curl -X POST http://localhost:3000/api/stripe/payment-intent \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100.00, "itemId": 1, "itemType": "auction"}'
```

Les differentes Routes de Stripe : 

| Route                          | Méthode | Auth | Description         |
|--------------------------------|---------|------|---------------------|
| /api/stripe/config             | GET     | ❌    | Clé publique        |
| /api/stripe/payment-intent     | POST    | ✅    | Créer paiement      |
| /api/stripe/payment-intent/:id | GET     | ✅    | Récupérer paiement  |
| /api/stripe/customer           | POST    | ✅    | Créer client        |
| /api/stripe/subscription       | POST    | ✅    | Créer abonnement    |
| /api/stripe/refund             | POST    | ✅    | Créer remboursement |
| /api/stripe/webhook            | POST    | ❌    | Webhooks Stripe     |
