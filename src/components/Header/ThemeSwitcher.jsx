import { Box, IconButton, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useColorScheme } from "@mui/material/styles";

export default function ThemeSwitcher() {
  const { mode, setMode } = useColorScheme();

  const toggleTheme = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <Tooltip title={`Chuyển sang chế độ ${mode === "light" ? "tối" : "sáng"}`}>
      <IconButton onClick={toggleTheme} color="inherit">
        {mode === "light" ? (
          <LightModeIcon fontSize="small" />
        ) : (
          <DarkModeOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
