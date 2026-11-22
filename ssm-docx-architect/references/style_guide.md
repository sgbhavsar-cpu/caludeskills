# SSM InfoTech Corporate Document Style Guide

This style guide establishes visual and typographical standards for all Microsoft Word (`.docx`) deliverables produced by SSM InfoTech Solutions Pvt. Ltd., including system architecture proposals, whitepapers, factory acceptance protocols, and cybersecurity reports.

---

## 1. Color Palette

| Token Name | Hex Code | RGB | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Violet** | `#7C1B9F` | `(124, 27, 159)` | Title, Heading 1, Cover Accents, Callout Left Borders, KPI Numbers |
| **Dark Purple** | `#4A0E66` | `(74, 14, 102)` | Heading 2, Table Headers, Metric Sub-labels |
| **Charcoal Body** | `#212529` | `(33, 37, 41)` | Body Text, Heading 3, Data Rows |
| **Soft Lilac Fill**| `#F7F0FA` | `(247, 240, 250)`| Callout Card Backgrounds, Stat Card Fills |
| **Border Lilac** | `#E2D4EE` | `(226, 212, 238)`| Header/Footer Rules, Subtle Divider Lines |
| **Slate Gray** | `#6C757D` | `(108, 117, 125)`| Running Headers/Footers, Subtitles, Metric Descriptions |
| **Teal Accent** | `#0F766E` | `(15, 118, 110)` | Positive ROI, Success Badges, Secondary Highlights |

---

## 2. Typography & Hierarchy

Font Family: **Calibri** (Corporate Standard) / Aptos.

- **Document Title**: 28pt Bold, Violet (`#7C1B9F`), 1.1 line spacing, 8pt space after.
- **Subtitle**: 13pt Regular, Slate (`#6C757D`), 40pt space after.
- **Heading 1**: 18pt Bold, Violet (`#7C1B9F`), 14pt space before, 6pt space after. **Must always start on a new page** (`page_break_before = True`), except immediately after the cover page break.
- **Heading 2**: 14pt Bold, Dark Purple (`#4A0E66`), 10pt space before, 4pt space after.
- **Heading 3**: 12pt Bold, Charcoal (`#212529`), 8pt space before, 2pt space after.
- **Body Text**: 11pt Regular, Charcoal (`#212529`), **Strictly Justified** (`WD_ALIGN_PARAGRAPH.JUSTIFY`), 1.15 line spacing, 6pt space after.
- **Header & Footer**: 8.5pt Regular, Slate (`#6C757D`).

---

## 3. Strict Rules & Prohibitions

1. **Alignment**: All normal paragraphs must be **Justified**. Never use ragged right alignment for general body text.
2. **List Formatting**:
   - **Numbered lists**: Bold Violet numbers with hanging indents. Never prepend bullet points (`• 1.` or `• 2.`).
   - **Bulleted lists**: Unnumbered items only. Clean round bullets.
3. **Table Style**:
   - Must ALWAYS use Word native style: **`List Table 4 Accent 4`** (`List Table 4 - Accent 4`).
   - **Never apply manual cell shading (`w:shd`) on table cells**, as this destroys Word's native table styling.
   - Header row must repeat on subsequent pages (`w:tblHeader`).
   - Rows must not split across page breaks (`w:cantSplit`).
4. **Mathematical Formulas**:
   - **Never** write formulas as raw ASCII text (e.g. `A = MTBF / (MTBF + MTTR)`).
   - Always insert native Word OMML equations (`<m:oMathPara><m:oMath>...</m:oMath></m:oMathPara>`).
5. **Page Geometry**:
   - Standard margins: 1.0 inch (72pt) top, bottom, left, right.
   - Standard paper size: A4 (8.27" x 11.69") or Letter (8.5" x 11.0").
   - Cover page must have distinct unlinked header/footer (`different_first_page_header_footer = True`).

