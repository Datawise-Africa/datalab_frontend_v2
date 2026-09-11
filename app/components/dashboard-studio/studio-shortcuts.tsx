import { useEffect, useEffectEvent } from 'react';
import { useStudio } from './studio-context';
import { useStudioUi } from './studio-ui-context';

/** Typing fields and open overlays keep their own keyboard behaviour. */
export function ownsKeyboard(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  if (target.closest('[role="dialog"], [role="menu"], [role="listbox"]'))
    return true;
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable === true)
  );
}

/**
 * Studio keyboard shortcuts:
 * Ctrl/⌘+S save · Ctrl/⌘+Z undo · Ctrl/⌘+Shift+Z or Ctrl/⌘+Y redo ·
 * Ctrl/⌘+D duplicate visual · Alt+↑/↓ move visual ·
 * Delete/Backspace remove visual · Esc deselect.
 */
export function StudioShortcuts() {
  const {
    undo,
    redo,
    save,
    dirty,
    selected,
    removeWidget,
    duplicateWidget,
    moveWidget,
    setSelectedId,
  } = useStudio();
  const { preview, view } = useStudioUi();

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const mod = event.metaKey || event.ctrlKey;
    const key = event.key.toLowerCase();
    if (mod && key === 's') {
      event.preventDefault();
      if (dirty) void save(false).catch(() => undefined);
      return;
    }
    // The model diagram has its own keyboard handling (Delete removes lines).
    if (preview || view === 'model' || ownsKeyboard(event.target)) return;
    if (mod && key === 'z') {
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
      return;
    }
    if (mod && key === 'y') {
      event.preventDefault();
      redo();
      return;
    }
    if (!selected) return;
    if (event.altKey && (key === 'arrowup' || key === 'arrowleft')) {
      event.preventDefault();
      moveWidget(-1);
    } else if (event.altKey && (key === 'arrowdown' || key === 'arrowright')) {
      event.preventDefault();
      moveWidget(1);
    } else if (mod && key === 'd') {
      event.preventDefault();
      duplicateWidget();
    } else if (key === 'delete' || key === 'backspace') {
      event.preventDefault();
      removeWidget();
    } else if (key === 'escape') {
      setSelectedId(undefined);
    }
  });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => onKeyDown(event);
    globalThis.addEventListener('keydown', handler);
    return () => globalThis.removeEventListener('keydown', handler);
    // onKeyDown is a useEffectEvent — intentionally excluded per React docs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
