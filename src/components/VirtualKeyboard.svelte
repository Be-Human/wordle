<script lang="ts">
  import type { LetterStatus } from '../lib/gameLogic';

  export let keyboardStatus: Record<string, LetterStatus>;
  export let onKeyPress: (key: string) => void;

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
  ];
</script>

<div class="virtual-keyboard">
  {#each keyboardRows as row}
    <div class="keyboard-row">
      {#each row as key}
        {@const isSpecialKey = key === 'ENTER' || key === 'BACK'}
        {@const status = !isSpecialKey ? keyboardStatus[key] : undefined}
        
        <button
          class="keyboard-key"
          class:special={isSpecialKey}
          class:correct={status === 'correct'}
          class:present={status === 'present'}
          class:absent={status === 'absent'}
          on:click={() => onKeyPress(key)}
        >
          {#if key === 'BACK'}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6H8L3 12l5 6h12l5-6-5-6z" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          {:else}
            {key}
          {/if}
        </button>
      {/each}
    </div>
  {/each}
</div>

<style>
  .virtual-keyboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    user-select: none;
  }

  .keyboard-row {
    display: flex;
    gap: 6px;
  }

  .keyboard-key {
    background-color: #818384;
    border: none;
    border-radius: 4px;
    color: #ffffff;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    height: 58px;
    min-width: 43px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    transition: background-color 0.2s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .keyboard-key:hover {
    background-color: #a1a3a4;
  }

  .keyboard-key:active {
    transform: scale(0.95);
  }

  .keyboard-key.special {
    font-size: 0.8rem;
    padding: 0 10px;
    min-width: 65px;
  }

  .keyboard-key.correct {
    background-color: #538d4e;
  }

  .keyboard-key.correct:hover {
    background-color: #6aa865;
  }

  .keyboard-key.present {
    background-color: #b59f3b;
  }

  .keyboard-key.present:hover {
    background-color: #d4ba4a;
  }

  .keyboard-key.absent {
    background-color: #3a3a3c;
  }

  .keyboard-key.absent:hover {
    background-color: #4a4a4c;
  }

  @media (max-width: 400px) {
    .keyboard-key {
      height: 48px;
      min-width: 35px;
      padding: 0 12px;
      font-size: 0.9rem;
    }

    .keyboard-key.special {
      min-width: 55px;
      padding: 0 8px;
      font-size: 0.7rem;
    }
  }
</style>
