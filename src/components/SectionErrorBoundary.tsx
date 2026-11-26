import React from 'react';
import { CONTACT_EMAILS } from '../data/content';

/** A failed lazy section should not take the rest of the website offline. */
export class SectionErrorBoundary extends React.Component<React.PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { console.error('A website section could not be loaded.'); }
  render() {
    if (!this.state.failed) return this.props.children;
    return <section role="alert" className="jas-wrap py-10 text-navy-850">
      <h2 className="text-lg font-semibold">This section could not be loaded</h2>
      <p className="mt-2">Please reload the page or contact us at {CONTACT_EMAILS.map((email, index) => <React.Fragment key={email}>{index > 0 && ' or '}<a className="underline" href={`mailto:${email}`}>{email}</a></React.Fragment>)}.</p>
      <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-navy-850 px-4 py-2 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">Reload page</button>
    </section>;
  }
}
