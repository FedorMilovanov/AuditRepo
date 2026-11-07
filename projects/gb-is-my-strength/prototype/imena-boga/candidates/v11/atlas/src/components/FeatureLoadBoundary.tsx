import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode; label: string; overlay?: boolean };
type State = { failed: boolean };

// A late-loaded module may fail on an interrupted connection. Preserve the
// reader and provide a real recovery action instead of crashing the SPA root.
export class FeatureLoadBoundary extends Component<Props, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div
        role="alert"
        className={this.props.overlay
          ? 'fixed inset-x-4 bottom-6 z-[150] mx-auto max-w-lg rounded-2xl border p-5 shadow-2xl'
          : 'my-6 rounded-2xl border p-5'}
        style={{ backgroundColor: 'var(--gb-surface)', borderColor: 'var(--gb-gold)', color: 'var(--gb-ink)' }}
      >
        <p className="font-ui text-sm font-semibold">{this.props.label} временно недоступно.</p>
        <p className="font-body-editorial mt-1 text-sm">Не удалось загрузить дополнительный модуль. Основное чтение сохранено.</p>
        <button type="button" onClick={() => window.location.reload()}
          className="font-ui mt-3 rounded-lg border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ borderColor: 'var(--gb-gold)' }}>Повторить загрузку страницы</button>
      </div>
    );
  }
}
