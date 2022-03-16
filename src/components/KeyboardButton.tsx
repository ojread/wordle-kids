import { Box, SxProps, Theme } from '@mui/material';
import { useCallback, useMemo } from 'react';

interface KeyboardButtonProps {
  letter?: string;
  label?: React.ReactNode;
  guesses: string[];
  target: string;
  onClick: (label: string) => void;
  sx?: SxProps<Theme> | undefined;
}

function KeyboardButton({
  letter,
  label,
  guesses,
  target,
  onClick,
  sx,
}: KeyboardButtonProps) {
  const onClickHandler = useCallback(
    () => onClick(letter ?? ''),
    [onClick, letter]
  );

  const backgroundColor = useMemo(() => {
    if (!letter) {
      return '#818384';
    }

    let foundAt: number[] = [];
    guesses.forEach((guess) => {
      guess.split('').forEach((guessLetter, index) => {
        if (letter === guessLetter) {
          foundAt.push(index);
        }
      });
    });
    foundAt = foundAt.filter(
      (value, index, self) => self.indexOf(value) === index
    );

    if (foundAt.length === 0) {
      return '#818384';
    }

    if (foundAt.length > 0 && !target.includes(letter)) {
      return '#3a3a3c';
    }

    let inRightSpot = false;
    for (const index of foundAt) {
      if (target.charAt(index) === letter) {
        inRightSpot = true;
        break;
      }
    }

    if (inRightSpot) {
      return '#538d4e';
    }

    return '#b59f3b';
  }, [guesses, letter, target]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: backgroundColor,
        border: 0,
        padding: 0,
        margin: '0 6px 0 0',
        height: '58px',
        borderRadius: '4px',
        fontSize: letter ? '13.333px' : '12px',
        fontWeight: letter ? 'bold' : '400',
        textTransform: 'uppercase',
        userSelect: 'none',
        flex: 1,
        ...sx,
      }}
      onClick={onClickHandler}
    >
      {label ?? letter ?? ''}
    </Box>
  );
}

export default KeyboardButton;
