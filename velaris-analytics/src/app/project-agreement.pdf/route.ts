import { getAgreementSubmission } from "@/lib/db";

type PdfSubmission = Awaited<ReturnType<typeof getAgreementSubmission>>;

function escapePdfText(input: string) {
  return input.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function rgb(r: number, g: number, b: number) {
  return `${clamp01(r)} ${clamp01(g)} ${clamp01(b)}`;
}

function wrapText(text: string, maxChars: number) {
  const normalized = String(text ?? "").replaceAll(/\s+/g, " ").trim();
  if (!normalized) return ["—"];

  const words = normalized.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length <= maxChars) {
      line = next;
      continue;
    }
    if (line) lines.push(line);
    if (word.length > maxChars) {
      lines.push(word.slice(0, Math.max(1, maxChars)));
      line = word.slice(Math.max(1, maxChars));
      continue;
    }
    line = word;
  }

  if (line) lines.push(line);
  return lines.length ? lines : ["—"];
}

function estimateMaxChars(fontSize: number, width: number) {
  const approxCharWidth = fontSize * 0.52;
  return Math.max(8, Math.floor(width / approxCharWidth));
}

function buildProjectAgreementPdf(options: {
  generatedAt: Date;
  submission: PdfSubmission;
}) {
  const encoder = new TextEncoder();
  const submission = options.submission;

  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 48;

  const ops: string[] = [];

  const drawRect = (x: number, y: number, w: number, h: number) =>
    ops.push(`${x} ${y} ${w} ${h} re`);

  const fillStrokeRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    fill: [number, number, number],
    stroke: [number, number, number],
    lineWidth = 1
  ) => {
    ops.push(`${rgb(fill[0], fill[1], fill[2])} rg`);
    ops.push(`${rgb(stroke[0], stroke[1], stroke[2])} RG`);
    ops.push(`${lineWidth} w`);
    drawRect(x, y, w, h);
    ops.push("B");
  };

  const fillRect = (x: number, y: number, w: number, h: number, fill: [number, number, number]) => {
    ops.push(`${rgb(fill[0], fill[1], fill[2])} rg`);
    drawRect(x, y, w, h);
    ops.push("f");
  };

  const strokeLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    stroke: [number, number, number],
    lineWidth = 1
  ) => {
    ops.push(`${rgb(stroke[0], stroke[1], stroke[2])} RG`);
    ops.push(`${lineWidth} w`);
    ops.push(`${x1} ${y1} m`);
    ops.push(`${x2} ${y2} l`);
    ops.push("S");
  };

  const setFillColor = (fill: [number, number, number]) =>
    ops.push(`${rgb(fill[0], fill[1], fill[2])} rg`);

  const drawText = (
    font: "F1" | "F2",
    size: number,
    x: number,
    y: number,
    text: string
  ) => {
    ops.push("BT");
    ops.push(`/${font} ${size} Tf`);
    ops.push(`1 0 0 1 ${x} ${y} Tm`);
    ops.push(`(${escapePdfText(text)}) Tj`);
    ops.push("ET");
  };

  const drawWrappedText = (options: {
    font: "F1" | "F2";
    size: number;
    x: number;
    y: number;
    width: number;
    lineHeight: number;
    text: string;
  }) => {
    const maxChars = estimateMaxChars(options.size, options.width);
    const lines = wrapText(options.text, maxChars);
    let y = options.y;
    for (const line of lines) {
      drawText(options.font, options.size, options.x, y, line);
      y -= options.lineHeight;
    }
    return y;
  };

  const headerHeight = 112;
  fillRect(0, pageHeight - headerHeight, pageWidth, headerHeight, [0.04, 0.06, 0.12]);
  fillRect(0, pageHeight - headerHeight, pageWidth, 3, [0.10, 0.78, 0.73]);

  setFillColor([1, 1, 1]);
  drawText("F2", 22, margin, pageHeight - 54, "Velaris Analytics");
  drawText("F1", 11, margin, pageHeight - 78, "Project Agreement Confirmation");

  setFillColor([0.82, 0.86, 0.92]);
  drawText(
    "F1",
    9,
    margin,
    pageHeight - 96,
    `Generated: ${options.generatedAt.toISOString().slice(0, 10)}`
  );

  const rightX = pageWidth - margin - 180;
  const docId = submission?.id ? `AG-${submission.id.slice(0, 10).toUpperCase()}` : "AG-TEMPLATE";
  setFillColor([0.82, 0.86, 0.92]);
  drawText("F1", 9, rightX, pageHeight - 96, `Document: ${docId}`);

  const contentTop = pageHeight - headerHeight - 26;
  const boxWidth = pageWidth - margin * 2;
  const gap = 16;

  let cursorTop = contentTop;

  const box = (title: string, height: number) => {
    const yTop = cursorTop;
    const yBottom = yTop - height;

    fillStrokeRect(margin, yBottom, boxWidth, height, [0.97, 0.98, 0.99], [0.88, 0.90, 0.93], 1);
    strokeLine(margin, yTop - 38, margin + boxWidth, yTop - 38, [0.90, 0.92, 0.95], 1);

    setFillColor([0.06, 0.09, 0.16]);
    drawText("F2", 12, margin + 18, yTop - 26, title.toUpperCase());

    cursorTop = yBottom - gap;
    return { yTop, yBottom };
  };

  const clientBox = box("Client Information", 156);

  const labelColor: [number, number, number] = [0.34, 0.39, 0.47];
  const valueColor: [number, number, number] = [0.08, 0.11, 0.17];

  const colGap = 22;
  const colWidth = (boxWidth - colGap - 36) / 2;
  const leftX = margin + 18;
  const rightColX = leftX + colWidth + colGap;

  const labelSize = 8;
  const valueSize = 11;
  const rowStartY = clientBox.yTop - 60;

  const drawField = (x: number, y: number, label: string, value: string) => {
    setFillColor(labelColor);
    drawText("F1", labelSize, x, y, label.toUpperCase());
    setFillColor(valueColor);
    drawWrappedText({
      font: "F2",
      size: valueSize,
      x,
      y: y - 16,
      width: colWidth,
      lineHeight: 14,
      text: value,
    });
  };

  drawField(leftX, rowStartY, "Client Name", submission?.clientName ?? "—");
  drawField(rightColX, rowStartY, "Company", submission?.companyName ?? "—");
  drawField(leftX, rowStartY - 56, "Email", submission?.email ?? "—");
  drawField(rightColX, rowStartY - 56, "WhatsApp", submission?.whatsapp ?? "—");

  const projectY = rowStartY - 112;
  setFillColor(labelColor);
  drawText("F1", labelSize, leftX, projectY, "PROJECT NAME".toUpperCase());
  setFillColor(valueColor);
  drawWrappedText({
    font: "F2",
    size: valueSize,
    x: leftX,
    y: projectY - 16,
    width: boxWidth - 36,
    lineHeight: 14,
    text: submission?.projectName ?? "—",
  });

  const agreementBox = box("Agreement Summary", 208);
  const agreementTextX = margin + 18;
  let agreementY = agreementBox.yTop - 58;
  setFillColor([0.13, 0.16, 0.22]);

  const bullets = [
    "Scope follows the approved proposal and agreed deliverables.",
    "Payment terms: 50% down payment before start, 50% before handover.",
    "Scope changes require an additional written agreement and may affect cost & timeline.",
    "Source code is delivered after full payment is completed.",
  ];

  for (const item of bullets) {
    drawText("F2", 11, agreementTextX, agreementY, "—");
    agreementY = drawWrappedText({
      font: "F1",
      size: 11,
      x: agreementTextX + 14,
      y: agreementY,
      width: boxWidth - 36 - 14,
      lineHeight: 16,
      text: item,
    }) - 6;
  }

  setFillColor([0.34, 0.39, 0.47]);
  drawWrappedText({
    font: "F1",
    size: 9,
    x: agreementTextX,
    y: agreementBox.yBottom + 24,
    width: boxWidth - 36,
    lineHeight: 12,
    text:
      "This document is generated from a digital confirmation submitted via the Project Agreement page.",
  });

  const confirmBox = box("Digital Confirmation", 188);
  const confX = margin + 18;
  const confW = boxWidth - 36;
  let confY = confirmBox.yTop - 60;

  const yesNo = (value: boolean | null | undefined) => (value ? "YES" : "NO");

  const drawKeyValue = (key: string, value: string) => {
    setFillColor([0.34, 0.39, 0.47]);
    drawText("F1", 9, confX, confY, key.toUpperCase());
    setFillColor([0.08, 0.11, 0.17]);
    drawText("F2", 11, confX + 210, confY - 1, value);
    confY -= 22;
  };

  drawKeyValue("Agreed payment terms", yesNo(submission?.agreedPaymentTerms));
  drawKeyValue(
    "Understood scope change impact",
    yesNo(submission?.understoodScopeChangeImpact)
  );
  drawKeyValue("Approved proceed", yesNo(submission?.approvedProceed));
  drawKeyValue("Signature name", submission?.signatureName ?? "—");
  drawKeyValue("Signed date", submission?.signedDate ?? "—");

  setFillColor([0.34, 0.39, 0.47]);
  drawWrappedText({
    font: "F1",
    size: 9,
    x: confX,
    y: confirmBox.yBottom + 24,
    width: confW,
    lineHeight: 12,
    text: "For any questions, contact Velaris Analytics via the email in your proposal or invoice.",
  });

  setFillColor([0.34, 0.39, 0.47]);
  drawText(
    "F1",
    9,
    margin,
    28,
    "Velaris Analytics • CRM Systems • Data Analytics"
  );
  setFillColor([0.55, 0.60, 0.68]);
  drawText("F1", 9, pageWidth - margin - 54, 28, "1 / 1");

  const contentStream = ops.join("\n");

  const objects: string[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  objects.push(
    [
      "<< /Type /Page",
      "/Parent 2 0 R",
      `/MediaBox [0 0 ${pageWidth} ${pageHeight}]`,
      "/Contents 4 0 R",
      "/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >>",
      ">>",
    ].join(" ")
  );
  objects.push(
    `<< /Length ${encoder.encode(contentStream).length} >>\nstream\n${contentStream}\nendstream`
  );
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  const parts: string[] = [];
  parts.push("%PDF-1.4\n");

  const offsets: number[] = new Array(objects.length + 1).fill(0);

  for (let i = 0; i < objects.length; i += 1) {
    offsets[i + 1] = encoder.encode(parts.join("")).length;
    parts.push(`${i + 1} 0 obj\n${objects[i]}\nendobj\n`);
  }

  const xrefStart = encoder.encode(parts.join("")).length;
  const pad = (n: number) => String(n).padStart(10, "0");

  parts.push("xref\n");
  parts.push(`0 ${objects.length + 1}\n`);
  parts.push("0000000000 65535 f \n");
  for (let i = 1; i <= objects.length; i += 1) {
    parts.push(`${pad(offsets[i])} 00000 n \n`);
  }

  parts.push("trailer\n");
  parts.push(`<< /Size ${objects.length + 1} /Root 1 0 R >>\n`);
  parts.push("startxref\n");
  parts.push(`${xrefStart}\n`);
  parts.push("%%EOF\n");

  return encoder.encode(parts.join(""));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const submission = id ? await getAgreementSubmission(id) : null;

  const pdf = buildProjectAgreementPdf({
    generatedAt: new Date(),
    submission,
  });

  const suffix = submission?.id ? `-${submission.id.slice(0, 10)}` : "";
  const filename = `Velaris-Project-Agreement${suffix}.pdf`;

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
