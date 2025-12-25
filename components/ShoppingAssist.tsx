import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, AlertTriangle, Ban } from 'lucide-react';
import { analyzeShoppingLabel } from '../services/geminiService';
import { ShoppingVerdict } from '../types';

const ShoppingAssist: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [verdict, setVerdict] = useState<ShoppingVerdict | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setVerdict(null);
        analyze(base64.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async (base64Data: string) => {
    setIsAnalyzing(true);
    try {
        const result = await analyzeShoppingLabel(base64Data);
        setVerdict(result);
    } catch (e) {
        console.error(e);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setVerdict(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Shopping Assist 🛒</h2>
      <p className="text-gray-500 mb-6">Snap a label to get the NutriGPT verdict.</p>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border-2 border-dashed border-gray-200 overflow-hidden relative flex flex-col items-center justify-center p-4">
        
        {!imagePreview && (
            <div className="text-center">
                <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Scan a Product</h3>
                <p className="text-gray-400 mb-6">Take a photo of the nutrition label</p>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-3 bg-nutri-dark text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                >
                    Open Camera
                </button>
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    className="hidden" 
                />
            </div>
        )}

        {imagePreview && (
            <>
                <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm" />
                <div className="absolute inset-0 w-full h-full object-contain p-4 z-10">
                     <img src={imagePreview} alt="Preview Content" className="w-full h-full object-contain rounded-xl shadow-lg" />
                </div>
                
                {/* Verdict Overlay */}
                {isAnalyzing && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center animate-bounce">
                            <span className="text-4xl">🤔</span>
                            <span className="font-bold text-gray-700 mt-2">Analyzing...</span>
                        </div>
                    </div>
                )}

                {verdict && (
                    <div className="absolute inset-x-4 bottom-4 z-20 animate-slide-up">
                        <div className={`
                            p-6 rounded-3xl shadow-2xl border-4
                            ${verdict.verdict === 'GO' ? 'bg-emerald-50 border-emerald-400' : ''}
                            ${verdict.verdict === 'STOP' ? 'bg-rose-50 border-rose-400' : ''}
                            ${verdict.verdict === 'CAUTION' ? 'bg-yellow-50 border-yellow-400' : ''}
                        `}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {verdict.verdict === 'GO' && <Check className="bg-emerald-500 text-white rounded-full p-1 w-8 h-8" />}
                                        {verdict.verdict === 'STOP' && <Ban className="bg-rose-500 text-white rounded-full p-1 w-8 h-8" />}
                                        {verdict.verdict === 'CAUTION' && <AlertTriangle className="bg-yellow-500 text-white rounded-full p-1 w-8 h-8" />}
                                        <h3 className="text-2xl font-black uppercase tracking-wide">{verdict.verdict}</h3>
                                    </div>
                                    <p className="text-gray-800 font-medium leading-relaxed">
                                        {verdict.explanation}
                                    </p>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-white w-16 h-16 rounded-2xl shadow-sm">
                                    <span className="text-2xl font-black text-gray-800">{verdict.score}</span>
                                    <span className="text-xs text-gray-400 font-bold">/10</span>
                                </div>
                            </div>
                            <button onClick={reset} className="w-full mt-4 py-3 bg-white rounded-xl font-bold text-gray-700 shadow-sm hover:bg-gray-50">
                                Scan Another
                            </button>
                        </div>
                    </div>
                )}
            </>
        )}

        {imagePreview && !verdict && !isAnalyzing && (
             <button 
                onClick={reset}
                className="absolute top-4 right-4 z-30 p-2 bg-white rounded-full shadow-lg text-gray-500"
             >
                <X size={20} />
             </button>
        )}

      </div>
    </div>
  );
};

export default ShoppingAssist;
