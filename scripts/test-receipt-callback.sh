#!/bin/bash
# Test script for process-receipt-callback Edge Function
# Simulates n8n sending OCR extraction results

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Testing process-receipt-callback Edge Function"
echo "=========================================="

# Check if SUPABASE_URL is set
if [ -z "$SUPABASE_URL" ]; then
  echo -e "${RED}❌ Error: SUPABASE_URL environment variable not set${NC}"
  echo "Usage: export SUPABASE_URL=https://your-project.supabase.co"
  exit 1
fi

# Check if NOTEBOOK_GENERATION_AUTH is set
if [ -z "$NOTEBOOK_GENERATION_AUTH" ]; then
  echo -e "${RED}❌ Error: NOTEBOOK_GENERATION_AUTH environment variable not set${NC}"
  echo "Usage: export NOTEBOOK_GENERATION_AUTH=your-secret-key"
  exit 1
fi

# Mock OCR data (Australian receipt example)
RECEIPT_ID="00000000-0000-0000-0000-000000000001"

# Mock OCR extraction data (Woolworths receipt)
OCR_DATA=$(cat <<'EOF'
{
  "merchant": {
    "name": "Woolworths Metro",
    "address": "123 George St, Sydney NSW 2000",
    "phone": "02 9876 5432",
    "abn": "88 000 014 675",
    "confidence_score": 0.98
  },
  "transaction": {
    "date": "2025-10-25",
    "time": "14:32",
    "receipt_number": "RCP-2025102532",
    "confidence_score": 0.97
  },
  "line_items": [
    {
      "description": "Milk 2L Full Cream",
      "quantity": 1,
      "unit_price": 395,
      "subtotal": 395,
      "confidence_score": 0.96
    },
    {
      "description": "Bread White Sandwich",
      "quantity": 2,
      "unit_price": 280,
      "subtotal": 560,
      "confidence_score": 0.95
    },
    {
      "description": "Bananas per kg",
      "quantity": 1.2,
      "unit_price": 349,
      "subtotal": 419,
      "confidence_score": 0.93
    }
  ],
  "payment": {
    "method": "CARD",
    "subtotal": 1374,
    "tax": 125,
    "total": 1499,
    "confidence_score": 0.98
  },
  "tax": {
    "gst": 125,
    "gst_inclusive": true,
    "confidence_score": 0.97
  },
  "overall_confidence": 0.96,
  "metadata": {
    "pages": 1,
    "extracted_at": "2025-10-27T12:30:00Z"
  }
}
EOF
)

echo ""
echo "Test Data:"
echo "  Receipt ID: $RECEIPT_ID"
echo "  Merchant: Woolworths Metro"
echo "  Total Amount: \$14.99 AUD"
echo "  Overall Confidence: 0.96"
echo ""

# Make request
echo -e "${YELLOW}📤 Sending OCR callback data...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  "$SUPABASE_URL/functions/v1/process-receipt-callback" \
  -H "Authorization: $NOTEBOOK_GENERATION_AUTH" \
  -H "Content-Type: application/json" \
  -d "{
    \"receipt_id\": \"$RECEIPT_ID\",
    \"ocr_data\": $OCR_DATA
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
  echo -e "${GREEN}✅ Test PASSED: OCR data stored successfully${NC}"
  echo -e "${YELLOW}💡 Check ai_match_suggestions table for AI-generated matches${NC}"
  exit 0
elif [ "$HTTP_STATUS" -eq 401 ] || [ "$HTTP_STATUS" -eq 403 ]; then
  echo -e "${RED}❌ Test FAILED: Authentication error${NC}"
  echo -e "${YELLOW}💡 Verify NOTEBOOK_GENERATION_AUTH matches Supabase secret${NC}"
  exit 1
elif [ "$HTTP_STATUS" -eq 400 ]; then
  echo -e "${RED}❌ Test FAILED: Invalid OCR data structure${NC}"
  exit 1
elif [ "$HTTP_STATUS" -eq 500 ]; then
  echo -e "${RED}❌ Test FAILED: Server error${NC}"
  exit 1
else
  echo -e "${RED}❌ Test FAILED: Unexpected status code${NC}"
  exit 1
fi
