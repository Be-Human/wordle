<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import GameBoard from './components/GameBoard.svelte';
  import VirtualKeyboard from './components/VirtualKeyboard.svelte';
  import { getRandomWord, words } from './lib/words';
  import { 
  createInitialGameState, 
  checkGuess, 
  updateKeyboardStatus, 
  addLetterToGuess, 
  removeLetterFromGuess
} from './lib/gameLogic';
import type { GameState, GameStatus } from './lib/gameLogic';

  let gameState: GameState = createInitialGameState(getRandomWord());
  let showMessage = false;
  let message = '';
  let showResult = false;

  function displayMessage(msg: string, duration = 2000) {
    message = msg;
    showMessage = true;
    setTimeout(() => {
      showMessage = false;
    }, duration);
  }

  function submitGuess() {
    if (gameState.currentGuess.length !== 5) {
      displayMessage('单词必须是5个字母');
      return;
    }

    if (!words.includes(gameState.currentGuess)) {
      displayMessage('不在单词库中');
      return;
    }

    const guessResult = checkGuess(gameState.currentGuess, gameState.targetWord);
    
    gameState.guesses[gameState.currentRow] = guessResult;
    gameState.keyboardStatus = updateKeyboardStatus(gameState.keyboardStatus, guessResult);
    
    const isWin = gameState.currentGuess === gameState.targetWord;
    
    if (isWin) {
      gameState.gameStatus = 'won';
      showResult = true;
    } else if (gameState.currentRow === 5) {
      gameState.gameStatus = 'lost';
      showResult = true;
    } else {
      gameState.currentRow++;
      gameState.currentGuess = '';
    }
  }

  function handleKeyPress(key: string) {
    if (gameState.gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACK') {
      gameState.currentGuess = removeLetterFromGuess(gameState.currentGuess);
    } else if (/^[A-Z]$/.test(key)) {
      gameState.currentGuess = addLetterToGuess(gameState.currentGuess, key);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleKeyPress('ENTER');
    } else if (e.key === 'Backspace') {
      handleKeyPress('BACK');
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      handleKeyPress(e.key.toUpperCase());
    }
  }

  function restartGame() {
    gameState = createInitialGameState(getRandomWord());
    showResult = false;
    showMessage = false;
  }

  function getResultTitle(): string {
    return gameState.gameStatus === 'won' ? '🎉 恭喜你！' : '😔 游戏结束';
  }

  function getResultMessage(): string {
    if (gameState.gameStatus === 'won') {
      const attempts = gameState.currentRow + 1;
      return `你用了 ${attempts} 次猜中了！`;
    } else {
      return `正确答案是: ${gameState.targetWord}`;
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
</script>

<div class="app">
  <header class="header">
    <h1>WORDLE</h1>
  </header>

  <main class="main-content">
    {#if showMessage}
      <div class="message-popup">
        {message}
      </div>
    {/if}

    <GameBoard {gameState} />

    <VirtualKeyboard 
      keyboardStatus={gameState.keyboardStatus} 
      onKeyPress={handleKeyPress}
    />
  </main>

  {#if showResult}
    <div class="modal-overlay" on:click={restartGame}>
      <div class="modal-content" on:click|stopPropagation>
        <h2>{getResultTitle()}</h2>
        <p class="result-message">{getResultMessage()}</p>
        <p class="attempts-info">
          已尝试: {gameState.currentRow + 1} / 6 次
        </p>
        <button class="restart-button" on:click={restartGame}>
          再来一局
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
  }

  .header {
    width: 100%;
    padding: 15px 0;
    border-bottom: 1px solid #3a3a3c;
    text-align: center;
  }

  .header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: 0.2rem;
    margin: 0;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    padding: 20px 0;
    position: relative;
  }

  .message-popup {
    position: absolute;
    top: 0;
    background-color: #ffffff;
    color: #121213;
    padding: 12px 24px;
    border-radius: 4px;
    font-weight: bold;
    z-index: 100;
    animation: fadeInOut 2s ease-in-out;
  }

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
    15% { opacity: 1; transform: translateY(0); }
    85% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: #121213;
    border: 1px solid #3a3a3c;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    max-width: 400px;
    width: 90%;
  }

  .modal-content h2 {
    margin: 0 0 20px 0;
    font-size: 1.8rem;
  }

  .result-message {
    font-size: 1.2rem;
    margin: 0 0 10px 0;
    line-height: 1.5;
  }

  .attempts-info {
    font-size: 1rem;
    color: #818384;
    margin: 0 0 25px 0;
  }

  .restart-button {
    background-color: #538d4e;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 12px 30px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .restart-button:hover {
    background-color: #6aa865;
  }

  .restart-button:active {
    transform: scale(0.98);
  }
</style>
