import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Copy, ExternalLink, Pause, Play, X } from 'lucide-react';
import {
  CLIENT_PORTAL_HIGHLIGHTS,
  CLIENT_PORTAL_URL,
  warmUpClientPortal
} from '../config/portal';
import { useDialog } from '../hooks/useDialog';

interface LoginRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl?: string;
}

const REDIRECT_SECONDS = 3;

/**
 * Executive, user-controlled transition to the dedicated external Client Portal.
 * - Pre-warms DNS + TLS immediately on open so navigation feels instant.
 * - Synchronized 3-second countdown with Pause/Resume, Open in New Tab, and Copy Link.
 * - Fully keyboard-accessible (focus trap, Escape to cancel) and reduced-motion safe.
 */
export const LoginRedirectModal: React.FC<LoginRedirectModalProps> = ({
  isOpen,
  onClose,
  targetUrl = CLIENT_PORTAL_URL
}) => {
  const reducedMotion = useReducedMotion();
  const [secondsLeft, setSecondsLeft] = useState<number>(REDIRECT_SECONDS);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [copyError, setCopyError] = useState(false);

  const panel = useRef<HTMLDivElement>(null);
  const copyResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    setIsPaused(true);
    onClose();
  }, [onClose]);

  useDialog(isOpen, cancel);

  // Reset state, warm connection, and manage focus whenever opened
  useEffect(() => {
    if (!isOpen) return;
    warmUpClientPortal(targetUrl);
    setSecondsLeft(REDIRECT_SECONDS);
    setIsPaused(false);
    setCopied(false);
    setCopyError(false);

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panel.current?.focus();

    return () => {
      if (copyResetTimer.current) {
        clearTimeout(copyResetTimer.current);
        copyResetTimer.current = null;
      }
      previousFocus?.focus();
    };
  }, [isOpen, targetUrl]);

  // Live 1-second countdown that triggers navigation cleanly at 0 unless paused
  useEffect(() => {
    if (!isOpen || isPaused) return;

    if (secondsLeft <= 0) {
      window.location.assign(targetUrl);
      return;
    }

    const tick = window.setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(tick);
  }, [isOpen, isPaused, secondsLeft, targetUrl]);

  if (!isOpen) return null;

  const progressRatio = Math.min(1, Math.max(0, (REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS));

  const handleCopyLink = async () => {
    setIsPaused(true);
    setCopied(false);
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
      copyResetTimer.current = setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopyError(true);
    }
  };

  const keepFocusInDialog = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = panel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const hostLabel = targetUrl.replace(/^https?:\/\//, '');

  return (
    <div className="jas-portal-overlay">
      <motion.div
        className="jas-portal-backdrop"
        onClick={cancel}
        aria-hidden="true"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="portal-transition-title"
        aria-describedby="portal-transition-description"
        tabIndex={-1}
        onKeyDown={keepFocusInDialog}
        className="jas-portal-card"
        initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          className="jas-portal-close"
          onClick={cancel}
          aria-label="Cancel and stay on the website"
        >
          <X size={19} />
        </button>

        <div className="jas-portal-brand">
          <span className="jas-portal-brand-mark">
            J<span>.</span>
          </span>
          <span>
            JHA <small>ACCOUNTING SOLUTIONS</small>
          </span>
        </div>

        <div className="jas-portal-visual" aria-hidden="true">
          <span className="jas-portal-orbit jas-portal-orbit-one" />
          <span className="jas-portal-orbit jas-portal-orbit-two" />
          <span className="jas-portal-visual-mark">
            J<span>.</span>
          </span>
          <span className="jas-portal-visual-arrow">
            <ArrowUpRight size={19} />
          </span>
        </div>

        <div className="jas-portal-copy">
          <p className="jas-portal-eyebrow">DEDICATED CLIENT WORKSPACE</p>
          <h2 id="portal-transition-title">
            Taking you to
            <br />
            <em>your portal.</em>
          </h2>
          <p id="portal-transition-description">
            You are leaving this website for the dedicated client portal.
          </p>
        </div>

        <div className="jas-portal-highlights" aria-label="Available in the client portal">
          {CLIENT_PORTAL_HIGHLIGHTS.map((item) => (
            <div key={item.title} className="jas-portal-highlight-row">
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </div>
          ))}
        </div>

        <div className="jas-portal-status" role="status" aria-live="polite">
          <span>
            {isPaused
              ? 'Automatic redirect paused'
              : secondsLeft > 0
                ? `Opening client portal in ${secondsLeft}s…`
                : 'Opening client portal…'}
          </span>
          <button
            type="button"
            className="jas-portal-pause-btn"
            onClick={() => {
              if (isPaused && secondsLeft <= 0) setSecondsLeft(REDIRECT_SECONDS);
              setIsPaused((prev) => !prev);
            }}
          >
            {isPaused ? (
              <>
                <Play size={12} aria-hidden="true" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause size={12} aria-hidden="true" />
                <span>Pause</span>
              </>
            )}
          </button>
        </div>

        <div className="jas-portal-progress" aria-hidden="true">
          <span
            className={isPaused ? 'is-paused' : ''}
            style={{ transform: `scaleX(${isPaused ? Math.max(0.12, progressRatio) : Math.max(0.15, progressRatio + (1 / REDIRECT_SECONDS))})` }}
          />
        </div>

        <div className="jas-portal-actions">
          <a
            href={targetUrl}
            onClick={() => setIsPaused(true)}
            className="jas-portal-primary"
          >
            Continue now <ArrowRight size={17} />
          </a>

          <div className="jas-portal-secondary-row">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={cancel}
              className="jas-portal-secondary"
            >
              <ExternalLink size={14} aria-hidden="true" />
              <span>Open in new tab</span>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="jas-portal-secondary"
            >
              {copied ? (
                <>
                  <Check size={14} aria-hidden="true" />
                  <span>Link copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} aria-hidden="true" />
                  <span>Copy portal link</span>
                </>
              )}
            </button>
          </div>

          {copyError && <p role="alert" className="jas-portal-copy-error">Could not copy the link. You can select the destination address below.</p>}
          <button type="button" onClick={cancel} className="jas-portal-cancel">
            Stay on this website
          </button>
        </div>

        <p className="jas-portal-destination">
          DESTINATION <span>{hostLabel}</span>
        </p>
      </motion.div>
    </div>
  );
};
