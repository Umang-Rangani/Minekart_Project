import React, { useEffect, useState } from 'react'
import { RotateCcw, Trophy, Users } from 'lucide-react'

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXTurn, setIsXTurn] = useState(true)
  const [scores, setScores] = useState({ X: 0, O: 0 })

  const getWinner = (currentBoard) => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return {
          player: currentBoard[a],
          combination: [a, b, c],
        }
      }
    }

    return null
  }

  const winner = getWinner(board)
  const isDraw = !winner && board.every(Boolean)

  const handleClick = (index) => {
    if (board[index] || winner || isDraw) return

    const newBoard = [...board]
    newBoard[index] = isXTurn ? 'X' : 'O'

    setBoard(newBoard)

    const newWinner = getWinner(newBoard)

    if (newWinner) {
      setScores((prev) => ({
        ...prev,
        [newWinner.player]: prev[newWinner.player] + 1,
      }))
      return
    }

    setIsXTurn((prev) => !prev)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXTurn(true)
  }

  const resetScores = () => {
    setScores({ X: 0, O: 0 })
    resetGame()
  }

  const getStatus = () => {
    if (winner) {
      return `${winner.player} Wins!`
    }

    if (isDraw) {
      return "It's a Draw!"
    }

    return `${isXTurn ? 'X' : 'O'}'s Turn`
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    document.title = 'TicTacToe | MineKart'
  }, [])

  return (
    <section className="min-h-screen bg-mk-bg px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        {/* HEADER */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-mk-border bg-mk-primary-soft px-3 py-1.5">
            <Trophy size={14} className="text-mk-primary-hover" />
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-mk-primary-hover">MineKart Game</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-mk-ink sm:text-3xl">Tic-Tac-Toe</h1>

          <p className="mt-1 text-xs text-mk-muted sm:text-sm">Classic game. Simple fun.</p>
        </div>

        {/* SCORE */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className={`rounded-xl border p-3 text-center transition-all ${isXTurn && !winner && !isDraw ? 'border-mk-primary bg-mk-bg shadow-sm' : 'border-mk-border bg-white'}`}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-mk-muted">Player</p>

            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="text-xl font-black text-mk-primary-hover">X</span>
              <span className="text-lg font-extrabold text-mk-ink">{scores.X}</span>
            </div>
          </div>

          <div className={`rounded-xl border p-3 text-center transition-all ${!isXTurn && !winner && !isDraw ? 'border-mk-primary bg-mk-bg shadow-sm' : 'border-mk-border bg-white'}`}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-mk-muted">Player</p>

            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="text-xl font-black text-mk-ink">O</span>
              <span className="text-lg font-extrabold text-mk-ink">{scores.O}</span>
            </div>
          </div>
        </div>

        {/* GAME CARD */}
        <div className="rounded-2xl border border-mk-border bg-white p-4 shadow-[0_10px_35px_rgba(73,54,49,0.08)] sm:p-5">
          {/* STATUS */}
          <div className="mb-4 flex items-center justify-between rounded-xl border border-mk-surface bg-mk-card px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mk-primary-soft">
                <Users size={14} className="text-mk-primary-hover" />
              </span>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-wider text-mk-muted">Game Status</p>

                <p className={`text-xs font-extrabold ${winner ? 'text-mk-primary-hover' : 'text-mk-ink'}`}>{getStatus()}</p>
              </div>
            </div>

            {(winner || isDraw) && <span className="rounded-full bg-mk-primary-soft px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-mk-primary-hover">Game Over</span>}
          </div>

          {/* BOARD */}
          <div className="mx-auto grid aspect-square w-full max-w-85 grid-cols-3 gap-2 sm:gap-3">
            {board.map((cell, index) => {
              const isWinningCell = winner?.combination.includes(index)

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleClick(index)}
                  disabled={Boolean(cell) || Boolean(winner) || isDraw}
                  className={`flex aspect-square items-center justify-center rounded-xl border-2 text-4xl font-black transition-all duration-200 sm:rounded-2xl sm:text-5xl ${
                    isWinningCell
                      ? 'border-mk-primary-hover bg-mk-primary-soft text-mk-primary-hover shadow-[0_0_0_3px_rgba(142,24,31,0.08)]'
                      : cell === 'X'
                        ? 'border-mk-border bg-mk-card text-mk-primary-hover'
                        : cell === 'O'
                          ? 'border-mk-border bg-mk-card text-mk-ink'
                          : 'border-mk-border bg-mk-bg text-mk-ink hover:border-mk-accent hover:bg-mk-primary-soft'
                  }`}
                >
                  {cell}
                </button>
              )
            })}
          </div>

          {/* ACTIONS */}
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={resetGame}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-mk-border bg-white px-4 py-2.5 text-xs font-bold text-mk-ink transition-colors hover:border-mk-accent hover:bg-mk-primary-soft"
            >
              <RotateCcw size={14} />
              New Game
            </button>

            <button
              type="button"
              onClick={resetScores}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-mk-primary-deep to-mk-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:from-mk-primary-deep hover:to-mk-primary"
            >
              <Trophy size={14} />
              Reset Score
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
