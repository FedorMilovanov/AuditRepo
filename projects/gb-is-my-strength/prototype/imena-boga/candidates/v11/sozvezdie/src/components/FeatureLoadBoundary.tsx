import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; label: string };
type State = { failed: boolean };

// Component-level recovery keeps the long-form reader on screen when an
// optional code-split UI module fails to download.
export default class FeatureLoadBoundary extends Component<Props, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="fixed bottom-5 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-gold-500/50 bg-ink-900 p-4 text-cream-200 shadow-2xl">
        <p className="font-ui text-xs font-medium">{this.props.label} временно недоступен.</p>
        <p className="mt-1 font-body text-sm">Статья остаётся доступна.</p>
        <button type="button" onClick={() => window.location.reload()}
          className="mt-3 rounded-full border border-gold-400/60 px-4 py-2 font-ui text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300">
          Повторить загрузку страницы
        </button>
      </div>
    );
  }
}
