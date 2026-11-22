/**
 * SSM InfoTech PowerPoint Presentation Deck Builder
 * Standard: PptxGenJS | 16:9 Widescreen (13.33" x 7.5") | Executive Violet Palette (#7C1B9F)
 */

const pptxgen = require('pptxgenjs');
const path = require('path');

class SSMPptxBuilder {
  constructor(options = {}) {
    this.pres = new pptxgen();
    this.pres.layout = 'LAYOUT_WIDE'; // 13.33" x 7.5"
    this.pres.author = options.author || 'SSM InfoTech Engineering Systems';
    this.pres.company = options.company || 'SSM InfoTech Solutions Pvt. Ltd.';
    this.pres.title = options.title || 'Executive Presentation';
    this.confidentiality = options.confidentiality || 'CONFIDENTIAL — SSM INFOTECH';
    this.projectContext = options.projectContext || 'Enterprise Automation & Digitalization';

    // Color Palette Constants
    this.C = {
      violet: '7C1B9F',
      darkPurple: '4A0E66',
      deepBg: '2D0B3F',
      lilac: 'F7F0FA',
      cardBorder: 'E2D4EE',
      charcoal: '212529',
      bodyGray: '495057',
      muted: '6C757D',
      white: 'FFFFFF',
      accentGreen: '0F766E',
      accentGold: 'B45309',
      lightGreen: 'E6F4EA',
      lightAmber: 'FEF3C7',
    };
  }

  /**
   * Add Standard Header, Badge, Title, and Footer Chrome to a Slide
   */
  addSlideChrome(slide, category, title, subtitle) {
    // 1. Top Violet Accent Bar
    slide.addShape(this.pres.ShapeType.rect, {
      x: 0, y: 0, w: '100%', h: 0.08,
      fill: { color: this.C.violet }, line: { type: 'none' }
    });

    // 2. Category Badge / Pill
    slide.addShape(this.pres.ShapeType.roundRect, {
      x: 0.8, y: 0.35, w: 2.8, h: 0.28,
      fill: { color: this.C.lilac }, line: { color: this.C.cardBorder, width: 1 },
      rectRadius: 0.05
    });
    slide.addText(category.toUpperCase(), {
      x: 0.8, y: 0.35, w: 2.8, h: 0.28,
      fontSize: 9, bold: true, color: this.C.violet,
      align: 'center', valign: 'middle', fontFace: 'Calibri'
    });

    // 3. Slide Title
    slide.addText(title, {
      x: 0.8, y: 0.68, w: 11.5, h: 0.45,
      fontSize: 20, bold: true, color: this.C.darkPurple,
      fontFace: 'Calibri'
    });

    // 4. Subtitle / Executive Takeaway
    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.8, y: 1.15, w: 11.5, h: 0.35,
        fontSize: 11, color: this.C.muted, italic: true,
        fontFace: 'Calibri'
      });
    }

    // 5. Footer Line & Labels
    slide.addShape(this.pres.ShapeType.line, {
      x: 0.8, y: 7.0, w: 11.73, h: 0,
      line: { color: 'E9ECEF', width: 1 }
    });
    slide.addText(this.projectContext, {
      x: 0.8, y: 7.05, w: 8.5, h: 0.3,
      fontSize: 9, color: this.C.muted, fontFace: 'Calibri'
    });
    slide.addText(this.confidentiality, {
      x: 9.3, y: 7.05, w: 3.23, h: 0.3,
      fontSize: 9, bold: true, color: this.C.violet, align: 'right', fontFace: 'Calibri'
    });
  }

  /**
   * Add a New Content Slide with Chrome
   */
  addSlide(category, title, subtitle) {
    const slide = this.pres.addSlide();
    this.addSlideChrome(slide, category, title, subtitle);
    return slide;
  }

  /**
   * Add Dark Executive Cover / Title Slide
   */
  addTitleSlide(options = {}) {
    const slide = this.pres.addSlide();
    const tag = options.tag || 'ENTERPRISE ARCHITECTURE PROPOSAL';
    const title = options.title || this.pres.title;
    const subtitle = options.subtitle || 'High-Performance Automation & Control Systems';
    const metadata = options.metadata || [];

    // Dark Background
    slide.addShape(this.pres.ShapeType.rect, {
      x: 0, y: 0, w: '100%', h: '100%',
      fill: { color: this.C.deepBg }
    });

    // Top Glowing Violet Strip
    slide.addShape(this.pres.ShapeType.rect, {
      x: 0, y: 0, w: '100%', h: 0.15,
      fill: { color: this.C.violet }
    });

    // Tag Pill
    slide.addShape(this.pres.ShapeType.roundRect, {
      x: 1.0, y: 1.2, w: 4.8, h: 0.35,
      fill: { color: this.C.darkPurple }, line: { color: this.C.violet, width: 1.5 },
      rectRadius: 0.08
    });
    slide.addText(tag.toUpperCase(), {
      x: 1.0, y: 1.2, w: 4.8, h: 0.35,
      fontSize: 10, bold: true, color: 'E2D4EE', align: 'center', valign: 'middle', fontFace: 'Calibri'
    });

    // Main Title
    slide.addText(title, {
      x: 1.0, y: 1.8, w: 11.3, h: 1.5,
      fontSize: 32, bold: true, color: this.C.white, fontFace: 'Calibri'
    });

    // Subtitle
    slide.addText(subtitle, {
      x: 1.0, y: 3.4, w: 11.3, h: 0.7,
      fontSize: 14, color: 'D1C4E9', fontFace: 'Calibri'
    });

    // Metadata Card Box
    if (metadata.length > 0) {
      slide.addShape(this.pres.ShapeType.roundRect, {
        x: 1.0, y: 4.4, w: 11.3, h: 1.9,
        fill: { color: '3B1252' }, line: { color: '5A1E7A', width: 1 },
        rectRadius: 0.1
      });

      metadata.forEach((item, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const cx = 1.3 + col * 3.7;
        const cy = 4.6 + row * 0.8;

        slide.addText(item.label.toUpperCase(), {
          x: cx, y: cy, w: 3.4, h: 0.22,
          fontSize: 9, bold: true, color: 'B39DDB', fontFace: 'Calibri'
        });
        slide.addText(item.val, {
          x: cx, y: cy + 0.24, w: 3.4, h: 0.35,
          fontSize: 12, bold: true, color: this.C.white, fontFace: 'Calibri'
        });
      });
    }

    return slide;
  }

  /**
   * Add Metric KPI Stat Cards (2 to 4 cards in a row)
   */
  addMetricCards(slide, cards = [], y = 1.6, h = 1.5) {
    const totalW = 11.73;
    const count = cards.length;
    const spacing = 0.25;
    const cardW = (totalW - (count - 1) * spacing) / count;

    cards.forEach((card, idx) => {
      const cx = 0.8 + idx * (cardW + spacing);
      const isHighlight = card.highlight === true;

      slide.addShape(this.pres.ShapeType.roundRect, {
        x: cx, y: y, w: cardW, h: h,
        fill: { color: isHighlight ? this.C.lilac : this.C.white },
        line: { color: isHighlight ? this.C.violet : this.C.cardBorder, width: isHighlight ? 1.5 : 1 },
        rectRadius: 0.1
      });

      slide.addText(card.value, {
        x: cx + 0.15, y: y + 0.12, w: cardW - 0.3, h: 0.55,
        fontSize: 26, bold: true, color: isHighlight ? this.C.violet : (card.success ? this.C.accentGreen : this.C.darkPurple),
        align: 'center', fontFace: 'Calibri'
      });

      slide.addText(card.label.toUpperCase(), {
        x: cx + 0.15, y: y + 0.68, w: cardW - 0.3, h: 0.28,
        fontSize: 10, bold: true, color: this.C.charcoal,
        align: 'center', fontFace: 'Calibri'
      });

      if (card.desc) {
        slide.addText(card.desc, {
          x: cx + 0.15, y: y + 0.98, w: cardW - 0.3, h: 0.42,
          fontSize: 9, color: this.C.bodyGray,
          align: 'center', fontFace: 'Calibri'
        });
      }
    });
  }

  /**
   * Add Modular Content Card
   */
  addCard(slide, x, y, w, h, options = {}) {
    const isHighlight = options.highlight === true;
    slide.addShape(this.pres.ShapeType.roundRect, {
      x, y, w, h,
      fill: { color: isHighlight ? this.C.lilac : this.C.white },
      line: { color: isHighlight ? this.C.violet : this.C.cardBorder, width: isHighlight ? 1.5 : 1 },
      rectRadius: 0.1
    });

    let currentY = y + 0.2;

    if (options.badge) {
      slide.addText(options.badge.toUpperCase(), {
        x: x + 0.2, y: currentY, w: w - 0.4, h: 0.25,
        fontSize: 9, bold: true, color: this.C.violet, fontFace: 'Calibri'
      });
      currentY += 0.28;
    }

    if (options.title) {
      slide.addText(options.title, {
        x: x + 0.2, y: currentY, w: w - 0.4, h: 0.38,
        fontSize: 14, bold: true, color: this.C.darkPurple, fontFace: 'Calibri'
      });
      currentY += 0.42;
    }

    if (options.text) {
      slide.addText(options.text, {
        x: x + 0.2, y: currentY, w: w - 0.4, h: 0.45,
        fontSize: 10, color: this.C.bodyGray, fontFace: 'Calibri'
      });
      currentY += 0.48;
    }

    if (options.bullets && options.bullets.length > 0) {
      const textItems = options.bullets.map(b => ({
        text: typeof b === 'string' ? b : b.text,
        options: {
          fontSize: 9.5,
          color: this.C.charcoal,
          bullet: true,
          bold: typeof b === 'object' && b.bold ? true : false
        }
      }));

      slide.addText(textItems, {
        x: x + 0.2, y: currentY, w: w - 0.4, h: h - (currentY - y) - 0.2,
        valign: 'top', fontFace: 'Calibri'
      });
    }
  }

  /**
   * Add Comparison / Data Table
   */
  addTable(slide, x, y, w, h, headers, rows, colWidths = []) {
    const formattedHeaders = headers.map(h => ({
      text: typeof h === 'string' ? h : h.text,
      options: {
        fill: this.C.darkPurple,
        color: this.C.white,
        bold: true,
        fontSize: 10.5,
        align: typeof h === 'object' && h.align ? h.align : 'left',
        valign: 'middle'
      }
    }));

    const formattedRows = rows.map((row, rowIdx) => {
      const rowFill = rowIdx % 2 === 1 ? this.C.lilac : this.C.white;
      return row.map((cell, colIdx) => ({
        text: typeof cell === 'string' ? cell : cell.text,
        options: {
          fill: rowFill,
          color: this.C.charcoal,
          fontSize: 9.5,
          align: typeof cell === 'object' && cell.align ? cell.align : 'left',
          valign: 'middle',
          bold: typeof cell === 'object' && cell.bold ? true : false
        }
      }));
    });

    slide.addTable([formattedHeaders, ...formattedRows], {
      x, y, w,
      colW: colWidths.length > 0 ? colWidths : undefined,
      border: { type: 'solid', color: this.C.cardBorder, pt: 1 },
      margin: [0.08, 0.1, 0.08, 0.1]
    });
  }

  /**
   * Add Mathematical Formula Callout Box
   */
  addFormulaBox(slide, x, y, w, h, formula, caption, variables = []) {
    slide.addShape(this.pres.ShapeType.roundRect, {
      x, y, w, h,
      fill: { color: this.C.lilac },
      line: { color: this.C.violet, width: 1.5 },
      rectRadius: 0.1
    });

    // Formula Text (Monospace highlight)
    slide.addText(formula, {
      x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.5,
      fontSize: 16, bold: true, color: this.C.darkPurple,
      fontFace: 'Consolas', align: 'center', valign: 'middle'
    });

    // Caption
    if (caption) {
      slide.addText(caption, {
        x: x + 0.2, y: y + 0.72, w: w - 0.4, h: 0.3,
        fontSize: 10, italic: true, color: this.C.muted,
        align: 'center', fontFace: 'Calibri'
      });
    }

    // Variables Explanation
    if (variables.length > 0) {
      const varItems = variables.map(v => ({
        text: `${v.symbol}: ${v.meaning}\n`,
        options: { fontSize: 9, color: this.C.bodyGray, bullet: true }
      }));
      slide.addText(varItems, {
        x: x + 0.3, y: y + 1.05, w: w - 0.6, h: h - 1.2,
        valign: 'top', fontFace: 'Calibri'
      });
    }
  }

  /**
   * Save Presentation to File
   */
  async save(filePath) {
    const fullPath = path.resolve(filePath);
    await this.pres.writeFile({ fileName: fullPath });
    return fullPath;
  }
}

// Standalone CLI Execution / Demonstration
if (require.main === module) {
  async function runDemo() {
    const outName = process.argv[2] || 'SSM_Executive_Presentation_Demo.pptx';
    console.log(`Generating demonstration deck: ${outName}...`);

    const builder = new SSMPptxBuilder({
      title: 'Industrial Control & OT Setpoint Optimization',
      subtitle: 'Real-time Closed Loop SCADA & Level 3 Integration',
      projectContext: 'SSM InfoTech Solutions | Enterprise Automation Suite',
      confidentiality: 'CONFIDENTIAL — BOARD REVIEW'
    });

    // Slide 1: Dark Executive Cover
    builder.addTitleSlide({
      tag: 'Executive Architecture Proposal',
      title: 'Automated Industrial SCADA &\nReal-Time Setpoint Optimization',
      subtitle: 'Physics-Grounded Optimization Platform for Mission-Critical Plants',
      metadata: [
        { label: 'Target Asset', val: 'Hydrocarbon Processing Facility' },
        { label: 'Architecture', val: 'Purdue Model Level 1-3 Compliance' },
        { label: 'Projected Gain', val: '$12.0M - $20.8M Annual Net Margin' },
        { label: 'Control Latency', val: '< 10 ms Deterministic Network' },
        { label: 'Security Model', val: 'IEC 62443 Data Diode Isolation' },
        { label: 'Payback Period', val: '< 6 Months from Commissioning' }
      ]
    });

    // Slide 2: Strategic Pillars & Metric Cards
    const slide2 = builder.addSlide(
      'System Performance',
      'Engineered Reliability & Deterministic Execution',
      'Zero-compromise OT telemetry with sub-second supervisory feedback loops.'
    );
    builder.addMetricCards(slide2, [
      { value: '99.99%', label: 'Supervisory Uptime', desc: 'Active-Active Historian Cluster', highlight: true },
      { value: '< 5 ms', label: 'L1 Loop Latency', desc: 'Direct Modbus TCP / OPC UA', success: true },
      { value: '100%', label: 'Purdue Compliance', desc: 'Hardware Data Diode Isolation', success: true },
      { value: '$0', label: 'Recurring License Fees', desc: 'Open Industrial Automation Stack' }
    ], 1.6, 1.5);

    builder.addCard(slide2, 0.8, 3.35, 5.7, 3.3, {
      badge: 'Core Architecture',
      title: 'Purdue Model L1-L3 Segregation',
      text: 'Ensures strict network isolation between field controllers and enterprise analytical nodes.',
      bullets: [
        'Dedicated OT DMZ buffering telemetry across Level 3 historians.',
        'Unidirectional data diodes preventing inbound enterprise cyber vectors.',
        'Deterministic MQTT Sparkplug B message brokerage.'
      ]
    });

    builder.addCard(slide2, 6.83, 3.35, 5.7, 3.3, {
      badge: 'Analytical Engine',
      title: 'Nonlinear Dynamic Setpoint Solver',
      text: 'Solves complex multivariable optimization matrices within continuous control intervals.',
      bullets: [
        'Simultaneous real-time thermodynamic enthalpy calculations.',
        'Automated penalty factor enforcement on equipment operating limits.',
        'Operator override failover mechanism engaging in < 250 milliseconds.'
      ]
    });

    // Slide 3: Comparison Matrix Table
    const slide3 = builder.addSlide(
      'Vendor Benchmark',
      'Platform Architecture vs. Legacy Vendor Stacks',
      'Evaluating operational flexibility, total cost of ownership, and real-time execution speeds.'
    );

    const headers = [
      { text: 'Capability / Layer', align: 'left' },
      { text: 'SSM Modern Architecture', align: 'left' },
      { text: 'Legacy Vendor A', align: 'left' },
      { text: 'Legacy Vendor B', align: 'left' }
    ];

    const rows = [
      ['Network Protocol', 'OPC UA & MQTT Sparkplug B', 'Proprietary DCOM', 'Closed Modbus variant'],
      ['Cycle Execution Time', '< 5 seconds continuous', '15 - 30 minutes batch', '60 minutes scheduled'],
      ['Cyber Isolation', 'Hardware Diode L3/L4 DMZ', 'Software firewall rule', 'Shared dual-NIC server'],
      ['Licensing Model', 'Zero recurring seat tax', 'Annual subscription license', 'Per-tag licensing tier']
    ];

    builder.addTable(slide3, 0.8, 1.8, 11.73, 4.8, headers, rows, [2.5, 3.23, 3.0, 3.0]);

    // Save
    const outPath = await builder.save(outName);
    console.log(`Successfully created: ${outPath}`);
  }

  runDemo().catch(err => {
    console.error('Error generating deck:', err);
    process.exit(1);
  });
}

module.exports = { SSMPptxBuilder };
