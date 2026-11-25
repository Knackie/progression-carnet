'use client';

import { useEffect, useState } from 'react';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallButton() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [installed, setInstalled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as InstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;

  const handleClick = async () => {
    if (promptEvent) {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      setPromptEvent(null);
    } else {
      setShowHelp(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition active:scale-95"
        title="Ajouter l'appli à l'écran d'accueil"
      >
        <span className="sm:hidden">📲</span>
        <span className="hidden sm:inline">📲 Installer</span>
      </button>

      {showHelp && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-xl p-5 max-w-sm w-full text-gray-800" onClick={e => e.stopPropagation()}>
            <p className="font-bold text-lg mb-2">📲 Installer l&apos;appli</p>
            {isIos ? (
              <p className="text-sm">
                Dans Safari, touchez le bouton <strong>Partager</strong> (carré avec une flèche), puis{' '}
                <strong>Sur l&apos;écran d&apos;accueil</strong>.
              </p>
            ) : (
              <p className="text-sm">
                Ouvrez le menu <strong>⋮</strong> de votre navigateur, puis <strong>Installer l&apos;application</strong> ou{' '}
                <strong>Ajouter à l&apos;écran d&apos;accueil</strong>.
              </p>
            )}
            <button onClick={() => setShowHelp(false)} className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold">
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
