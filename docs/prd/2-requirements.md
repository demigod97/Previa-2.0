# 2. Requirements

## Functional
* **FR1**: The system must allow users to upload bank statements in PDF and CSV formats.
* **FR2**: The system must allow users to upload receipts and bills via a web portal or a mobile app.
* **FR3**: The system must use OCR and AI to extract key data from uploaded documents, including transaction details, dates, and amounts.
* **FR4**: The system must automatically match transactions with receipts and bills based on extracted data points, such as date and amount.
* **FR5**: The system must provide a dashboard for users to review, edit, and approve AI-suggested matches and categories.
* **FR6**: The system must provide a set of gamified tasks and challenges to educate users on financial literacy.
* **FR7**: The system must allow users to export reconciled financial data in a standardized format.
* **FR8**: The system must provide an interactive onboarding workflow that guides users to create their first bank account by uploading a statement, with AI-assisted account name/number extraction and user confirmation.

## Non-Functional
* **NFR1**: The system must be secure and protect user data in accordance with Australian data security standards.
* **NFR2**: The AI reconciliation engine must achieve an automation rate of at least 70%.
* **NFR3**: The mobile app's OCR must be accurate enough to extract key data from a majority of receipts and bills.
* **NFR4**: The web application must be responsive and accessible across all major browsers.

## Compatibility Requirements
* **CR1**: The system must be compatible with a variety of bank statement formats (PDF and CSV) from major Australian banks.
* **CR2**: The exported data format must be compatible with common accounting software such as Xero and QuickBooks, even if a direct API integration is out of scope for the MVP.
