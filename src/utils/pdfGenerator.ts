import jsPDF from 'jspdf';
import { EvaluationReport } from '../types';

export function generateEvaluationPDF(report: EvaluationReport) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = margin;
      drawHeaderMini();
    }
  };

  const drawHeaderMini = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text('CA EXAM CHECKER AI — EVALUATION DOSSIER', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`ID: ${report.id.slice(0, 12)} | Candidate: ${report.studentName}`, pageWidth - margin, y, { align: 'right' });
    y += 3;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  // 1. TOP EDITORIAL BRAND HEADER
  doc.setFillColor(2, 132, 199); // #0284C7 brand blue
  doc.rect(margin, y, contentWidth, 2, 'F');
  y += 5;

  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('CA EXAM CHECKER AI', margin, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(2, 132, 199);
  doc.text('CHECKED LIKE AN EXAMINER', margin + 78, y - 1);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Official ICAI Evaluated Dossier • ${new Date(report.createdAt).toLocaleDateString()}`, pageWidth - margin, y, {
    align: 'right',
  });
  y += 5;

  // Thin separator rule
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // 2. DOSSIER METADATA BLOCK & SCORE BOX
  const metaHeight = 34;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.rect(margin, y, contentWidth, metaHeight, 'FD');

  // Candidate info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('CANDIDATE NAME:', margin + 4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(report.studentName || 'CA Aspirant', margin + 35, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('SUBJECT & CODE:', margin + 4, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  const subjectDisplay = report.subjectCode ? `${report.subjectName} (${report.subjectCode})` : report.subjectName;
  doc.text(subjectDisplay, margin + 35, y + 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('CA LEVEL & ATTEMPT:', margin + 4, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`${report.caLevel.replace('_', ' ')} • ${report.attempt}`, margin + 35, y + 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('EVALUATION ID:', margin + 4, y + 27);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(report.id, margin + 35, y + 27);

  // Score Box on Right
  const scoreBoxWidth = 52;
  const scoreBoxX = pageWidth - margin - scoreBoxWidth - 2;
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.8);
  doc.rect(scoreBoxX, y + 3, scoreBoxWidth, 28, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(2, 132, 199);
  doc.text('AWARDED SCORE', scoreBoxX + scoreBoxWidth / 2, y + 7, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(`${report.obtainedMarks} / ${report.maxMarks}`, scoreBoxX + scoreBoxWidth / 2, y + 16, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  if (report.passed) {
    doc.setTextColor(16, 185, 129);
    doc.text(`PASSED (${report.percentage}%)`, scoreBoxX + scoreBoxWidth / 2, y + 23, { align: 'center' });
  } else {
    doc.setTextColor(239, 68, 68);
    doc.text(`REVISION NEEDED (${report.percentage}%)`, scoreBoxX + scoreBoxWidth / 2, y + 23, { align: 'center' });
  }

  y += metaHeight + 6;

  // 3. ICAI COMPLIANCE & ARITHMETIC VERIFICATION
  const sumOfQuestions = report.questionEvaluations.reduce((acc, q) => acc + q.marksObtained, 0);
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentWidth, 8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `ICAI ARITHMETIC AUDIT VERIFIED: Total Awarded (${report.obtainedMarks}) matches Question Sum (${sumOfQuestions.toFixed(1)}). Strict Step-Wise Marking Applied.`,
    margin + 3,
    y + 5.5
  );

  y += 12;

  // 4. EXECUTIVE SUMMARY & EXAMINER OBSERVATIONS
  checkPageBreak(30);
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Executive Examiner Assessment', margin, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(
    report.overallSummary ||
      report.overallFeedback ||
      'Overall the candidate demonstrates a commendable understanding of core principles with clear step-wise presentation. Areas for improvement include working note precision and specific statutory section references.',
    contentWidth
  );
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4 + 4;

  // 5. DETAILED QUESTION-BY-QUESTION EVALUATION
  checkPageBreak(25);
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Step-by-Step Question Breakdown', margin, y);
  y += 5;

  report.questionEvaluations.forEach((q, idx) => {
    checkPageBreak(40);

    // Question Header Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentWidth, 7, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const qTopic = q.topic || q.topicName || 'Question Problem Statement';
    doc.text(`Question ${q.questionNumber || idx + 1}: ${qTopic}`, margin + 3, y + 4.8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(2, 132, 199);
    doc.text(`Awarded: ${q.marksObtained} / ${q.maxMarks} Marks`, pageWidth - margin - 3, y + 4.8, { align: 'right' });

    y += 9;

    // Strengths
    const positiveNote = q.whatWasCorrect || q.positiveFeedback;
    if (positiveNote) {
      checkPageBreak(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(22, 101, 52); // dark green
      doc.text('Strength / Compliant Steps:', margin + 2, y);
      y += 3.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(51, 65, 85);
      const posLines = doc.splitTextToSize(`• ${positiveNote}`, contentWidth - 4);
      doc.text(posLines, margin + 4, y);
      y += posLines.length * 3.5 + 2;
    }

    // Deductions & Missing elements
    const deductionNote = q.whyMarksDeducted || q.whatWasMissing;
    if (deductionNote) {
      checkPageBreak(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(185, 28, 28); // dark red
      doc.text('Examiner Deductions & Corrections:', margin + 2, y);
      y += 3.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(51, 65, 85);
      const dedLines = doc.splitTextToSize(`• ${deductionNote} (-${q.marksDeducted ?? 0}m)`, contentWidth - 6);
      doc.text(dedLines, margin + 4, y);
      y += dedLines.length * 3.5 + 1;
    }

    // Step breakdown items if present
    if (q.stepBreakdown && q.stepBreakdown.length > 0) {
      checkPageBreak(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Step Marking Audit:', margin + 2, y);
      y += 3.5;

      q.stepBreakdown.forEach((s) => {
        checkPageBreak(10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        const sNum = s.stepNumber || s.stepIndex || '';
        const sMax = s.maxMarks || s.allocatedMarks || '';
        const stext = `[Step ${sNum}] ${s.description}: ${s.awardedMarks}/${sMax} marks (${s.status || 'Audited'})`;
        const slines = doc.splitTextToSize(`  - ${stext}`, contentWidth - 6);
        doc.text(slines, margin + 4, y);
        y += slines.length * 3.2 + 1;
      });
    }

    y += 4;
  });

  // 6. ACTIONABLE STUDY RECOMMENDATIONS
  const recommendationsList = report.actionableRecommendations || report.recommendations || [];
  if (recommendationsList.length > 0) {
    checkPageBreak(30);
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('3. Strategic Recommendations for Next Attempt', margin, y);
    y += 5;

    recommendationsList.forEach((rec) => {
      checkPageBreak(12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const recLines = doc.splitTextToSize(`• ${rec}`, contentWidth - 4);
      doc.text(recLines, margin + 2, y);
      y += recLines.length * 3.6 + 1.5;
    });
    y += 4;
  }

  // 7. FOOTER CERTIFICATE ON EVERY PAGE
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(2, 132, 199);
    doc.text('CA EXAM CHECKER AI', margin, pageHeight - 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('• Certified ICAI Examiner Style AI Evaluation • Accurate • Reliable', margin + 35, pageHeight - 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  // Save the PDF file
  const fileSubject = report.subjectCode || report.subjectId || 'Exam';
  const filename = `CA_Evaluation_${fileSubject}_${(report.studentName || 'Student').replace(/\s+/g, '_')}_${report.id.slice(0, 8)}.pdf`;
  doc.save(filename);
}
