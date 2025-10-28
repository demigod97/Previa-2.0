# PDF Generation Guide for README.md

**Document:** README.md → PDF for FIT3195 Assessment 3 Submission
**Date:** October 28, 2025
**Purpose:** Convert comprehensive README.md to professional PDF format

---

## Method 1: Pandoc (Recommended - Best Quality)

### Prerequisites
- Install Pandoc: https://pandoc.org/installing.html
- Install LaTeX (for PDF engine): https://www.latex-project.org/get/

### Windows Installation
```bash
# Install Pandoc via Chocolatey
choco install pandoc

# Install MiKTeX (LaTeX distribution)
choco install miktex
```

### Generate PDF
```bash
cd D:\ailocal\FinAI\Previa

# Basic PDF generation
pandoc README.md -o Previa_FIT3195_Submission.pdf

# Enhanced PDF with table of contents and syntax highlighting
pandoc README.md -o Previa_FIT3195_Submission.pdf \
  --pdf-engine=xelatex \
  --toc \
  --toc-depth=2 \
  --highlight-style=tango \
  -V geometry:margin=1in \
  -V fontsize=11pt \
  -V documentclass=article \
  -V papersize=a4
```

### Output
- **File:** `Previa_FIT3195_Submission.pdf`
- **Size:** ~50-60 pages (estimated)
- **Quality:** Professional, LaTeX-rendered

---

## Method 2: Markdown PDF (VS Code Extension)

### Prerequisites
- Visual Studio Code
- Markdown PDF extension by yzane

### Installation
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Markdown PDF"
4. Install "Markdown PDF" by yzane

### Generate PDF
1. Open `README.md` in VS Code
2. Right-click in the editor
3. Select "Markdown PDF: Export (pdf)"
4. PDF will be saved in the same directory

### Configuration (Optional)
Create `.vscode/settings.json`:
```json
{
  "markdown-pdf.executablePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "markdown-pdf.format": "A4",
  "markdown-pdf.displayHeaderFooter": true,
  "markdown-pdf.headerTemplate": "<div style=\"font-size: 9px; margin-left: 1cm;\">Previa - FIT3195 Assessment 3</div>",
  "markdown-pdf.footerTemplate": "<div style=\"font-size: 9px; margin: auto;\"><span class=\"pageNumber\"></span> / <span class=\"totalPages\"></span></div>",
  "markdown-pdf.margin.top": "1.5cm",
  "markdown-pdf.margin.bottom": "1.5cm",
  "markdown-pdf.margin.left": "1cm",
  "markdown-pdf.margin.right": "1cm"
}
```

### Output
- **File:** `README.pdf` (in same directory)
- **Size:** ~50-60 pages
- **Quality:** Good, Chrome-rendered

---

## Method 3: Online Converter (Quick & Easy)

### Recommended Services
1. **Dillinger** (https://dillinger.io)
   - Upload README.md
   - Click "Export as" → "PDF"
   - Free, no signup required

2. **Markdown to PDF** (https://www.markdowntopdf.com)
   - Upload README.md
   - Click "Convert"
   - Download PDF

3. **CloudConvert** (https://cloudconvert.com/md-to-pdf)
   - Upload README.md
   - Convert to PDF
   - Free for small files

### Limitations
- May not render Mermaid diagrams correctly
- Limited control over formatting
- File size limits on free tiers

---

## Method 4: GitHub Actions (Automated)

### Create Workflow File
`.github/workflows/generate-pdf.yml`:
```yaml
name: Generate PDF Documentation

on:
  push:
    paths:
      - 'README.md'
  workflow_dispatch:

jobs:
  generate-pdf:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Generate PDF
        uses: baileyjm02/markdown-to-pdf@v1
        with:
          input_path: README.md
          output_dir: docs/pdf
          images_dir: docs
          build_html: false

      - name: Upload PDF
        uses: actions/upload-artifact@v3
        with:
          name: Previa-README-PDF
          path: docs/pdf/README.pdf
```

### Usage
1. Push to GitHub
2. PDF generated automatically
3. Download from Actions artifacts

---

## Method 5: Chrome Print to PDF (Manual)

### Steps
1. Open README.md in VS Code
2. Install "Markdown Preview Enhanced" extension
3. Right-click preview → "Chrome (Puppeteer)" → "PDF"
4. Or use Chrome browser:
   - View README on GitHub
   - Print (Ctrl+P)
   - Select "Save as PDF"
   - Adjust margins and layout

### Settings
- Paper size: A4
- Margins: Normal (1 inch)
- Headers/Footers: On
- Background graphics: On

---

## Mermaid Diagram Rendering

### Issue
Mermaid diagrams may not render in some PDF converters.

### Solutions

#### Solution 1: Pre-render Mermaid to Images
```bash
# Install mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Generate images from README
mmdc -i README.md -o README_with_images.md -e png

# Then convert to PDF
pandoc README_with_images.md -o Previa_FIT3195_Submission.pdf
```

#### Solution 2: Use Mermaid Live Editor
1. Visit https://mermaid.live
2. Paste each Mermaid diagram
3. Export as PNG/SVG
4. Replace code blocks with images in a copy of README
5. Convert to PDF

#### Solution 3: Use GitHub Rendered Version
1. Push README to GitHub
2. GitHub renders Mermaid automatically
3. Use browser Print to PDF from GitHub page

---

## Recommended Workflow (Best Quality)

### Step 1: Prepare README for PDF
```bash
# Navigate to project directory
cd D:\ailocal\FinAI\Previa

# Ensure README is up to date
git status
```

### Step 2: Generate PDF with Pandoc
```bash
pandoc README.md -o "Previa_FIT3195_Assessment3_Submission.pdf" \
  --pdf-engine=xelatex \
  --toc \
  --toc-depth=2 \
  --number-sections \
  --highlight-style=tango \
  -V geometry:margin=1in \
  -V fontsize=11pt \
  -V documentclass=article \
  -V papersize=a4 \
  -V title="Previa - FIT3195 Assessment 3 Master Submission Index" \
  -V author="Team Ivory" \
  -V date="October 28, 2025"
```

### Step 3: Verify PDF
- Open generated PDF
- Check table of contents (should be clickable)
- Verify all sections rendered
- Check Mermaid diagrams (may need manual fix)
- Review page breaks and formatting

### Step 4: Fix Mermaid Diagrams (if needed)
If Mermaid diagrams didn't render:
1. Take screenshots from GitHub rendered version
2. Save as PNG files in `docs/images/`
3. Create `README_print.md` with image references
4. Re-generate PDF from `README_print.md`

---

## Alternative: Generate Multiple PDFs

### Option A: Single Comprehensive PDF
```bash
pandoc README.md -o Previa_Complete_Submission.pdf
```

### Option B: Separate PDFs by Section
```bash
# Extract sections into separate files
# Then generate individual PDFs

# Executive Summary
pandoc README.md -o Previa_Executive_Summary.pdf --from=markdown --to=pdf

# Implementation Status
# (manually extract section)

# Technical Stack
# (manually extract section)
```

---

## Quality Checklist

Before finalizing PDF, verify:

- [ ] **Formatting**
  - [ ] Table of contents generated and clickable
  - [ ] Headers and footers present
  - [ ] Page numbers visible
  - [ ] Margins consistent (1 inch recommended)

- [ ] **Content**
  - [ ] All 13 sections present
  - [ ] External links preserved (GitHub, Jira, etc.)
  - [ ] Internal links work (or converted to page references)
  - [ ] Code blocks syntax highlighted
  - [ ] Tables formatted correctly

- [ ] **Diagrams**
  - [ ] All 6 Mermaid diagrams rendered (or replaced with images)
  - [ ] System architecture diagram visible
  - [ ] Flowcharts clear and readable

- [ ] **Metadata**
  - [ ] Title page shows "Previa - FIT3195 Assessment 3"
  - [ ] Author: Team Ivory
  - [ ] Date: October 28, 2025
  - [ ] Version: 0.1.0-MVP

- [ ] **File Properties**
  - [ ] File size reasonable (<20MB)
  - [ ] PDF version 1.4+ (for compatibility)
  - [ ] Searchable text (not scanned images)

---

## Troubleshooting

### Issue 1: "pandoc: command not found"
**Solution:** Install Pandoc and add to PATH
```bash
# Windows
choco install pandoc
# Or download from https://pandoc.org/installing.html
```

### Issue 2: LaTeX errors
**Solution:** Install MiKTeX or TeX Live
```bash
choco install miktex
```

### Issue 3: Mermaid diagrams not rendering
**Solution:** Use Method 5 (Chrome Print) or pre-render to images

### Issue 4: Tables overflow page width
**Solution:** Add landscape mode for wide tables
```bash
pandoc README.md -o output.pdf -V geometry:landscape
```

### Issue 5: File size too large
**Solution:** Compress images or reduce diagram resolution
```bash
# Compress PDF
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output-compressed.pdf input.pdf
```

---

## Final Output Files

After successful generation, you should have:

```
Previa/
├── README.md                                    # Original Markdown (12,000 words)
├── Previa_FIT3195_Assessment3_Submission.pdf   # PDF version for submission
│
└── docs/
    └── pdf/                                     # Optional separate PDFs
        ├── Previa_Executive_Summary.pdf
        ├── Previa_Implementation_Status.pdf
        └── Previa_Technical_Stack.pdf
```

---

## Submission Checklist

Before submitting PDF to FIT3195:

- [ ] PDF opens without errors
- [ ] All 13 sections visible
- [ ] GitHub and Jira links present (clickable)
- [ ] Mermaid diagrams rendered or replaced with images
- [ ] File size <20MB (for upload)
- [ ] Filename: `Previa_FIT3195_Assessment3_Submission.pdf`
- [ ] Metadata correct (title, author, date)
- [ ] Professional appearance (consistent formatting)

---

## Quick Start Command (Copy & Paste)

```bash
# Navigate to project directory
cd "D:\ailocal\FinAI\Previa"

# Generate PDF with Pandoc (RECOMMENDED)
pandoc README.md -o "Previa_FIT3195_Assessment3_Submission.pdf" --pdf-engine=xelatex --toc --toc-depth=2 --highlight-style=tango -V geometry:margin=1in -V fontsize=11pt -V documentclass=article -V papersize=a4 -V title="Previa - FIT3195 Assessment 3 Master Submission Index" -V author="Team Ivory" -V date="October 28, 2025"

# Alternative: VS Code Markdown PDF Extension
# Right-click README.md → "Markdown PDF: Export (pdf)"

# Alternative: Chrome Print to PDF
# Open README.md in browser → Ctrl+P → Save as PDF
```

---

## Support

If you encounter issues generating the PDF:

1. **Check this guide** - Solutions for common problems above
2. **Try alternative methods** - If one doesn't work, try another
3. **Manual screenshots** - For Mermaid diagrams if needed
4. **GitHub Issues** - Report problems at github.com/demigod97/Previa-2.0/issues

---

**Document Version:** 1.0
**Last Updated:** October 28, 2025
**Maintained By:** Previa Development Team
