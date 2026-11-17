import { jsPDF } from 'jspdf';
import { SummaryResult } from './types';

/**
 * Generates an executive, beautifully formatted, ready-to-read PDF document from a summary.
 * Designed to work smoothly both client-side and server-side in Node.js.
 */
export function generatePdfDocument(summary: SummaryResult): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const bottomMargin = 22;

  let currentY = margin;

  // Helper to check page overflow and add a new page if necessary
  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      currentY = margin;
      drawPageDecoration();
    }
  };

  // Helper to draw modern subtle top/bottom decoration
  const drawPageDecoration = () => {
    // Top subtle bar
    doc.setFillColor(79, 70, 229); // #4F46E5 Indigo
    doc.rect(margin, 8, contentWidth, 1.5, 'F');
  };

  // Initial page decoration
  drawPageDecoration();

  // 1. BRAND HEADER
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(79, 70, 229);
  doc.text('SUMMARI  •  EXECUTIVE YOUTUBE BRIEFING', margin, currentY);
  currentY += 6;

  // 2. VIDEO TITLE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(17, 24, 39); // Gray 900
  const titleLines = doc.splitTextToSize(summary.title, contentWidth);
  doc.text(titleLines, margin, currentY);
  currentY += titleLines.length * 7 + 2;

  // 3. METADATA CARD (Creator, Date, Read Time, Link)
  const metaHeight = 20;
  ensureSpace(metaHeight);
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, currentY, contentWidth, metaHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // Slate 600

  const col1X = margin + 4;
  const col2X = margin + contentWidth / 2 + 2;
  const metaY1 = currentY + 6;
  const metaY2 = currentY + 14;

  doc.setFont('helvetica', 'bold');
  doc.text('Kreator / Saluran:', col1X, metaY1);
  doc.setFont('helvetica', 'normal');
  doc.text(summary.channel || 'YouTube Creator', col1X + 30, metaY1);

  doc.setFont('helvetica', 'bold');
  doc.text('Estimasi Baca:', col2X, metaY1);
  doc.setFont('helvetica', 'normal');
  doc.text(`~${summary.readingTimeMinutes} Menit`, col2X + 24, metaY1);

  doc.setFont('helvetica', 'bold');
  doc.text('Tautan Video:', col1X, metaY2);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(79, 70, 229);
  const truncatedUrl =
    summary.videoUrl.length > 45
      ? summary.videoUrl.substring(0, 42) + '...'
      : summary.videoUrl;
  doc.text(truncatedUrl, col1X + 30, metaY2);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.text('Tanggal:', col2X, metaY2);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('id-ID', { dateStyle: 'medium' }), col2X + 24, metaY2);

  currentY += metaHeight + 8;

  // Helper for Section Titles
  const drawSectionHeader = (title: string, iconNumber?: string) => {
    ensureSpace(14);
    // Accent rectangle
    doc.setFillColor(99, 102, 241); // Indigo 500
    doc.rect(margin, currentY, 3, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 27, 75); // Indigo 950
    const fullHeader = iconNumber ? `${iconNumber}. ${title}` : title;
    doc.text(fullHeader, margin + 6, currentY + 5.5);
    currentY += 10;
  };

  // Helper for Paragraph Body Text
  const drawParagraph = (text: string, fontSize: number = 10, lineHeight: number = 5) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(51, 65, 85); // Slate 700

    const lines = doc.splitTextToSize(text, contentWidth);
    for (const line of lines) {
      ensureSpace(lineHeight + 1);
      doc.text(line, margin, currentY);
      currentY += lineHeight;
    }
    currentY += 4;
  };

  // 4. EXECUTIVE SUMMARY
  drawSectionHeader('Ringkasan Eksekutif');
  drawParagraph(summary.executiveSummary, 10, 5.2);

  // 5. KEY POINTS
  if (summary.keyPoints && summary.keyPoints.length > 0) {
    drawSectionHeader('Poin-Poin Utama Pembahasan');

    summary.keyPoints.forEach((kp, idx) => {
      ensureSpace(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42); // Slate 900

      const badgeText = `${idx + 1}`;
      // Small circle badge
      doc.setFillColor(238, 242, 255);
      doc.circle(margin + 3, currentY - 1, 3, 'F');
      doc.setTextColor(79, 70, 229);
      doc.text(badgeText, margin + 2.2, currentY);

      doc.setTextColor(15, 23, 42);
      const topicTitle = kp.timestamp ? `${kp.topic} (${kp.timestamp})` : kp.topic;
      const topicLines = doc.splitTextToSize(topicTitle, contentWidth - 10);
      doc.text(topicLines, margin + 8, currentY);
      currentY += topicLines.length * 5 + 2;

      // Details
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      const detailLines = doc.splitTextToSize(kp.details, contentWidth - 8);
      for (const dLine of detailLines) {
        ensureSpace(4.8);
        doc.text(dLine, margin + 8, currentY);
        currentY += 4.8;
      }
      currentY += 3;
    });
  }

  // 6. KEY TAKEAWAYS (CALLOUT BOX)
  if (summary.takeaways && summary.takeaways.length > 0) {
    drawSectionHeader('Wawasan Kunci (Key Takeaways)');

    summary.takeaways.forEach((takeaway) => {
      ensureSpace(10);
      // Bullet dot
      doc.setFillColor(79, 70, 229);
      doc.circle(margin + 3, currentY - 1, 1.2, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);

      const takeawayLines = doc.splitTextToSize(takeaway, contentWidth - 8);
      for (const tLine of takeawayLines) {
        ensureSpace(4.8);
        doc.text(tLine, margin + 8, currentY);
        currentY += 4.8;
      }
      currentY += 2;
    });
    currentY += 3;
  }

  // 7. ACTION ITEMS
  if (summary.actionItems && summary.actionItems.length > 0) {
    drawSectionHeader('Langkah Aksi & Tips Praktis');

    summary.actionItems.forEach((action) => {
      ensureSpace(10);
      // Checkbox bracket style
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(16, 185, 129); // Emerald 500
      doc.text(`[✓]`, margin, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);

      const actionLines = doc.splitTextToSize(`${action}`, contentWidth - 8);
      for (const aLine of actionLines) {
        ensureSpace(4.8);
        doc.text(aLine, margin + 8, currentY);
        currentY += 4.8;
      }
      currentY += 2;
    });
    currentY += 3;
  }

  // 8. CONCLUSION
  if (summary.conclusion) {
    drawSectionHeader('Kesimpulan Akhir');
    drawParagraph(summary.conclusion, 10, 5.2);
  }

  // FOOTER ON ALL PAGES
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400

    // Footer dividing line
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.text(
      'Summari AI • https://github.com/alifshelviano/summari',
      margin,
      pageHeight - 8
    );
    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      pageWidth - margin - 20,
      pageHeight - 8
    );
  }

  return doc;
}

/**
 * Convenience helper to export PDF as an ArrayBuffer or Buffer for server attachment.
 */
export function generatePdfBuffer(summary: SummaryResult): Buffer {
  const doc = generatePdfDocument(summary);
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}

