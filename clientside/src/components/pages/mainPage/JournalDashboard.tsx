import React, { useState, useEffect } from 'react';
import { journals, insights } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { FaHeart, FaLightbulb, FaCalendar, FaStar, FaQuoteLeft, FaRocket, FaFeatherAlt, FaMagic } from 'react-icons/fa';
import { HiOutlinePlusCircle, HiOutlineEmojiHappy, HiOutlineEmojiSad, HiOutlineTrendingUp } from 'react-icons/hi';

interface JournalEntry {
    id: number;
    content: string;
    mood_rating: number;
    created_at: string;
}

interface Insight {
    id: number;
    entry_id: number;
    keywords: string;
    moods: string;
    sentiment: string;
    key_themes: string;
}

const MoodEmoji = ({ rating }: { rating: number }) => {
    if (rating >= 8) return <span className="text-2xl">😊</span>;
    if (rating >= 6) return <span className="text-2xl">😌</span>;
    if (rating >= 4) return <span className="text-2xl">😐</span>;
    if (rating >= 2) return <span className="text-2xl">😔</span>;
    return <span className="text-2xl">😢</span>;
};

const JournalDashboard: React.FC = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [currentEntry, setCurrentEntry] = useState('');
    const [moodRating, setMoodRating] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [todayEntry, setTodayEntry] = useState<JournalEntry | null>(null);
    const [entryInsights, setEntryInsights] = useState<Insight | null>(null);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchEntries();
            checkTodayEntry();
        }
    }, [isAuthenticated]);

    const fetchEntries = async () => {
        try {
            const response = await journals.getAll();
            setEntries(response);
        } catch (err) {
            setError('Failed to fetch journal entries');
        }
    };

    const checkTodayEntry = async () => {
        try {
            const response = await journals.checkToday();
            setTodayEntry(response);
        } catch (err) {
            // It's ok if there's no today entry
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentEntry.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await journals.create(currentEntry, moodRating);
            setEntries((prev) => [response, ...prev]);
            setCurrentEntry('');
            setMoodRating(5);
            setTodayEntry(response);

            // Fetch insights for the new entry
            try {
                const insightResponse = await insights.getForEntry(response.id);
                setEntryInsights(insightResponse);
            } catch (insightErr) {
                // Insights might not be ready immediately
                console.log('Insights not ready yet');
            }
        } catch (err) {
            setError('Failed to create journal entry');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getMoodColor = (rating: number) => {
        if (rating >= 8) return 'from-emerald-400 to-green-500';
        if (rating >= 6) return 'from-yellow-400 to-orange-400';
        if (rating >= 4) return 'from-blue-400 to-indigo-500';
        if (rating >= 2) return 'from-purple-400 to-pink-500';
        return 'from-red-400 to-pink-500';
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Header */}
            <div className="glass-card p-8 animate-fade-in-up">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-h1 text-white font-bold mb-2">
                            {getGreeting()}, {user?.first_name || 'Friend'}! 👋
                        </h1>
                        <p className="text-white/80 text-body-lg">
                            How are you feeling today? Share your thoughts and let AI help you grow.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-float">
                            <FaFeatherAlt className="w-16 h-16 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="glass-card p-4 border-l-4 border-red-400 animate-shake">
                    <div className="flex items-center">
                        <div className="text-red-300 mr-3">⚠️</div>
                        <p className="text-white">{error}</p>
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Journal Entry Form */}
                <div className="xl:col-span-2 space-y-6">
                    {todayEntry ? (
                        <div className="glass-card p-8 border-l-4 border-emerald-400 animate-scale-in">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                                    <FaHeart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-h5 text-white font-semibold">Today's Entry Complete!</h3>
                                    <p className="text-white/70">You've already written your journal for today</p>
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-white/80 text-body-sm">{formatDate(todayEntry.created_at)}</span>
                                    <div className="flex items-center space-x-2">
                                        <MoodEmoji rating={todayEntry.mood_rating} />
                                        <span className="text-white font-medium">{todayEntry.mood_rating}/10</span>
                                    </div>
                                </div>
                                <p className="text-white/90 whitespace-pre-wrap">{todayEntry.content}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                                    <HiOutlinePlusCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-h5 text-white font-semibold">Write Today's Entry</h3>
                                    <p className="text-white/70">Express your thoughts and feelings</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-white font-medium mb-3">
                                        How are you feeling today?
                                    </label>
                                    <textarea
                                        value={currentEntry}
                                        onChange={(e) => setCurrentEntry(e.target.value)}
                                        className="modern-textarea w-full h-40"
                                        placeholder="Share your thoughts, experiences, and feelings..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-3">
                                        Mood Rating: {moodRating}/10
                                    </label>
                                    <div className="space-y-3">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={moodRating}
                                            onChange={(e) => setMoodRating(Number(e.target.value))}
                                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                        <div className="flex justify-between text-white/60 text-body-sm">
                                            <span>😢 Very Low</span>
                                            <span>😐 Neutral</span>
                                            <span>😊 Very High</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !currentEntry.trim()}
                                    className="btn-primary w-full flex items-center justify-center space-x-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="spinner w-5 h-5"></div>
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaMagic className="w-5 h-5" />
                                            <span>Save Entry</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* AI Insights */}
                    {entryInsights && (
                        <div className="glass-card p-8 animate-scale-in">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                    <FaLightbulb className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-h5 text-white font-semibold">AI Insights</h3>
                                    <p className="text-white/70">Powered by advanced analysis</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                                    <h4 className="text-white font-semibold mb-2 flex items-center">
                                        <FaStar className="w-4 h-4 mr-2 text-yellow-400" />
                                        Keywords
                                    </h4>
                                    <p className="text-white/80">{entryInsights.keywords}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                                    <h4 className="text-white font-semibold mb-2 flex items-center">
                                        <HiOutlineEmojiHappy className="w-4 h-4 mr-2 text-blue-400" />
                                        Moods
                                    </h4>
                                    <p className="text-white/80">{entryInsights.moods}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                                    <h4 className="text-white font-semibold mb-2 flex items-center">
                                        <HiOutlineTrendingUp className="w-4 h-4 mr-2 text-green-400" />
                                        Sentiment
                                    </h4>
                                    <p className="text-white/80">{entryInsights.sentiment}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                                    <h4 className="text-white font-semibold mb-2 flex items-center">
                                        <FaRocket className="w-4 h-4 mr-2 text-purple-400" />
                                        Key Themes
                                    </h4>
                                    <p className="text-white/80">{entryInsights.key_themes}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Entries Sidebar */}
                <div className="space-y-6">
                    <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                                <FaCalendar className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-h6 text-white font-semibold">Recent Entries</h3>
                        </div>

                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {entries.slice(0, 5).map((entry, index) => (
                                <div
                                    key={entry.id}
                                    className="bg-white/10 rounded-xl p-4 border border-white/20 transition-all duration-300 hover:bg-white/20 animate-fade-in-up"
                                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white/70 text-body-sm">
                                            {formatDate(entry.created_at)}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <MoodEmoji rating={entry.mood_rating} />
                                            <span className="text-white/80 text-body-sm">{entry.mood_rating}/10</span>
                                        </div>
                                    </div>
                                    <p className="text-white/90 text-body-sm line-clamp-3">
                                        {entry.content.substring(0, 100)}...
                                    </p>
                                </div>
                            ))}

                            {entries.length === 0 && (
                                <div className="text-center py-8">
                                    <FaQuoteLeft className="w-12 h-12 text-white/30 mx-auto mb-4" />
                                    <p className="text-white/60">No entries yet. Start your journey today!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    {entries.length > 0 && (
                        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <h3 className="text-h6 text-white font-semibold mb-4">Quick Stats</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/70">Total Entries</span>
                                    <span className="text-white font-semibold">{entries.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/70">Avg Mood</span>
                                    <span className="text-white font-semibold">
                                        {(entries.reduce((sum, entry) => sum + entry.mood_rating, 0) / entries.length).toFixed(1)}/10
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/70">This Week</span>
                                    <span className="text-white font-semibold">
                                        {entries.filter(entry => 
                                            new Date(entry.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                                        ).length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JournalDashboard;