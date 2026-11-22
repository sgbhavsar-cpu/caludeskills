#!/usr/bin/env python3
"""
SSM InfoTech Solutions Pvt. Ltd. - Word Document Builder Engine
================================================================
A standardized, production-ready document generation engine for Microsoft Word (.docx).
Enforces corporate identity, typography hierarchy, table rules, and OpenXML standards.
"""

import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

# --- SSM InfoTech Brand Palette ---
COLOR_VIOLET = RGBColor(124, 27, 159)      # #7C1B9F (Primary Accent)
COLOR_DARK_PURPLE = RGBColor(74, 14, 102)  # #4A0E66 (Deep Purple)
COLOR_CHARCOAL = RGBColor(33, 37, 41)      # #212529 (Body Text)
COLOR_SLATE = RGBColor(108, 117, 125)      # #6C757D (Muted Text)
COLOR_TEAL = RGBColor(15, 118, 110)        # #0F766E (Positive / Metrics)

HEX_VIOLET = "7C1B9F"
HEX_DARK_PURPLE = "4A0E66"
HEX_LILAC_BG = "F7F0FA"
HEX_LILAC_BORDER = "E2D4EE"
HEX_CHARCOAL = "212529"
HEX_SLATE = "6C757D"
HEX_WHITE = "FFFFFF"


class SSMDocumentBuilder:
    """
    Builder for generating professional, brand-compliant Word documents for SSM InfoTech.
    """

    def __init__(
        self,
        title: str = "Enterprise Technical Document",
        subtitle: str = "Industrial Automation & Software Solutions",
        classification: str = "CONFIDENTIAL",
        author: str = "SSM InfoTech Engineering Team",
        organization: str = "SSM InfoTech Solutions Pvt. Ltd.",
        date_str: str = "November 2026",
        version_str: str = "v1.0",
        paper_size: str = "A4"
    ):
        self.title = title
        self.subtitle = subtitle
        self.classification = classification
        self.author = author
        self.organization = organization
        self.date_str = date_str
        self.version_str = version_str
        self.paper_size = paper_size

        self.doc = Document()
        self._init_geometry_and_styles()
        self.has_cover_page = False
        self._first_body_heading = True

    def _init_geometry_and_styles(self):
        """Set up page dimensions, margins, and standard document styles."""
        sec = self.doc.sections[0]

        if self.paper_size.upper() == "A4":
            sec.page_width = Inches(8.27)
            sec.page_height = Inches(11.69)
        else: # Letter
            sec.page_width = Inches(8.5)
            sec.page_height = Inches(11.0)

        # Standard 1.0 inch margins
        sec.top_margin = Inches(1.0)
        sec.bottom_margin = Inches(1.0)
        sec.left_margin = Inches(1.0)
        sec.right_margin = Inches(1.0)

        # Separate cover page header/footer
        sec.different_first_page_header_footer = True

        # 1. Normal Style (Body text - Justified, 11pt, 1.15 line spacing, 6pt after)
        normal_style = self.doc.styles['Normal']
        normal_style.font.name = 'Calibri'
        normal_style.font.size = Pt(11)
        normal_style.font.color.rgb = COLOR_CHARCOAL
        normal_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        normal_style.paragraph_format.line_spacing = 1.15
        normal_style.paragraph_format.space_after = Pt(6)

        # 2. Heading 1 (Violet, 18pt bold, page break before)
        h1 = self.doc.styles['Heading 1']
        h1.font.name = 'Calibri'
        h1.font.size = Pt(18)
        h1.font.bold = True
        h1.font.color.rgb = COLOR_VIOLET
        h1.paragraph_format.space_before = Pt(14)
        h1.paragraph_format.space_after = Pt(6)
        h1.paragraph_format.page_break_before = True

        # 3. Heading 2 (Dark Purple, 14pt bold)
        h2 = self.doc.styles['Heading 2']
        h2.font.name = 'Calibri'
        h2.font.size = Pt(14)
        h2.font.bold = True
        h2.font.color.rgb = COLOR_DARK_PURPLE
        h2.paragraph_format.space_before = Pt(10)
        h2.paragraph_format.space_after = Pt(4)
        h2.paragraph_format.page_break_before = False

        # 4. Heading 3 (Charcoal, 12pt bold)
        h3 = self.doc.styles['Heading 3']
        h3.font.name = 'Calibri'
        h3.font.size = Pt(12)
        h3.font.bold = True
        h3.font.color.rgb = COLOR_CHARCOAL
        h3.paragraph_format.space_before = Pt(8)
        h3.paragraph_format.space_after = Pt(2)
        h3.paragraph_format.page_break_before = False

    def _setup_running_headers_footers(self):
        """Configure running header and footer with dynamic page numbering."""
        sec = self.doc.sections[0]

        # Running Header
        header = sec.header
        hp = header.paragraphs[0]
        hp.text = ""
        hp.paragraph_format.space_after = Pt(0)
        pPr = hp._p.get_or_add_pPr()

        # Add right tab stop for 6.27 inches (A4 8.27 - 2.0 = 6.27 inches = ~9028 dxa)
        tab_dxa = int((sec.page_width.inches - sec.left_margin.inches - sec.right_margin.inches) * 1440)
        tabs = OxmlElement('w:tabs')
        tab1 = parse_xml(f'<w:tab {nsdecls("w")} w:val="right" w:pos="{tab_dxa}"/>')
        tabs.append(tab1)
        pPr.append(tabs)

        # Header bottom border line (subtle lilac)
        pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="6" w:space="4" w:color="{HEX_LILAC_BORDER}"/></w:pBdr>')
        pPr.append(pBdr)

        r_left = hp.add_run(self.title)
        r_left.font.name = 'Calibri'
        r_left.font.size = Pt(8.5)
        r_left.font.color.rgb = COLOR_SLATE

        hp.add_run("\t")

        r_right = hp.add_run(self.organization)
        r_right.font.name = 'Calibri'
        r_right.font.size = Pt(8.5)
        r_right.font.bold = True
        r_right.font.color.rgb = COLOR_VIOLET

        # Running Footer
        footer = sec.footer
        fp = footer.paragraphs[0]
        fp.text = ""
        fp.paragraph_format.space_after = Pt(0)
        fp_Pr = fp._p.get_or_add_pPr()

        # Footer tab stop
        f_tabs = OxmlElement('w:tabs')
        f_tab1 = parse_xml(f'<w:tab {nsdecls("w")} w:val="right" w:pos="{tab_dxa}"/>')
        f_tabs.append(f_tab1)
        fp_Pr.append(f_tabs)

        # Footer top border line
        fpBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:top w:val="single" w:sz="6" w:space="4" w:color="{HEX_LILAC_BORDER}"/></w:pBdr>')
        fp_Pr.append(fpBdr)

        r_fleft = fp.add_run(f"{self.classification} — {self.organization}")
        r_fleft.font.name = 'Calibri'
        r_fleft.font.size = Pt(8.5)
        r_fleft.font.color.rgb = COLOR_SLATE

        fp.add_run("\t")

        r_page = fp.add_run("Page ")
        r_page.font.name = 'Calibri'
        r_page.font.size = Pt(8.5)
        r_page.font.color.rgb = COLOR_SLATE

        # Dynamic PAGE field
        fld_page = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>')
        fp._p.append(fld_page)

        p_of = fp.add_run(" of ")
        p_of.font.name = 'Calibri'
        p_of.font.size = Pt(8.5)
        p_of.font.color.rgb = COLOR_SLATE

        # Dynamic NUMPAGES field
        fld_numpages = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="NUMPAGES"/>')
        fp._p.append(fld_numpages)

    def add_cover_page(self, tag_line: str = "INDUSTRIAL SOFTWARE & AUTOMATION EXCELLENCE"):
        """Creates an executive, brand-compliant SSM InfoTech cover page."""
        self.has_cover_page = True
        self._setup_running_headers_footers()

        # Top spacing
        sp = self.doc.add_paragraph()
        sp.paragraph_format.space_before = Pt(40)
        sp.paragraph_format.space_after = Pt(0)

        # Category Pill / Tag
        p_tag = self.doc.add_paragraph()
        p_tag.paragraph_format.space_after = Pt(16)
        r_tag = p_tag.add_run(f"■ {tag_line.upper()}")
        r_tag.font.name = 'Calibri'
        r_tag.font.size = Pt(10)
        r_tag.font.bold = True
        r_tag.font.color.rgb = COLOR_VIOLET

        # Main Title
        p_title = self.doc.add_paragraph()
        p_title.paragraph_format.space_after = Pt(8)
        p_title.paragraph_format.line_spacing = 1.1
        r_title = p_title.add_run(self.title)
        r_title.font.name = 'Calibri'
        r_title.font.size = Pt(28)
        r_title.font.bold = True
        r_title.font.color.rgb = COLOR_VIOLET

        # Subtitle
        p_sub = self.doc.add_paragraph()
        p_sub.paragraph_format.space_after = Pt(40)
        r_sub = p_sub.add_run(self.subtitle)
        r_sub.font.name = 'Calibri'
        r_sub.font.size = Pt(13)
        r_sub.font.color.rgb = COLOR_SLATE

        # Decorative Horizontal Violet Accent Bar (1.5pt thick)
        p_bar = self.doc.add_paragraph()
        p_bar.paragraph_format.space_after = Pt(120)
        pBar_Pr = p_bar._p.get_or_add_pPr()
        bdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="18" w:space="1" w:color="{HEX_VIOLET}"/></w:pBdr>')
        pBar_Pr.append(bdr)

        # Metadata Callout Card at Bottom of Cover Page
        tbl = self.doc.add_table(rows=1, cols=2)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        tbl.columns[0].width = Inches(3.1)
        tbl.columns[1].width = Inches(3.1)

        # Style left metadata cell
        c0 = tbl.cell(0, 0)
        c0_Pr = c0._tc.get_or_add_tcPr()
        c0_Pr.append(parse_xml(f'<w:shd {nsdecls("w")} w:val="clear" w:color="auto" w:fill="{HEX_LILAC_BG}"/>'))
        c0_Pr.append(parse_xml(f'<w:tcBorders {nsdecls("w")}><w:left w:val="single" w:sz="24" w:space="0" w:color="{HEX_VIOLET}"/><w:top w:val="none"/><w:right w:val="none"/><w:bottom w:val="none"/></w:tcBorders>'))
        c0_Pr.append(parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="140" w:type="dxa"/><w:left w:w="180" w:type="dxa"/><w:bottom w:w="140" w:type="dxa"/><w:right w:w="140" w:type="dxa"/></w:tcMar>'))

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(2)
        r0_h = p0.add_run("PREPARED BY:\n")
        r0_h.font.size = Pt(8.5)
        r0_h.font.bold = True
        r0_h.font.color.rgb = COLOR_VIOLET
        r0_b = p0.add_run(f"{self.organization}\nAuthor: {self.author}")
        r0_b.font.size = Pt(9.5)
        r0_b.font.color.rgb = COLOR_CHARCOAL

        # Style right metadata cell
        c1 = tbl.cell(0, 1)
        c1_Pr = c1._tc.get_or_add_tcPr()
        c1_Pr.append(parse_xml(f'<w:shd {nsdecls("w")} w:val="clear" w:color="auto" w:fill="{HEX_LILAC_BG}"/>'))
        c1_Pr.append(parse_xml(f'<w:tcBorders {nsdecls("w")}><w:left w:val="none"/><w:top w:val="none"/><w:right w:val="none"/><w:bottom w:val="none"/></w:tcBorders>'))
        c1_Pr.append(parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="140" w:type="dxa"/><w:left w:w="180" w:type="dxa"/><w:bottom w:w="140" w:type="dxa"/><w:right w:w="140" w:type="dxa"/></w:tcMar>'))

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(2)
        r1_h = p1.add_run("DOCUMENT DETAILS:\n")
        r1_h.font.size = Pt(8.5)
        r1_h.font.bold = True
        r1_h.font.color.rgb = COLOR_VIOLET
        r1_b = p1.add_run(f"Date: {self.date_str}\nVersion: {self.version_str} | {self.classification}")
        r1_b.font.size = Pt(9.5)
        r1_b.font.color.rgb = COLOR_CHARCOAL

        # Force page break to start body
        self.doc.add_page_break()

    def add_heading_1(self, text: str):
        """
        Adds a Heading 1 element.
        Enforces automatic page break before, unless it's the very first heading right after cover.
        """
        if not self.has_cover_page:
            self._setup_running_headers_footers()

        p = self.doc.add_heading(text, level=1)
        # If it's the first heading immediately after cover page, page_break_before is not needed
        if self._first_body_heading and self.has_cover_page:
            p.paragraph_format.page_break_before = False
            self._first_body_heading = False
        else:
            p.paragraph_format.page_break_before = True
            self._first_body_heading = False
        return p

    def add_heading_2(self, text: str):
        """Adds a Heading 2 in Dark Purple."""
        return self.doc.add_heading(text, level=2)

    def add_heading_3(self, text: str):
        """Adds a Heading 3 in Charcoal."""
        return self.doc.add_heading(text, level=3)

    def add_paragraph(self, text: str, bold_prefix: str = None):
        """
        Adds a body paragraph with strict justification, 1.15 line spacing, 6pt space after.
        """
        p = self.doc.add_paragraph()
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(6)

        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Calibri'
            r_pre.font.size = Pt(11)
            r_pre.font.bold = True
            r_pre.font.color.rgb = COLOR_CHARCOAL

        r = p.add_run(text)
        r.font.name = 'Calibri'
        r.font.size = Pt(11)
        r.font.color.rgb = COLOR_CHARCOAL
        return p

    def add_numbered_item(self, number_str: str, text: str, bold_prefix: str = None):
        """
        Strict Rule: Numbered items MUST have bold Violet numbers and hanging indents.
        NEVER prepend bullet points (•) to numbered items.
        """
        # Sanitize input: strip any accidental bullet
        cleaned_num = number_str.replace("•", "").strip()
        if not cleaned_num.endswith((".", ")")):
            cleaned_num = f"{cleaned_num}."

        p = self.doc.add_paragraph()
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.left_indent = Inches(0.4)
        p.paragraph_format.first_line_indent = Inches(-0.4)
        p.paragraph_format.space_after = Pt(4)

        # Bold Violet Number
        r_num = p.add_run(f"{cleaned_num}\t")
        r_num.font.name = 'Calibri'
        r_num.font.size = Pt(11)
        r_num.font.bold = True
        r_num.font.color.rgb = COLOR_VIOLET

        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Calibri'
            r_pre.font.size = Pt(11)
            r_pre.font.bold = True
            r_pre.font.color.rgb = COLOR_CHARCOAL

        r_text = p.add_run(text)
        r_text.font.name = 'Calibri'
        r_text.font.size = Pt(11)
        r_text.font.color.rgb = COLOR_CHARCOAL
        return p

    def add_bullet_item(self, text: str, bold_prefix: str = None):
        """
        Strict Rule: Bullets (•) exclusively for unnumbered items.
        Automatically strips any duplicate leading bullets or numbering prefixes.
        """
        cleaned_text = text.lstrip("•-* \t")
        p = self.doc.add_paragraph(style='List Bullet')
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_after = Pt(4)

        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Calibri'
            r_pre.font.size = Pt(11)
            r_pre.font.bold = True
            r_pre.font.color.rgb = COLOR_CHARCOAL

        r_text = p.add_run(cleaned_text)
        r_text.font.name = 'Calibri'
        r_text.font.size = Pt(11)
        r_text.font.color.rgb = COLOR_CHARCOAL
        return p

    def add_callout(self, title: str, text: str, callout_type: str = "info"):
        """
        Creates an executive callout card (single cell table):
        - Soft Lilac background (#F7F0FA)
        - 3pt Violet solid left border (#7C1B9F)
        - 8pt internal cell margins
        """
        sec = self.doc.sections[0]
        usable_width = sec.page_width.inches - sec.left_margin.inches - sec.right_margin.inches
        tbl = self.doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        cell = tbl.cell(0, 0)
        cell.width = Inches(usable_width)

        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'  <w:top w:val="none"/>'
            f'  <w:left w:val="single" w:sz="24" w:space="0" w:color="{HEX_VIOLET}"/>'
            f'  <w:bottom w:val="none"/>'
            f'  <w:right w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)

        shd = parse_xml(f'<w:shd {nsdecls("w")} w:val="clear" w:color="auto" w:fill="{HEX_LILAC_BG}"/>')
        tcPr.append(shd)

        mar = parse_xml(
            f'<w:tcMar {nsdecls("w")}>'
            f'  <w:top w:w="140" w:type="dxa"/>'
            f'  <w:left w:w="200" w:type="dxa"/>'
            f'  <w:bottom w:w="140" w:type="dxa"/>'
            f'  <w:right w:w="200" w:type="dxa"/>'
            f'</w:tcMar>'
        )
        tcPr.append(mar)

        p = cell.paragraphs[0]
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)

        icon = "■" if callout_type == "info" else "▲"
        if title:
            r_title = p.add_run(f"{icon} {title.upper()}\n")
            r_title.font.name = 'Calibri'
            r_title.font.size = Pt(10)
            r_title.font.bold = True
            r_title.font.color.rgb = COLOR_VIOLET

        r_body = p.add_run(text)
        r_body.font.name = 'Calibri'
        r_body.font.size = Pt(10.5)
        r_body.font.color.rgb = COLOR_CHARCOAL

        # Subtle spacer after callout
        sp = self.doc.add_paragraph()
        sp.paragraph_format.space_before = Pt(0)
        sp.paragraph_format.space_after = Pt(6)

    def add_stat_cards(self, stats: list):
        """
        Creates a row of 2 to 4 executive KPI metric callout cards.
        stats is a list of dicts: [{'value': '99.98%', 'label': 'HISTORIAN UPTIME', 'desc': 'Continuous OT operations'}]
        """
        n = len(stats)
        if n == 0 or n > 4:
            raise ValueError("add_stat_cards supports 1 to 4 cards.")

        sec = self.doc.sections[0]
        usable_width = sec.page_width.inches - sec.left_margin.inches - sec.right_margin.inches
        col_w = usable_width / n

        tbl = self.doc.add_table(rows=1, cols=n)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False

        for idx, item in enumerate(stats):
            cell = tbl.cell(0, idx)
            cell.width = Inches(col_w)
            tcPr = cell._tc.get_or_add_tcPr()

            # Shading & border
            tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:val="clear" w:color="auto" w:fill="{HEX_LILAC_BG}"/>'))
            tcPr.append(parse_xml(f'<w:tcBorders {nsdecls("w")}><w:left w:val="single" w:sz="12" w:space="0" w:color="{HEX_VIOLET}"/><w:top w:val="none"/><w:right w:val="none"/><w:bottom w:val="none"/></w:tcBorders>'))
            tcPr.append(parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="120" w:type="dxa"/><w:left w:w="160" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:right w:w="160" w:type="dxa"/></w:tcMar>'))

            p = cell.paragraphs[0]
            p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_after = Pt(2)

            r_val = p.add_run(f"{item.get('value', '')}\n")
            r_val.font.name = 'Calibri'
            r_val.font.size = Pt(20)
            r_val.font.bold = True
            r_val.font.color.rgb = COLOR_VIOLET

            r_lbl = p.add_run(f"{item.get('label', '').upper()}\n")
            r_lbl.font.name = 'Calibri'
            r_lbl.font.size = Pt(8.5)
            r_lbl.font.bold = True
            r_lbl.font.color.rgb = COLOR_DARK_PURPLE

            r_desc = p.add_run(item.get('desc', ''))
            r_desc.font.name = 'Calibri'
            r_desc.font.size = Pt(8.5)
            r_desc.font.color.rgb = COLOR_SLATE

        sp = self.doc.add_paragraph()
        sp.paragraph_format.space_after = Pt(6)

    def add_table(self, headers: list, rows_data: list, col_widths: list = None):
        """
        Creates a table adhering strictly to the user global rule:
        - MUST ALWAYS use native Word style: 'List Table 4 Accent 4' (or 'List Table 4 - Accent 4').
        - Never apply manual cell shading overrides (w:shd) on table cells, as this breaks Word's native table styling.
        - Repeats header row across pages (w:tblHeader).
        - Prevents rows from splitting across page breaks (w:cantSplit).
        """
        rows_count = len(rows_data) + 1
        cols_count = len(headers)

        tbl = self.doc.add_table(rows=rows_count, cols=cols_count)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False

        # Set List Table 4 Accent 4 style
        tblPr = tbl._tbl.tblPr
        tblStyle = tblPr.find(qn('w:tblStyle'))
        if tblStyle is not None:
            tblStyle.set(qn('w:val'), 'ListTable4-Accent4')
        else:
            tblPr.append(parse_xml(f'<w:tblStyle {nsdecls("w")} w:val="ListTable4-Accent4"/>'))

        # Set Column Widths if provided, else distribute evenly
        sec = self.doc.sections[0]
        usable_width = sec.page_width.inches - sec.left_margin.inches - sec.right_margin.inches
        if not col_widths:
            col_widths = [usable_width / cols_count] * cols_count

        for col_idx, width in enumerate(col_widths):
            for row in tbl.rows:
                row.cells[col_idx].width = Inches(width)

        # Header Row
        header_tr = tbl.rows[0]._tr.get_or_add_trPr()
        header_tr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

        for c_idx, h_text in enumerate(headers):
            cell = tbl.cell(0, c_idx)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(h_text)
            r.font.name = 'Calibri'
            r.font.bold = True
            r.font.size = Pt(10)

        # Data Rows
        for r_idx, row_data in enumerate(rows_data, start=1):
            trPr = tbl.rows[r_idx]._tr.get_or_add_trPr()
            trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))

            for c_idx, val in enumerate(row_data):
                cell = tbl.cell(r_idx, c_idx)
                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(4)
                p.paragraph_format.space_after = Pt(4)
                p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
                r = p.add_run(str(val))
                r.font.name = 'Calibri'
                r.font.size = Pt(10)

        # Spacer after table
        sp = self.doc.add_paragraph()
        sp.paragraph_format.space_after = Pt(6)
        return tbl

    def add_omml_equation(self, omml_xml: str):
        """
        Inserts native Word OMML equation (m:oMath / m:oMathPara).
        Strict Rule: NEVER write formulas as raw ASCII text.
        """
        p = self.doc.add_paragraph()
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(8)

        if "<m:oMath" not in omml_xml:
            # Wrap in standard oMathPara if not already wrapped
            omml_xml = f'<m:oMathPara {nsdecls("m")}><m:oMath>{omml_xml}</m:oMath></m:oMathPara>'

        math_elem = parse_xml(omml_xml)
        p._p.append(math_elem)
        return p

    def save(self, filepath: str):
        """Saves the document to the specified filepath."""
        os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
        self.doc.save(filepath)
        print(f"[SSM InfoTech Builder] Document successfully saved: {filepath}")


def create_sample_ssm_document(output_path: str):
    """Generates a complete reference showcase document for SSM InfoTech."""
    builder = SSMDocumentBuilder(
        title="Industrial Automation & Cybersecurity Architecture",
        subtitle="Bridging Control Systems (L0–L2) and Enterprise Analytics (L3–L4)",
        classification="CONFIDENTIAL",
        author="SSM InfoTech Solutions Engineering Team",
        organization="SSM InfoTech Solutions Pvt. Ltd.",
        date_str="November 2026",
        version_str="v2.1"
    )

    # 1. Cover Page
    builder.add_cover_page(tag_line="ENTERPRISE OT & DIGITALIZATION FRAMEWORK")

    # 2. Executive Summary
    builder.add_heading_1("1. Executive Summary & Operational Landscape")
    builder.add_paragraph(
        "SSM InfoTech Solutions Pvt. Ltd. delivers end-to-end industrial software, automation, and industrial IT integration "
        "designed for continuous uptime and rigorous compliance. Modern process manufacturing and utility plants face significant "
        "challenges reconciling legacy operational technology (OT) with cloud-native information technology (IT) ecosystems."
    )
    builder.add_paragraph(
        "By deploying our indigenous X-Force platform alongside deterministic network architectures, industrial organizations "
        "achieve comprehensive visibility, proactive safety monitoring, and seamless ISA 18.2 / EEMUA 191 alarm compliance.",
        bold_prefix="Core Mission: "
    )

    # 3. KPI Metric Callout Cards
    builder.add_stat_cards([
        {"value": "99.98%", "label": "PROCESS HISTORIAN UPTIME", "desc": "Continuous L1/L2 telemetry capture"},
        {"value": "< 10ms", "label": "CONTROL LOOP LATENCY", "desc": "Deterministic network backplanes"},
        {"value": "100%", "label": "IEC 62443 COMPLIANCE", "desc": "Full cybersecurity zoning & isolation"}
    ])

    # 4. Technical Architecture
    builder.add_heading_1("2. Multi-Tier Industrial Architecture")
    builder.add_paragraph(
        "The SSM InfoTech architecture is organized into strict functional tiers based on the Purdue Enterprise Reference "
        "Architecture (PERA), ensuring deterministic real-time control at the field level while providing high-throughput "
        "aggregation for plant historians and enterprise ERP interfaces."
    )

    builder.add_callout(
        title="Zero-Trust Perimeter Rule",
        text="Direct routable connectivity between Level 1/2 control networks and Level 4 enterprise networks is strictly prohibited. "
             "All historian synchronization must pass through unidirectional hardware data diodes and intermediate DMZ jump servers."
    )

    # 5. Native Styled Table (List Table 4 Accent 4)
    builder.add_heading_2("Architecture Layer Specifications")
    headers = ["Purdue Layer", "System Functions", "SSM InfoTech Engineered Solution", "Failover SLA"]
    rows = [
        ["Layer 0 / 1", "Field sensors, actuators, and PLC/DCS controllers", "Direct fieldbus / Modbus TCP / OPC UA integration", "< 5 ms bumpless"],
        ["Layer 2", "HMI visualization & supervisory supervisory control", "X-Force High Availability SCADA cluster", "< 500 ms switchover"],
        ["Layer 3", "Batch records, alarm management, maintenance workflows", "X-Force Historian & Digital Work Management Suite", "99.99% active-active"],
        ["Layer 3.5 (DMZ)", "Cyber threat inspection, secure reverse proxy, syslog", "Industrial IT Continuous Threat Detection & Data Diode", "Dual redundant paths"],
        ["Layer 4 / Cloud", "Enterprise ERP, predictive ML, multi-site analytics", "Cloud IIoT Data Platform & Secure API Gateway", "Multi-AZ redundancy"]
    ]
    builder.add_table(headers, rows, col_widths=[1.2, 1.8, 2.2, 1.07])

    # 6. Operational Availability Formula (OMML)
    builder.add_heading_2("Reliability & Availability Mathematical Model")
    builder.add_paragraph(
        "Operational system availability across multi-redundant SCADA nodes is calculated utilizing native Mean Time Between Failures "
        "(MTBF) and Mean Time To Repair (MTTR) parameters:"
    )

    omml_str = (
        f'<m:oMathPara {nsdecls("m")}>'
        f'  <m:oMath>'
        f'    <m:r><m:rPr><m:lit/></m:rPr><m:t>A = </m:t></m:r>'
        f'    <m:f>'
        f'      <m:num><m:r><m:t>MTBF</m:t></m:r></m:num>'
        f'      <m:den><m:r><m:t>MTBF + MTTR</m:t></m:r></m:den>'
        f'    </m:f>'
        f'    <m:r><m:t> = </m:t></m:r>'
        f'    <m:f>'
        f'      <m:num><m:r><m:t>Total Uptime</m:t></m:r></m:num>'
        f'      <m:den><m:r><m:t>Total Uptime + Downtime</m:t></m:r></m:den>'
        f'    </m:f>'
        f'  </m:oMath>'
        f'</m:oMathPara>'
    )
    builder.add_omml_equation(omml_str)

    # 7. Implementation Checklist
    builder.add_heading_1("3. Implementation & Compliance Directives")
    builder.add_paragraph(
        "Project engineers must adhere to the following sequence during commissioning and site acceptance testing (SAT):"
    )

    # Numbered list (Bold Violet numbers, no bullets!)
    builder.add_numbered_item("1", "Conduct baseline network discovery and asset inventory across all L1–L3 subnetworks.", bold_prefix="Asset Discovery: ")
    builder.add_numbered_item("2", "Configure dual-homed industrial network switches with Rapid Spanning Tree Protocol (RSTP).", bold_prefix="Switch Configuration: ")
    builder.add_numbered_item("3", "Deploy X-Force Historian nodes with database mirrors in hot-standby configuration.", bold_prefix="Historian Deployment: ")
    builder.add_numbered_item("4", "Validate ISA 18.2 alarm rationalization rules to eliminate standing and nuisance alarms.", bold_prefix="Alarm Rationalization: ")

    builder.add_heading_2("Site Acceptance Deliverables")
    builder.add_bullet_item("Complete electrical schematic and control loop diagrams (PDF & DWG).")
    builder.add_bullet_item("Factory Acceptance Testing (FAT) signed sign-off protocols.")
    builder.add_bullet_item("Cybersecurity vulnerability assessment and penetration test certification.")

    # Save
    builder.save(output_path)


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "SSM_InfoTech_Architecture_Standard.docx"
    create_sample_ssm_document(out)
