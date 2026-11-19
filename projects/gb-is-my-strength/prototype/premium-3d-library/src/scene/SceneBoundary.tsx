import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  onCrash: (message: string) => void;
}

/**
 * Ошибка в сцене иначе оставляет пользователя с чёрным экраном:
 * React размонтирует дерево, а canvas продолжает показывать последний кадр.
 * Здесь мы ловим сбой и отдаём понятный экран с выходом на обычный сайт.
 */
export class SceneBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Сцена упала:", message);
    this.props.onCrash(
      "Зал столкнулся с ошибкой отрисовки и не может продолжить. Попробуйте обновить страницу или включить «Лёгкую» графику — на часть устройств это помогает."
    );
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
