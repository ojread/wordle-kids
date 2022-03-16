import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import { Box, IconButton, Popover, Typography } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import GameTiles from './components/GameTiles';
import Keyboard from './components/Keyboard';
import allWords from './words.json';
import dictionary from './dictionary.json';

const TOTAL_GUESSES = 6;

interface AppState {
  wordLength: number;
  guesses: string[];
  guess: string;
  guessLocked: boolean;
  shake: boolean;
  target: string;
  keyboardStyle: 'qwerty' | 'abc';
  anchorElement: HTMLButtonElement | null;
}

function App() {
  const [state, setState] = useState<AppState>({
    wordLength: 3,
    guesses: [],
    guess: '',
    guessLocked: false,
    shake: false,
    target: '',
    keyboardStyle: 'abc',
    anchorElement: null,
  });

  const {
    wordLength,
    guesses,
    guess,
    guessLocked,
    shake,
    target,
    keyboardStyle,
    anchorElement,
  } = state;

  useEffect(() => {
    if (target === '') {
      const words = (allWords as Record<string, string[]>)[`${wordLength}`];

      setState({
        ...state,
        target: words[Math.floor(Math.random() * words.length)].toUpperCase(),
      });
    }
  }, [state, target, wordLength]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setState({ ...state, anchorElement: event.currentTarget });
  };
  const handleClose = () => {
    setState({ ...state, anchorElement: null });
  };
  const popoverOpen = useMemo(() => Boolean(anchorElement), [anchorElement]);

  const guessesLeft = TOTAL_GUESSES - guesses.length;

  const lastGuess = useMemo(() => {
    if (guesses.length > 0) {
      return guesses[guesses.length - 1];
    }

    return '';
  }, [guesses]);

  const onLetterEntered = useCallback(
    (letter: string) => {
      console.log(
        lastGuess,
        target,
        guess.length,
        wordLength,
        `${guess}${letter}`
      );
      if (lastGuess !== target && guess.length < wordLength) {
        setState({
          ...state,
          guess: `${guess}${letter}`,
        });
      }
    },
    [guess, lastGuess, state, target, wordLength]
  );

  const onGuess = useCallback(() => {
    if (
      lastGuess !== target &&
      guess.length === wordLength &&
      guessesLeft > 0 &&
      !shake
    ) {
      if (!dictionary.includes(guess.toLowerCase())) {
        setState({
          ...state,
          shake: true,
        });
        setTimeout(() => {
          setState({
            ...state,
            shake: false,
          });
        }, 300);
        return;
      }

      setState({
        ...state,
        guessLocked: true,
      });
    }
  }, [guess, guessesLeft, lastGuess, shake, state, target, wordLength]);

  const onGuessFinish = useCallback(() => {
    if (
      lastGuess !== target &&
      guess.length === wordLength &&
      guessesLeft > 0 &&
      dictionary.includes(guess.toLowerCase())
    ) {
      setState({
        ...state,
        guesses: [...guesses, guess],
        guess: '',
        guessLocked: false,
      });
    }
  }, [guess, guesses, guessesLeft, lastGuess, state, target, wordLength]);

  const onLetterDeleted = useCallback(() => {
    if (lastGuess !== target && guess.length > 0) {
      setState({
        ...state,
        guess: guess.slice(0, -1),
      });
    }
  }, [guess, lastGuess, state, target]);

  const onWordLengthHandler = useCallback(
    (length: number) => {
      const words = (allWords as Record<string, string[]>)[`${length}`];

      setState({
        ...state,
        wordLength: length,
        anchorElement: null,
        guesses: [],
        guess: '',
        target: words[Math.floor(Math.random() * words.length)].toUpperCase(),
      });
    },
    [state]
  );

  const onChangeKeyboardStyle = useCallback(() => {
    if (keyboardStyle === 'abc') {
      setState({
        ...state,
        keyboardStyle: 'qwerty',
        anchorElement: null,
      });
      return;
    }

    setState({
      ...state,
      keyboardStyle: 'abc',
      anchorElement: null,
    });
  }, [keyboardStyle, state]);

  console.log(state);

  return (
    <div className="App">
      <header className="App-header">
        <Typography
          variant="h4"
          sx={{
            display: 'flex',
            borderBottom: '1px solid #3a3a3c',
            height: '51px',
            lineHeight: '51px',
            mb: '10px',
            fontWeight: 600,
            width: '100%',
            boxSizing: 'border-box',
            alignItems: 'center',
          }}
        >
          <Box sx={{ flexGrow: 1 }}></Box>
          Wordle for Kids
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-end' }}>
            <IconButton onClick={handleClick}>
              <SettingsOutlinedIcon sx={{ color: 'white' }} />
            </IconButton>
            <Popover
              open={popoverOpen}
              anchorEl={anchorElement}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Typography sx={{ p: 1 }}>
                <Box
                  sx={{ p: 1, cursor: 'pointer' }}
                  onClick={() => onWordLengthHandler(3)}
                >
                  3 Letter Words
                </Box>
                <Box
                  sx={{ p: 1, cursor: 'pointer' }}
                  onClick={() => onWordLengthHandler(4)}
                >
                  4 Letter Words
                </Box>
                <Box
                  sx={{ p: 1, cursor: 'pointer' }}
                  onClick={() => onWordLengthHandler(5)}
                >
                  5 Letter Words
                </Box>
                <Box
                  sx={{ p: 1, cursor: 'pointer' }}
                  onClick={onChangeKeyboardStyle}
                >
                  Change to {keyboardStyle === 'abc' ? 'QWERTY' : 'ABC'}{' '}
                  keyboard
                </Box>
              </Typography>
            </Popover>
          </Box>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            display: 'grid',
            gridTemplateRows: 'repeat(6, 1fr)',
            gridGap: '6px',
          }}
        >
          {guesses.map((guess, index) => (
            <GameTiles
              target={target}
              key={`previous-guess-${index}`}
              word={guess}
              wordLength={wordLength}
              locked
            />
          ))}
          {guessesLeft > 0 ? (
            <GameTiles
              key={`current-guess-${guesses.length}`}
              target={target}
              word={guess}
              wordLength={wordLength}
              shake={shake}
              locked={guessLocked}
              onLastTileFlip={onGuessFinish}
            />
          ) : null}
          {guessesLeft > 1
            ? [...Array(guessesLeft - 1)].map((_, index) => (
                <GameTiles
                  target={target}
                  key={`next-guess-${index}`}
                  word=""
                  wordLength={wordLength}
                />
              ))
            : null}
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Keyboard
          guesses={guesses}
          target={target}
          keyboardStyle={keyboardStyle}
          onGuess={onGuess}
          onLetterEntered={onLetterEntered}
          onLetterDeleted={onLetterDeleted}
        />
      </header>
    </div>
  );
}

export default App;
