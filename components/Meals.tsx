import React, { useState, useRef } from 'react';
import { Camera, Plus, Star, Trophy, Clock } from 'lucide-react';
import { Meal, UserProfile } from '../types';
import { analyzeMealImage } from '../services/geminiService';

interface MealsProps {
  userProfile: UserProfile;
}

const Meals: React.FC<MealsProps> = ({ userProfile }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      
      try {
        const analysis = await analyzeMealImage(base64Data, userProfile);
        
        const newMeal: Meal = {
          id: Date.now().toString(),
          timestamp: new Date(),
          imageUrl: base64,
          ...analysis
        };
        
        setMeals(prev => [newMeal, ...prev]);
      } catch (err) {
        alert("Failed to analyze meal. Try again!");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-nutri-mint text-emerald-800';
    if (score >= 5) return 'bg-nutri-sunshine text-yellow-800';
    return 'bg-nutri-coral text-rose-800';
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-extrabold text-gray-800">Meal Timeline 🍲</h2>
            <p className="text-gray-500">Your delicious history</p>
        </div>
        <div className="bg-purple-100 p-2 px-4 rounded-xl flex items-center gap-2">
            <Trophy size={18} className="text-purple-600" />
            <span className="font-bold text-purple-700">{meals.length} Logged</span>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-30 md:absolute md:bottom-8 md:right-8">
        <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className={`
                h-16 w-16 rounded-full shadow-xl flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-95
                ${isProcessing ? 'bg-gray-400 animate-pulse' : 'bg-nutri-dark'}
            `}
        >
            {isProcessing ? <span className="text-2xl">👀</span> : <Plus size={32} />}
        </button>
        <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload}
        />
      </div>

      {/* List */}
      <div className="space-y-6 relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 -z-10 hidden md:block"></div>

        {meals.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-dashed border-2 border-gray-200">
                <span className="text-6xl block mb-4">🍽️</span>
                <p className="text-xl font-bold text-gray-400">No meals logged yet.</p>
                <p className="text-gray-400">Tap the + button to start!</p>
            </div>
        )}

        {meals.map((meal) => (
            <div key={meal.id} className="relative md:pl-20 animate-fade-in-up">
                
                {/* Timeline Dot (Desktop) */}
                <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-white border-4 border-nutri-lavender hidden md:block shadow-sm"></div>

                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Image */}
                        <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden relative shrink-0">
                            {meal.imageUrl ? (
                                <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">📷</div>
                            )}
                            <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold ${getScoreColor(meal.score)}`}>
                                {meal.score}/10
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-xl font-bold text-gray-800">{meal.name}</h3>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock size={12} />
                                    {meal.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 italic mb-3">"{meal.vibeCheck}"</p>

                            <div className="flex gap-2 mb-3">
                                <div className="px-3 py-1 bg-gray-50 rounded-xl text-xs font-semibold text-gray-600">
                                    🔥 {meal.calories} kcal
                                </div>
                                <div className="px-3 py-1 bg-gray-50 rounded-xl text-xs font-semibold text-gray-600">
                                    🥩 {meal.macros.protein}g P
                                </div>
                                <div className="px-3 py-1 bg-gray-50 rounded-xl text-xs font-semibold text-gray-600">
                                    🍞 {meal.macros.carbs}g C
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Stamp */}
                    {meal.score >= 9 && (
                        <div className="absolute -right-2 -bottom-2 opacity-20 transform rotate-12">
                            <Star size={80} className="fill-yellow-400 text-yellow-500" />
                        </div>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Meals;
