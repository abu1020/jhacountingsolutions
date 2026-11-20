import React from 'react';

/** Contain unexpected render failures and give visitors a safe recovery path. */
export class ErrorBoundary extends React.Component<React.PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { console.error('A page component failed to render.'); }
  render() {
    if (this.state.failed) return <main role="alert" className="min-h-screen bg-brand-ivory px-6 py-24 text-navy-850"><div className="max-w-xl mx-auto"><h1 className="text-3xl font-bold">Something went wrong</h1><p className="mt-4">Please reload the page. If the problem continues, contact us at <a className="underline" href="mailto:rishijha@tuta.io">rishijha@tuta.io</a>.</p><button className="mt-6 bg-navy-850 text-white px-5 py-3" onClick={() => window.location.reload()}>Reload page</button></div></main>;
    return this.props.children;
  }
}
