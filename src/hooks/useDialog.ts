import { useEffect } from 'react';

/**
 * Minimal dialog behaviour for the app's modal components:
 *  - Escape key closes (WCAG 2.1.1 keyboard escape hatch)
 *  - Body scroll is locked while open and restored on close
 *
 * Pair with role="dialog" aria-modal="true" aria-label="..." on the panel.
 * Full focus-trap + focus-return is the P1 follow-up (see
 * docs/UI_UX_ENTERPRISE_REVIEW.md §1.5) — this hook is the safe,
 * zero-regression first step shared by all four modals.
 */
export function useDialog(isOpen: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
}
