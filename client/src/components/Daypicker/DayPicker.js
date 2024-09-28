import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import styles from "./DayPicker.module.css"
const DAYS = [
  { key: "M", label: "M" },
  { key: "T", label: "T" },
  { key: "W", label: "W" },
  { key: "R", label: "R" },
  { key: "F", label: "F" },
];

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  //margin: theme.spacing(2),
  //padding: theme.spacing(0, 1),
  // borderRadius: '50%',
  // Additional custom styles if needed
}));

const StyledToggle = styled(ToggleButton)(({ theme }) => ({
  color: "black",
  // border: "1px solid black", 
  backgroundColor: "white",
  "&.Mui-selected": {
    color: "white",
    background: "#daaa00",
  },
  "&:hover": {
    borderColor: "#daaa00",
    background: "#daaa00",
  },
  "&:hover.Mui-selected": {
    borderColor: "#daaa00",
    background: "#daaa00",
  },
  width: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textTransform: 'unset',
}));

const DayPicker = ({ selectedDays, setSelectedDays }) => {
  return (
    <StyledToggleButtonGroup
      size="small"
      arial-label="Days of the week"
      value={selectedDays}
      style={{ gap: "10px" }}
      onChange={(event, value) => {
        console.log(value);
        setSelectedDays(value)
      }}
    >
      {DAYS.map((day, index) => (
        <StyledToggle key={day.key} value={day.key} style={{ borderRadius: "20px", border: "1px solid #000000" }} className={styles.circleDay} aria-label={day.key}>
          {day.label}
        </StyledToggle>
      ))}
    </StyledToggleButtonGroup>
  );
};

export default DayPicker;