# 7) Security & RLS (Deterministic Rules)

- Authentication: Supabase Auth; no secrets in client; tokens validated in Edge.
- Authorization: RLS policies enforce tier-based and owner access per table

**RLS Policy Examples:**

```sql
-- user_tiers: Users can only read their own tier
CREATE POLICY "Users can view own tier"
  ON user_tiers FOR SELECT
  USING (auth.uid() = user_id);

-- bank_accounts: Users own their accounts
CREATE POLICY "Users own their bank accounts"
  ON bank_accounts FOR ALL
  USING (auth.uid() = user_id);

-- bank_statements: Users own their statements
CREATE POLICY "Users own their bank statements"
  ON bank_statements FOR ALL
  USING (auth.uid() = user_id);

-- transactions: Users can only access their own
CREATE POLICY "Users own their transactions"
  ON transactions FOR ALL
  USING (auth.uid() = user_id);

-- receipts: Users own their receipts
CREATE POLICY "Users own their receipts"
  ON receipts FOR ALL
  USING (auth.uid() = user_id);

-- reconciliation_matches: Users own their matches
CREATE POLICY "Users own their reconciliation matches"
  ON reconciliation_matches FOR ALL
  USING (auth.uid() = user_id);
```

**Premium Feature Gates:**
- `premium_user` tier can access advanced analytics (enforced in Edge Functions)
- Free `user` tier limited to 3 bank accounts, 50 transactions/month (enforced in Edge)
- Tier checks via Edge Function helper: `getUserTier(userId)`

**Secrets (server-side only):**
- `CHAT_WEBHOOK_URL` - General financial chat (role-agnostic for MVP)
- `DOCUMENT_PROCESSING_WEBHOOK_URL` - OCR extraction for statements/receipts
- `RECONCILIATION_WEBHOOK_URL` - Transaction-receipt matching engine
- `ADDITIONAL_SOURCES_WEBHOOK_URL` - Website/text ingestion (if needed)

**Hardening:**
- Input validation at Edge; reject missing/invalid fields; cap payload sizes
- Rate limiting at CDN/edge tier for chat and upload triggers
- Idempotent callbacks by `source_id` or `transaction_id`
- PII protection: Never log raw financial data; mask account numbers
