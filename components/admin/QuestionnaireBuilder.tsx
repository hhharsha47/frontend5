"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  Image as ImageIcon,
  List,
  CheckSquare,
  Save,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { createQuestionnaire } from "@/app/actions/custom-order";
import { cn } from "@/lib/utils";

type QuestionType =
  | "text"
  | "textarea"
  | "file_upload"
  | "single_select"
  | "multi_select";

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: string[]; // For select types
}

interface QuestionnaireBuilderProps {
  orderId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function QuestionnaireBuilder({
  orderId,
  onClose,
  onSuccess,
}: QuestionnaireBuilderProps) {
  const [title, setTitle] = useState("Additional Information Needed");
  const [description, setDescription] = useState(
    "Please provide the following details so we can finalize your quote."
  );
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "",
      type: "text",
      required: true,
      options: [],
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        text: "",
        type: "text",
        required: true,
        options: [],
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length === 1) {
      toast.error("You need at least one question.");
      return;
    }
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (
    qId: string,
    optionIndex: number,
    value: string
  ) => {
    const question = questions.find((q) => q.id === qId);
    if (!question) return;

    const newOptions = [...(question.options || [])];
    newOptions[optionIndex] = value;

    updateQuestion(qId, "options", newOptions);
  };

  const addOption = (qId: string) => {
    const question = questions.find((q) => q.id === qId);
    if (!question) return;
    updateQuestion(qId, "options", [...(question.options || []), ""]);
  };

  const removeOption = (qId: string, optionIndex: number) => {
    const question = questions.find((q) => q.id === qId);
    if (!question) return;
    const newOptions = [...(question.options || [])];
    newOptions.splice(optionIndex, 1);
    updateQuestion(qId, "options", newOptions);
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Please enter a questionnaire title");
      return;
    }

    for (const q of questions) {
      if (!q.text.trim()) {
        toast.error("All questions must have text");
        return;
      }
      if (
        (q.type === "single_select" || q.type === "multi_select") &&
        (!q.options || q.options.length < 2)
      ) {
        toast.error("Choice questions must have at least 2 options");
        return;
      }
      if (q.options?.some((opt) => !opt.trim())) {
        toast.error("Please fill out all option fields");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const result = await createQuestionnaire(orderId, {
        title,
        description,
        questions,
      });

      if (result.success) {
        toast.success("Questionnaire sent to customer!");
        onSuccess();
      } else {
        toast.error("Failed to send: " + result.error);
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <List className="w-5 h-5 text-indigo-600" />
              Questionnaire Builder
            </h3>
            <p className="text-xs text-slate-500">
              Create a form for the customer to fill out
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Form Settings */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Form Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-lg font-bold border-b border-slate-200 focus:border-indigo-500 outline-none py-1 px-1 transition-all placeholder:font-normal"
                  placeholder="e.g. Reference Images Needed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Instructions / Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                  placeholder="Explain what you need from the customer..."
                  rows={2}
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group hover:border-indigo-200 transition-colors relative"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => removeQuestion(q.id)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex gap-4">
                    <div className="mt-3 text-slate-300 cursor-move">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-4">
                      {/* Question Header */}
                      <div className="flex gap-4 items-start pr-10">
                        <div className="flex-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Question {index + 1}
                          </label>
                          <input
                            value={q.text}
                            onChange={(e) =>
                              updateQuestion(q.id, "text", e.target.value)
                            }
                            className="w-full font-medium border-b border-slate-200 focus:border-indigo-500 outline-none py-1 transition-all"
                            placeholder="Type your question here..."
                            autoFocus={index === questions.length - 1} // Auto focusing new questions
                          />
                        </div>
                        <div className="w-40">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Type
                          </label>
                          <select
                            value={q.type}
                            onChange={(e) =>
                              updateQuestion(q.id, "type", e.target.value)
                            }
                            className="w-full text-sm border border-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500 bg-white"
                          >
                            <option value="text">Short Text</option>
                            <option value="textarea">Long Text</option>
                            <option value="file_upload">File Upload</option>
                            <option value="single_select">Single Choice</option>
                            <option value="multi_select">
                              Multiple Choice
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Dynamic Options for Select Types */}
                      {(q.type === "single_select" ||
                        q.type === "multi_select") && (
                        <div className="pl-4 border-l-2 border-slate-100 space-y-2">
                          <label className="block text-xs font-bold text-slate-400">
                            Options
                          </label>
                          {q.options?.map((opt, optIndex) => (
                            <div
                              key={optIndex}
                              className="flex gap-2 items-center"
                            >
                              <div
                                className={cn(
                                  "w-4 h-4 border-2 border-slate-200 rounded-sm",
                                  q.type === "single_select"
                                    ? "rounded-full"
                                    : "rounded-sm"
                                )}
                              ></div>
                              <input
                                value={opt}
                                onChange={(e) =>
                                  handleOptionChange(
                                    q.id,
                                    optIndex,
                                    e.target.value
                                  )
                                }
                                className="flex-1 text-sm border-b border-dashed border-slate-200 focus:border-indigo-500 outline-none py-1 bg-transparent"
                                placeholder={`Option ${optIndex + 1}`}
                              />
                              <button
                                onClick={() => removeOption(q.id, optIndex)}
                                className="text-slate-300 hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addOption(q.id)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-2"
                          >
                            <Plus className="w-3 h-3" /> Add Option
                          </button>
                        </div>
                      )}

                      {/* Footer Actions per Question */}
                      <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600 select-none">
                          <div
                            className={cn(
                              "w-4 h-4 border-2 rounded transition-colors flex items-center justify-center",
                              q.required
                                ? "bg-indigo-600 border-indigo-600"
                                : "border-slate-300"
                            )}
                          >
                            {q.required && (
                              <CheckSquare className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={(e) =>
                              updateQuestion(q.id, "required", e.target.checked)
                            }
                            className="hidden"
                          />
                          Required
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addQuestion}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center">
          <div className="text-xs text-slate-400 font-medium">
            {questions.length} question{questions.length !== 1 ? "s" : ""} •
            Estimated time: {Math.ceil(questions.length * 1.5)} mins
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Questionnaire
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
