import { useEffect } from 'react';
import { useAppSelector } from '.';

export function ThemeSynchronizer() {
  const theme = useAppSelector((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--ds-primary-h', String(theme.primaryHue));
    root.style.setProperty('--ds-secondary-h', String(theme.secondaryHue));
    root.style.setProperty('--ds-tertiary-h', String(theme.tertiaryHue));
    root.style.setProperty('--ds-font-family', theme.fontFamily);
    root.style.setProperty('--ds-font-mono', theme.fontMono);
    root.style.setProperty('--ds-border-radius', `${theme.borderRadius}rem`);
    root.style.setProperty('--ds-border-width', `${theme.borderWidth}px`);

    if (theme.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return null;
}
