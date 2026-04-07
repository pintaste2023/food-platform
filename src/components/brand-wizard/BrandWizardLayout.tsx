// Brand Wizard Layout - Shared shell for brand creation steps
// Provides navigation, step indicator, and consistent branding

'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BrandWizardLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  onNext?: () => void;
  onBack?: () => void;
  canProceed?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

export default function BrandWizardLayout({
  children,
  currentStep,
  totalSteps,
  stepTitles,
  onNext,
  onBack,
  canProceed = true,
  nextLabel = '下一步',
  backLabel = '上一步',
}: BrandWizardLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← {backLabel}
          </button>
          <Link href="/" className="font-bold text-xl gradient-text hover:opacity-80 transition-opacity">
            品點子
          </Link>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center gap-2 ${isActive ? 'text-orange-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                      isActive 
                        ? 'bg-orange-500 text-white' 
                        : isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? '✓' : stepNumber}
                    </span>
                    <span className={`text-sm hidden sm:inline ${isActive ? 'font-semibold' : ''}`}>
                      {title}
                    </span>
                  </div>
                  {index < stepTitles.length - 1 && (
                    <div className={`w-8 sm:w-16 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex justify-between gap-4">
          <button
            onClick={handleBack}
            className="btn-secondary flex-1 max-w-xs"
          >
            ← {backLabel}
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`btn-primary flex-1 max-w-xs ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {nextLabel} →
          </button>
        </div>
      </div>

      {/* Spacer for fixed footer */}
      <div className="h-24"></div>
    </div>
  );
}

// Step-specific result display components
export function BrandResultCard({ 
  title, 
  icon, 
  children, 
  action 
}: { 
  title: string; 
  icon: string; 
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="card mb-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function BrandInputField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  type = 'text'
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-orange-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
        required={required}
      />
    </div>
  );
}

export function BrandTextArea({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 4 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors resize-none"
      />
    </div>
  );
}

export function BrandSelect({ 
  label, 
  value, 
  onChange, 
  options 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  options: { value: string; label: string }[];
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function BrandTagInput({ 
  label, 
  tags, 
  onAdd, 
  onRemove,
  suggestions = []
}: { 
  label: string; 
  tags: string[]; 
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  suggestions?: string[];
}) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span key={tag} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1">
            {tag}
            <button 
              onClick={() => onRemove(tag)}
              className="hover:text-orange-900"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="輸入標籤後按 Enter"
        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
      />
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onAdd(suggestion)}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function LoadingState({ message = 'AI 產生中...' }: { message?: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4 animate-bounce">🤔</div>
      <p className="text-gray-600 mb-2">{message}</p>
      <p className="text-gray-400 text-sm">這可能需要幾秒鐘</p>
    </div>
  );
}

export function ErrorState({ 
  message, 
  onRetry 
}: { 
  message: string; 
  onRetry?: () => void 
}) {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-red-500 mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          重新嘗試
        </button>
      )}
    </div>
  );
}
