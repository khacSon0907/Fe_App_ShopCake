import { useColorScheme } from '@mui/material/styles';
import { Button, Typography } from '@mui/material';

export default function App() {
  const { mode, setMode } = useColorScheme();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Chế độ hiện tại: {mode}
      </Typography>
      <Button
        variant="contained"
        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      >
        Chuyển sang {mode === 'light' ? 'dark' : 'light'} mode
      </Button>
    </>
  );
}
