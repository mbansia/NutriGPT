import React from 'react';
import { UserProfile } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Brain, Heart, Zap, Bone } from 'lucide-react';

interface MyPlanProps {
  userProfile: UserProfile;
}

const MyPlan: React.FC<MyPlanProps> = ({ userProfile }) => {

  const macroData = [
    { name: 'Protein', value: 30, color: '#FDA4AF' }, // Coral
    { name: 'Fats', value: 25, color: '#FDE047' },    // Sunshine
    { name: 'Carbs', value: 45, color: '#A7F3D0' },   // Mint
  ];

  const weeklyData = [
    { day: 'M', cal: 2100 },
    { day: 'T', cal: 2400 },
    { day: 'W', cal: 1800 },
    { day: 'T', cal: 2250 },
    { day: 'F', cal: 2100 },
    { day: 'S', cal: 2600 },
    { day: 'S', cal: 2000 },
  ];

  const PowerUpBadge = ({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) => (
    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white shadow-sm border-2 ${color} w-full`}>
        <div className="mb-2 text-gray-700">{icon}</div>
        <span className="text-xs font-bold text-gray-600 text-center">{label}</span>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Your Master Plan 🗺️</h2>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-nutri-mint to-teal-100 p-6 rounded-3xl shadow-sm text-teal-900">
            <h3 className="font-bold opacity-70">Daily Calories</h3>
            <p className="text-4xl font-extrabold mt-1">2,400</p>
            <p className="text-sm mt-2 font-medium">TDEE Adjusted</p>
        </div>
        <div className="bg-gradient-to-br from-nutri-coral to-rose-100 p-6 rounded-3xl shadow-sm text-rose-900">
            <h3 className="font-bold opacity-70">Weight Goal</h3>
            <p className="text-4xl font-extrabold mt-1">{userProfile.targetWeight} kg</p>
            <p className="text-sm mt-2 font-medium">Current: {userProfile.weight} kg</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
            <h3 className="font-bold text-gray-400 mb-2">Power Ups</h3>
            <div className="flex gap-2">
                <Brain size={24} className="text-purple-500" />
                <Heart size={24} className="text-red-500" />
            </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Macro Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Macro Split</h3>
            <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={macroData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {macroData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-gray-300">Balanced</span>
                </div>
            </div>
            <div className="flex justify-around mt-4">
                {macroData.map((m) => (
                    <div key={m.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }}></div>
                        <span className="font-semibold text-gray-600">{m.name} {m.value}%</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Weekly Consistency */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Calorie Consistency</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="cal" fill="#C4B5FD" radius={[10, 10, 10, 10]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Wellness Goals */}
      <div>
        <h3 className="text-xl font-bold text-gray-700 mb-4">Wellness Power-Ups ⚡</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PowerUpBadge icon={<Brain className="text-pink-500" />} label="Brain Fuel" color="border-pink-200" />
            <PowerUpBadge icon={<Bone className="text-gray-500" />} label="Strong Bones" color="border-gray-200" />
            <PowerUpBadge icon={<Heart className="text-red-500" />} label="Heart Happy" color="border-red-200" />
            <PowerUpBadge icon={<Zap className="text-yellow-500" />} label="Energy Max" color="border-yellow-200" />
        </div>
      </div>

    </div>
  );
};

export default MyPlan;
