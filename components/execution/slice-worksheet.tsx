"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { CheckCircle2, Circle, Camera, AlertTriangle, MessageSquare, ChevronDown, ChevronUp, Shovel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock Data for the "Recipe"
const MOCK_STEPS = [
    {
        id: 1,
        title: "Site Preparation & Protection",
        description: "Cover the floors and seal the kitchen entrance to prevent dust migration.",
        status: "completed",
        umarelNote: {
            type: "warning",
            content: "Watch out for the parquet floor! Use double-layer cardboard, not just plastic. Dust travels everywhere."
        },
        requiresProof: true,
        proofUploaded: true
    },
    {
        id: 2,
        title: "Demolition of Old Sink",
        description: "Disconnect water supply and carefully remove the existing ceramic sink.",
        status: "in_progress",
        umarelNote: {
            type: "tip",
            content: "Close the main water valve first. Keep a bucket handy for the P-trap residue."
        },
        requiresProof: true,
        proofUploaded: false
    },
    {
        id: 3,
        title: "Countertop Cutting",
        description: "Enlarge the hole for the new double-basin sink.",
        status: "pending",
        umarelNote: null,
        requiresProof: true,
        proofUploaded: false
    },
    {
        id: 4,
        title: "Silicon Sealing",
        description: "Apply anti-mold silicon to the perimeter.",
        status: "pending",
        umarelNote: {
            type: "critical",
            content: "Do NOT use white silicon on black granite. Use translucent or matching black. Ensure the surface is 100% dry."
        },
        requiresProof: true, // "No photo, no next step"
        proofUploaded: false
    }
];

export function SliceWorksheet({ sliceId }: { sliceId: string }) {
    const t = useTranslations('execution');
    const [openStep, setOpenStep] = useState<number | null>(2); // Default to current step
    const completedSteps = MOCK_STEPS.filter(s => s.status === "completed").length;
    const progress = (completedSteps / MOCK_STEPS.length) * 100;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-100 flex items-center gap-2">
                            <Shovel className="w-6 h-6 text-orange-500" />
                            Kitchen Sink Replacement
                        </h1>
                        <p className="text-stone-400 text-sm mt-1">Slice #{sliceId.substring(0, 6)} • Belgrano, CABA</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-stone-300">{t('status')}</div>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-200 border border-blue-800">
                            {t('inProgress')}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-stone-400">
                        <span>{t('progress')}</span>
                        <span>{Math.round(progress)}% ({completedSteps}/{MOCK_STEPS.length} {t('steps')})</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-stone-800" />
                </div>
            </div>

            {/* Steps List */}
            <div className="space-y-4">
                {MOCK_STEPS.map((step, index) => {
                    const isOpen = openStep === step.id;
                    const isCompleted = step.status === "completed";
                    const isCurrent = step.status === "in_progress";
                    const isLocked = step.status === "pending" && !isCompleted && !isCurrent;

                    return (
                        <div
                            key={step.id}
                            className={cn(
                                "border rounded-xl transition-all duration-200 overflow-hidden",
                                isCurrent ? "border-orange-500/50 bg-stone-900/50 ring-1 ring-orange-500/20" : "border-stone-800 bg-stone-900",
                                isCompleted ? "opacity-75" : ""
                            )}
                        >
                            {/* Step Header */}
                            <div
                                className="flex items-center p-4 cursor-pointer hover:bg-stone-800/50"
                                onClick={() => setOpenStep(isOpen ? null : step.id)}
                            >
                                <div className="mr-4">
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    ) : isCurrent ? (
                                        <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                        </div>
                                    ) : (
                                        <Circle className="w-6 h-6 text-stone-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className={cn("font-semibold text-stone-100", isCompleted && "text-stone-400 line-through")}>
                                        {step.title}
                                    </h3>
                                </div>
                                {isOpen ? <ChevronUp className="w-5 h-5 text-stone-500" /> : <ChevronDown className="w-5 h-5 text-stone-500" />}
                            </div>

                            {/* Step Body */}
                            {isOpen && (
                                <div className="px-4 pb-6 ml-10 border-l border-stone-800/50 space-y-6">
                                    <p className="text-stone-300">{step.description}</p>

                                    {/* Umarel Note */}
                                    {step.umarelNote && (
                                        <div className={cn(
                                            "p-4 rounded-lg border flex gap-3 text-sm",
                                            step.umarelNote.type === "critical" ? "bg-red-950/20 border-red-900/50 text-red-200" :
                                                step.umarelNote.type === "warning" ? "bg-yellow-950/20 border-yellow-900/50 text-yellow-200" :
                                                    "bg-blue-950/20 border-blue-900/50 text-blue-200"
                                        )}>
                                            <AlertTriangle className="w-5 h-5 shrink-0" />
                                            <div>
                                                <span className="font-bold block mb-1">
                                                    {step.umarelNote.type === "critical" ? t('umarelCriticalAlert') : t('umarelWisdom')}:
                                                </span>
                                                {step.umarelNote.content}
                                            </div>
                                        </div>
                                    )}

                                    {/* Proof of Work */}
                                    {step.requiresProof && (
                                        <div className="bg-stone-950 rounded-lg p-4 border border-stone-800">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-stone-400 text-sm font-medium">Proof of Truth Required</span>
                                                {step.proofUploaded ? (
                                                    <span className="text-green-500 text-xs flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="text-orange-500 text-xs">Pending Upload</span>
                                                )}
                                            </div>

                                            {step.proofUploaded ? (
                                                <div className="h-24 w-full bg-stone-800 rounded-md flex items-center justify-center border border-stone-700">
                                                    <span className="text-stone-500 text-xs">Image_2025...jpg</span>
                                                </div>
                                            ) : (
                                                <Button variant="outline" className="w-full gap-2 border-dashed border-stone-700 hover:bg-stone-800 hover:border-stone-600 h-24">
                                                    <Camera className="w-6 h-6 text-stone-400" />
                                                    <span className="text-stone-400">{t('tapCapture')}</span>
                                                </Button>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-2">
                                        <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" disabled={!isCurrent}>
                                            {t('completeStep')}
                                        </Button>
                                        <Button variant="ghost" className="text-stone-400 hover:text-stone-300">
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            {t('summonUmarel')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
