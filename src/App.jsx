import { useColorScheme } from "@mui/material/styles";
import { Button, Typography } from "@mui/material";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
export default function App() {
  const { mode, setMode } = useColorScheme();
  const handleChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
  };

  return (
    <>
    <div className="header">
 <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="label-select-dark-light-mode">Mode</InputLabel>
        <Select
          labelId="label-select-dark-light-mode"
          id="select-dark-light-mode"
          label="Mode"
          value={mode}
          onChange={handleChange}
        >
          <MenuItem value="light">
            <div style={{ display: "flex", alignItems:"center",gap:8 }}>
              <LightModeIcon fontSize="small"/> Light
            </div>
          </MenuItem>

          <MenuItem value="dark">
             <div style={{ display: "flex", alignItems:"center",gap:8 }}>
              <DarkModeOutlinedIcon fontSize="small"/> Dark
            </div>
          </MenuItem>
      
        </Select>
      </FormControl>
    </div>
     
    </>
  );
}
