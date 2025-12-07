import React from 'react';
import { Check, AlertTriangle, Briefcase, Heart, Rocket } from 'lucide-react';

export type Category = 'hiring' | 'dating' | 'founder';

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
}

export function SimulationResults({ characters, category, onReset }: SimulationResultsProps) {
    const getCategoryIcon = () => {
        switch (category) {
            case 'hiring': return <Briefcase className="w-5 h-5" />;
            case 'dating': return <Heart className="w-5 h-5" />;
            case 'founder': return <Rocket className="w-5 h-5" />;
        }
    };

    const getCategoryLabel = () => {
        switch (category) {
            case 'hiring': return 'Job Matches';
            case 'dating': return 'Potential Partners';
            case 'founder': return 'Co-founder Matches';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary font-medium text-sm">
                    {getCategoryIcon()}
                    <span>{getCategoryLabel()}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Your Simulated Matches</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Based on your communication style, here are 5 diverse profiles and how you&apos;d likely interact with them.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {characters.map((char) => (
                    <div key={char.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        {/* Header */}
                        <div className={`p-4 ${char.avatarColor} bg-opacity-10 flex items-center gap-4`}>
                            <div className={`w-12 h-12 rounded-full ${char.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-sm`}>
                                {char.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{char.name}</h4>
                                <p className="text-sm text-gray-600">{char.role}</p>
                            </div>
                            <div className="ml-auto flex flex-col items-end">
                                <span className="text-2xl font-bold text-brand-primary">{char.matchScore}%</span>
                                <span className="text-xs text-gray-500">Match</span>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4 flex-1 flex flex-col">
                            <div>
                                <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    Why you align
                                </h5>
                                <ul className="space-y-2">
                                    {char.alignment.map((point, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 leading-relaxed pl-2 border-l-2 border-green-100">
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-100">
                                <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    Potential Challenges
                                </h5>
                                <ul className="space-y-2">
                                    {char.challenges.map((point, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 leading-relaxed pl-2 border-l-2 border-amber-100">
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
                <button className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Get Real Matches → Join Waitlist
                </button>
                <button
                    onClick={onReset}
                    className="px-8 py-4 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                >
                    Try Another Category
                </button>
            </div>
        </div>
    );
}
