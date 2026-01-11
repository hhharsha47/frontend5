"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, UploadCloud, FileText } from "lucide-react";
import { submitQuestionnaireResponse } from "@/app/actions/custom-order";

interface Question {
  id: string;
  text: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "file_upload"
    | "single_select"
    | "multi_select";
  required: boolean;
  options?: string[];
}

interface QuestionnaireResponderProps {
  questionnaireId: number;
  questions: Question[];
  title?: string;
  description?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function QuestionnaireResponder({
  questionnaireId,
  questions = [],
  title = "Additional Information Needed",
  description = "Please answer the following questions to help us process your request.",
  onSuccess,
  onCancel,
}: QuestionnaireResponderProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (id: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    // Validate
    const missing = questions.filter((q) => q.required && !answers[q.id]);

    if (missing.length > 0) {
      toast.error(
        `Please answer all required questions: ${missing
          .map((q) => q.text)
          .join(", ")}`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitQuestionnaireResponse(
        questionnaireId,
        answers
      );
      if (result.success) {
        toast.success("Response submitted successfully!");
        onSuccess();
      } else {
        toast.error("Failed to submit response.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl w-full mx-auto flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="px-8 py-6 bg-indigo-600 text-white shrink-0">
        <h2 className="text-2xl font-bold font-display">{title}</h2>
        <p className="text-indigo-100 mt-2 text-sm">{description}</p>
      </div>

      {/* Form Content */}
      <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">
        {questions.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            No questions to display.
          </div>
        ) : (
          questions.map((q, idx) => (
            <div
              key={q.id}
              className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <label className="block text-sm font-bold text-slate-800">
                <span className="text-indigo-600 mr-2">{idx + 1}.</span>
                {q.text}
                {q.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {q.type === "text" && (
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
                  placeholder="Your answer..."
                  value={answers[q.id] || ""}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                />
              )}

              {q.type === "textarea" && (
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm font-medium resize-none"
                  placeholder="Please provide details..."
                  value={answers[q.id] || ""}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                />
              )}

              {q.type === "single_select" && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleInputChange(q.id, opt)}
                      className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all text-left ${
                        answers[q.id] === opt
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-[1.02]"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === "file_upload" && (
                <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group block">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-600">
                    {answers[q.id] ? "Change File" : "Click to upload file"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports JPG, PNG, PDF
                  </p>
                  {/* Mock Upload Hidden Input */}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Limit file size to 700KB to ensure Base64 fits in Next.js Server Action limit (1MB default)
                        if (file.size > 700 * 1024) {
                          toast.error(
                            `File too large (${(file.size / 1024).toFixed(
                              0
                            )}KB). Max 700KB allowed.`
                          );
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const base64 = event.target?.result as string;
                          console.log(
                            "File read:",
                            file.name,
                            "Length:",
                            base64.length
                          );
                          // Store full file data object
                          handleInputChange(q.id, {
                            name: file.name,
                            type: file.type,
                            data: base64,
                          });
                          toast.success(`Attached: ${file.name}`);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {answers[q.id] && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                      <CheckCircle className="w-3 h-3" />
                      {typeof answers[q.id] === "object"
                        ? answers[q.id].name
                        : answers[q.id]}
                    </div>
                  )}
                </label>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-8 py-6 bg-slate-50 border-t border-slate-100 shrink-0">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Submit Response
            </>
          )}
        </button>
      </div>
    </div>
  );
}
