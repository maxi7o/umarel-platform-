import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, FileSignature, Hash, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContractSnapshot {
    sliceTitle: string;
    sliceDescription: string;
    agreedPrice: number;
    currency?: string;
    acceptedAt: string;
    termsVersion: string;
}

interface ContractCertificateProps {
    id: string;
    contractHash: string;
    snapshot: ContractSnapshot;
    providerName: string;
    clientName: string;
    createdAt: Date;
    locale?: string;
}

export function ContractCertificate({
    id,
    contractHash,
    snapshot,
    providerName,
    clientName,
    createdAt,
    locale = 'en'
}: ContractCertificateProps) {
    const formattedDate = new Intl.DateTimeFormat(locale, {
        dateStyle: 'long',
        timeStyle: 'short'
    }).format(new Date(snapshot.acceptedAt || createdAt));

    const priceFormatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: snapshot.currency || 'USD' // Default to USD or infer
    }).format(snapshot.agreedPrice);

    return (
        <Card className="w-full max-w-3xl mx-auto border-2 border-slate-200 shadow-xl bg-[#fffbf0] md:p-8 print:border-4 print:shadow-none">
            {/* Watermark effect could go here */}

            <CardHeader className="text-center space-y-4 pb-2">
                <div className="flex justify-center mb-4">
                    <div className="h-20 w-20 bg-slate-900 rounded-full flex items-center justify-center border-4 border-double border-orange-200">
                        <ShieldCheck className="h-10 w-10 text-orange-400" />
                    </div>
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight uppercase">
                        Digital Service Agreement
                    </h1>
                    <p className="text-slate-500 font-medium tracking-widest text-xs uppercase mt-2">
                        Secured by Umarel Protocol
                    </p>
                </div>
                <div className="flex justify-center items-center gap-2">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Critically Verified
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-8 pt-6">

                {/* Parties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white/50 border border-slate-100 rounded-lg">
                    <div className="space-y-1">
                        <span className="text-xs uppercase text-slate-400 font-bold">Provider (Service)</span>
                        <p className="text-lg font-semibold text-slate-900">{providerName}</p>
                        <p className="text-xs text-slate-500 font-mono">Signatory ID: ***</p>
                    </div>
                    <div className="space-y-1 md:text-right">
                        <span className="text-xs uppercase text-slate-400 font-bold">Client (Requester)</span>
                        <p className="text-lg font-semibold text-slate-900">{clientName}</p>
                    </div>
                </div>

                {/* Terms */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-1">
                            Agreement Scope
                        </h3>
                        <p className="text-xl font-medium text-slate-800">
                            {snapshot.sliceTitle}
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            {snapshot.sliceDescription}
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-100 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-medium">Agreed Value:</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-900">{priceFormatted}</span>
                    </div>
                </div>

                {/* Hash / Security */}
                <div className="bg-slate-900 text-slate-200 p-4 rounded-md space-y-3 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Hash size={100} />
                    </div>

                    <div className="flex items-center gap-2 text-orange-400 text-sm font-bold uppercase tracking-wider">
                        <FileSignature className="w-4 h-4" />
                        Ricardian Contract Hash (SHA-256)
                    </div>

                    <code className="block font-mono text-xs md:text-sm break-all text-slate-400 bg-black/30 p-3 rounded border border-white/10 select-all">
                        {contractHash}
                    </code>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Signed: {formattedDate}
                        </div>
                        <span>v{snapshot.termsVersion || '1.0'}</span>
                    </div>
                </div>

            </CardContent>

            <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
                <div className="text-xs text-slate-400 max-w-xs">
                    This document is an immutable representation of the digital agreement stored in the Umarel database.
                </div>
                <Button variant="outline" size="sm" className="gap-2 print:hidden" onClick={() => window.print()}>
                    <Download size={14} />
                    Download PDF
                </Button>
            </CardFooter>
        </Card>
    );
}

function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
        </svg>
    )
}
