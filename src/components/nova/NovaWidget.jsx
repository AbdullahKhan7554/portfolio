'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { novaConfig } from '@/config/nova.config';
import { NovaProvider } from './context/NovaProvider';
import { useNova } from './context/NovaContext';
import { FloatingButton } from './ui/FloatingButton';
import { ChatWindow } from './ui/ChatWindow';

/**
 * Nova — self-contained, config-driven AI chat widget (UI only).
 *
 * Drop `<NovaWidget />` anywhere once (e.g. the root layout). Pass a custom
 * `config` to re-brand for another tenant; defaults to `novaConfig`.
 */
export function NovaWidget({ config = novaConfig }) {
  return (
    <NovaProvider config={config}>
      <NovaRoot />
    </NovaProvider>
  );
}

/** Renders the launcher plus the (mobile) backdrop + window with exit anims. */
function NovaRoot() {
  const { isOpen, isMobile, close, vars } = useNova();

  return (
    <>
      <FloatingButton />
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            key="nova-backdrop"
            onClick={close}
            aria-hidden="true"
            style={vars}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm"
          />
        )}
        {isOpen && <ChatWindow key="nova-window" />}
      </AnimatePresence>
    </>
  );
}
