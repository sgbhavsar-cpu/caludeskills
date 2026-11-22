# OpenXML & OMML Technical Reference Guide

This reference provides exact XML snippets for advanced Word capabilities required by the SSM InfoTech document standards.

---

## 1. Dynamic Page Numbers: "Page X of Y"

Word requires dynamic field codes (`w:fldSimple`) for page numbers in running footers:

```python
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

# Paragraph run for "Page "
fp.add_run("Page ")

# Dynamic current page number
fld_page = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>')
fp._p.append(fld_page)

fp.add_run(" of ")

# Dynamic total page count
fld_numpages = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="NUMPAGES"/>')
fp._p.append(fld_numpages)
```

---

## 2. Table Header Repeat & No Split

To ensure tables look professional across multiple pages:

```python
# 1. Repeat header row on every page
header_tr = tbl.rows[0]._tr.get_or_add_trPr()
header_tr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

# 2. Prevent row from splitting across a page break (apply to each data row)
for row in tbl.rows[1:]:
    trPr = row._tr.get_or_add_trPr()
    trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
```

---

## 3. Native Table Style: `List Table 4 Accent 4`

To apply native table style without relying on user Word locale overrides:

```python
tblPr = tbl._tbl.tblPr
tblStyle = tblPr.find(qn('w:tblStyle'))
if tblStyle is not None:
    tblStyle.set(qn('w:val'), 'ListTable4-Accent4')
else:
    tblPr.append(parse_xml(f'<w:tblStyle {nsdecls("w")} w:val="ListTable4-Accent4"/>'))
```
> **CRITICAL**: Never add `<w:shd>` elements to cells inside this table, as doing so overrides and corrupts Word's native accent theming.

---

## 4. OMML Equations (`m:oMath` & `m:oMathPara`)

Word formulas must be embedded as native Office Math Markup Language (OMML) rather than plain ASCII:

### Fraction: `A / B`
```xml
<m:oMathPara xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">
  <m:oMath>
    <m:f>
      <m:num><m:r><m:t>A</m:t></m:r></m:num>
      <m:den><m:r><m:t>B</m:t></m:r></m:den>
    </m:f>
  </m:oMath>
</m:oMathPara>
```

### Subscript & Superscript: `X_1^2`
```xml
<m:sSubSup xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">
  <m:e><m:r><m:t>X</m:t></m:r></m:e>
  <m:sub><m:r><m:t>1</m:t></m:r></m:sub>
  <m:sup><m:r><m:t>2</m:t></m:r></m:sup>
</m:sSubSup>
```

### Full Reliability Availability Formula
```xml
<m:oMathPara xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">
  <m:oMath>
    <m:r><m:rPr><m:lit/></m:rPr><m:t>Availability = </m:t></m:r>
    <m:f>
      <m:num><m:r><m:t>MTBF</m:t></m:r></m:num>
      <m:den><m:r><m:t>MTBF + MTTR</m:t></m:r></m:den>
    </m:f>
    <m:r><m:t> × 100%</m:t></m:r>
  </m:oMath>
</m:oMathPara>
```
Append to paragraph via `p._p.append(parse_xml(omml_str))`.

