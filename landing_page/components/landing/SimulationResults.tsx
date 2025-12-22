import React from 'react';
import { Check, AlertTriangle, Briefcase, Heart, Rocket, Sparkles } from 'lucide-react';

export type Category = 'hiring' | 'dating' | 'cofounder';

export interface SimulatedCharacter {
    id: string;
    name: string;
    role: string; // Job title, "Potential Partner", "Co-founder"
    avatarColor: string;
    matchScore: number;
    alignment: string[];
    challenges: string[];
    category: Category;
}

interface SimulationResultsProps {
    characters: SimulatedCharacter[];
    category: Category;
    onReset: () => void;
    insights: {
        overall_vibe: string;
        insights: string[];
    };
}

export function SimulationResults({
    characters,
    category,
    onReset,
    insights
}: SimulationResultsProps) {
    const getCategoryIcon = () => {
        switch (category) {
            case 'hiring': return <Briefcase className="w-5 h-5" />;
            case 'dating': return <Heart className="w-5 h-5" />;
            case 'cofounder': return <Rocket className="w-5 h-5" />;
        }
    };

    const getCategoryLabel = () => {
        switch (category) {
            case 'hiring': return 'Job Matches';
            case 'dating': return 'Potential Partners';
            case 'cofounder': return 'Co-founder Matches';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Insights Section at Top */}
            <div className="max-w-4xl mx-auto space-y-4 mb-8">
                <div className="bg-gradient-to-r from-brand-primary/20 to-brand-primary/10 p-6 rounded-xl border border-brand-primary/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <h3 className="text-xl font-bold mb-2 text-gray-100 flex items-center gap-2">
                        <span className="text-2xl">✨</span>
                        Your Personality Analysis
                    </h3>
                    <p className="text-lg text-gray-200 font-medium">{insights.overall_vibe}</p>
                </div>

                <div className="grid gap-3">
                    {insights.insights?.map((insight: string, index: number) => (
                        <div
                            key={index}
                            className="bg-dark-800/50 border border-white/10 p-4 rounded-lg shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-shadow"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-brand-primary font-bold text-lg mt-0.5">
                                    {index + 1}
                                </span>
                                <p className="text-gray-300 flex-1">{insight}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="max-w-4xl mx-auto">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-brand-primary/30"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-dark-850 px-4 text-sm text-gray-400 font-medium">
                            Based on your personality, here are your matches
                        </span>
                    </div>
                </div>
            </div>

            {/* Character Matches Section */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-brand-primary font-medium text-sm">
                    {getCategoryIcon()}
                    <span>{getCategoryLabel()}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-100">Your Personalized Matches</h3>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    These matches are generated based on your unique communication style and personality.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {characters.map((char) => (
                    <div key={char.id} className="relative bg-dark-800/50 border border-white/10 rounded-xl overflow-hidden hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:border-brand-primary/30 transition-all duration-300 flex flex-col">
                        {/* Example Badge */}
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-700/90 backdrop-blur-sm border border-gray-600/50 shadow-lg">
                            <Sparkles className="w-3.5 h-3.5 text-gray-300" />
                            <span className="text-xs font-semibold text-gray-200 tracking-wide">EXAMPLE</span>
                        </div>

                        {/* Header */}
                        <div className={`pt-12 p-4 ${char.avatarColor} bg-opacity-20 flex items-center gap-4 border-b border-white/10`}>
                            <div className={`w-12 h-12 rounded-full ${char.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(0,0,0,0.3)]`}>
                                {char.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-100">{char.name}</h4>
                                <p className="text-sm text-gray-400">{char.role}</p>
                            </div>
                            <div className="ml-auto flex flex-col items-end">
                                <span className="text-2xl font-bold text-brand-primary">{char.matchScore}%</span>
                                <span className="text-xs text-gray-500">Match</span>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4 flex-1 flex flex-col">
                            <div>
                                <h5 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-400" />
                                    Why you align
                                </h5>
                                <ul className="space-y-2">
                                    {char.alignment.map((point, idx) => (
                                        <li key={idx} className="text-sm text-gray-400 leading-relaxed pl-2 border-l-2 border-green-500/30">
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-auto pt-4 border-t border-white/10">
                                <h5 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                                    Potential Challenges
                                </h5>
                                <ul className="space-y-2">
                                    {char.challenges.map((point, idx) => (
                                        <li key={idx} className="text-sm text-gray-400 leading-relaxed pl-2 border-l-2 border-amber-500/30">
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <button className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transform hover:-translate-y-0.5">
                    Get Real Matches → Join Waitlist
                </button>
                <button
                    onClick={onReset}
                    className="px-8 py-4 rounded-lg border border-white/20 text-gray-300 hover:bg-dark-800 hover:border-brand-primary/50 font-medium transition-all"
                >
                    Try Another Category
                </button>
            </div>
        </div>
    );
}
