import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-text font-sans flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-surface border border-error rounded-2xl p-8 text-center">
            <p className="text-4xl mb-4">⚠️</p>
            <h1 className="text-xl font-semibold text-text mb-2">Algo deu errado</h1>
            <p className="text-sm text-muted mb-6">{this.state.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, message: '' })}
              className="px-6 py-2 rounded-xl bg-primary text-white font-semibold
                hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary
                focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
