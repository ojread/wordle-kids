import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import './App.css';
import {
  Alert,
  Box,
  Grow,
  GrowProps,
  IconButton,
  Popover,
  Snackbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import GameTiles from './components/GameTiles';
import Keyboard from './components/Keyboard';
import allWords from './words.json';
import dictionary from './dictionary.json';

const TOTAL_GUESSES = 6;
const DEFAULT_WIDTH_MULTIPLIER = 66;
const MARGIN = 30;

const useSize = (target: React.RefObject<HTMLDivElement>) => {
  const [size, setSize] = React.useState<DOMRectReadOnly>();

  React.useLayoutEffect(() => {
    if (!target.current) {
      return;
    }
    setSize(target.current.getBoundingClientRect());
  }, [target]);

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
};

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

function loadState(): AppState {
  const rawData = window.localStorage.getItem('data');
  if (!rawData) {
    return {
      wordLength: 3,
      guesses: [],
      guess: '',
      guessLocked: false,
      target: '',
      keyboardStyle: 'abc',
      showTarget: false,
    };
  }

  return JSON.parse(rawData) as AppState;
}

function saveState(state: AppState) {
  window.localStorage.setItem('data', JSON.stringify(state));
}

function GrowTransition(props: GrowProps) {
  return <Grow {...props} />;
}

interface AppState {
  wordLength: number;
  guesses: string[];
  guess: string;
  guessLocked: boolean;
  target: string;
  keyboardStyle: 'qwerty' | 'abc';
  showTarget: boolean;
}

interface BadWordState {
  shake: boolean;
  showNotInWordList: boolean;
}

function App() {
  const size = useWindowSize();

  const headerRef = React.useRef<HTMLDivElement>(null);
  const headerSize = useSize(headerRef);

  const keyboardRef = React.useRef<HTMLDivElement>(null);
  const keyboardSize = useSize(keyboardRef);

  const onBigScreen = useMediaQuery('(min-height:700px)');

  const [state, setState] = useState<AppState>(loadState());

  saveState(state);

  const [badWordState, setBadWordState] = useState<BadWordState>({
    shake: false,
    showNotInWordList: false,
  });

  const {
    wordLength,
    guesses,
    guess,
    guessLocked,
    target,
    keyboardStyle,
    showTarget,
  } = state;

  const { shake, showNotInWordList } = badWordState;

  useEffect(() => {
    if (target === '') {
      const words = (allWords as Record<string, string[]>)[`${wordLength}`];

      setState({
        ...state,
        target: words[Math.floor(Math.random() * words.length)].toUpperCase(),
      });
    }
  }, [state, target, wordLength]);

  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
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
        setBadWordState({
          shake: true,
          showNotInWordList: true,
        });
        setTimeout(() => {
          setBadWordState({
            shake: false,
            showNotInWordList: true,
          });
        }, 300);
        setTimeout(() => {
          setBadWordState({
            shake: false,
            showNotInWordList: false,
          });
        }, 2000);
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
        showTarget: guesses.length + 1 === TOTAL_GUESSES && guess !== target,
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

      setAnchorElement(null);
      setState({
        ...state,
        wordLength: length,
        guesses: [],
        guess: '',
        target: words[Math.floor(Math.random() * words.length)].toUpperCase(),
        showTarget: false,
      });
    },
    [state]
  );

  const onChangeKeyboardStyle = useCallback(() => {
    if (keyboardStyle === 'abc') {
      setAnchorElement(null);
      setState({
        ...state,
        keyboardStyle: 'qwerty',
      });
      return;
    }

    setAnchorElement(null);
    setState({
      ...state,
      keyboardStyle: 'abc',
    });
  }, [keyboardStyle, state]);

  const widthMultiplier = useMemo(() => {
    if (
      onBigScreen ||
      !size?.height ||
      !headerSize?.height ||
      !keyboardSize?.height
    ) {
      return DEFAULT_WIDTH_MULTIPLIER;
    }

    const playareaHeight =
      size.height - headerSize.height - keyboardSize.height - MARGIN;

    return (playareaHeight - (TOTAL_GUESSES - 1) * 5) / TOTAL_GUESSES;
  }, [headerSize?.height, keyboardSize?.height, onBigScreen, size.height]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'a':
        case 'b':
        case 'c':
        case 'd':
        case 'e':
        case 'f':
        case 'g':
        case 'h':
        case 'i':
        case 'j':
        case 'k':
        case 'l':
        case 'm':
        case 'n':
        case 'o':
        case 'p':
        case 'q':
        case 'r':
        case 's':
        case 't':
        case 'u':
        case 'v':
        case 'w':
        case 'x':
        case 'y':
        case 'z':
          onLetterEntered(event.key.toUpperCase());
          break;
        case 'Enter':
          onGuess();
          break;
        case 'Backspace':
          onLetterDeleted();
          break;
      }
    },
    [onGuess, onLetterDeleted, onLetterEntered]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div className="App">
      <header
        className={`App-header${onBigScreen ? '' : ' App-header-mobile'}`}
      >
        <Typography
          ref={headerRef}
          variant={onBigScreen ? 'h4' : 'h5'}
          component="div"
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
            <IconButton
              onClick={handleClick}
              sx={
                onBigScreen
                  ? undefined
                  : {
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                    }
              }
            >
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
              <Typography component="div" sx={{ p: 1 }}>
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
            width: `${wordLength * widthMultiplier + (wordLength - 1) * 5}px`,
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
          keyboardRef={keyboardRef}
          guesses={guesses}
          target={target}
          keyboardStyle={keyboardStyle}
          onGuess={onGuess}
          onLetterEntered={onLetterEntered}
          onLetterDeleted={onLetterDeleted}
        />
      </header>
      <Snackbar open={showTarget} TransitionComponent={GrowTransition}>
        <Alert
          classes={{
            message: 'alertMessage',
          }}
          sx={{
            position: 'fixed',
            width: '80%',
            maxWidth: '484px',
            height: '48px',
            top: 'calc(50% - 48px)',
            left: (size?.width ?? 0) < 484 ? '10%' : 'calc(50% - 242px)',
            boxSizing: 'border-box',
            fontSize: 16,
            fontWeight: 'bold',
          }}
          severity="error"
        >
          {showTarget ? target : ''}
        </Alert>
      </Snackbar>
      <Snackbar open={showNotInWordList} TransitionComponent={GrowTransition}>
        <Alert
          classes={{
            message: 'alertMessage',
          }}
          sx={{
            position: 'fixed',
            width: '80%',
            maxWidth: '484px',
            height: '48px',
            top: 'calc(50% - 48px)',
            left: '10%',
            boxSizing: 'border-box',
            fontSize: 16,
            fontWeight: 'bold',
          }}
          severity="warning"
        >
          Not in word list
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
