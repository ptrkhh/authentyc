import React from 'react';
import { Briefcase, Heart, Rocket } from 'lucide-react';
import { SwipeDeck } from './swipe/SwipeDeck';

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
    onJoinWaitlist: (category: Category) => void; // required: wires the end-of-deck CTA to the waitlist modal
    onReset: () => void;
    insights: {
        overall_vibe: string;
        insights: string[];
    };
}

export function SimulationResults({
    characters,
    category,
    onJoinWaitlist,
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
                <p className="text-gray-300 max-w-2xl mx-auto">
                    These matches are generated based on your unique communication style and personality.
                </p>
            </div>

            <div className="max-w-xl mx-auto pt-2">
                <SwipeDeck
                    characters={characters}
                    category={category}
                    onJoinWaitlist={onJoinWaitlist}
                    onReset={onReset}
                />
            </div>
        </div>
    );
}
