# API Contracts - Subscription Management System (Frontend expectations)

Base path used by frontend: `/api` (backend can choose actual base, set via VITE_API_BASE_URL)

## Plans

GET /api/plans
Response 200:
[
{ "id": "p_basic", "name":"Basic", "price":299, "quotaGB":100, "features":["..."] },
...
]

POST /api/plans
Body: { name, price, quotaGB, features:[] }
Response 201: created plan

PUT /api/plans/:id
Body: { name?, price?, quotaGB?, features? }
Response 200: updated plan

DELETE /api/plans/:id
Response 204

## Subscriptions

POST /api/subscriptions
Body: { userId, planId }
Response 201:
{ id, userId, planId, status:"active", startedAt }

GET /api/subscriptions?userId=<id>
Response 200: [ { id, userId, planId, status, startedAt, ... } ]

PUT /api/subscriptions/:id
Body: { newPlanId }
Response 200: updated subscription

POST /api/subscriptions/:id/cancel
Response 200: { ...status: "cancelled", cancelledAt }

POST /api/subscriptions/:id/renew
Response 200: { ...status: "active", renewedAt }

## Notes for backend team

- Allow CORS for frontend origin (http://localhost:5173).
- For now auth can be skipped (demo users); later add token header `Authorization: Bearer <token>`.
- Return JSON with the fields above. If anything differs, tell frontend to adapt.
