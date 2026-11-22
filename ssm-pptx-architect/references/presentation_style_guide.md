# SSM InfoTech Corporate Presentation Style Guide

This style guide establishes visual, typographical, and structural standards for all Microsoft PowerPoint (`.pptx`) presentations produced by SSM InfoTech Solutions.

---

## 1. Core Principles

1. **Native PowerPoint Files**: Always output standalone, editable `.pptx` files using **PptxGenJS**.
2. **Strictly Prohibited**:
   - **Marp CLI**: Prohibited due to rigid themes, lack of card layouts, and poor aesthetic control.
   - **Slidev**: Prohibited because it requires a live web server / browser environment and cannot run as an offline standalone file via double-click on `file://`.
3. **Widescreen 16:9 Canvas**: Always set `pres.layout = 'LAYOUT_WIDE'` (13.33 inches wide by 7.5 inches high).

---

## 2. Color Palette & Design Tokens

| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| **Primary Violet** | `#7C1B9F` | Top accent bar, category badges, key KPI values, primary borders |
| **Dark Purple** | `#4A0E66` | Slide titles, header accents, dark badges, table header fills |
| **Deep Background** | `#2D0B3F` | Dark executive cover slide background |
| **Soft Lilac Fill** | `#F7F0FA` | Card backgrounds, active state fills, pill badge backgrounds |
| **Card Border** | `#E2D4EE` | 1px clean card borders, divider strokes |
| **Charcoal Body** | `#212529` | Main body text, card headlines, table data text |
| **Body Gray** | `#495057` | Secondary text, card descriptions, bullet text |
| **Muted Slate** | `#6C757D` | Footer text, subtitles, italic takeaways |
| **White** | `#FFFFFF` | Standard card backgrounds, inverted text on purple |
| **Success Teal** | `#0F766E` | Positive ROI metrics, uptime numbers, approved badges |
| **Warning Amber** | `#B45309` | Risk callouts, critical notice banners |

---

## 3. Canvas Layout & Coordinate System (13.33" x 7.5")

All measurements in PptxGenJS are in inches:

```
(0, 0) ────────────────────────────────────────────────────────── (13.33, 0)
│ [ Top Accent Bar: y=0, h=0.08, fill=Violet ]                             │
│                                                                          │
│ [ Category Badge: x=0.8, y=0.35, w=2.8, h=0.28, radius=0.05 ]            │
│ [ Slide Title: x=0.8, y=0.68, w=11.5, h=0.45, font=20pt Bold ]           │
│ [ Subtitle / Takeaway: x=0.8, y=1.15, w=11.5, h=0.35, font=11pt Italic ] │
│                                                                          │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │                                                                      │ │
│ │                      MAIN CONTENT WORKSPACE                          │ │
│ │               (y = 1.6 to y = 6.8 | Height = 5.2")                   │ │
│ │                                                                      │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│ [ Footer Separator Line: x=0.8, y=7.0, w=11.73, line=1px ]               │
│ [ Footer Left: Project Title ]           [ Footer Right: Confidential ] │
(0, 7.5) ──────────────────────────────────────────────────────── (13.33, 7.5)
```

### Layout Coordinates
* **Canvas Width**: `13.33"`
* **Canvas Height**: `7.5"`
* **Left & Right Margins**: `0.8"` (Usable width = `11.73"`)
* **Top Margin (Content)**: `1.6"`
* **Bottom Margin (Content)**: `6.8"` (Footer starts at `7.0"`)

---

## 4. Component Standards

### 1. Slide Chrome (Standard Headers & Footers)
* Every content slide must have:
  - Top accent bar: `h: 0.08`, full width, Violet (`#7C1B9F`).
  - Category Badge: uppercase, 9pt bold Violet, soft lilac background (`#F7F0FA`), border `#E2D4EE`.
  - Slide Title: 20-22pt bold Calibri, Dark Purple (`#4A0E66`).
  - Subtitle: 11pt italic Calibri, Slate (`#6C757D`).
  - Bottom Footer: 1px divider rule at `y: 7.0`, left project context label, right confidentiality label and slide numbering.

### 2. Executive Metric Stat Cards
* Standard card dimensions for 3-up: `w: 3.7"`, `h: 1.8"`, spacing `0.3"`.
* Large metric value: 26-28pt bold Calibri, Violet or Success Teal (`#0F766E`).
* Uppercase Label: 10-11pt bold Calibri, Charcoal (`#212529`).
* Description: 9pt regular Calibri, Body Gray (`#495057`).
* Card Shape: `rectRadius: 0.1`, border `1px` (`#E2D4EE`).

### 3. Comparison & Data Tables
* Header Row: Fill Dark Purple (`#4A0E66`) or Violet (`#7C1B9F`), bold white text, height `0.4"`.
* Alternating Rows: White and Soft Lilac (`#F7F0FA`).
* Text Alignment: Left for descriptions, Center for status/values.
* Padding: Top/Bottom `0.08"`, Left/Right `0.1"`.

### 4. Mathematical & Engineering Formula Callouts
* Formulas must be placed in a dedicated callout card with monospace or clean sans-serif typography, soft lilac background, and bold accent border.
* Include parameter definitions and engineering context below the equation.
