import React from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import './index.css'

// Reducer slice
const ticTacToe = createSlice({
  name: 'ticTacToe',
  initialState: {
    squares: Array(9).fill(null),
    currentStep: 0,
    winner: null,
    nextValue: 'X',
    status: 'Next player: X',
  },
  reducers: {
    selectSquare(state, action) {
      if (!state.winner && !state.squares[action.payload]) {
        const newSquares = [...state.squares];
        newSquares[action.payload] = calculateNextValue(state.squares);
        const winner = calculateWinner(newSquares);
        const nextValue = calculateNextValue(newSquares);
        const status = calculateStatus(winner, newSquares, nextValue);
        return {
          squares: newSquares,
          winner,
          nextValue,
          status,
        };
      }
      return state; // Return the state if no changes
    },
    restart(state) {
      const newSquares = Array(9).fill(null);
      const winner = calculateWinner(newSquares);
      const nextValue = calculateNextValue(newSquares);
      const status = calculateStatus(winner, newSquares, nextValue);
      return {
        squares: newSquares,
        winner,
        nextValue,
        status,
      };
    },
  },
});

// Actions
export const { selectSquare, restart } = ticTacToe.actions;

// Store
const store = configureStore({
  reducer: ticTacToe.reducer,
});

// Components
function Board() {
  const { status, squares } = useSelector(state => state);
  const dispatch = useDispatch();

  function selectSquareHandler(squareIndex) {
    dispatch(selectSquare(squareIndex));
  }

  function handleRestart() {
    dispatch(restart());
  }

  function renderSquare(i) {
    return (
      <button
        className="w-40 h-40 border-4 border-violet-900 rounded-lg text-8xl bg-violet-600 hover:bg-violet-800"
        onClick={() => selectSquareHandler(i)}
        key={i}
      >
        {squares[i]}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-bold mb-5">{status}</div>
      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col gap-6">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="flex flex-col gap-6">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="flex flex-col gap-6">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <button
        className="mt-5 py-2 px-10 btn btn-outline btn-primary"
        onClick={handleRestart}
      >
        Reset
      </button>
    </div>
  );
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Draw`
    : `Next player: ${nextValue}`;
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center">
      <Provider store={store}>
        <Board />
      </Provider>
    </div>
  );
}

export default App;
