import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MyPlan from './components/MyPlan';
import ShoppingAssist from './components/ShoppingAssist';
import Meals from './components/Meals';
import Profile from './components/Profile';
import { ViewState, UserProfile } from './types';

// Mock Initial User Data
const INITIAL_USER: UserProfile = {
  name: "Alex",
  age: 28,
  height: 175,
  weight: 70,
  targetWeight: 65,
  goal: 'Weight Loss',
  allergies: ['Peanuts'],
  wellnessGoals: ['Better Skin', 'Energy']
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // In a real app, this would be managed by Context or Redux
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard userProfile={userProfile} />;
      case 'plan': return <MyPlan userProfile={userProfile} />;
      case 'shopping': return <ShoppingAssist />;
      case 'meals': return <Meals userProfile={userProfile} />;
      case 'profile': return <Profile userProfile={userProfile} />;
      default: return <Dashboard userProfile={userProfile} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-gray-800">
      
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col h-full relative w-full">
        {/* Mobile Header Spacer */}
        <div className="md:hidden h-16 w-full shrink-0"></div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {renderView()}
        </div>
      </main>

    </div>
  );
};

export default App;
