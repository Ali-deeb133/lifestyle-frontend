import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class GlobalErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    // هون ممكن تضيف logging service لاحقاً
    console.error('[GlobalErrorBoundary]', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h2 className="text-xl font-semibold">حدث خطأ غير متوقع</h2>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg"
            onClick={() => window.location.reload()}
          >
            إعادة تحميل
          </button>
        </div>
      )
    }
    return this.props.children
  }
}