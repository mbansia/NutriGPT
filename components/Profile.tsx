import React from 'react';
import { UserProfile } from '../types';
import { User, Ruler, Weight, Activity, FileText } from 'lucide-react';

interface ProfileProps {
    userProfile: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ userProfile }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-800">My Profile 👤</h2>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-20 h-20 bg-nutri-mint rounded-full flex items-center justify-center text-4xl">
                😎
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800">{userProfile.name}</h3>
                <p className="text-gray-500">Level 5 Nutritionist</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Activity className="text-nutri-coral" /> 
                Stats & Goals
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl">
                    <span className="text-xs text-gray-400 font-bold uppercase">Current Weight</span>
                    <p className="text-2xl font-black text-gray-800">{userProfile.weight} kg</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                    <span className="text-xs text-gray-400 font-bold uppercase">Target</span>
                    <p className="text-2xl font-black text-emerald-600">{userProfile.targetWeight} kg</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                    <span className="text-xs text-gray-400 font-bold uppercase">Height</span>
                    <p className="text-xl font-bold text-gray-800">{userProfile.height} cm</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                    <span className="text-xs text-gray-400 font-bold uppercase">Age</span>
                    <p className="text-xl font-bold text-gray-800">{userProfile.age}</p>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <FileText className="text-nutri-lavender" /> 
                Medical Vault
            </h3>
            <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors">
                + Upload Blood Work / DNA PDF
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">AI will extract key markers to refine your plan.</p>
        </div>
    </div>
  );
};

export default Profile;
