# Test Fixtures - Sample Files

This directory contains sample bank statements and receipts for testing Previa's OCR and reconciliation features.

## File Listing

### Bank Statements (PDF)
- `commbank-statement-jan-2024.pdf` - Sample Commonwealth Bank statement (placeholder)
- `anz-statement-jan-2024.pdf` - Sample ANZ statement (placeholder)

### Receipts (Images)
- `woolworths-receipt-20240115.jpg` - Grocery receipt (placeholder)
- `shell-receipt-20240116.jpg` - Fuel receipt (placeholder)
- `aldi-receipt-20240122.jpg` - Grocery receipt (placeholder)
- `mcdonalds-receipt-20240120.jpg` - Fast food receipt (placeholder)
- `coles-receipt-20240118.pdf` - Grocery receipt PDF (placeholder)

## Usage

These files are referenced in `src/test/fixtures/financial-data.ts` and are used for:

1. **Development Testing:** Test upload and OCR extraction UI without real documents
2. **Integration Tests:** Validate document processing pipeline
3. **Demo Mode:** Show potential users how the system works

## Creating Real Test Files

To replace placeholders with actual sample files:

1. **Bank Statements:**
   - Use anonymized/redacted real statements
   - Or generate synthetic statements using tools like PDF generators
   - Ensure they contain: institution name, account info, transactions, dates

2. **Receipts:**
   - Take photos of receipts with personal info removed
   - Or use receipt generator websites
   - Ensure they contain: merchant, date, total amount, tax

## Security Notes

- **NEVER commit real financial documents** to version control
- All test files should be anonymized or synthetic
- Do not include actual account numbers, names, or addresses
- Current placeholders are safe - they're just text files

## File Formats Supported

- **PDF:** Bank statements, receipts
- **CSV:** Bank statement exports
- **Images:** JPG, PNG for receipt photos
- **Audio:** (Future) Voice memos for expense logging

## Size Limits

Per `docs/environment-variables.md`:
- Maximum file size: 50MB
- Typical bank statement: 200-500KB
- Typical receipt photo: 100-200KB

