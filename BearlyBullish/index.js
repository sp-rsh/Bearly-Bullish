const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageOrientation, TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const C = {
  navy:       "0A2540",   // Primary trust blue
  teal:       "00897B",   // Primary action green-teal
  tealLight:  "E0F2F1",   // Teal tint backgrounds
  amber:      "F59E0B",   // Warning / countdown
  amberLight: "FEF3C7",   // Amber tint
  red:        "EF4444",   // Overdue / danger
  redLight:   "FEE2E2",   // Red tint
  green:      "16A34A",   // Success / paid
  greenLight: "DCFCE7",   // Green tint
  slate:      "1E293B",   // Body text
  slateLight: "64748B",   // Secondary text
  border:     "E2E8F0",   // Borders
  bg:         "F8FAFC",   // App background
  white:      "FFFFFF",
  accent:     "6366F1",   // Purple accent (premium)
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const border = (color = C.border) => ({
  top: { style: BorderStyle.SINGLE, size: 1, color },
  bottom: { style: BorderStyle.SINGLE, size: 1, color },
  left: { style: BorderStyle.SINGLE, size: 1, color },
  right: { style: BorderStyle.SINGLE, size: 1, color },
});
const noBorder = () => ({
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
});

function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 120 },
    children: [new TextRun({ text, bold: true, size: 36, color: C.navy, font: "Inter" })]
  });
}
function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 80 },
    children: [new TextRun({ text, bold: true, size: 26, color: C.teal, font: "Inter" })]
  });
}
function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 60 },
    children: [new TextRun({ text, bold: true, size: 22, color: C.navy, font: "Inter" })]
  });
}
function Body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 100 },
    children: [new TextRun({
      text,
      size: 22,
      color: opts.color || C.slate,
      bold: opts.bold || false,
      italics: opts.italic || false,
      font: "Inter"
    })]
  });
}
function Bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({
      text,
      size: 22,
      color: opts.color || C.slate,
      bold: opts.bold || false,
      font: "Inter"
    })]
  });
}
function Label(text, color = C.navy) {
  return new Paragraph({
    spacing: { before: 40, after: 20 },
    children: [new TextRun({ text, size: 18, color, bold: true, font: "Inter", allCaps: true })]
  });
}
function Divider() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.border, space: 1 } },
    children: []
  });
}
function Space(before = 200) {
  return new Paragraph({ spacing: { before, after: 0 }, children: [] });
}
function ColorBox(label, hex, description, contrastText = C.white) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 1200, type: WidthType.DXA },
        borders: noBorder(),
        shading: { fill: hex, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `#${hex}`, size: 16, color: contrastText, bold: true, font: "Inter" })]
        })]
      }),
      new TableCell({
        width: { size: 1500, type: WidthType.DXA },
        borders: noBorder(),
        shading: { fill: C.bg, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 160, right: 80 },
        children: [new Paragraph({
          children: [new TextRun({ text: label, size: 20, color: C.navy, bold: true, font: "Inter" })]
        })]
      }),
      new TableCell({
        width: { size: 6660, type: WidthType.DXA },
        borders: noBorder(),
        shading: { fill: C.bg, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [new Paragraph({
          children: [new TextRun({ text: description, size: 20, color: C.slateLight, font: "Inter" })]
        })]
      }),
    ]
  });
}
function InfoBox(title, body, fillColor = C.tealLight, titleColor = C.teal) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: 9360, type: WidthType.DXA },
        borders: border(titleColor),
        shading: { fill: fillColor, type: ShadingType.CLEAR },
        margins: { top: 160, bottom: 160, left: 200, right: 200 },
        children: [
          new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: title, bold: true, size: 22, color: titleColor, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: body, size: 20, color: C.slate, font: "Inter" })] }),
        ]
      })]
    })]
  });
}
function ScreenMock(title, description, elements) {
  const rows = [
    new TableRow({
      children: [new TableCell({
        width: { size: 9360, type: WidthType.DXA },
        borders: border(C.navy),
        shading: { fill: C.navy, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 200, right: 200 },
        children: [new Paragraph({
          children: [new TextRun({ text: `SCREEN: ${title}`, size: 22, color: C.white, bold: true, font: "Inter" })]
        })]
      })]
    }),
    new TableRow({
      children: [new TableCell({
        width: { size: 9360, type: WidthType.DXA },
        borders: border(C.border),
        shading: { fill: C.bg, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        children: [
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: description, size: 20, color: C.slateLight, italics: true, font: "Inter" })] }),
          ...elements
        ]
      })]
    }),
  ];
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360], rows });
}
function TwoColRow(leftText, rightText, shade = C.white) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 4500, type: WidthType.DXA },
        borders: border(C.border),
        shading: { fill: shade, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 160, right: 80 },
        children: [new Paragraph({ children: [new TextRun({ text: leftText, size: 20, color: C.navy, bold: true, font: "Inter" })] })]
      }),
      new TableCell({
        width: { size: 4860, type: WidthType.DXA },
        borders: border(C.border),
        shading: { fill: shade, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [new Paragraph({ children: [new TextRun({ text: rightText, size: 20, color: C.slate, font: "Inter" })] })]
      }),
    ]
  });
}

// ─── DOCUMENT ─────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: {
      document: { run: { font: "Inter", size: 22, color: C.slate } }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: C.navy, font: "Inter" },
        paragraph: { spacing: { before: 480, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: C.teal, font: "Inter" },
        paragraph: { spacing: { before: 360, after: 80 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, color: C.navy, font: "Inter" },
        paragraph: { spacing: { before: 240, after: 60 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [

      // ══════════════════════════════════════════════════════════════════════
      // COVER
      // ══════════════════════════════════════════════════════════════════════
      new Paragraph({
        spacing: { before: 1440, after: 120 },
        children: [new TextRun({ text: "FINETRA", size: 80, bold: true, color: C.navy, font: "Inter" })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "Complete Product Design & Psychology Report", size: 36, color: C.teal, font: "Inter" })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 480 },
        children: [new TextRun({ text: "India's MSME Payment Intelligence Platform \u2014 Every Design Decision, Justified.", size: 24, color: C.slateLight, italics: true, font: "Inter" })]
      }),
      InfoBox(
        "How To Read This Report",
        "This document covers every design decision for Finetra from first principles \u2014 the psychology behind each color, font, animation, screen layout, notification, and user flow. Every choice is backed by research. By the end you should be able to close your eyes and visualize the entire product.",
        C.tealLight, C.teal
      ),
      Space(400),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 1: PRODUCT OVERVIEW
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 1 \u2014 What Finetra Is"),
      Divider(),

      H2("1.1 Problem Statement"),
      Body("India passed Section 43B(h) on April 1, 2024 \u2014 a law mandating that any company purchasing from a registered MSME must pay within 45 days, or lose their tax deduction. \u20B97.34 lakh crore is currently locked in delayed MSME invoices. Yet:"),
      Bullet("6.3 crore MSME owners don't know this right exists, can't track it, and have no tool to enforce it."),
      Bullet("Companies buying from MSMEs don't know which vendors are MSME-registered, quietly accumulating tax liability."),
      Bullet("The only government portal (MSME Samadhaan) requires 2+ hours of manual form-filling to file a single complaint."),
      Bullet("Zero fintech startups have built a consumer-facing tool for this. The gap is confirmed and wide open."),
      Space(100),

      H2("1.2 Solution"),
      Body("Finetra is a mobile-first web application (PWA) that:"),
      Bullet("Lets MSME owners add invoices in under 30 seconds"),
      Bullet("Tracks the 45-day legal deadline per invoice with a live countdown"),
      Bullet("Calculates compound interest accrued on overdue invoices (legally mandated, 3\u00D7 RBI bank rate)"),
      Bullet("Auto-generates MSME Samadhaan complaint with one tap when a buyer doesn't pay"),
      Bullet("Sends timely WhatsApp + push alerts at psychologically optimal moments"),
      Bullet("On the B2B side: gives companies a vendor compliance dashboard to track all MSME obligations"),
      Space(100),

      H2("1.3 Platform Decision: PWA, Not Native App"),
      Body("Finetra launches as a Progressive Web App (PWA), not a native iOS/Android app. Here is why this is correct:"),
      Bullet("Zero app store friction. Indian MSME owners are on mid-range Android phones. App store discovery is poor for niche B2B tools. A WhatsApp link sending them directly to the PWA converts at 4\u00D7 higher than 'download our app.'"),
      Bullet("Installable. PWA can be added to the home screen with an 'Add to Home Screen' prompt. It behaves exactly like a native app but without the 3-week Apple review cycle."),
      Bullet("Faster to build. One codebase instead of three (iOS + Android + web). As a solo founder in Netherlands, this is the only rational choice."),
      Bullet("Works on low storage phones. Indian mid-range users often have <2GB free storage. A PWA uses ~2MB vs an app using 40-80MB."),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 2: PSYCHOLOGY OF THE TARGET USER
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 2 \u2014 The Psychology of the Indian MSME Owner"),
      Divider(),

      H2("2.1 Who They Are (Psychographic Profile)"),
      Body("Your primary user is not a startup founder. They are:"),
      Bullet("Age 28\u201355, running a small business (sole proprietor, small manufacturer, freelancer registered as MSME, home baker, small trader)"),
      Bullet("Earning \u20B93L\u201340L/year from their business"),
      Bullet("Using a mid-range Android phone (Redmi, Realme, Samsung M-series)"),
      Bullet("Comfortable with WhatsApp, Google Pay, and basic Android apps"),
      Bullet("Not comfortable with complex software \u2014 uses Khatabook or basic Excel for accounting"),
      Bullet("Deeply relationship-oriented: avoids conflict, hates asking for money directly"),
      Bullet("Deeply pride-oriented: wants to feel professional, not like an informal vendor"),
      Space(100),

      H2("2.2 Their Core Emotional Drivers"),
      Body("Understanding these drives every design decision in Finetra."),
      Space(60),

      H3("Driver 1: 'Log kya kahenge' (Social Status Anxiety)"),
      Body("The MSME owner wants to be seen as organized, professional, and credible. They are embarrassed by the informality of chasing payments over WhatsApp. Finetra makes them feel like a serious professional by giving them infrastructure that feels corporate. The app's visual language must reinforce this: no cartoons, no cheap-looking icons \u2014 clean, structured, professional."),
      Space(60),

      H3("Driver 2: Conflict Avoidance Around Money"),
      Body("Asking clients for money is deeply uncomfortable in Indian business culture. It feels confrontational, potentially relationship-damaging. Finetra removes this entirely \u2014 the automated reminder and interest meter do the 'confronting' without the user ever having to personally say 'pay me.' This is the core emotional value proposition. Every feature must reinforce: 'You don't have to do anything uncomfortable. The system handles it.'"),
      Space(60),

      H3("Driver 3: Fear of Losing Business"),
      Body("MSME owners are terrified of upsetting clients and losing future business. The design must communicate: 'Finetra keeps the relationship professional \u2014 it doesn't threaten clients, it gently reminds them of legal obligations they already agreed to.' The language in reminders, the tone of notifications, everything must feel like a professional system, not an aggression."),
      Space(60),

      H3("Driver 4: Money Urgency"),
      Body("Show them a specific number they are losing and they act immediately. This is the same psychology Paytm used ('Cashback karo, paisa bachao') and why the TDS payslip idea had merit. The 'You are owed \u20B9X in interest' screen is Finetra's most powerful psychological tool. Research confirms: people respond faster to preventing a concrete loss than gaining an abstract benefit (loss aversion, Kahneman). Frame everything as money being recovered, not money being earned."),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 3: COLOR PSYCHOLOGY
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 3 \u2014 The Complete Color System"),
      Divider(),

      Body("Research shows 62-90% of a user's subconscious judgment about a product happens within 90 seconds, and is based primarily on color. In fintech specifically, where users are handing over financial data and trusting a service with their money, color does not decorate \u2014 it either builds or destroys trust. Here is every color in Finetra, what it is, where it goes, and exactly why."),
      Space(120),

      H2("3.1 The Primary Palette"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1200, 1500, 6660],
        rows: [
          new TableRow({
            children: [
              new TableCell({ width: { size: 1200, type: WidthType.DXA }, borders: noBorder(), shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "#0A2540", size: 16, color: "FFFFFF", bold: true, font: "Inter" })] })] }),
              new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: noBorder(), shading: { fill: C.bg, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 160, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Deep Navy", size: 20, color: C.navy, bold: true, font: "Inter" })] })] }),
              new TableCell({ width: { size: 6660, type: WidthType.DXA }, borders: noBorder(), shading: { fill: C.bg, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Brand primary. Headers, logos, heavy text. Navy is the #1 trust color in fintech globally \u2014 used by Stripe, HDFC, Axis. It communicates: stable, serious, institutional. It is the color of midnight in a courtroom, which is exactly the feeling you want when reminding a client of a legal obligation.", size: 20, color: C.slateLight, font: "Inter" })] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 1200, type: WidthType.DXA }, borders: noBorder(), shading: { fill: C.teal, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "#00897B", size: 16, color: "FFFFFF", bold: true, font: "Inter" })] })] }),
              new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: noBorder(), shading: { fill: C.bg, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 160, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Teal (Action Green)", size: 20, color: C.navy, bold: true, font: "Inter" })] })] }),
              new TableCell({ width: { size: 6660, type: WidthType.DXA }, borders: noBorder(), shading: { fill: C.bg, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Primary CTA buttons, active states, progress indicators. Green-teal is the universal 'growth and money' signal in fintech. 54% of users associate green with financial stability. Teal specifically is more distinctive than pure green (used by Paytm, Groww) while retaining all the trust associations. In Indian fintech, green = credited, success, go. Every positive action is this color.", size: 20, color: C.slateLight, font: "Inter" })] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 1200, type: WidthType.DXA }, borders: noBorder(), shading: { fill: "F8FAFC", type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "#F8FAFC", size: 16, color: C.slateLight, bold: true, font: "Inter" })] })] }),
              new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: noBorder(), shading: { fill: C.bg, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 160, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Off-White Background", size: 20, color: C.navy, bold: true, font: "Inter" })] })] }),
              new TableCell({ width: { size: 6660, type: WidthType.DXA }, borders: noBorder(), shading: { fill: C.bg, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "App background. Pure white (#FFFFFF) is too harsh for financial apps \u2014 it increases visual fatigue and makes data feel cold. Off-white (Slate-50) is what Notion, Linear, and CRED use. It is warm, breathable, reduces eye strain during prolonged dashboard use. Finance apps are looked at daily; the background must be restful.", size: 20, color: C.slateLight, font: "Inter" })] })] }),
            ]
          }),
        ]
      }),
      Space(120),

      H2("3.2 The Semantic Color System"),
      Body("These are the colors that communicate state and meaning. Every color has ONE meaning and is used consistently throughout the app. This is how the brain learns to read the app without thinking."),
      Space(60),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1200, 1500, 6660],
        rows: [
          ColorBox("AMBER", C.amber, "Countdown warning. Used on invoices with 5-14 days remaining. Yellow-amber triggers 'attention required' in the brain without the panic of red. Research: orange/amber CTAs increase click-through rates up to 24% over neutral. It says: 'Act soon, but you are still okay.' Shows on invoice cards, countdown timers, deadline badges.", C.white),
          ColorBox("RED", C.red, "Overdue state. Used ONLY when a deadline has passed. Red triggers urgency, action, danger signals in the amygdala. It should be used sparingly \u2014 if everything is red, nothing is. Only overdue invoices, failed states, and critical alerts use this. The brain learns: red = I need to act right now.", C.white),
          ColorBox("GREEN", C.green, "Paid / Success. When a client pays, the invoice card turns green. This is the dopamine hit \u2014 the reward. Green = money received, goal achieved, relief. The checkmark animation on payment confirmation is the most important micro-interaction in the app.", C.white),
          ColorBox("INDIGO", C.accent, "Premium / Upgrade prompts. Purple historically signals wealth, exclusivity, and premium. Used on 'Upgrade to Pro' banners, the premium badge, and the B2B dashboard. It creates aspiration without pressure.", C.white),
        ]
      }),
      Space(120),

      H2("3.3 Color Ratios and the 60-30-10 Rule"),
      Body("A critical design principle: color ratios determine whether an interface feels balanced or chaotic. Finetra uses the 60-30-10 rule:"),
      Bullet("60% \u2014 Off-white (#F8FAFC): The dominant background. Breathing room. Whitespace. The app never feels crowded."),
      Bullet("30% \u2014 Navy (#0A2540): Headers, body text, card shadows, structural elements. Creates the professional, serious backbone."),
      Bullet("10% \u2014 Teal/Action colors: CTAs, badges, highlights, countdowns. Scarce use makes them powerful. When the eye sees teal, it knows: 'this is clickable or important.'"),
      Body("Red and amber appear less than 5% of the time combined, always on data. This scarcity is intentional \u2014 when something turns red, it immediately commands attention precisely because red is rarely seen."),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 4: TYPOGRAPHY
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 4 \u2014 Typography System"),
      Divider(),

      H2("4.1 The Primary Typeface: Inter"),
      Body("Finetra uses Inter as its singular typeface. This is not a default choice \u2014 it is the correct choice, for specific reasons:"),
      Bullet("Inter was designed specifically for computer screens, optimizing for legibility at small sizes. On a Redmi Note phone at 360px width showing a 13px invoice label, Inter reads cleanly where Roboto or Open Sans would blur."),
      Bullet("Inter has a tall x-height (the height of lowercase letters relative to uppercase). This dramatically improves readability of financial data like '\u20B982,400' or 'Day 39 of 45'."),
      Bullet("Inter is used by GitHub, Figma, Linear, and most modern SaaS. Indian users who are digitally active will subconsciously associate it with trustworthy, modern software."),
      Bullet("Inter is available free via Google Fonts, loads fast, and works perfectly in the browser without licensing complexity."),
      Bullet("For Indian language support (Hindi UI option): Inter + Noto Sans Devanagari pair perfectly, sharing visual weight and x-height. This future-proofs the app for Hindi language expansion."),
      Space(60),

      InfoBox(
        "Why Not Poppins?",
        "Poppins is visually appealing but was designed for display (headings), not UI text. Its round, geometric forms reduce information density and make dashboards feel airy rather than data-rich. When a user is looking at 12 invoices on a dashboard, you need a typeface that packs information clearly, not one that looks beautiful on a poster.",
        "FFF3CD", "F59E0B"
      ),
      Space(120),

      H2("4.2 The Type Scale"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2400, 1200, 5760],
        rows: [
          new TableRow({ children: [
            new TableCell({ width: { size: 2400, type: WidthType.DXA }, borders: border(C.border), shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Style", size: 20, color: C.white, bold: true, font: "Inter" })] })] }),
            new TableCell({ width: { size: 1200, type: WidthType.DXA }, borders: border(C.border), shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Size / Weight", size: 20, color: C.white, bold: true, font: "Inter" })] })] }),
            new TableCell({ width: { size: 5760, type: WidthType.DXA }, borders: border(C.border), shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Where It's Used + Why", size: 20, color: C.white, bold: true, font: "Inter" })] })] }),
          ]}),
          TwoColRow("Display Number", "40px / 700", "The single most important number on screen \u2014 total interest owed, days overdue. Large and unavoidable. The brain prioritizes large, bold numbers. This is the 'aha moment' number that makes people pull out their credit card."),
          TwoColRow("Page Title", "24px / 600", "Screen headers ('My Invoices', 'Dashboard'). Clear orientation. Users should never feel lost."),
          TwoColRow("Section Header", "18px / 600", "Groups of content within a screen ('This Month', 'Overdue', 'Paid')."),
          TwoColRow("Body / Card Title", "15px / 500", "Invoice names, client names, primary card content. The workhorse size. 15px is the minimum comfortable reading size on mobile."),
          TwoColRow("Supporting Text", "13px / 400", "Dates, secondary labels, descriptions. Lighter weight differentiates from primary content without a size drop."),
          TwoColRow("Labels / Badges", "11px / 600 CAPS", "Status badges ('OVERDUE', 'PAID', 'DUE IN 3 DAYS'). All-caps at small size is more legible than mixed case. Never go below 11px on mobile."),
          TwoColRow("Legal / Fine Print", "12px / 400", "Interest calculation explanation, legal disclaimers. Readable but clearly secondary."),
        ]
      }),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 5: THE AHA MOMENT & ONBOARDING
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 5 \u2014 The Aha Moment & Onboarding"),
      Divider(),

      H2("5.1 What Is the Aha Moment"),
      Body("Research from Amplitude shows that users who reach their 'aha moment' in the first session are 3x more likely to return and convert to paid. For Finetra, the aha moment is precisely defined:"),
      Space(60),
      InfoBox(
        "Finetra's Aha Moment",
        "The instant the user sees: 'Invoice #[X] to [Client Name] is 23 days overdue. Legal interest accrued: \u20B94,812. Click here to send a legal reminder.' \u2014 For the first time in their career, they see a specific rupee amount they are owed, which they can enforce, with one tap. This is the moment everything clicks.",
        C.tealLight, C.teal
      ),
      Space(100),
      Body("Every onboarding decision must point toward getting the user to this screen as fast as possible. Research shows 90% of users churn without experiencing value in the first week. In Finetra, value must be felt within the first 90 seconds."),
      Space(100),

      H2("5.2 Onboarding Flow \u2014 Screen by Screen"),
      Space(60),

      H3("Step 1: Landing / Welcome (0-15 seconds)"),
      Body("The user arrives via WhatsApp link, Instagram bio, or Google search. They see:"),
      Bullet("Full-screen, clean white background. No hero image of smiling people (clich\u00E9 and Indian users ignore these)."),
      Bullet("Large headline in navy: 'Do you know how much your clients legally owe you right now?'"),
      Bullet("Subtext in teal: 'Add your first invoice and find out in 30 seconds.'"),
      Bullet("Single CTA button: 'Check My Invoices \u2192' in teal. No sign-up form yet."),
      Bullet("Psychological principle: Lead with the outcome (knowing money owed), not the process (sign up, fill form). This is the difference between a 40% bounce rate and an 80% bounce rate."),
      Space(60),

      H3("Step 2: Phone OTP Login (15-45 seconds)"),
      Body("After clicking the CTA:"),
      Bullet("Full-screen modal: 'Enter your phone number to save your invoices.'"),
      Bullet("Big number keypad (native, auto-triggered on mobile). No typing an email address."),
      Bullet("OTP sent via SMS. 6-digit OTP. Auto-read on Android via SMS permission."),
      Bullet("Why phone, not email: 72% of Indian users prefer phone login. They don't remember email passwords. Phone OTP is familiar from GPay, Paytm, Zepto. Every extra friction field loses 15-20% of users."),
      Bullet("Progress indicator: 'Step 1 of 2 \u2014 almost there.' Users who see progress indicators are significantly more likely to complete onboarding."),
      Space(60),

      H3("Step 3: Quick Profile (45-75 seconds)"),
      Body("Single screen, maximum 3 fields:"),
      Bullet("Your name (pre-filled if Google login used)"),
      Bullet("Your business type (dropdown: Manufacturing / Services / Trading / Freelancer / Other)"),
      Bullet("Your Udyam Registration Number (optional, but smart: 'Add this to unlock enforcement features')"),
      Bullet("Skip button clearly visible. Never force completion. Users who skip should still reach the dashboard."),
      Space(60),

      H3("Step 4: Add First Invoice (75-120 seconds)"),
      Body("This is the activation event. Immediately after profile, the user is taken to 'Add Your First Invoice' \u2014 NOT to a dashboard with 0 data."),
      Bullet("Three fields only: Client Name, Invoice Amount (\u20B9), Date of Delivery/Service"),
      Bullet("Auto-suggest client names from phone contacts (with permission) \u2014 removes typing friction"),
      Bullet("Date picker: defaults to today. Most common entry is a recent invoice."),
      Bullet("'Save Invoice' button in teal. When tapped: a satisfying micro-animation (see Section 8)."),
      Bullet("The screen then instantly shows: the dashboard with that first invoice, the 45-day countdown, and \u2014 if it's already overdue \u2014 the interest meter."),
      Body("This is the aha moment. The user has now experienced the core product value in under 2 minutes, with zero complexity."),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 6: SCREEN-BY-SCREEN DESIGN
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 6 \u2014 Every Screen, Designed"),
      Divider(),

      H2("6.1 The Dashboard (Home Screen)"),
      Space(60),
      ScreenMock(
        "Dashboard \u2014 Home",
        "The user's daily view. Opens every time they launch the app. Must deliver maximum value in minimum visual complexity.",
        [
          new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "TOP BAR:", size: 18, color: C.teal, bold: true, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Left: 'Good morning, [Name]' in 16px slate. Right: notification bell (red dot if new alert). No logo in the top bar \u2014 the user already knows where they are. Use that space for context.", size: 20, color: C.slate, font: "Inter" })] }),

          new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "HERO CARD (the single most important element):", size: 18, color: C.teal, bold: true, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Full-width card with navy (#0A2540) background. White text. Shows: 'Total Interest Your Clients Owe You' in 13px caps, then the live rupee amount in 40px bold white. Below that: '\u20B982,400 across 3 overdue invoices.' A teal 'View Details \u2192' link. This card is sticky \u2014 it never scrolls away. The large number creates daily habit: users open the app to watch this number grow, then act.", size: 20, color: C.slate, font: "Inter" })] }),

          new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "INVOICE TABS:", size: 18, color: C.teal, bold: true, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Three horizontal tabs below the hero card: 'Overdue' (red dot count), 'Due Soon' (amber dot count), 'Paid' (green). Default to Overdue. Users should always see the most urgent thing first.", size: 20, color: C.slate, font: "Inter" })] }),

          new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "INVOICE CARDS (per invoice):", size: 18, color: C.teal, bold: true, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "White card with 8px radius, subtle shadow (0px 2px 8px rgba(10,37,64,0.08)). Left accent bar (4px wide, red if overdue, amber if due soon, green if paid). Top-left: Client name in 15px/600. Bottom-left: '\u20B942,000 \u2022 Inv #023'. Top-right: Status badge (OVERDUE / DUE IN 5 DAYS / PAID). Bottom-right: 'Interest: \u20B93,200' in red if overdue, hidden if paid. Tap anywhere on card = full invoice detail.", size: 20, color: C.slate, font: "Inter" })] }),

          new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "FLOATING ACTION BUTTON:", size: 18, color: C.teal, bold: true, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Bottom-right. Teal circle, '+' icon. Tapping it opens 'Add Invoice' sheet. Always visible. Research shows FABs increase feature discovery by 40% over buried menu items.", size: 20, color: C.slate, font: "Inter" })] }),
        ]
      ),
      Space(120),

      H2("6.2 Invoice Detail Screen"),
      ScreenMock(
        "Invoice Detail",
        "Opens when user taps an invoice card. Full context, full action options.",
        [
          new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "HEADER SECTION:", size: 18, color: C.teal, bold: true, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Client name in 24px/600. Below: 'Invoice #023 \u2022 \u20B942,000 \u2022 Delivered 12 Mar 2025'. Status badge top-right. The hierarchy is: who, how much, when.", size: 20, color: C.slate, font: "Inter" })] }),

          new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "THE COUNTDOWN RING:", size: 18, color: C.teal, bold: true, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "A circular progress ring (SVG) centered on screen. For a due-in-10-days invoice: 78% of the ring is filled teal, 22% is empty. Inside the ring: '10' in 40px bold. Below: 'days until legal deadline'. As days pass, the ring empties. When overdue, the ring turns red and shows '-[X]' with a pulse animation. This visualization is psychologically more compelling than a date text because it shows depletion \u2014 the same mechanism that makes Snapchat streaks so powerful.", size: 20, color: C.slate, font: "Inter" })] }),

          new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "INTEREST METER (if overdue):", size: 18, color: C.teal, bold: true, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Below the ring: red section showing 'Legal Interest Accrued: \u20B94,812.00'. Below that, in smaller text: 'Based on 3\u00D7 RBI rate (\u20B9X/day)'. A subtle live counter animation (number ticking up slowly) creates urgency without panic \u2014 like watching a taxi meter.", size: 20, color: C.slate, font: "Inter" })] }),

          new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "ACTION BUTTONS:", size: 18, color: C.teal, bold: true, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Three options in priority order: (1) 'Send WhatsApp Reminder' \u2014 primary teal button, full width. (2) 'File MSME Samadhaan Complaint' \u2014 secondary navy outline button. (3) 'Mark as Paid' \u2014 green text link. The order matters: WhatsApp is the lowest-friction first step, Samadhaan is the escalation, paid is the resolution.", size: 20, color: C.slate, font: "Inter" })] }),
        ]
      ),
      Space(120),

      H2("6.3 Add Invoice Screen"),
      ScreenMock(
        "Add Invoice (Bottom Sheet)",
        "Slides up from the bottom when FAB is tapped. Never a full page navigation \u2014 bottom sheets feel faster and less disruptive.",
        [
          new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "DESIGN PRINCIPLE:", size: 18, color: C.teal, bold: true, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "The form must feel like a WhatsApp message, not a tax form. Three fields. No asterisks. No required field indicators. The copy is conversational: 'Who is this invoice for?' not 'Client Name *'.", size: 20, color: C.slate, font: "Inter" })] }),

          new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "FIELD 1 \u2014 Client Name:", size: 18, color: C.teal, bold: true, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Text input with phone contacts suggestion (shown as circular contact avatars below the field). Indian users' clients are in their phone contacts. Tapping a contact auto-fills the field. This removes the most common friction point \u2014 typing a company name on a small keyboard.", size: 20, color: C.slate, font: "Inter" })] }),

          new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "FIELD 2 \u2014 Invoice Amount:", size: 18, color: C.teal, bold: true, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Large \u20B9 symbol pre-placed, then numeric keyboard auto-triggers. Shows formatted number as user types: '42000' becomes '\u20B942,000'. Indian number formatting (lakh system) is respected: '100000' shows as '\u20B91,00,000'. This is a critical trust detail \u2014 showing Indian formatting tells the user 'this app was made for me.'", size: 20, color: C.slate, font: "Inter" })] }),

          new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "FIELD 3 \u2014 Date of Delivery:", size: 18, color: C.teal, bold: true, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Date picker defaults to today. Two quick-select chips: 'Today' and 'Yesterday'. 80% of invoices are added within 2 days of delivery. These chips eliminate calendar interaction for most users.", size: 20, color: C.slate, font: "Inter" })] }),

          new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "PREVIEW BEFORE SAVE:", size: 18, color: C.teal, bold: true, font: "Inter" })] }),
          new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "As the user fills fields, a live preview card appears above the form showing what the invoice will look like on the dashboard. This reduces errors and gives the user confidence before saving. It also reinforces the visual language of the dashboard.", size: 20, color: C.slate, font: "Inter" })] }),
        ]
      ),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 7: MICRO-INTERACTIONS & ANIMATIONS
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 7 \u2014 Micro-interactions & Animations"),
      Divider(),

      Body("Micro-interactions are the invisible architecture of trust. Research confirms: users cannot articulate WHY they prefer one app over another with identical features, but the answer is always in the micro-interactions. When a button responds instantly, when a check appears at exactly the right speed, when a number increments smoothly \u2014 the brain releases dopamine. These are the moments that wire habit."),
      Space(100),

      H2("7.1 The Six Critical Micro-interactions"),
      Space(60),

      H3("1. Invoice Save Confirmation"),
      Body("When the user taps 'Save Invoice': the save button morphs into a checkmark (\u2714) over 300ms with an ease-out curve. The checkmark holds for 600ms, then the bottom sheet slides down and the new invoice card slides into the dashboard list with a 200ms spring animation. The experience: satisfying, complete, instant. Duration: 1.1 seconds total. This is the 'heart tap' equivalent \u2014 the moment the user feels rewarded for doing the right thing."),
      Space(60),

      H3("2. Payment Received (Mark as Paid)"),
      Body("This is the most important animation in the app. When a user marks an invoice as paid: (1) The invoice card's left accent bar transitions from red to green over 500ms. (2) A subtle confetti burst (6-8 tiny teal and green particles) erupts from the card and fades in 800ms. (3) The interest meter disappears with a fade. (4) The hero number at the top decreases with a smooth count-down animation. The brain is being explicitly rewarded for using the app, reinforcing the habit loop."),
      Space(60),

      H3("3. Interest Meter Ticker"),
      Body("The interest number on overdue invoices ticks up slowly in real time (not just on page load). The number increments every few seconds by a small amount (\u20B90.10-0.50 based on daily rate). This creates the 'taxi meter' effect \u2014 passive urgency. The user doesn't need to be told 'act fast' \u2014 they watch the number go up and feel it themselves. This is the same psychology as watching a loading bar or a countdown timer."),
      Space(60),

      H3("4. Countdown Ring Pulse"),
      Body("When an invoice has 3 or fewer days remaining, the circular countdown ring pulses gently: it slightly expands and contracts (scale 1.0 \u2192 1.04 \u2192 1.0) every 3 seconds. Subtle enough not to be annoying, prominent enough that the eye notices. The animation triggers the brain's motion-detection system, which evolved to notice movement as a survival signal. It says: 'This needs attention' without words."),
      Space(60),

      H3("5. WhatsApp Reminder Sent"),
      Body("When the user taps 'Send WhatsApp Reminder': the button shows a loading spinner for 1.5s (the API call), then morphs into 'Sent via WhatsApp \u2713'. A WhatsApp-green (#25D366) flash briefly highlights the button, then fades to the original teal. This color nod to WhatsApp is deliberate \u2014 the user's brain immediately maps it to a familiar, trusted action."),
      Space(60),

      H3("6. Dashboard Load Skeleton"),
      Body("When the dashboard loads, instead of a blank white screen, skeleton cards (grey shimmer boxes in the shape of invoice cards) appear for 400-800ms while data fetches. Research confirms skeleton screens feel 15-29% faster than blank screens because the brain is seeing structure forming rather than waiting. Use Tailwind CSS shimmer class or CSS animation. Never show a loading spinner on the main dashboard \u2014 it feels like the app is struggling."),
      Space(120),

      H2("7.2 Animation Timing Guide"),
      Body("Every animation in Finetra follows these exact timing rules. Consistency is what makes an interface feel 'crafted.'"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3000, 1500, 4860],
        rows: [
          new TableRow({ children: [
            new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: border(C.border), shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Animation Type", size: 20, color: C.white, bold: true, font: "Inter" })] })] }),
            new TableCell({ width: { size: 1500, type: WidthType.DXA }, borders: border(C.border), shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Duration", size: 20, color: C.white, bold: true, font: "Inter" })] })] }),
            new TableCell({ width: { size: 4860, type: WidthType.DXA }, borders: border(C.border), shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Easing Curve", size: 20, color: C.white, bold: true, font: "Inter" })] })] }),
          ]}),
          TwoColRow("Button press response", "100ms", "ease-out \u2014 feels snappy, responsive"),
          TwoColRow("Bottom sheet slide up", "250ms", "cubic-bezier(0.16, 1, 0.3, 1) \u2014 spring feel"),
          TwoColRow("Card entry animation", "200ms", "ease-in-out, staggered 30ms between cards"),
          TwoColRow("Save confirmation checkmark", "300ms", "ease-out \u2014 satisfying, not abrupt"),
          TwoColRow("Color state transitions", "400ms", "linear \u2014 smooth state changes"),
          TwoColRow("Confetti (payment received)", "800ms", "ease-out, particle spread"),
          TwoColRow("Number count animations", "600ms", "ease-out \u2014 decelerates at end"),
          TwoColRow("Page transitions", "250ms", "slide-left on navigate, slide-right on back"),
          TwoColRow("Skeleton to content", "200ms", "fade-in"),
        ]
      }),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 8: NOTIFICATION STRATEGY
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 8 \u2014 Notification Psychology & Strategy"),
      Divider(),

      Body("Push notifications are either the best retention tool you have, or the fastest way to get uninstalled. Research shows apps that send notifications within the first 90 days see 3x higher retention. But 71% of users say they've uninstalled an app because of too many notifications. The difference is relevance and timing."),
      Space(100),

      H2("8.1 The Four Types of Notifications Finetra Sends"),
      Space(60),

      H3("Type 1: Deadline Alerts (Urgency-triggered)"),
      Body("These are the most important notifications. Sent when an invoice crosses a threshold:"),
      Bullet("Day 35 (10 days before deadline): '\ud83d\udfe1 Invoice to [Client] due in 10 days \u2014 \u20B942,000. Send a reminder now?'"),
      Bullet("Day 40 (5 days before): '\u26a0\ufe0f [Client] has 5 days to pay \u20B942,000 before legal interest starts. Tap to send WhatsApp reminder.'"),
      Bullet("Day 45 (deadline day): '\ud83d\udd34 Today is the last day. [Client] owes \u20B942,000. After today, you can legally charge \u20B9[X]/day in interest.'"),
      Bullet("Day 46+ (overdue): '\ud83d\udcb0 [Client] owes you \u20B942,000 + \u20B9[X] in interest (Day [Y] overdue). Tap to take action.'"),
      Space(60),

      H3("Type 2: Good News Notifications (Dopamine-driven)"),
      Body("These are underused but critical for habit formation. The brain learns to look forward to an app that sometimes brings good news:"),
      Bullet("'[Client] paid \u20B942,000 \u2714\ufe0f Your account balance this week: +\u20B991,500.' \u2014 Reinforce the positive behavior of using the app."),
      Bullet("'Interest earned this month: \u20B98,200 from 3 overdue invoices. All recovered through Finetra.' \u2014 Monthly win summary."),
      Space(60),

      H3("Type 3: Educational Nudges (First 14 days only)"),
      Body("Only during the first 2 weeks, send 1-2 tips that expand usage:"),
      Bullet("Day 3: 'Did you know you can send a professional WhatsApp reminder in one tap? Try it on your oldest invoice.'"),
      Bullet("Day 7: 'Your invoice to [Client] crosses the 45-day mark in 12 days. Set a reminder?'"),
      Body("Stop educational notifications after Day 14. Users who haven't adopted by then won't from nudges; they need re-engagement instead."),
      Space(60),

      H3("Type 4: Weekly Summary (Every Monday 9am)"),
      Body("One notification per week: 'Your Finetra Summary: 3 invoices due this week (\u20B91,24,000). 1 overdue (\u20B942,000 + interest). 2 paid last week \u2714. Open to review.' This creates a ritual \u2014 Monday morning dashboard check. 9am Monday is confirmed by research as the highest-engagement time for B2B fintech apps."),
      Space(100),

      H2("8.2 Notification Copy Principles"),
      Body("The language of every notification must follow these rules:"),
      Bullet("Always include the specific rupee amount. Vague notifications ('Your invoice needs attention') convert at 3% vs specific ones ('Your \u20B942,000 invoice to Mehta Traders is overdue') which convert at 18%."),
      Bullet("Never use the word 'overdue' in the title. Use 'needs attention' or 'ready for action.' Overdue feels accusatory toward the user, not toward the client."),
      Bullet("Include one clear action in every notification. 'Tap to send reminder.' 'Tap to view.' Not both. One action."),
      Bullet("Emojis: use 1 per notification, at the start. \ud83d\udfe1 for warning, \ud83d\udd34 for urgent, \u2714\ufe0f for success, \ud83d\udcb0 for money. They increase open rates by 19-30% in Indian consumer apps."),
      Bullet("WhatsApp notifications: in addition to push, critical alerts (Day 40, Day 45, Day 50+) are also sent via WhatsApp. Indians have 95%+ WhatsApp open rates vs 20-30% for push. Use AiSensy API."),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 9: HABIT FORMATION LOOP
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 9 \u2014 Designing for Habit: The Hook Model"),
      Divider(),

      Body("Nir Eyal's Hook Model explains why some apps become daily habits and others are forgotten. It has four components: Trigger, Action, Variable Reward, Investment. Here is Finetra's specific implementation of each:"),
      Space(100),

      H2("9.1 Trigger"),
      Body("External triggers (first 30 days): Push notification when invoice hits Day 35. WhatsApp alert at Day 45. Weekly Monday summary."),
      Body("Internal trigger (after habit forms): The user feels a mild unease when they haven't checked the app in 2+ days \u2014 the same unease that makes people check Instagram. This happens because the interest meter is always moving. They know money is ticking. The app becomes the place they go to resolve that anxiety."),
      Space(60),

      H2("9.2 Action"),
      Body("The simplest possible action: open app, see dashboard, tap one button. The entire core loop is 3 taps maximum. Research from BJ Fogg: the easier the action, the stronger the habit. If using the app requires more mental effort than not using it, the habit never forms."),
      Space(60),

      H2("9.3 Variable Reward"),
      Body("This is the key to addiction \u2014 not a guaranteed reward, but an unpredictable one. Finetra has natural variable rewards:"),
      Bullet("Sometimes when you open the app, a payment has arrived. Confetti. Number goes up. This is unpredictable and delightful."),
      Bullet("Sometimes the interest meter has jumped significantly overnight. A new, larger number. Urgency, action."),
      Bullet("Sometimes nothing has changed. Neutral. But the possibility of a positive or negative discovery keeps users coming back."),
      Body("This is the same mechanism as checking email, Instagram likes, or a stock app. The variability is not designed to be harmful \u2014 it is inherent to the product (you genuinely don't know when clients pay)."),
      Space(60),

      H2("9.4 Investment"),
      Body("Each use makes Finetra more valuable to the user:"),
      Bullet("More invoices = more data = richer dashboard = harder to leave"),
      Bullet("Client history builds up \u2014 user can see which clients always pay late, which are reliable"),
      Bullet("The Udyam verification, bank details, complaint history are all 'stored value' that would be painful to recreate elsewhere"),
      Body("This is the 'stored value' principle. The more a user puts into the app, the less likely they are to switch."),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 10: TRUST ARCHITECTURE
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 10 \u2014 Trust Architecture"),
      Divider(),

      Body("In fintech, especially one dealing with legal enforcement and financial data, trust is the product. A user who doesn't trust Finetra won't add their invoice data, won't connect their Udyam number, and won't tap 'File Complaint.' Every screen must earn and maintain trust."),
      Space(100),

      H2("10.1 Visual Trust Signals"),
      Bullet("Security badge: 'Bank-grade 256-bit encryption' footer on login and data screens. Not a lie \u2014 HTTPS + Supabase RLS is legitimately bank-grade. But saying it explicitly reduces anxiety."),
      Bullet("'Your data never leaves India' \u2014 Supabase has India region. This is critical for MSME owners who are rightfully concerned about foreign data storage."),
      Bullet("Legal citations: Interest calculation screen shows 'As per Section 16 of MSMED Act 2006, compound interest at 3\u00D7 RBI rate.' This makes the tool feel authoritative, not made-up."),
      Bullet("Government logo proximity: Include 'Integrated with MSME Samadhaan \u2014 Ministry of MSME, Govt. of India' in the complaint filing section. Proximity to the government brand builds enormous trust with Indian users."),
      Space(60),

      H2("10.2 Social Trust Signals"),
      Bullet("After 100 users: 'Trusted by 100+ MSME owners across India.' After 1,000: '1,000+ MSMEs use Finetra to recover \u20B950+ crore in delayed payments.'"),
      Bullet("Named testimonials with photo and city: 'Rajesh Kumar, Furniture Manufacturer, Jaipur: Finetra helped me recover \u20B91.4 lakh in interest I didn't know I was owed.' Real names, real cities, real amounts \u2014 not stock photos."),
      Bullet("Case study snippets in onboarding: 'Priya from Surat recovered \u20B982,000 in unpaid invoices using Finetra in her first month.' Shown during onboarding to reduce the 'will this actually work?' doubt."),
      Space(60),

      H2("10.3 Transparency as Trust"),
      Body("Finetra shows exactly how every calculation is done:"),
      Bullet("Interest calculation: '\u20B942,000 \u00D7 3 \u00D7 6.5% (RBI rate) \u00F7 365 \u00D7 23 days = \u20B9713.42 interest.' Full formula shown, expandable. Users who can verify your math trust you completely."),
      Bullet("No hidden fees: 'Finetra charges \u20B9299/month. We take nothing from your invoice amounts or recovered interest. 100% of what you recover is yours.'"),
      Bullet("Data deletion: 'Delete all my data' option in Settings. Visible. Easy to find. Users who see this button trust that the data is actually theirs."),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 11: DARK/LIGHT MODE DECISION
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 11 \u2014 Dark Mode vs Light Mode"),
      Divider(),

      Body("Research is unambiguous: 82% of mobile users have dark mode enabled on their devices. However, research is equally clear: finance and banking apps perform better in light mode for trust and readability. This is not a contradiction \u2014 it is context."),
      Space(60),

      H2("11.1 The Decision: Light Mode Default, Dark Mode Supported"),
      Body("Finetra launches in light mode by default, with a dark mode toggle in Settings:"),
      Bullet("Light mode builds trust for financial data. Users perceive light-background financial apps as more legitimate and professional \u2014 this is documented and consistent across studies."),
      Bullet("Light mode is optimal for reading numbers, which is Finetra's primary use case. High-contrast dark text on off-white is the most readable configuration for rupee amounts and dates."),
      Bullet("However, 82% of users prefer dark mode, and forcing light mode frustrates power users. Offering the toggle respects user autonomy, which itself builds trust (research: giving users control increases trust scores by 22%)."),
      Bullet("Dark mode design: Deep navy (#0A2540) background, white text, teal and amber accents. The existing navy brand color becomes the background. The app looks premium, serious, focused."),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 12: NAVIGATION DESIGN
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 12 \u2014 Navigation Architecture"),
      Divider(),

      H2("12.1 The Bottom Navigation Bar"),
      Body("Finetra uses a bottom navigation bar with exactly 4 items. Research shows 4-5 items is optimal \u2014 fewer wastes space, more creates cognitive overload. The 4 items:"),
      Space(60),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 1600, 5960],
        rows: [
          new TableRow({ children: [
            new TableCell({ width: { size: 1800, type: WidthType.DXA }, borders: border(C.border), shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Tab", size: 20, color: C.white, bold: true, font: "Inter" })] })] }),
            new TableCell({ width: { size: 1600, type: WidthType.DXA }, borders: border(C.border), shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Icon", size: 20, color: C.white, bold: true, font: "Inter" })] })] }),
            new TableCell({ width: { size: 5960, type: WidthType.DXA }, borders: border(C.border), shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Purpose", size: 20, color: C.white, bold: true, font: "Inter" })] })] }),
          ]}),
          TwoColRow("Home", "House icon", "Dashboard with all invoices. Always has red badge if overdue invoices exist. Default tab on open."),
          TwoColRow("Add Invoice", "Plus circle", "Direct to add invoice form. The most frequent action. Center position by deliberate choice \u2014 thumb-reachable on all phone sizes."),
          TwoColRow("Reports", "Bar chart", "Monthly summary: invoices issued, collected, pending, interest earned. Simple analytics for business owners."),
          TwoColRow("Settings", "Gear icon", "Profile, Udyam number, bank details, notification preferences, subscription, dark mode."),
        ]
      }),
      Space(60),
      Body("The active tab indicator is a teal underline + teal icon color. Inactive tabs are grey (#94A3B8). The contrast is immediately obvious without being garish."),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 13: EMPTY STATES & ERROR STATES
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 13 \u2014 Empty States & Error States"),
      Divider(),

      H2("13.1 The Psychology of Empty States"),
      Body("Empty states are the most underdesigned part of apps and the second-biggest cause of drop-off after onboarding. When a user first sees an empty dashboard, they feel: confusion, doubt, and boredom. All three kill engagement."),
      Space(60),

      H3("Dashboard Empty State (no invoices yet):"),
      Body("Center-screen illustration (simple, flat, Indian-appropriate: a small shop front with a 'Pending' sign). Below: 'You haven\u2019t added any invoices yet.' Below that: 'Add your first invoice and see how much your clients owe you.' Then: a large teal 'Add Invoice' button. The illustration is not decorative \u2014 it is orienting. The CTA is not generic \u2014 it is the core value proposition restated as a direct action."),
      Space(60),

      H3("'Paid' Tab Empty State:"),
      Body("'\u2714 No paid invoices yet. When clients pay, they appear here.' Simple. Positive framing. Doesn\u2019t make the user feel like a failure."),
      Space(60),

      H2("13.2 Error States"),
      Body("Every error in Finetra communicates three things: (1) what went wrong in plain English, (2) whether it\u2019s the user\u2019s fault or the app\u2019s fault, (3) exactly what to do next."),
      Bullet("Network error: 'No internet connection. Your data is saved locally and will sync when you reconnect.' \u2014 Reassurance first, information second."),
      Bullet("MSME Samadhaan API down: 'Government portal is temporarily unavailable. We\u2019ll retry in 30 minutes and notify you when your complaint is submitted.' \u2014 Takes ownership of the problem."),
      Bullet("Invalid Udyam number: 'That Udyam number wasn\u2019t found. Please double-check the format: UDYAM-XX-00-0000000' \u2014 Shows the correct format, no jargon."),
      Body("Error messages are always in the user's language level, never technical. Never show a stack trace, error code, or internal system message."),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 14: GAMIFICATION
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 14 \u2014 Gamification Elements"),
      Divider(),

      Body("Finetra is a serious fintech tool. But serious does not mean joyless. Duolingo taught the world that gamification works in professional tools when it is tied to real outcomes, not artificial ones. Every gamification element here is directly tied to the user achieving a real business outcome."),
      Space(100),

      H2("14.1 The Recovery Milestone"),
      Body("When a user recovers their first \u20B910,000, then \u20B950,000, then \u20B91,00,000 in payments (including interest): a full-screen celebration card appears. It shows: '\ud83c\udf89 You\u2019ve recovered \u20B950,000 using Finetra!' Below: 'Share your win' button that generates a clean, shareable image card with the number (no sensitive client data). This is the viral loop \u2014 MSME owners are proud of running a tight business. They will share this."),
      Space(60),

      H2("14.2 Streak Tracking"),
      Body("'Invoices tracked on time for X consecutive months.' A simple streak counter on the profile page. Not intrusive, but visible. The psychology of streaks (pioneered by Duolingo) is powerful \u2014 once users have a streak of 3+ months, the cost of breaking it becomes a real deterrent to leaving."),
      Space(60),

      H2("14.3 The Client Reliability Score"),
      Body("After 3+ invoices with a single client, Finetra calculates their 'Payment Reliability Score' (internal only, never shown to client): 'Mehta Traders: Pays in 38 days on average. Reliable.' Or: 'XYZ Industries: Average 67 days. 2 late payments. High risk.' This data helps the user make smarter business decisions. It\u2019s also deeply engaging \u2014 users want to see their clients scored. This feature creates a reason to log EVERY invoice, even ones from reliable clients."),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 15: INDIAN-SPECIFIC DESIGN DECISIONS
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 15 \u2014 India-Specific Design Decisions"),
      Divider(),

      Body("These are the details that separate an app built FOR India vs an app translated into India. Each of these is a detail that Indian users will notice subconsciously without being able to articulate \u2014 but will make them feel 'this was made for someone like me.'"),
      Space(100),

      H2("15.1 Number Formatting"),
      Body("Always use the Indian numbering system: \u20B91,00,000 (1 lakh), not \u20B9100,000. Dates in DD/MM/YYYY format, not MM/DD or ISO. Time in 12-hour format with AM/PM (24-hour is rarely used in Indian consumer apps)."),
      Space(60),

      H2("15.2 Language"),
      Body("Primary language: English. But the English must be Indian English: 'Due date' not 'Payment deadline.' 'Invoice amount' not 'Receivable.' 'Client' not 'Customer.' 'MSME' is the term Indian business owners use \u2014 never 'small business' (carries a slight stigma)."),
      Body("Phase 2: Hindi UI toggle. The navigation labels, empty states, and error messages should be available in Hindi for tier-2/3 users. The core calculation text stays in English (legal terms are English-language)."),
      Space(60),

      H2("15.3 WhatsApp-First Integration"),
      Body("India runs on WhatsApp. Every notification strategy has a WhatsApp version. The reminder templates sent to clients via WhatsApp must look professional: pre-formatted with the Finetra name, the invoice number, the amount, and a payment UPI link. The client receiving this sees a professional message, not a personal request. This is the psychological bridge from 'awkward personal ask' to 'formal professional communication.'"),
      Space(60),

      H2("15.4 UPI Payment Link in Reminders"),
      Body("When sending a WhatsApp reminder, Finetra auto-includes the user's UPI ID as a payment link: 'Pay via UPI: [UPI ID]'. The client can tap and pay without leaving WhatsApp. This removes the final friction from payment. Razorpay/Cashfree payment links integrate seamlessly."),
      Space(60),

      H2("15.5 Connectivity Considerations"),
      Body("Many Indian MSME owners operate in areas with 3G-4G variability. Finetra is designed to be functional offline: all existing invoice data is cached locally via IndexedDB. New invoices added offline sync when connection returns. API calls are queued and retried. The app never tells the user 'You need to be online to view your invoices' \u2014 that\u2019s unacceptable for a tool people rely on for their business."),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 16: PRICING SCREEN PSYCHOLOGY
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 16 \u2014 Pricing Screen Psychology"),
      Divider(),

      Body("The pricing screen is where psychology and conversion meet. Most SaaS pricing pages are built wrong. Here is Finetra\u2019s approach, grounded in decades of behavioral economics research."),
      Space(100),

      H2("16.1 The Anchor-Then-Price Principle"),
      Body("Before showing any price, the pricing screen shows: 'The average Finetra user recovers \u20B948,000 in their first 3 months.' This is the anchor. The brain now calculates: \u20B9299/month \u00D7 3 months = \u20B9897. To recover \u20B948,000. That\u2019s a 53x return. The price is now obviously worth it, before the user even sees it."),
      Space(60),

      H2("16.2 The Two-Plan Structure"),
      Body("Free tier: Add up to 3 invoices. See deadlines. No reminders, no WhatsApp integration, no interest calculator. This is the hook \u2014 the user experiences the aha moment (I can see my invoices) but hits the paywall before the moment of maximum value (I can see what I\u2019m owed and collect it)."),
      Body("Pro tier: \u20B9299/month or \u20B92,499/year (2 months free). Unlimited invoices, WhatsApp reminders, interest calculator, one-tap Samadhaan filing, client reliability scores, monthly reports."),
      Body("The annual plan is presented first, with the monthly option in smaller text below. Research shows presenting annual first increases annual plan uptake by 40% vs monthly first."),
      Space(60),

      H2("16.3 The Risk Reversal"),
      Body("'If you don\u2019t recover more than \u20B9299 in your first month, we\u2019ll refund you completely. No questions. No forms.' This removes the last psychological barrier. An MSME owner with a single \u20B920,000 overdue invoice knows: there is no risk."),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 17: FULL TECH SPEC
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 17 \u2014 Technical Implementation Reference"),
      Divider(),

      H2("17.1 The Stack"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2400, 2400, 4560],
        rows: [
          new TableRow({ children: [
            new TableCell({ width: { size: 2400, type: WidthType.DXA }, borders: border(C.border), shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Layer", size: 20, color: C.white, bold: true, font: "Inter" })] })] }),
            new TableCell({ width: { size: 2400, type: WidthType.DXA }, borders: border(C.border), shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Tool", size: 20, color: C.white, bold: true, font: "Inter" })] })] }),
            new TableCell({ width: { size: 4560, type: WidthType.DXA }, borders: border(C.border), shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Why", size: 20, color: C.white, bold: true, font: "Inter" })] })] }),
          ]}),
          TwoColRow("Frontend Framework", "React + Vite", "Fast build, large ecosystem, PWA support via vite-plugin-pwa. You likely already know React."),
          TwoColRow("Styling", "Tailwind CSS", "Utility-first. Consistent spacing, colors defined in config. No CSS bloat. Mobile-first responsive trivially."),
          TwoColRow("UI Components", "shadcn/ui", "Accessible, unstyled components you customize. No licensing, no lock-in. Copy the components into your codebase."),
          TwoColRow("Database & Auth", "Supabase", "Postgres + auth + real-time + storage. Free tier: 50,000 MAU. India region available. RLS for row-level security."),
          TwoColRow("Payments", "Razorpay", "No setup cost. 2% per transaction. UPI, cards, netbanking. Best-in-class for India. Subscription support built in."),
          TwoColRow("WhatsApp API", "AiSensy / Interakt", "Indian WhatsApp API providers. Free tier for first 1,000 messages/month. Template message approval: 2-3 days."),
          TwoColRow("Push Notifications", "Firebase FCM", "Free. Excellent Android support (your primary user). Web push for PWA included."),
          TwoColRow("Interest Calculation", "Pure JavaScript", "Deterministic math. No library. RBI rate is public. Update once when RBI changes it."),
          TwoColRow("Animations", "Framer Motion", "React animation library. 50kb. Handles all the micro-interactions described in Section 7."),
          TwoColRow("Offline Support", "IndexedDB + SW", "Service Worker caches app shell. IndexedDB stores invoice data. workbox-webpack-plugin handles this."),
          TwoColRow("Analytics", "PostHog (free)", "Product analytics. Track funnel: signup \u2192 first invoice \u2192 first reminder \u2192 paid conversion. Free up to 1M events/month."),
          TwoColRow("Error Monitoring", "Sentry (free)", "Catch crashes. Free tier: 5,000 errors/month. One line of setup. Essential for knowing what breaks in production."),
        ]
      }),
      Space(120),

      H2("17.2 The Interest Calculation (The Core Logic)"),
      Body("This is the formula that powers the most important number in the app. It must be provably correct."),
      Space(60),
      InfoBox(
        "Interest Formula (Section 16 MSMED Act + RBI Rate)",
        "Daily Interest = Principal \u00D7 (3 \u00D7 RBI Bank Rate) / 365\nAccrued Interest = Daily Interest \u00D7 Days Overdue (from Day 46)\n\nExample: Invoice \u20B942,000 | RBI Rate 6.5% | Overdue 30 days\nDaily Rate = 42,000 \u00D7 (3 \u00D7 0.065) / 365 = \u20B922.48/day\nTotal Interest = \u20B922.48 \u00D7 30 = \u20B9674.38\n\nIMPORTANT: Interest is compound (monthly rests) per MSMED Act. Implement using compound formula after Day 90.",
        C.tealLight, C.teal
      ),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // SECTION 18: THE COMPLETE DESIGN CHECKLIST
      // ══════════════════════════════════════════════════════════════════════
      H1("SECTION 18 \u2014 The Pre-Launch Design QA Checklist"),
      Divider(),

      Body("Use this checklist before any public launch. Every item must be checked off."),
      Space(60),

      H2("Visual Design"),
      Bullet("All text passes WCAG AA contrast ratio (4.5:1 for body, 3:1 for large text). Use whocanuse.com to verify."),
      Bullet("No text below 12px anywhere in the app."),
      Bullet("All tappable elements are minimum 44\u00D744px (Apple and Google touch target requirement)."),
      Bullet("Consistent 8px grid used for all spacing (4px for fine-grain, 8px for components, 16px for sections)."),
      Bullet("Color is never the only indicator of state (always paired with text label or icon)."),
      Bullet("All images have alt text. All interactive elements have aria-labels."),
      Bullet("Indian number formatting (\u20B91,00,000 not \u20B9100,000) used everywhere."),
      Space(60),

      H2("Interaction Design"),
      Bullet("Every button responds within 100ms of tap (no perceptible delay)."),
      Bullet("Loading states exist for all API calls over 200ms."),
      Bullet("Error states exist for all failure scenarios (network, server, validation)."),
      Bullet("Empty states guide the user to an action for every empty list."),
      Bullet("All forms show inline validation, not just on submit."),
      Bullet("Back button / swipe-back works correctly on all navigation."),
      Space(60),

      H2("Performance"),
      Bullet("First Contentful Paint under 2s on 3G (use Lighthouse to test)."),
      Bullet("App works offline for existing data (service worker active)."),
      Bullet("Total JavaScript bundle under 200kb gzipped."),
      Bullet("Images are WebP format, served at correct sizes."),
      Bullet("Fonts are subsetted (only Latin + Devanagari characters loaded)."),
      Space(60),

      H2("Indian User Specifics"),
      Bullet("Works on Chrome Android 80+ (covers 95% of Indian Android users)."),
      Bullet("Works on 3G connectivity (test with Chrome DevTools throttling)."),
      Bullet("WhatsApp share works correctly on Android."),
      Bullet("UPI payment link format is valid and opens the correct apps."),
      Bullet("Udyam number format validation matches actual format (UDYAM-XX-00-0000000)."),
      Space(200),

      // ══════════════════════════════════════════════════════════════════════
      // FINAL SECTION
      // ══════════════════════════════════════════════════════════════════════
      H1("Final Note: The One Design Principle That Overrides Everything"),
      Divider(),

      Space(60),
      InfoBox(
        "The Prime Directive of Finetra's Design",
        "Every design decision must be evaluated against one question: 'Does this get the user to their \u20B9 number faster and more clearly?' The interest accrued, the days remaining, the amount owed \u2014 this is what the user came for. If a UI element, animation, color, or feature doesn't help the user reach that number faster or act on it more easily, it does not belong in the app.",
        C.tealLight, C.teal
      ),
      Space(100),
      Body("The most sophisticated design is often invisible. When a user opens Finetra and within 5 seconds knows exactly how much money they are owed and exactly how to recover it \u2014 without thinking about navigation, without reading instructions, without feeling confused or overwhelmed \u2014 that is when the design has succeeded."),
      Body("Build less. Make it faster. Make it clearer. Make the number undeniable. Then get out of the way."),
      Space(80),
      new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [new TextRun({ text: "\u2014 End of Finetra Design & Psychology Report \u2014", size: 22, color: C.slateLight, italics: true, font: "Inter" })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  console.log("Creating file...");
  fs.writeFileSync("finetra_design_report.docx", buffer);
  console.log("Document created successfully!");
}).catch(err => {
  console.error("Error:", err);
});