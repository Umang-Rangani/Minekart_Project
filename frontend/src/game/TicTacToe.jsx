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
    <section className="min-h-screen bg-[#FBF7F2] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        {/* HEADER */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#E8DDD4] bg-[#F7EEE7] px-3 py-1.5">
            <Trophy size={14} className="text-[#8E181F]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8E181F]">MineKart Game</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-[#351C18] sm:text-3xl">Tic-Tac-Toe</h1>

          <p className="mt-1 text-xs text-[#9A857B] sm:text-sm">Classic game. Simple fun.</p>
        </div>

        {/* SCORE */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className={`rounded-xl border p-3 text-center transition-all ${isXTurn && !winner && !isDraw ? 'border-[#A51D26] bg-[#FFF4F2] shadow-sm' : 'border-[#E8DDD4] bg-white'}`}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#9A857B]">Player</p>

            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="text-xl font-black text-[#8E181F]">X</span>
              <span className="text-lg font-extrabold text-[#351C18]">{scores.X}</span>
            </div>
          </div>

          <div className={`rounded-xl border p-3 text-center transition-all ${!isXTurn && !winner && !isDraw ? 'border-[#A51D26] bg-[#FFF4F2] shadow-sm' : 'border-[#E8DDD4] bg-white'}`}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#9A857B]">Player</p>

            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="text-xl font-black text-[#351C18]">O</span>
              <span className="text-lg font-extrabold text-[#351C18]">{scores.O}</span>
            </div>
          </div>
        </div>

        {/* GAME CARD */}
        <div className="rounded-2xl border border-[#E8DDD4] bg-white p-4 shadow-[0_10px_35px_rgba(73,54,49,0.08)] sm:p-5">
          {/* STATUS */}
          <div className="mb-4 flex items-center justify-between rounded-xl border border-[#EEE5DF] bg-[#FFFCFA] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7EEE7]">
                <Users size={14} className="text-[#8E181F]" />
              </span>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Game Status</p>

                <p className={`text-xs font-extrabold ${winner ? 'text-[#8E181F]' : 'text-[#351C18]'}`}>{getStatus()}</p>
              </div>
            </div>

            {(winner || isDraw) && <span className="rounded-full bg-[#F7EEE7] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#8E181F]">Game Over</span>}
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
                      ? 'border-[#8E181F] bg-[#F7EEE7] text-[#8E181F] shadow-[0_0_0_3px_rgba(142,24,31,0.08)]'
                      : cell === 'X'
                        ? 'border-[#E8DDD4] bg-[#FFFCFA] text-[#8E181F]'
                        : cell === 'O'
                          ? 'border-[#E8DDD4] bg-[#FFFCFA] text-[#351C18]'
                          : 'border-[#E8DDD4] bg-[#FBF7F2] text-[#351C18] hover:border-[#C9A79C] hover:bg-[#F7EEE7]'
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
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E3D6CE] bg-white px-4 py-2.5 text-xs font-bold text-[#493631] transition-colors hover:border-[#C9A79C] hover:bg-[#F7EEE7]"
            >
              <RotateCcw size={14} />
              New Game
            </button>

            <button
              type="button"
              onClick={resetScores}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#B5262D] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:from-[#6E1419] hover:to-[#A51D26]"
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
