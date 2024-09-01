import React, { useState, useCallback } from 'react';
import { Toolbar, IconButton, Typography, Box, Menu, MenuItem, Button } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import PaletteIcon from '@mui/icons-material/Palette';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import "./Formatting.css";
import { SketchPicker } from 'react-color'; // Import a color picker component

const FormattingToolbar = ({ hotInstance }) => {
    const [fontSize, setFontSize] = useState(12);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [textColor, setTextColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [anchorEl, setAnchorEl] = useState(null);

    const handleTextColorChange = (color) => {
        setTextColor(color.hex);
        applyFormatting('textColor', color.hex);
    };

    const handleBackgroundColorChange = (color) => {
        setBackgroundColor(color.hex);
        applyFormatting('backgroundColor', color.hex);
    };

    const applyFormatting = useCallback((className, value = null) => {
        if (!hotInstance) return;

        const selected = hotInstance.getSelected();
        if (!selected || !selected.length) return;

        hotInstance.suspendRender();

        selected.forEach(([startRow, startCol, endRow, endCol]) => {
            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol; col <= endCol; col++) {
                    let cellMeta = hotInstance.getCellMeta(row, col);

                    if (className === 'fontSize') {
                        cellMeta.fontSize = value;
                    } else if (className === 'fontFamily') {
                        cellMeta.fontFamily = value;
                    } else if (className === 'textColor') {
                        cellMeta.textColor = value;
                    } else if (className === 'backgroundColor') {
                        cellMeta.backgroundColor = value;
                    }

                    hotInstance.setCellMeta(row, col, 'customClass', cellMeta);
                }
            }
        });

        hotInstance.resumeRender();

        const [startRow, startCol, endRow, endCol] = selected[0];
        setTimeout(() => {
            hotInstance.selectCell(startRow, startCol, endRow, endCol, false, false);
            hotInstance.render();
        }, 0);
    }, [hotInstance]);

    return (
        <Box>
            <Toolbar>
                <IconButton onMouseDown={() => applyFormatting('htBold')}>
                    <FormatBoldIcon />
                </IconButton>
                <IconButton onMouseDown={() => applyFormatting('htItalic')}>
                    <FormatItalicIcon />
                </IconButton>
                <IconButton onMouseDown={() => applyFormatting('htUnderline')}>
                    <FormatUnderlinedIcon />
                </IconButton>
                <IconButton onMouseDown={() => applyFormatting('htTextAlignLeft')}>
                    <FormatAlignLeftIcon />
                </IconButton>
                <IconButton onMouseDown={() => applyFormatting('htTextAlignCenter')}>
                    <FormatAlignCenterIcon />
                </IconButton>
                <IconButton onMouseDown={() => applyFormatting('htTextAlignRight')}>
                    <FormatAlignRightIcon />
                </IconButton>
                <IconButton onMouseDown={(e) => setAnchorEl(e.currentTarget)}>
                    <PaletteIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem>
                        <SketchPicker color={textColor} onChangeComplete={handleTextColorChange} />
                    </MenuItem>
                    <MenuItem>
                        <SketchPicker color={backgroundColor} onChangeComplete={handleBackgroundColorChange} />
                    </MenuItem>
                </Menu>
                <IconButton onMouseDown={() => applyFormatting('border', 'all')}>
                    <BorderAllIcon />
                </IconButton>
                <Button onMouseDown={() => applyFormatting('fontFamily', 'Arial')}>Arial</Button>
                <Button onMouseDown={() => applyFormatting('fontFamily', 'Times New Roman')}>Times New Roman</Button>
                <Button onMouseDown={() => applyFormatting('fontFamily', 'Courier New')}>Courier New</Button>
                {/* More font families can be added */}
                <IconButton onMouseDown={() => applyFormatting('fontSize', fontSize - 2)}>
                    <RemoveIcon />
                </IconButton>
                <Typography variant="body1" style={{ padding: '0 10px' }}>
                    {fontSize}px
                </Typography>
                <IconButton onMouseDown={() => applyFormatting('fontSize', fontSize + 2)}>
                    <AddIcon />
                </IconButton>
            </Toolbar>
        </Box>
    );
};

export default FormattingToolbar;
