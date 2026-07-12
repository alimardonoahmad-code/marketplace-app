'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }
    if (localStorage.getItem('pwa-install-dismissed') === '1') {
      setHidden(true);
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setDeferred(null);
  };

  const dismiss = () => {
    setHidden(true);
    localStorage.setItem('pwa-install-dismissed', '1');
  };

  if (installed || hidden || !deferred) return null;

  return (
    <div className="fixed left-0 right-0 z-[90] ozon-install-banner bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] lg:hidden">
      <div className="app-container flex items-center gap-3 py-2.5">
        <img src="/icon-192.png" alt="" className="h-10 w-10 rounded-xl shrink-0 shadow-soft" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-text leading-tight">Market-ро насб кунед</p>
          <p className="text-[11px] text-text-muted">Монанди барнома дар экрани телефон</p>
        </div>
        <button type="button" onClick={install} className="ozon-install-btn shrink-0">
          <Download className="h-4 w-4" />
          Насб
        </button>
        <button type="button" onClick={dismiss} className="p-1 text-text-muted hover:text-text" aria-label="Пӯшидан">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
