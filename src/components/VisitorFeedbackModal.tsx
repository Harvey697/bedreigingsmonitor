import React, { useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { VisitorFeedbackManager } from './VisitorFeedbackManager';
import { ThreatItem } from '../types/threat';

interface VisitorFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOwnerMode?: boolean;
  preselectedThreat?: ThreatItem | null;
  threats?: ThreatItem[];
}

export const VisitorFeedbackModal: React.FC<VisitorFeedbackModalProps> = ({
  isOpen,
  onClose,
  isOwnerMode = false,
  preselectedThreat,
  threats = [],
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl relative my-auto overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="px-4 sm:px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <MessageSquare className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Reactie- & Vragenformulier
              </h3>
              <p className="text-xs text-slate-600">
                Stel uw vraag of reageer op cyberdreigingen • Bedreigingsmonitor.nl
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            title="Sluit venster (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white">
          <VisitorFeedbackManager
            threats={threats}
            isOwnerMode={isOwnerMode}
            preselectedThreat={preselectedThreat}
            onCloseModal={onClose}
          />
        </div>
      </div>
    </div>
  );
};
