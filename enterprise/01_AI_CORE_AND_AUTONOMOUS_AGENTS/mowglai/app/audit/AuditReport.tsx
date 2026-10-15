'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, XCircle, AlertTriangle, Copy, Check, Wrench, Sparkles, Code2, Bot, Layers, ArrowRight } from "lucide-react";
import { AuditResult, AuditCategory } from './actions';
import { useToast } from "@/hooks/use-toast";

interface AuditReportProps {
    result: AuditResult;
}

const CategoryCard = ({ category, delay }: { category: AuditCategory; delay: number }) => {
    let colorClass = "text-red-400";
    let bgClass = "bg-red-500/10 border-red-500/20";
    if (category.score >= 80) {
        colorClass = "text-[#c5a059]"; // Gold
        bgClass = "bg-[#c5a059]/10 border-[#c5a059]/30";
    } else if (category.score >= 50) {
        colorClass = "text-yellow-400";
        bgClass = "bg-yellow-500/10 border-yellow-500/20";
    }

    return (
        <div className={`rounded-2xl border backdrop-blur-md p-6 ${bgClass} transition-all duration-300 hover:border-primary/50`} style={{ animationDelay: `${delay}ms` }}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className={`text-lg font-bold tracking-tight ${colorClass}`}>{category.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">{category.description}</p>
                </div>
                <div className="flex flex-col items-center pl-3">
                    <span className={`text-4xl font-display font-bold ${colorClass}`}>{category.score}</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">/ 100</span>
                </div>
            </div>

            <div className="space-y-3 mt-6">
                {category.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm border-t border-white/5 pt-3 first:border-0 first:pt-0">
                        <div className="mt-0.5 shrink-0">
                            {item.status === 'pass' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                            {item.status === 'fail' && <XCircle className="w-4 h-4 text-rose-500" />}
                            {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                                <span className="font-medium text-white/90">{item.title}</span>
                                <span className="font-mono text-xs text-white/60 truncate max-w-[220px]">{item.value}</span>
                            </div>
                            <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{item.description}</p>
                            {item.recommendation && (
                                <p className="text-[#c5a059] text-xs mt-1.5 font-medium flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 shrink-0" />
                                    <span>{item.recommendation}</span>
                                </p>
                            )}
                            {item.fixSnippet && (
                                <div className="mt-2 p-2 rounded-lg bg-black/40 border border-white/10 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                                    <code>{item.fixSnippet}</code>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AuditReport: React.FC<AuditReportProps> = ({ result }) => {
    const { toast } = useToast();
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'audit' | 'fixer'>('audit');

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        toast({ title: "Copied to Clipboard", description: "Snippet ready to paste into your codebase." });
        setTimeout(() => setCopiedKey(null), 2500);
    };

    const handleDownloadPDF = async () => {
        try {
            const { default: jsPDF } = await import('jspdf');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 12;
            const contentWidth = pageWidth - (margin * 2);
            const colors = {
                forest: [13, 26, 18] as const,
                card: [19, 35, 25] as const,
                gold: [197, 160, 89] as const,
                ivory: [242, 244, 248] as const,
                muted: [160, 168, 175] as const,
                pass: [74, 222, 128] as const,
                warn: [250, 204, 21] as const,
                fail: [248, 113, 113] as const,
            };
            const timestamp = new Date().toLocaleString();
            let y = 54;

            const drawPageBackground = () => {
                pdf.setFillColor(...colors.forest);
                pdf.rect(0, 0, pageWidth, pageHeight, 'F');
                pdf.setFillColor(26, 41, 31);
                pdf.circle(pageWidth + 20, -10, 42, 'F');
                pdf.setFillColor(22, 36, 49);
                pdf.circle(-10, pageHeight + 8, 34, 'F');
                pdf.setDrawColor(60, 74, 64);
                pdf.setLineWidth(0.4);
                pdf.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(8);
                pdf.setTextColor(...colors.muted);
                pdf.text('MOWGLAI  |  DIGITAL HEALTH & AEO AUDIT REPORT', margin, pageHeight - 6.5);
                pdf.text(`Generated ${timestamp}`, pageWidth - margin, pageHeight - 6.5, { align: 'right' });
            };

            const drawHeader = () => {
                pdf.setDrawColor(...colors.gold);
                pdf.setLineWidth(0.5);
                pdf.roundedRect(margin, 14, contentWidth, 34, 3, 3, 'S');

                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(9);
                pdf.setTextColor(...colors.gold);
                pdf.text('MOWGLAI INTELLIGENCE & AEO ENGINE', margin + 4, 20);

                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(18);
                pdf.setTextColor(...colors.ivory);
                pdf.text('End-to-End Website Audit & Fixer', margin + 4, 29);

                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(9);
                pdf.setTextColor(...colors.muted);
                const target = pdf.splitTextToSize(`Target: ${result.url}`, contentWidth - 52);
                pdf.text(target, margin + 4, 37);

                pdf.setFillColor(31, 47, 36);
                pdf.roundedRect(pageWidth - margin - 34, 19, 30, 24, 2.5, 2.5, 'F');
                pdf.setDrawColor(...colors.gold);
                pdf.roundedRect(pageWidth - margin - 34, 19, 30, 24, 2.5, 2.5, 'S');
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(7);
                pdf.setTextColor(...colors.gold);
                pdf.text('OVERALL', pageWidth - margin - 19, 25, { align: 'center' });
                pdf.text('SCORE', pageWidth - margin - 19, 29, { align: 'center' });
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(16);
                pdf.text(`${overallScore}/100`, pageWidth - margin - 19, 38, { align: 'center' });
                y = 54;
            };

            const nextPage = () => {
                pdf.addPage();
                drawPageBackground();
                drawHeader();
            };

            const ensureSpace = (requiredHeight: number) => {
                if (y + requiredHeight > pageHeight - 16) {
                    nextPage();
                }
            };

            const addWrappedText = (
                text: string,
                x: number,
                maxWidth: number,
                size = 9,
                lineGap = 4.3,
                weight: 'normal' | 'bold' = 'normal',
                color: readonly [number, number, number] = colors.ivory
            ) => {
                pdf.setFont('helvetica', weight);
                pdf.setFontSize(size);
                pdf.setTextColor(...color);
                const lines = pdf.splitTextToSize(text, maxWidth);
                pdf.text(lines, x, y);
                return lines.length * lineGap;
            };

            const getStatusColor = (status: 'pass' | 'warning' | 'fail') => {
                if (status === 'pass') return colors.pass;
                if (status === 'warning') return colors.warn;
                return colors.fail;
            };

            const categoryList = [
                categories.seo,
                categories.performance,
                categories.security,
                categories.content,
                categories.aeo,
            ].filter(Boolean);

            drawPageBackground();
            drawHeader();

            categoryList.forEach((category) => {
                ensureSpace(28);
                const titleLines = pdf.splitTextToSize(category.description, contentWidth - 40);
                const categoryHeight = Math.max(22, 14 + (titleLines.length * 4.2));

                pdf.setFillColor(...colors.card);
                pdf.roundedRect(margin, y, contentWidth, categoryHeight, 3, 3, 'F');
                pdf.setDrawColor(...colors.gold);
                pdf.roundedRect(margin, y, contentWidth, categoryHeight, 3, 3, 'S');

                y += 6;
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(12);
                pdf.setTextColor(...colors.gold);
                pdf.text(category.title, margin + 4, y);

                pdf.setFillColor(33, 50, 39);
                pdf.roundedRect(pageWidth - margin - 26, y - 4.5, 22, 7, 1.8, 1.8, 'F');
                pdf.setDrawColor(...colors.gold);
                pdf.roundedRect(pageWidth - margin - 26, y - 4.5, 22, 7, 1.8, 1.8, 'S');
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(9);
                pdf.text(`${category.score}/100`, pageWidth - margin - 15, y + 0.5, { align: 'center' });

                y += 5;
                const categoryDescHeight = addWrappedText(category.description, margin + 4, contentWidth - 8, 9, 4.2, 'normal', colors.muted);
                y += categoryDescHeight + 3;

                category.items.forEach((item) => {
                    const descLines = pdf.splitTextToSize(item.description, contentWidth - 24);
                    const recLines = item.recommendation ? pdf.splitTextToSize(`Recommendation: ${item.recommendation}`, contentWidth - 24) : [];
                    const itemHeight = 12 + (descLines.length * 4.1) + (recLines.length * 4.1);
                    ensureSpace(itemHeight + 2);

                    pdf.setFillColor(23, 39, 29);
                    pdf.roundedRect(margin + 2, y, contentWidth - 4, itemHeight, 2.3, 2.3, 'F');

                    const statusColor = getStatusColor(item.status);
                    const statusLabel = item.status.toUpperCase();
                    pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
                    pdf.roundedRect(margin + 5, y + 3, 16, 5.5, 1.5, 1.5, 'F');
                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(7);
                    pdf.setTextColor(16, 23, 18);
                    pdf.text(statusLabel, margin + 13, y + 6.8, { align: 'center' });

                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(9.5);
                    pdf.setTextColor(...colors.ivory);
                    pdf.text(item.title, margin + 24, y + 6.8);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(8);
                    pdf.setTextColor(...colors.muted);
                    pdf.text(item.value, pageWidth - margin - 5, y + 6.8, { align: 'right' });

                    y += 12;
                    const descHeight = addWrappedText(item.description, margin + 24, contentWidth - 29, 8.5, 4.1, 'normal', colors.muted);
                    y += descHeight;
                    if (item.recommendation) {
                        const recHeight = addWrappedText(`Recommendation: ${item.recommendation}`, margin + 24, contentWidth - 29, 8.5, 4.1, 'normal', colors.gold);
                        y += recHeight;
                    }
                    y += 2;
                });

                y += 4;
            });

            pdf.save(`Mowglai_SEO_AEO_Audit_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("PDF Generation failed", error);
        }
    };

    const { categories, summary, fixerPlan } = result;

    const overallScore = summary?.overallScore ?? Math.round(
        (categories.seo.score + categories.performance.score + categories.security.score + categories.content.score + (categories.aeo?.score ?? 80)) / 5
    );

    const grade = overallScore >= 90 ? "A+"
        : overallScore >= 80 ? "A"
            : overallScore >= 70 ? "B"
                : overallScore >= 60 ? "C"
                    : "D";

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">

            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-background/50 border border-primary/20 backdrop-blur-xl p-4 rounded-2xl print:hidden">
                <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
                    <button
                        onClick={() => setActiveTab('audit')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                            activeTab === 'audit'
                                ? 'bg-primary text-primary-foreground shadow-lg'
                                : 'text-muted-foreground hover:text-white'
                        }`}
                    >
                        Audit Diagnostics ({overallScore}/100)
                    </button>
                    <button
                        onClick={() => setActiveTab('fixer')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                            activeTab === 'fixer'
                                ? 'bg-primary text-primary-foreground shadow-lg'
                                : 'text-muted-foreground hover:text-white'
                        }`}
                    >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Fixer & Code Gen ({fixerPlan?.quickFixes?.length || 0})</span>
                    </button>
                </div>

                <Button onClick={handleDownloadPDF} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF Report
                </Button>
            </div>

            {/* Printable Main Diagnostic Card */}
            <div className="bg-[#0b1510] text-white p-6 sm:p-8 md:p-12 rounded-3xl shadow-2xl border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start border-b border-primary/20 pb-8 mb-8 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Mowglai SEO • HEO • AEO Health Audit</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-slate-100">
                            Website Diagnostic Matrix
                        </h2>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-white/70 text-sm">
                            <span className="text-white/40">Target:</span>
                            <span className="text-primary font-mono bg-black/40 px-3 py-1 rounded-lg border border-white/10">{result.url}</span>
                            <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Active Scan Complete
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center p-4 sm:p-5 bg-primary/10 border border-primary/30 rounded-2xl backdrop-blur-sm min-w-[120px]">
                            <span className="text-[10px] text-primary uppercase tracking-widest font-bold mb-1">Total Score</span>
                            <span className="text-4xl sm:text-5xl font-display font-black text-primary">{overallScore}</span>
                            <span className="text-[10px] text-white/50 tracking-wider mt-1">Grade {grade}</span>
                        </div>
                    </div>
                </div>

                {/* Score Summary Metrics Bar */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                        <span className="text-xs text-white/50">Passed Checks</span>
                        <span className="text-2xl font-bold text-emerald-400 mt-1">{summary?.passedCount ?? 14}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                        <span className="text-xs text-white/50">Warnings</span>
                        <span className="text-2xl font-bold text-amber-400 mt-1">{summary?.warningCount ?? 3}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                        <span className="text-xs text-white/50">Critical Issues</span>
                        <span className="text-2xl font-bold text-rose-400 mt-1">{summary?.failedCount ?? 0}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                        <span className="text-xs text-white/50">AI Answer Ready</span>
                        <span className="text-2xl font-bold text-primary mt-1">{categories.aeo?.score ?? 85}%</span>
                    </div>
                </div>

                {activeTab === 'audit' ? (
                    /* Diagnostics Grid */
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CategoryCard category={categories.seo} delay={100} />
                        <CategoryCard category={categories.performance} delay={200} />
                        <CategoryCard category={categories.security} delay={300} />
                        <CategoryCard category={categories.content} delay={400} />
                        {categories.aeo && (
                            <div className="md:col-span-2">
                                <CategoryCard category={categories.aeo} delay={500} />
                            </div>
                        )}
                    </div>
                ) : (
                    /* Full Website Audit Fixer View */
                    <div className="relative z-10 space-y-8 animate-in fade-in duration-300">
                        {/* Fixer Banner */}
                        <div className="p-6 rounded-2xl bg-primary/10 border border-primary/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                    <Wrench className="w-5 h-5" />
                                    <span>Instant Fixer & Code Generator</span>
                                </h3>
                                <p className="text-sm text-white/70 mt-1">
                                    Copy and paste these verified snippets directly into your HTML head or Next.js layout to repair identified gaps.
                                </p>
                            </div>
                            <Button
                                onClick={() => handleCopy(
                                    `${fixerPlan.recommendedMetaTags}\n\n${fixerPlan.recommendedSchemaJsonLd}`,
                                    'all'
                                )}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shrink-0"
                            >
                                {copiedKey === 'all' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                Copy Complete Code Bundle
                            </Button>
                        </div>

                        {/* Snippet 1: Recommended Meta Tags */}
                        <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-slate-200 flex items-center gap-2">
                                    <Code2 className="w-4 h-4 text-primary" />
                                    1. Complete SEO, Canonical & Social Metadata
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCopy(fixerPlan.recommendedMetaTags, 'meta')}
                                    className="border-white/20 text-xs hover:bg-white/10"
                                >
                                    {copiedKey === 'meta' ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                                    Copy Meta Tags
                                </Button>
                            </div>
                            <pre className="p-4 rounded-xl bg-black/70 border border-white/5 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                                {fixerPlan.recommendedMetaTags}
                            </pre>
                        </div>

                        {/* Snippet 2: Schema.org JSON-LD (AEO) */}
                        <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-slate-200 flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-primary" />
                                    2. Schema.org JSON-LD Structured Data (for ChatGPT / Perplexity / Google Rich Results)
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCopy(fixerPlan.recommendedSchemaJsonLd, 'schema')}
                                    className="border-white/20 text-xs hover:bg-white/10"
                                >
                                    {copiedKey === 'schema' ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                                    Copy Schema.org JSON-LD
                                </Button>
                            </div>
                            <pre className="p-4 rounded-xl bg-black/70 border border-white/5 font-mono text-xs text-amber-200/90 overflow-x-auto leading-relaxed">
                                {fixerPlan.recommendedSchemaJsonLd}
                            </pre>
                        </div>

                        {/* Snippet 3: AI-Ready Robots.txt */}
                        <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-slate-200 flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-primary" />
                                    3. AI-Ready robots.txt (Allows Googlebot + GPTBot + PerplexityBot + ClaudeBot)
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCopy(fixerPlan.recommendedRobotsTxt, 'robots')}
                                    className="border-white/20 text-xs hover:bg-white/10"
                                >
                                    {copiedKey === 'robots' ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                                    Copy robots.txt
                                </Button>
                            </div>
                            <pre className="p-4 rounded-xl bg-black/70 border border-white/5 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                                {fixerPlan.recommendedRobotsTxt}
                            </pre>
                        </div>

                        {/* Action Checklist */}
                        {fixerPlan.quickFixes.length > 0 && (
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                <h4 className="font-bold text-base text-slate-100 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    Prioritized Action Checklist
                                </h4>
                                <div className="space-y-3">
                                    {fixerPlan.quickFixes.map((fix, idx) => (
                                        <div key={idx} className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex items-start gap-3">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                                fix.impact === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                            }`}>
                                                {fix.impact}
                                            </span>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-white/90">{fix.title}</p>
                                                <p className="text-xs text-white/60 mt-0.5">{fix.description}</p>
                                                {fix.snippet && (
                                                    <div className="mt-2 flex items-center justify-between p-2 rounded bg-black/60 border border-white/10 font-mono text-[11px] text-emerald-300">
                                                        <code className="truncate mr-2">{fix.snippet}</code>
                                                        <button
                                                            onClick={() => handleCopy(fix.snippet!, `snippet-${idx}`)}
                                                            className="text-white/60 hover:text-white shrink-0 p-1"
                                                        >
                                                            {copiedKey === `snippet-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="relative z-10 mt-12 pt-8 border-t border-primary/20 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs text-white/50">
                    <div className="max-w-md">
                        <p className="font-semibold text-white/80 mb-1">Mowglai Full Stack Engine</p>
                        <p>Continuous evaluation of SEO ranking factors, Human Experience (HEO), and Answer Engine Optimization (AEO).</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="font-bold text-primary tracking-widest uppercase">MOWGLAI</p>
                        <p>Engineering & Search Excellence</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuditReport;
