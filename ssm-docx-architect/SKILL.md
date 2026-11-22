---
name: ssm-docx-architect
description: >-
  Author, style, and generate enterprise-grade Microsoft Word (.docx) documents with SSM InfoTech branding.
  Enforces strict corporate design standards: justified body text, Violet (#7C1B9F) accents, List Table 4 Accent 4 native tables,
  OMML mathematical equations, executive callout cards, dynamic page numbering (Page X of Y), and automatic page breaks on Heading 1.
  Activate when creating technical proposals, whitepapers, audit reports, system architectures, tender submissions, or standard operating procedures.
---

# SSM InfoTech Word Document Architect Skill

This skill governs the end-to-end design, generation, and styling of Microsoft Word (`.docx`) documents for **SSM InfoTech Solutions Pvt. Ltd.** It ensures all technical proposals, enterprise architectures, cybersecurity audit reports, and executive summaries strictly comply with corporate branding guidelines and the user's global document styling rules.

---

## 1. Quick Reference: SSM InfoTech Brand System

| Element | Specification | Values / Rule |
| :--- | :--- | :--- |
| **Primary Accent** | Violet | `#7C1B9F` / `RGB(124, 27, 159)` |
| **Deep Secondary** | Dark Purple | `#4A0E66` / `RGB(74, 14, 102)` |
| **Card Fill** | Soft Lilac | `#F7F0FA` / `RGB(247, 240, 250)` |
| **Subtle Border** | Lilac Stroke | `#E2D4EE` / `RGB(226, 212, 238)` |
| **Body Text** | Charcoal | `#212529` / `RGB(33, 37, 41)` |
| **Muted Text** | Slate | `#6C757D` / `RGB(108, 117, 125)` |
| **Success / Metric** | Teal Emerald | `#0F766E` / `RGB(15, 118, 110)` |
| **Standard Font** | Calibri / Aptos | Body: 11pt, H1: 18pt Bold, H2: 14pt Bold, H3: 12pt Bold |
| **Geometry** | A4 or Letter | 1.0" (72pt) margins on all sides; separate first-page header/footer |

---

## 2. Mandatory Document & Visual Rules (Zero Exceptions)

Whenever generating or editing Word documents, you MUST strictly uphold these requirements:

1. **Text Alignment**: Normal body text MUST ALWAYS be **Justified** (`WD_ALIGN_PARAGRAPH.JUSTIFY`), with 1.15 line spacing and 6pt space after. Never leave normal body paragraphs left-aligned.
2. **Heading 1 Page Breaks**: Every `Heading 1` MUST automatically start on a new page (`h1_style.paragraph_format.page_break_before = True`).
3. **Microsoft Word Table Style**:
   - MUST ALWAYS use native Word style **`List Table 4 Accent 4`** (`List Table 4 - Accent 4`).
   - **Never apply manual cell shading overrides (`w:shd`) on table cells**, as this breaks Word's native table styling.
   - All tables must repeat the header row across pages (`w:tblHeader`) and prevent row splits (`w:cantSplit`).
4. **Mathematical Equations**:
   - **NEVER** write formulas as raw ASCII text (e.g. `A = MTBF / (MTBF + MTTR)`).
   - Always insert native Word OMML equations (`<m:oMathPara><m:oMath>...</m:oMath></m:oMathPara>`).
5. **List Formatting (Numbered vs. Bulleted)**:
   - When list items contain numbers (e.g. `1.`, `2.`, `(A)`), format them strictly as numbered items with bold Violet numbers and hanging indents.
   - **NEVER** prepend bullet points (`•`) to numbered items (prevent `• 1.` or `• 2.`).
   - Reserve bullets (`•`) exclusively for unnumbered items; automatically strip any duplicate leading bullets.
6. **Running Headers & Footers**:
   - Cover page MUST have unlinked headers/footers (`different_first_page_header_footer = True`).
   - Running Header: Document Title (left) & `SSM InfoTech Solutions Pvt. Ltd.` (right) with a subtle lilac bottom border.
   - Running Footer: `Confidential — SSM InfoTech Solutions` (left) & dynamic `Page X of Y` field codes (right).

---

## 3. Using the Reusable Builder Engine

The skill provides an automated generator engine: `scripts/ssm_docx_builder.py`.

### Generating via Python Script
```python
from ssm_docx_builder import SSMDocumentBuilder

# 1. Initialize Document
builder = SSMDocumentBuilder(
    title="Industrial Software Architecture & OT Integration",
    subtitle="SCADA, Process Historians, and Purdue Model Compliance",
    classification="CONFIDENTIAL",
    author="Engineering Systems Team",
    organization="SSM InfoTech Solutions Pvt. Ltd.",
    date_str="November 2026",
    version_str="v1.0"
)

# 2. Add Executive Cover Page
builder.add_cover_page(tag_line="ENTERPRISE OT & DIGITALIZATION")

# 3. Add Sections (Heading 1 automatically forces page break)
builder.add_heading_1("1. Executive Summary")
builder.add_paragraph(
    "SSM InfoTech Solutions Pvt. Ltd. provides comprehensive industrial software and automation frameworks "
    "unifying plant floor devices with enterprise cloud historians.",
    bold_prefix="Overview: "
)

# 4. Add Metric Cards (2 to 4 KPI callouts)
builder.add_stat_cards([
    {"value": "99.98%", "label": "HISTORIAN UPTIME", "desc": "Continuous data ingestion"},
    {"value": "< 10ms", "label": "CONTROL LOOP LATENCY", "desc": "Deterministic network switches"},
    {"value": "100%", "label": "IEC 62443 COMPLIANCE", "desc": "Hardware data diode isolation"}
])

# 5. Add Executive Callout Card
builder.add_callout(
    title="Critical OT Guideline",
    text="Routable IP connections between L1 controllers and corporate enterprise networks are strictly forbidden."
)

# 6. Add Native Styled Table (List Table 4 Accent 4)
headers = ["Layer", "Function", "Engineered System", "Failover"]
rows = [
    ["Level 1", "PLC/DCS Loops", "Direct Modbus TCP / OPC UA", "< 5 ms"],
    ["Level 2", "Supervisory HMI", "X-Force High Availability SCADA", "< 500 ms"],
    ["Level 3", "Operations Historian", "X-Force Historian & Alarm Suite", "Active-Active Mirror"]
]
builder.add_table(headers, rows, col_widths=[1.2, 1.8, 2.2, 1.07])

# 7. Add Native OMML Equation
builder.add_heading_2("Availability Equation")
omml_str = (
    '<m:oMathPara xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">'
    '  <m:oMath>'
    '    <m:r><m:rPr><m:lit/></m:rPr><m:t>A = </m:t></m:r>'
    '    <m:f>'
    '      <m:num><m:r><m:t>MTBF</m:t></m:r></m:num>'
    '      <m:den><m:r><m:t>MTBF + MTTR</m:t></m:r></m:den>'
    '    </m:f>'
    '  </m:oMath>'
    '</m:oMathPara>'
)
builder.add_omml_equation(omml_str)

# 8. Add Strict Numbered & Bulleted Lists
builder.add_heading_1("2. Commissioning Directives")
builder.add_numbered_item("1", "Perform asset inventory and MAC address verification on all L1/L2 drops.", bold_prefix="Discovery: ")
builder.add_numbered_item("2", "Validate NTP time synchronization across all historian cluster nodes.", bold_prefix="Time Sync: ")

builder.add_heading_2("Documentation Checklist")
builder.add_bullet_item("As-built network topology diagrams.")
builder.add_bullet_item("Signed Site Acceptance Testing (SAT) certificates.")

# 9. Save
builder.save("SSM_Technical_Architecture.docx")
```

---

## 4. Standalone CLI Generation

You can generate a showcase reference document directly from terminal:
```bash
python ~/.gemini/config/skills/ssm-docx-architect/scripts/ssm_docx_builder.py "output_document.docx"
```

---

## 5. Verification Checklist

Before delivering any `.docx` file to the user:
- [ ] Is body text **justified** (`WD_ALIGN_PARAGRAPH.JUSTIFY`) throughout?
- [ ] Does every `Heading 1` start cleanly on a new page?
- [ ] Does table use **`List Table 4 Accent 4`** without manual cell background overrides?
- [ ] Are mathematical formulas inserted as native **OMML equations**?
- [ ] Are numbered lists formatted with bold Violet numbers and NO bullets (`• 1.` strictly eliminated)?
- [ ] Are running headers/footers unlinked from the cover page and displaying dynamic `Page X of Y`?

