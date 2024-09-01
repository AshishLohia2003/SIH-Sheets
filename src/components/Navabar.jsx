import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Select, MenuItem, TextField, Button, Box } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import "./Formatting.css"

const FormattingToolbar = ({ hotInstance }) => {
    const applyFormatting = (className) => {
        if (!hotInstance) {
            console.error("HotTable instance is not available.");
            return;
        }

        const selected = hotInstance.getSelected();
        if (!selected || !selected.length) {
            console.warn("No cells are selected.");
            return;
        }

        hotInstance.suspendRender();

        selected.forEach(([startRow, startCol, endRow, endCol]) => {
            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol; col <= endCol; col++) {
                    let currentClassName = hotInstance.getCellMeta(row, col).className || '';

                    if (currentClassName.includes(className)) {
                        currentClassName = currentClassName.replace(className, '').trim();
                    } else {
                        currentClassName += ` ${className}`;
                    }

                    hotInstance.setCellMeta(row, col, 'className', currentClassName);
                }
            }
        });

        hotInstance.resumeRender();
        hotInstance.render();

        const [startRow, startCol, endRow, endCol] = selected[0];
        setTimeout(() => {
            hotInstance.selectCell(startRow, startCol, endRow, endCol);
            hotInstance.render();
        }, 0);
    };



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
                <Select
                    defaultValue="12"
                    onChange={(e) => applyFormatting('fontSize', e.target.value)}
                >
                    <MenuItem value="8">8px</MenuItem>
                    <MenuItem value="10">10px</MenuItem>
                    <MenuItem value="12">12px</MenuItem>
                    <MenuItem value="14">14px</MenuItem>
                    <MenuItem value="16">16px</MenuItem>
                </Select>
            </Toolbar>
        </Box>
    );
};

export default FormattingToolbar;
