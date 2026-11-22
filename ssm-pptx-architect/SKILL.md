---
name: ssm-pptx-architect
description: >-
  Author, style, and generate enterprise-grade Microsoft PowerPoint (.pptx) presentations with PptxGenJS.
  Enforces strict corporate design standards: 16:9 widescreen layout, Violet (#7C1B9F) executive theme,
  card-based layouts, KPI metric stat cards, native styled comparison tables, mathematical formula callouts,
  dark executive cover slides, and structured presentation decks.
---

# SSM InfoTech PowerPoint Presentation Architect Skill

This skill governs the end-to-end design, generation, and styling of Microsoft PowerPoint (`.pptx`) presentations for **SSM InfoTech Solutions Pvt. Ltd.** It ensures all executive briefing decks, technical feasibility presentations, system architectures, and board reviews strictly comply with corporate branding guidelines and the user's global presentation rules.

---

## 1. Core Principles & Technology Standards

1. **Presentation Engine**: Always use **`PptxGenJS`** (`npm i pptxgenjs`).
   - Produces 100% native, fully editable `.pptx` slides compatible with Microsoft PowerPoint, Google Slides, and Apple Keynote.
2. **Prohibited Alternatives**:
   - **Marp CLI**: Strictly prohibited due to rigid theme constraints, lack of card layouts, and basic aesthetics.
   - **Slidev**: Strictly prohibited because it requires a local Node.js development server and browser environment; it cannot run offline via standalone `file://` double-click.
3. **Canvas Dimensions**:
   - Always set `pres.layout = 'LAYOUT_WIDE'` (16:9 widescreen: 13.33 inches wide by 7.5 inches high).

---

## 2. Brand Tokens & Color Palette

| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Primary Violet** | `#7C1B9F` | Top accent strip, category badges, key KPI values, primary borders |
| **Dark Purple** | `#4A0E66` | Slide titles, header accents, dark badges, table header fills |
| **Deep Background**| `#2D0B3F` | Dark executive cover slide background |
| **Soft Lilac Fill** | `#F7F0FA` | Card backgrounds, active state fills, pill badge backgrounds |
| **Card Border** | `#E2D4EE` | 1px clean card borders, divider strokes |
| **Charcoal Body** | `#212529` | Main body text, card headlines, table data text |
| **Body Gray** | `#495057` | Secondary text, card descriptions, bullet text |
| **Muted Slate** | `#6C757D` | Footer text, subtitles, italic takeaways |
| **White** | `#FFFFFF` | Standard card backgrounds, inverted text on purple |
| **Success Teal** | `#0F766E` | Positive ROI metrics, uptime numbers, approved badges |
| **Warning Amber** | `#B45309` | Risk callouts, critical notice banners |

---

## 3. Component Archetypes

### 1. Slide Chrome (Header & Footer)
Every content slide must adhere to the standard chrome:
* **Top Accent Bar**: Height `0.08"`, full width, filled with Violet (`#7C1B9F`).
* **Category Badge**: Pill rounded rectangle (`rectRadius: 0.05`), soft lilac fill (`#F7F0FA`), 9pt bold Violet text.
* **Slide Title**: 20-22pt bold Calibri, Dark Purple (`#4A0E66`).
* **Subtitle**: 11pt italic Calibri, Slate (`#6C757D`).
* **Bottom Footer**: 1px horizontal rule at `y: 7.0"`, project context on the left, confidentiality and slide numbering on the right.

### 2. Dark Executive Cover Slide
* Background: `#2D0B3F` full bleed.
* Glowing top strip: `#7C1B9F`.
* Large title: 32pt bold white Calibri.
* Metadata card box: 6-item key parameter grid (Target Asset, Architecture, Projected Gain, Latency, Security, Payback).

### 3. Metric & KPI Stat Cards
* Arranged 2-up, 3-up, or 4-up horizontally.
* Large stat value: 26-28pt bold, Violet (`#7C1B9F`) or Success Teal (`#0F766E`).
* Uppercase Label: 10pt bold Charcoal (`#212529`).
* Description: 9pt Body Gray (`#495057`).
* Card Border: 1px `#E2D4EE`, `rectRadius: 0.1`.

### 4. Native Styled Tables
* Table Headers: Filled with Dark Purple (`#4A0E66`), bold white text, height `0.4"`.
* Alternating Rows: White and Soft Lilac (`#F7F0FA`) with charcoal text.
* Cell Padding: `[0.08, 0.1, 0.08, 0.1]` inches.

### 5. Engineering & Mathematical Formula Boxes
* Monospace font (`Consolas`), centered formula text.
* Soft lilac background with Violet border.
* Parameter definitions listed cleanly underneath.

---

## 4. Reusable Builder Engine (`SSMPptxBuilder`)

The skill provides an automated generator engine: `scripts/pptx_deck_builder.js`.

### Usage in Node.js:

```javascript
const { SSMPptxBuilder } = require('./scripts/pptx_deck_builder');

async function generate() {
  const builder = new SSMPptxBuilder({
    title: 'Enterprise Architecture Briefing',
    subtitle: 'SCADA, Process Historians, and Cyber DMZ',
    confidentiality: 'CONFIDENTIAL — SSM INFOTECH'
  });

  // 1. Add Title Slide
  builder.addTitleSlide({
    tag: 'Executive Architecture Proposal',
    title: 'Industrial SCADA &\nReal-Time Telemetry Platform',
    subtitle: 'Mission-Critical Architecture for Level 1-3 Facilities',
    metadata: [
      { label: 'Platform Scope', val: 'L1 Controllers to L3 Enterprise Historians' },
      { label: 'Availability', val: '99.99% Dual Redundant Hot-Standby' }
    ]
  });

  // 2. Add Content Slide with Metric Cards
  const slide = builder.addSlide(
    'Architecture Metrics',
    'Real-time Determinism & Reliability',
    'Supervisory feedback loop timing verified across all network switches.'
  );

  builder.addMetricCards(slide, [
    { value: '99.99%', label: 'Historian Uptime', desc: 'Active-Active Mirror', highlight: true },
    { value: '< 10 ms', label: 'Network Latency', desc: 'OPC UA Over TSN', success: true }
  ]);

  // 3. Add Content Cards
  builder.addCard(slide, 0.8, 3.4, 5.7, 3.3, {
    badge: 'Network Segregation',
    title: 'Purdue Model Compliance',
    bullets: [
      'Isolated OT DMZ preventing direct L1/L4 connections.',
      'Unidirectional hardware data diodes for critical historian feeds.'
    ]
  });

  // 4. Save
  await builder.save('SSM_Architecture_Briefing.pptx');
}

generate();
```

---

## 5. Standalone CLI Generation

You can generate a showcase reference deck directly from terminal:
```bash
node scripts/pptx_deck_builder.js "output_presentation.pptx"
```

---

## 6. Verification Checklist

Before delivering any `.pptx` file to the user:
- [ ] Is layout set to **16:9 widescreen** (`pres.layout = 'LAYOUT_WIDE'`, 13.33" x 7.5")?
- [ ] Is the primary accent **Violet** (`#7C1B9F`) with **Dark Purple** (`#4A0E66`) titles?
- [ ] Do cards use **rounded corners** (`rectRadius: 0.1`) with subtle `#E2D4EE` borders?
- [ ] Are KPI metrics displayed with large **24-28pt bold numbers** and uppercase labels?
- [ ] Do tables have **dark purple header fills**, bold white text, and alternating lilac rows?
- [ ] Does every slide feature consistent **top accent bar**, **category pill**, and **footer bar**?
