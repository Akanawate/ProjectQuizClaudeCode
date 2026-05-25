import { useState, useEffect } from 'react'
import type { Level } from './types'
import { useQuiz } from './hooks/useQuiz'
import { useRanking } from './hooks/useRanking'
import HomeScreen from './components/HomeScreen'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import RankingScreen from './components/RankingScreen'

type AppState =
  | { screen: 'home' }
  | { screen: 'quiz'; nickname: string; level: Level }
  | { screen: 'result'; nickname: string; level: Level }
  | { screen: 'ranking'; nickname: string; level: Level; fromHome?: boolean }

export default function App() {
  const [appState, setAppState] = useState<AppState>({ screen: 'home' })
  const { state: quizState, startQuiz, answerQuestion, advanceQuestion, resetQuiz, score } = useQuiz()
  const { rankings, loading, error, fetchRanking, submitScore } = useRanking()

  const handleStart = (nickname: string, level: Level) => {
    startQuiz(level)
    setAppState({ screen: 'quiz', nickname, level })
  }

  const handleAnswer = (answer: boolean) => {
    answerQuestion(answer)
  }

  useEffect(() => {
    if (quizState?.isFinished && appState.screen === 'quiz') {
      setAppState(prev =>
        prev.screen === 'quiz'
          ? { screen: 'result', nickname: prev.nickname, level: prev.level }
          : prev,
      )
    }
  }, [quizState?.isFinished, appState.screen])

  const handleViewRanking = () => {
    if (appState.screen === 'result') {
      setAppState({ screen: 'ranking', nickname: appState.nickname, level: appState.level })
    }
  }

  const handleBrowseRanking = (level: Level) => {
    setAppState({ screen: 'ranking', nickname: '', level, fromHome: true })
  }

  const handlePlayAgain = () => {
    resetQuiz()
    setAppState({ screen: 'home' })
  }

  return (
    <div className="min-h-screen bg-background text-text font-sans">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-16">
        {appState.screen === 'home' && <HomeScreen onStart={handleStart} onBrowseRanking={handleBrowseRanking} />}

        {appState.screen === 'quiz' && quizState && (
          <QuizScreen
            quizState={quizState}
            onAnswer={handleAnswer}
            onAdvance={advanceQuestion}
            level={appState.level}
          />
        )}

        {appState.screen === 'result' && quizState && (
          <ResultScreen
            questions={quizState.questions}
            answers={quizState.answers}
            score={score}
            total={quizState.questions.length}
            nickname={appState.nickname}
            level={appState.level}
            submitScore={submitScore}
            onViewRanking={handleViewRanking}
            onPlayAgain={handlePlayAgain}
          />
        )}

        {appState.screen === 'ranking' && (
          <RankingScreen
            level={appState.level}
            nickname={appState.nickname}
            fromHome={appState.fromHome}
            fetchRanking={fetchRanking}
            rankings={rankings}
            loading={loading}
            error={error}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  )
}
