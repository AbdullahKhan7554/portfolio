'use client';

import { NovaContext } from './NovaContext';
import { useDisclosure } from '../hooks/useDisclosure';
import { useNovaChat } from '../hooks/useNovaChat';
import { useNovaTheme } from '../hooks/useNovaTheme';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { MOBILE_QUERY } from '../constants/nova.constants';

/**
 * Composes the widget's independent concerns (open/close, theme, conversation,
 * responsive breakpoint) into a single context value. Keeps every consumer
 * component free of state wiring so each stays single-responsibility.
 */
export function NovaProvider({ config, children }) {
  const disclosure = useDisclosure(false);
  const chat = useNovaChat(config);
  const { mode, vars } = useNovaTheme(config.theme);
  const isMobile = useMediaQuery(MOBILE_QUERY);

  const value = {
    config,
    isMobile,
    mode,
    vars,
    ...disclosure,
    ...chat,
  };

  return <NovaContext.Provider value={value}>{children}</NovaContext.Provider>;
}
