import React, { useState } from "react";
import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { Pages } from "utils/utils";

interface iProps {
  changeSample: (item: string) => void;
}

export default function Navbar({changeSample}: iProps) {
  const [selectedIndex, setSelectedIndex] = useState("ERC20 Token");
  const onChange = (sample: string) => {
    setSelectedIndex(sample);
    changeSample(sample);
  }
  return (
    <Box sx={{ width: '100%', maxWidth: 260, bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="secondary mailbox folder">
        {
          Pages.map(page => (
            <ListItemButton
              selected={selectedIndex === page}
              onClick={() => onChange(page)}
              key={page}
            >
              <ListItemText primary={page} />
            </ListItemButton>
          ))
        }
        
      </List>
    </Box>
  );
}