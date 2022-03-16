import { Box } from '@mui/material';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import KeyboardButton from './KeyboardButton';

interface KeyboardProps {
  keyboardRef: React.RefObject<HTMLDivElement>;
  guesses: string[];
  target: string;
  keyboardStyle: 'qwerty' | 'abc';
  onGuess: () => void;
  onLetterEntered: (letter: string) => void;
  onLetterDeleted: () => void;
}

function Keyboard({
  keyboardRef,
  guesses,
  target,
  keyboardStyle,
  onGuess,
  onLetterEntered,
  onLetterDeleted,
}: KeyboardProps) {
  return keyboardStyle === 'abc' ? (
    <Box
      ref={keyboardRef}
      key="abc-keyboard"
      sx={{
        display: 'grid',
        gridTemplateRows: `repeat(3, 1fr)`,
        mt: '10px',
        ml: 1,
        mr: 1,
        width: 'calc(100% - 16px)',
        maxWidth: '484px'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          margin: '0 auto 8px',
        }}
      >
        <KeyboardButton
          letter="A"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="B"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="C"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="D"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="E"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="F"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="G"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="H"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="I"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="J"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          margin: '0 auto 8px',
        }}
      >
        <Box sx={{ flexGrow: 1, flex: 0.5 }} />
        <KeyboardButton
          letter="K"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="L"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="M"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="N"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="O"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="P"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="Q"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="R"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="S"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <Box sx={{ flexGrow: 1, flex: 0.5 }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          margin: '0 auto 8px',
        }}
      >
        <KeyboardButton
          label="Enter"
          guesses={guesses}
          target={target}
          onClick={onGuess}
          sx={{ flex: 1.5 }}
        />
        <KeyboardButton
          letter="T"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="U"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="V"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="W"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="X"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="Y"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="Z"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          label={<BackspaceOutlinedIcon />}
          guesses={guesses}
          target={target}
          onClick={onLetterDeleted}
          sx={{ flex: 1.5 }}
        />
      </Box>
    </Box>
  ) : (
    <Box
      ref={keyboardRef}
      key="qwerty-keyboard"
      sx={{
        display: 'grid',
        gridTemplateRows: `repeat(3, 1fr)`,
        gridGap: '5px',
        mt: '10px',
        ml: 1,
        mr: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          margin: '0 auto 8px',
        }}
      >
        <KeyboardButton
          letter="Q"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="W"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="E"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="R"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="T"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="Y"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="U"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="I"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="O"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="P"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          margin: '0 auto 8px',
        }}
      >
        <Box sx={{ flexGrow: 1 }} />
        <KeyboardButton
          letter="A"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="S"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="D"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="F"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="G"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="H"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="J"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="K"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="L"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <Box sx={{ flexGrow: 1 }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          margin: '0 auto 8px',
        }}
      >
        <KeyboardButton
          label="Enter"
          guesses={guesses}
          target={target}
          onClick={onGuess}
          sx={{ flex: 1.5 }}
        />
        <KeyboardButton
          letter="Z"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="X"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="C"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="V"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="B"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="N"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          letter="M"
          guesses={guesses}
          target={target}
          onClick={onLetterEntered}
        />
        <KeyboardButton
          label={<BackspaceOutlinedIcon />}
          guesses={guesses}
          target={target}
          onClick={onLetterDeleted}
          sx={{ flex: 1.5 }}
        />
      </Box>
    </Box>
  );
}

export default Keyboard;
