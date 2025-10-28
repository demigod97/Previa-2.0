#!/bin/bash
# Test script for process-receipt Edge Function
# Tests triggering the OCR extraction workflow

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Testing process-receipt Edge Function"
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
USER_ID="00000000-0000-0000-0000-000000000002"
FILE_PATH="test/sample-receipt.pdf"
BUCKET="receipts"

echo ""
echo "Test Data:"
echo "  Receipt ID: $RECEIPT_ID"
echo "  User ID: $USER_ID"
echo "  File Path: $FILE_PATH"
echo "  Bucket: $BUCKET"
echo ""

# Make request
echo -e "${YELLOW}📤 Sending request to process-receipt...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  "$SUPABASE_URL/functions/v1/process-receipt" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"receipt_id\": \"$RECEIPT_ID\",
    \"user_id\": \"$USER_ID\",
    \"file_path\": \"$FILE_PATH\",
    \"bucket\": \"$BUCKET\"
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
  echo -e "${GREEN}✅ Test PASSED: Receipt processing started successfully${NC}"
  exit 0
elif [ "$HTTP_STATUS" -eq 401 ]; then
  echo -e "${RED}❌ Test FAILED: Authentication error (check JWT_TOKEN)${NC}"
  exit 1
elif [ "$HTTP_STATUS" -eq 500 ]; then
  echo -e "${RED}❌ Test FAILED: Server error (check logs and secrets)${NC}"
  echo -e "${YELLOW}💡 Tip: Verify OCR_EXTRACT secret is set in Supabase${NC}"
  exit 1
else
  echo -e "${RED}❌ Test FAILED: Unexpected status code${NC}"
  exit 1
fi
