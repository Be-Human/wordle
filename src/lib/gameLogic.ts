export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export interface LetterState {
  letter: string;
  status: LetterStatus;
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  targetWord: string;
  currentGuess: string;
  currentRow: number;
  guesses: LetterState[][];
  keyboardStatus: Record<string, LetterStatus>;
  gameStatus: GameStatus;
}

export function createInitialGameState(targetWord: string): GameState {
  const guesses: LetterState[][] = [];
  for (let i = 0; i < 6; i++) {
    const row: LetterState[] = [];
    for (let j = 0; j < 5; j++) {
      row.push({ letter: '', status: 'empty' });
    }
    guesses.push(row);
  }

  return {
    targetWord,
    currentGuess: '',
    currentRow: 0,
    guesses,
    keyboardStatus: {},
    gameStatus: 'playing'
  };
}

export function checkGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = [];
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  const usedIndices = new Set<number>();

  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = { letter: guessLetters[i], status: 'correct' };
      usedIndices.add(i);
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i]) continue;

    let found = false;
    for (let j = 0; j < 5; j++) {
      if (!usedIndices.has(j) && guessLetters[i] === targetLetters[j]) {
        result[i] = { letter: guessLetters[i], status: 'present' };
        usedIndices.add(j);
        found = true;
        break;
      }
    }

    if (!found) {
      result[i] = { letter: guessLetters[i], status: 'absent' };
    }
  }

  return result;
}

export function updateKeyboardStatus(
  keyboardStatus: Record<string, LetterStatus>,
  guessResult: LetterState[]
): Record<string, LetterStatus> {
  const newStatus = { ...keyboardStatus };

  for (const { letter, status } of guessResult) {
    const upperLetter = letter.toUpperCase();
    const currentStatus = newStatus[upperLetter];

    if (status === 'correct') {
      newStatus[upperLetter] = 'correct';
    } else if (status === 'present' && currentStatus !== 'correct') {
      newStatus[upperLetter] = 'present';
    } else if (status === 'absent' && !currentStatus) {
      newStatus[upperLetter] = 'absent';
    }
  }

  return newStatus;
}

export function addLetterToGuess(guess: string, letter: string): string {
  if (guess.length >= 5) return guess;
  return guess + letter.toUpperCase();
}

export function removeLetterFromGuess(guess: string): string {
  if (guess.length === 0) return guess;
  return guess.slice(0, -1);
}
