import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const DAYS = [
    { key: "monday", label: "M" },
    { key: "tuesday", label: "T" },
    { key: "wednesday", label: "W" },
    { key: "thursday", label: "T" },
    { key: "friday", label: "F" },
  ];

  const StyledToggleButtonGroup = withStyles(theme => ({
    grouped: {
      margin: theme.spacing(2),
      padding: theme.spacing(0, 1),
      border: "1px solid #daaa00",
    borderRadius: "50%"
    }
  }))(ToggleButtonGroup);
  
  const StyledToggle = withStyles({
    root: {
      color: "#daaa00",
      border: "1px solid #daaa00", // Border color for all states
      backgroundColor: "white",
      "&$selected": {
        color: "white",
        background: "#daaa00"
      },
      "&:hover": {
        borderColor: "#daaa00",
        background: "#daaa00"
      },
      "&:hover$selected": {
        borderColor: "#daaa00",
        background: "#daaa00"
      },
      minWidth: 32,
      maxWidth: 32,
      height: 32,
      textTransform: "unset",
      fontSize: "0.75rem"
    },
    selected: {}
  })(ToggleButton);
  
  const DayPicker = ({ selectedDays, setSelectedDays }) => {
    return (
      <StyledToggleButtonGroup
        size="small"
        arial-label="Days of the week"
        value={selectedDays}
        onChange={(event, value) => setSelectedDays(value)}
      >
        {DAYS.map((day, index) => (
          <StyledToggle key={day.key} value={index} aria-label={day.key}>
            {day.label}
          </StyledToggle>
        ))}
      </StyledToggleButtonGroup>
    );
  };
  
  export default DayPicker;