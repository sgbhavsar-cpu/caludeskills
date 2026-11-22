# PptxGenJS API Cheatsheet & Patterns

A practical reference of PptxGenJS patterns used in SSM presentation generators.

---

## 1. Initializing Presentation
```javascript
const pptxgen = require('pptxgenjs');
const pres = new pptxgen();

// Enforce 16:9 Widescreen Layout (13.33" x 7.5")
pres.layout = 'LAYOUT_WIDE';
pres.author = 'SSM InfoTech Solutions';
pres.company = 'SSM InfoTech Solutions Pvt. Ltd.';
pres.title = 'Executive Proposal';
```

---

## 2. Adding Shapes & Cards

### Rounded Rectangle Card with Border
```javascript
slide.addShape(pres.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 3.7,
  h: 4.8,
  fill: { color: 'FFFFFF' },
  line: { color: 'E2D4EE', width: 1 },
  rectRadius: 0.1
});
```

### Top Category Badge / Pill
```javascript
slide.addShape(pres.ShapeType.roundRect, {
  x: 0.8,
  y: 0.35,
  w: 2.8,
  h: 0.28,
  fill: { color: 'F7F0FA' },
  line: { color: 'E2D4EE', width: 1 },
  rectRadius: 0.05
});
slide.addText('ARCHITECTURE & COMPLIANCE', {
  x: 0.8,
  y: 0.35,
  w: 2.8,
  h: 0.28,
  fontSize: 9,
  bold: true,
  color: '7C1B9F',
  align: 'center',
  valign: 'middle'
});
```

---

## 3. Formatted Multi-Line Text Blocks
```javascript
slide.addText([
  { text: 'Core Advantage\n', options: { fontSize: 14, bold: true, color: '4A0E66' } },
  { text: 'Deterministic execution latency below 10 milliseconds across all supervisory nodes.\n\n', options: { fontSize: 10, color: '495057' } },
  { text: '• Hardware data diodes isolate L1/L2 networks.\n', options: { fontSize: 9.5, color: '212529', bullet: true } },
  { text: '• OPC UA and MQTT Sparkplug B protocol unification.', options: { fontSize: 9.5, color: '212529', bullet: true } }
], {
  x: 1.0,
  y: 1.8,
  w: 3.3,
  h: 4.4,
  valign: 'top'
});
```

---

## 4. Native PowerPoint Tables

```javascript
const headers = [
  { text: 'Layer', options: { fill: '4A0E66', color: 'FFFFFF', bold: true, align: 'left' } },
  { text: 'Component', options: { fill: '4A0E66', color: 'FFFFFF', bold: true, align: 'left' } },
  { text: 'Latency', options: { fill: '4A0E66', color: 'FFFFFF', bold: true, align: 'center' } },
  { text: 'Redundancy', options: { fill: '4A0E66', color: 'FFFFFF', bold: true, align: 'center' } }
];

const rows = [
  [
    { text: 'Level 1' },
    { text: 'PLC & DCS Loops' },
    { text: '< 5 ms', options: { align: 'center' } },
    { text: 'Dual Hot-Standby', options: { align: 'center' } }
  ],
  [
    { text: 'Level 2' },
    { text: 'Supervisory SCADA' },
    { text: '< 500 ms', options: { align: 'center' } },
    { text: 'Active-Active Mirror', options: { align: 'center' } }
  ]
];

// Add alternating row fill colors
const formattedRows = rows.map((row, idx) => {
  const rowFill = idx % 2 === 1 ? 'F7F0FA' : 'FFFFFF';
  return row.map(cell => ({
    text: cell.text,
    options: { fill: rowFill, color: '212529', fontSize: 10, ...(cell.options || {}) }
  }));
});

slide.addTable([headers, ...formattedRows], {
  x: 0.8,
  y: 1.8,
  w: 11.73,
  colW: [2.0, 4.73, 2.5, 2.5],
  border: { type: 'solid', color: 'E2D4EE', pt: 1 },
  margin: [0.08, 0.1, 0.08, 0.1]
});
```

---

## 5. Saving to File
```javascript
pres.writeFile({ fileName: 'SSM_Executive_Presentation.pptx' })
  .then(fileName => console.log(`Presentation generated: ${fileName}`))
  .catch(err => console.error(err));
```
