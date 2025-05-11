import {
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useColorScheme } from "@mui/material/styles";

export default function ThemeSwitcher() {
  const { mode, setMode } = useColorScheme();

  const handleChange = (e) => {
    setMode(e.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="theme-mode-label">Mode</InputLabel>
      <Select
        labelId="theme-mode-label"
        id="theme-mode-select"
        label="Mode"
        value={mode}
        onChange={handleChange}
      >
        <MenuItem value="light">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LightModeIcon fontSize="small" /> Light
          </div>
        </MenuItem>
        <MenuItem value="dark">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <DarkModeOutlinedIcon fontSize="small" /> Dark
          </div>
        </MenuItem>
      </Select>
    </FormControl>
  );
}
