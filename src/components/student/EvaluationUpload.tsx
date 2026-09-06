import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Trash2,
  RotateCw,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Award,
  CreditCard,
  Building2,
  Loader2,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Subject, UploadedPage, EvaluationStage } from '../../types';

interface EvaluationUploadProps {
  onNavigate: (path: string) => void;
  onEvaluationComplete: (reportId: string) => void;
}

const STAGES: { stage: EvaluationStage; label: string }[] = [
  { stage: 'INGESTING_PAGES', label: '1/10 Ingesting & preparing answer sheet scans' },
  { stage: 'OCR_HANDWRITING_RECOGNITION', label: '2/10 AI handwriting & notation recognition' },
  { stage: 'QUESTION_SEGMENTATION', label: '3/10 Detecting question numbers, sub-parts & notes' },
  { stage: 'SYLLABUS_MAPPING', label: '4/10 Mapping against syllabus & attempt model papers' },
  { stage: 'STEP_MARKING_CALCULATION', label: '5/10 Evaluating step marks & partial credit' },
  { stage: 'AMENDMENT_STANDARDS_VERIFICATION', label: '6/10 Checking AS / Ind AS / SA & tax amendments' },
  { stage: 'WORKING_NOTE_AUDIT', label: '7/10 Auditing working notes, cross-references & ledger balance' },
  { stage: 'PRESENTATION_ANALYSIS', label: '8/10 Evaluating presentation, narrations & format' },
  { stage: 'TOTAL_MARKS_ARITHMETIC_VERIFICATION', label: '9/10 Verifying question-level arithmetic total sum' },
  { stage: 'FINALIZING_REPORT', label: '10/10 Finalizing examiner audit report & roadmap' },
];

export const EvaluationUpload: React.FC<EvaluationUploadProps> = ({ onNavigate, onEvaluationComplete }) => {
  const { user, refreshUser } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>(user?.caLevel || 'CA_INTERMEDIATE');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [attempt, setAttempt] = useState<string>(user?.attempt || 'Nov 2026');
  const [pages, setPages] = useState<UploadedPage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [eligibility, setEligibility] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load subjects
  useEffect(() => {
    api.getAcademics(selectedLevel).then((res) => {
      setSubjects(res.subjects);
      if (res.subjects.length > 0) {
        setSelectedSubjectId(res.subjects[0].id);
      }
    });

    api.checkEligibility().then((res) => {
      setEligibility(res);
    });
  }, [selectedLevel]);

  // Handle files
  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newPages: UploadedPage[] = [];

    fileArray.forEach((file, index) => {
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const isImage = file.type.startsWith('image/');

      if (!isPdf && !isImage) {
        alert(`File ${file.name} is not a valid JPG, PNG or PDF.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const pageNumber = pages.length + newPages.length + 1;

        setPages((prev) => [
          ...prev,
          {
            pageNumber: prev.length + 1,
            fileName: file.name,
            fileType: isPdf ? 'pdf' : (file.type.split('/')[1] as any) || 'jpeg',
            fileSize: file.size,
            dataUrl,
            status: 'VALID',
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Page reordering & actions
  const movePage = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const newPages = [...pages];
    const temp = newPages[index];
    newPages[index] = newPages[targetIndex];
    newPages[targetIndex] = temp;

    // renumber
    newPages.forEach((p, idx) => {
      p.pageNumber = idx + 1;
    });

    setPages(newPages);
  };

  const removePage = (index: number) => {
    const newPages = pages.filter((_, idx) => idx !== index);
    newPages.forEach((p, idx) => {
      p.pageNumber = idx + 1;
    });
    setPages(newPages);
  };

  const addSamplePages = () => {
    // Convenient sample mock handwritten sheets for immediate testing
    const sampleMockPages: UploadedPage[] = [
      {
        pageNumber: 1,
        fileName: 'CA_Inter_AdvAcc_Paper_Pg1.jpg',
        fileType: 'jpeg',
        fileSize: 450000,
        dataUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%221100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22800%22%20height%3D%221100%22%20fill%3D%22%23fffdfa%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2280%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%23111%22%3EQ.1(a)%20AS%2012%20Government%20Grants%3C%2Ftext%3E%3Ctext%20x%3D%2250%22%20y%3D%22130%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23333%22%3EFacts%20of%20the%20Case%3A%20Govt%20grant%20received%20Rs%204%2C00%2C000%20for%20machinery...%3C%2Ftext%3E%3Ctext%20x%3D%2250%22%20y%3D%22180%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23333%22%3EWorking%20Note%201%3A%20Cost%20of%20Plant%20%3D%20Rs%2020%2C00%2C000.%20Useful%20Life%20%3D%205%20years.%3C%2Ftext%3E%3Ctext%20x%3D%2250%22%20y%3D%22230%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23333%22%3EDeferred%20Income%20Method%3A%20Rs%2080%2C000%20credited%20to%20P%26L%20annually.%3C%2Ftext%3E%3C%2Fsvg%3E',
        status: 'VALID',
      },
      {
        pageNumber: 2,
        fileName: 'CA_Inter_AdvAcc_Paper_Pg2.jpg',
        fileType: 'jpeg',
        fileSize: 420000,
        dataUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%221100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22800%22%20height%3D%221100%22%20fill%3D%22%23fffdfa%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2280%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%23111%22%3EQ.1(b)%20Internal%20Reconstruction%3C%2Ftext%3E%3Ctext%20x%3D%2250%22%20y%3D%22130%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23333%22%3EJournal%20Entries%20in%20the%20books%20of%20XYZ%20Ltd.%3C%2Ftext%3E%3Ctext%20x%3D%2250%22%20y%3D%22180%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23333%22%3EEquity%20Share%20Capital%20A%2Fc%20Dr.%20To%20Reconstruction%20A%2Fc...%3C%2Ftext%3E%3C%2Fsvg%3E',
        status: 'VALID',
      },
    ];
    setPages(sampleMockPages);
  };

  // Run evaluation
  const handleStartEvaluation = async () => {
    if (!selectedSubjectId) {
      setError('Please select a CA subject');
      return;
    }

    if (pages.length === 0) {
      setError('Please upload at least one page of your handwritten answer sheet');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentStageIndex(0);

    // Simulate real visual stage progression while backend executes
    const stageTimer = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    try {
      const res = await api.evaluateAnswerSheet({
        subjectId: selectedSubjectId,
        caLevel: selectedLevel,
        attempt,
        pages,
      });

      clearInterval(stageTimer);
      setCurrentStageIndex(STAGES.length - 1);
      await refreshUser();

      setTimeout(() => {
        onEvaluationComplete(res.report.id);
      }, 800);
    } catch (err: any) {
      clearInterval(stageTimer);
      setError(err.message || 'Evaluation failed. Your credit has been preserved.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title & Eligibility Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1A1A1A]">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block mb-1">Examination Submission</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            Evaluate Handwritten Answer Sheet
          </h1>
          <p className="text-xs text-[#1A1A1A]/70 mt-1 font-sans">
            Upload your scanned mock or practice test papers for question-wise step grading.
          </p>
        </div>

        {/* Current Eligibility Status Badge */}
        {eligibility && (
          <div className="flex items-center gap-2 p-2.5 bg-[#FFFFFF] border border-[#1A1A1A] text-xs font-mono">
            {eligibility.source === 'PERMANENT_FREE' ? (
              <span className="flex items-center gap-1.5 text-[#1A1A1A] font-bold">
                <Award className="w-4 h-4 text-[#1A1A1A]" /> VIP Permanent Free
              </span>
            ) : eligibility.source === 'INSTITUTE_SPONSORED' ? (
              <span className="flex items-center gap-1.5 text-[#1A1A1A] font-bold">
                <Building2 className="w-4 h-4 text-[#1A1A1A]" /> Institute Sponsored
              </span>
            ) : eligibility.freeRemaining > 0 ? (
              <span className="flex items-center gap-1.5 text-[#1A1A1A] font-bold">
                <Sparkles className="w-4 h-4 text-[#1A1A1A]" /> {eligibility.freeRemaining} Free Left
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[#1A1A1A] font-bold">
                <CreditCard className="w-4 h-4 text-[#1A1A1A]" /> {eligibility.remainingCredits} Credits
              </span>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-[#FFFFFF] border-2 border-[#1A1A1A] text-[#1A1A1A] text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#1A1A1A] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Progress Overlay during evaluation */}
      {loading && (
        <div className="p-8 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-xl space-y-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A]">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">
              Auditing & Evaluating Answer Folio...
            </h3>
            <p className="text-xs font-mono uppercase tracking-wider text-[#1A1A1A] font-bold">
              {STAGES[currentStageIndex].label}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto bg-[#EFECE6] h-2 overflow-hidden border border-[#1A1A1A]">
            <div
              className="bg-[#1A1A1A] h-full transition-all duration-700 ease-out"
              style={{ width: `${((currentStageIndex + 1) / STAGES.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-2xl mx-auto text-[10px] text-[#1A1A1A]/70 text-left font-mono">
            {STAGES.map((s, idx) => (
              <div
                key={s.stage}
                className={`p-1.5 border truncate ${
                  idx <= currentStageIndex
                    ? 'text-[#1A1A1A] font-bold bg-[#EFECE6] border-[#1A1A1A]'
                    : 'text-[#1A1A1A]/40 border-[#1A1A1A]/10 bg-[#F9F8F6]'
                }`}
              >
                {s.label.split(' ')[0]} {s.stage.replace(/_/g, ' ').toLowerCase()}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#1A1A1A]/60 font-sans">
            Please keep this tab open while our vision engine parses your handwriting and computes verified marks.
          </p>
        </div>
      )}

      {!loading && (
        <div className="space-y-8">
          {/* Exam & Subject Selection Form */}
          <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
            <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
              1. Select CA Exam & Subject
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Level */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1A1A]">CA Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
                >
                  <option value="CA_FOUNDATION">CA Foundation</option>
                  <option value="CA_INTERMEDIATE">CA Intermediate</option>
                  <option value="CA_FINAL">CA Final</option>
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-[#1A1A1A]">Subject Paper</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      Paper {sub.paperNumber}: {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1A1A]">Target Attempt</label>
                <select
                  value={attempt}
                  onChange={(e) => setAttempt(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
                >
                  <option value="May 2026">May 2026 (Current)</option>
                  <option value="Nov 2026">Nov 2026</option>
                  <option value="May 2027">May 2027</option>
                </select>
              </div>
              <div className="sm:col-span-2 flex items-end">
                <p className="text-[11px] text-[#1A1A1A]/70 leading-relaxed font-sans">
                  Evaluated against ICAI syllabus amendments, relevant Finance Acts, and applicable AS/Ind AS standards for this attempt.
                </p>
              </div>
            </div>
          </div>

          {/* Upload Drag & Drop Area */}
          <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
                2. Upload Answer Sheet Scans
              </h3>
              <button
                onClick={addSamplePages}
                className="text-xs font-mono text-[#1A1A1A] uppercase tracking-wider font-bold underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Mock Sheet</span>
              </button>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[#1A1A1A] bg-[#EFECE6]'
                  : 'border-[#1A1A1A]/40 hover:border-[#1A1A1A] bg-[#F9F8F6]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
              />
              <UploadCloud className="w-10 h-10 text-[#1A1A1A] mx-auto mb-3" />
              <p className="text-sm font-serif font-bold text-[#1A1A1A]">
                Drag and drop your answer sheet scans here, or click to browse
              </p>
              <p className="text-xs text-[#1A1A1A]/70 mt-1 font-sans">
                Supports JPG, PNG, and PDF. You can upload multiple pages together.
              </p>
            </div>

            {/* Uploaded Pages Grid */}
            {pages.length > 0 && (
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between text-xs text-[#1A1A1A]">
                  <span className="font-bold font-mono">
                    {pages.length} Page{pages.length > 1 ? 's' : ''} Ready for Evaluation
                  </span>
                  <button
                    onClick={() => setPages([])}
                    className="text-[#1A1A1A] hover:underline font-mono text-[11px]"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {pages.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FFFFFF] border border-[#1A1A1A] space-y-2 relative group"
                    >
                      <div className="aspect-[3/4] bg-[#F9F8F6] overflow-hidden flex items-center justify-center border border-[#1A1A1A]/20">
                        {p.fileType === 'pdf' ? (
                          <FileText className="w-12 h-12 text-[#1A1A1A]" />
                        ) : (
                          <img
                            src={p.dataUrl}
                            alt={`Page ${p.pageNumber}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#1A1A1A]">Pg {p.pageNumber}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              movePage(idx, 'UP');
                            }}
                            disabled={idx === 0}
                            className="p-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              movePage(idx, 'DOWN');
                            }}
                            disabled={idx === pages.length - 1}
                            className="p-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removePage(idx);
                            }}
                            className="p-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                            title="Remove Page"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[10px] font-mono text-[#1A1A1A]/50 truncate">{p.fileName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-[#EFECE6] border border-[#1A1A1A]">
            <div className="text-xs text-[#1A1A1A]/70 font-sans">
              <span className="font-bold text-[#1A1A1A]">Evaluation Guarantee:</span> Total score will strictly equal the arithmetic sum of question decimal marks. If an error occurs, your credit is restored.
            </div>

            <button
              onClick={handleStartEvaluation}
              disabled={pages.length === 0}
              className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#F9F8F6] bg-[#1A1A1A] hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed border border-[#1A1A1A] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run AI Evaluation Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
