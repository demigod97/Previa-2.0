#!/bin/bash
# Test script for match-receipt-transactions Edge Function
# Tests OpenAI-powered transaction matching

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Testing match-receipt-transactions Edge Function"
echo "=========================================="

# Check if SUPABASE_URL is set
if [ -z "$SUPABASE_URL" ]; then
  echo -e "${RED}❌ Error: SUPABASE_URL environment variable not set${NC}"
  echo "Usage: export SUPABASE_URL=https://your-project.supabase.co"
  exit 1
fi

# Check if JWT_TOKEN is set
if [ -z "$JWT_TOKEN" ]; then
  echo -e "${RED}❌ Error: JWT_TOKEN environment variable not set${NC}"
  echo "Usage: export JWT_TOKEN=your-jwt-token"
  exit 1
fi

# Mock data for testing
RECEIPT_ID="00000000-0000-0000-0000-000000000001"

echo ""
echo "Test Data:"
echo "  Receipt ID: $RECEIPT_ID"
echo ""

# Make request
echo -e "${YELLOW}📤 Requesting AI transaction matching...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  "$SUPABASE_URL/functions/v1/match-receipt-transactions" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"receipt_id\": \"$RECEIPT_ID\"
  }")

# Extract HTTP status
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo ""
echo "Response Status: $HTTP_STATUS"
echo "Response Body:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

# Check status
if [ "$HTTP_STATUS" -eq 200 ]; then
  # Check if matches were found
  MATCHES_FOUND=$(echo "$BODY" | jq -r '.matches_found' 2>/dev/null)

  if [ "$MATCHES_FOUND" = "0" ] || [ -z "$MATCHES_FOUND" ]; then
    echo -e "${YELLOW}⚠️  Test PASSED: No matching transactions found${NC}"
    echo -e "${YELLOW}💡 This is expected if:${NC}"
    echo "   - User has no unreconciled transactions in last 90 days"
    echo "   - Receipt merchant/amount doesn't match any transactions"
    echo "   - AI confidence threshold not met (<0.3)"
  else
    echo -e "${GREEN}✅ Test PASSED: Found $MATCHES_FOUND AI match suggestions${NC}"
    echo ""
    echo "Match Details:"
    echo "$BODY" | jq '.matches' 2>/dev/null
  fi
  exit 0
elif [ "$HTTP_STATUS" -eq 401 ]; then
  echo -e "${RED}❌ Test FAILED: Authentication error (check JWT_TOKEN)${NC}"
  exit 1
elif [ "$HTTP_STATUS" -eq 404 ]; then
  echo -e "${RED}❌ Test FAILED: Receipt not found${NC}"
  echo -e "${YELLOW}💡 Ensure receipt exists in database and belongs to authenticated user${NC}"
  exit 1
elif [ "$HTTP_STATUS" -eq 500 ]; then
  echo -e "${RED}❌ Test FAILED: Server error${NC}"
  echo -e "${YELLOW}💡 Check:${NC}"
  echo "   1. OPENAI_API_KEY secret is set in Supabase"
  echo "   2. OpenAI API quota/billing is active"
  echo "   3. Supabase function logs: supabase functions logs match-receipt-transactions"
  exit 1
else
  echo -e "${RED}❌ Test FAILED: Unexpected status code${NC}"
  exit 1
fi
