import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, PieChart, ScanBarcode, Utensils, UserCircle, Menu, X } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, setIsOpen }) => {
  
  const navItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={24} /> },
    { id: 'plan', label: 'My Plan', icon: <PieChart size={24} /> },
    { id: 'shopping', label: 'Shopping Assist', icon: <ScanBarcode size={24} /> },
    { id: 'meals', label: 'Meals', icon: <Utensils size={24} /> },
    { id: 'profile', label: 'Profile', icon: <UserCircle size={24} /> },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-white rounded-full shadow-lg text-nutri-dark"
        >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-10">
            <span className="text-3xl">🥑</span>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
              NutriGPT
            </h1>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id);
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-semibold
                  ${currentView === item.id 
                    ? 'bg-nutri-mint text-emerald-800 shadow-md transform scale-105' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto p-4 bg-purple-50 rounded-2xl">
            <p className="text-sm font-bold text-purple-800">Pro Tip 💡</p>
            <p className="text-xs text-purple-600 mt-1">Log your snacks to keep the streak alive!</p>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
