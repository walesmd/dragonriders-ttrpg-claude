import { useState } from 'react';

interface HelpPanelProps {
  title?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: 'inline' | 'floating';
}

export default function HelpPanel({
  title = 'Help',
  children,
  defaultOpen = false,
  variant = 'inline',
}: HelpPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (variant === 'floating') {
    return (
      <>
        {/* Help button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-4 right-4 z-40 w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all"
          aria-label="Toggle help"
        >
          <span className="text-xl">?</span>
        </button>

        {/* Help panel */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="fixed bottom-20 right-4 z-50 w-80 max-h-96 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
              <div className="bg-gray-700 px-4 py-3 flex items-center justify-between">
                <h3 className="font-bold text-white">{title}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-80 text-sm text-gray-300">
                {children}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-blue-900/30 transition-colors"
      >
        <span className="text-blue-300 font-medium flex items-center gap-2">
          <span className="text-lg">ℹ️</span>
          {title}
        </span>
        <span className="text-blue-400 text-xl">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="px-4 py-3 text-sm text-gray-300 bg-gray-800/50 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}
