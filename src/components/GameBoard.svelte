<script lang="ts">
  import type { GameState } from '../lib/gameLogic';

  export let gameState: GameState;
</script>

<div class="game-board">
  {#each gameState.guesses as row, rowIndex}
    <div class="board-row">
      {#each row as cell, colIndex}
        {@const isCurrentRow = rowIndex === gameState.currentRow}
        {@const letter = isCurrentRow && colIndex < gameState.currentGuess.length
          ? gameState.currentGuess[colIndex]
          : cell.letter}
        {@const status = !isCurrentRow ? cell.status : 'empty'}
        
        <div
          class="board-cell"
          class:correct={status === 'correct'}
          class:present={status === 'present'}
          class:absent={status === 'absent'}
          class:filled={letter && isCurrentRow}
        >
          {letter}
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .game-board {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin: 20px 0;
  }

  .board-row {
    display: flex;
    gap: 6px;
  }

  .board-cell {
    width: 58px;
    height: 58px;
    border: 2px solid #3a3a3c;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    text-transform: uppercase;
    transition: all 0.3s ease;
  }

  .board-cell.filled {
    border-color: #565758;
  }

  .board-cell.correct {
    background-color: #538d4e;
    border-color: #538d4e;
  }

  .board-cell.present {
    background-color: #b59f3b;
    border-color: #b59f3b;
  }

  .board-cell.absent {
    background-color: #3a3a3c;
    border-color: #3a3a3c;
  }

  @media (max-width: 400px) {
    .board-cell {
      width: 48px;
      height: 48px;
      font-size: 1.5rem;
    }
  }
</style>
