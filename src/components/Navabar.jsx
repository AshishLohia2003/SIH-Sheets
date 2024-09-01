import React, { useState, useEffect, useCallback } from 'react';
import { Toolbar, IconButton, Typography, Box } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import "./Formatting.css";
import debounce from 'lodash.debounce';

const FormattingToolbar = ({ hotInstance }) => {
    const [fontSize, setFontSize] = useState(12);
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
        textAlign: ''
    });

    const alignmentClasses = ['htTextAlignLeft', 'htTextAlignCenter', 'htTextAlignRight'];

    const applyFormatting = (className, value = null) => {
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
                    let cellMeta = hotInstance.getCellMeta(row, col);
                    let currentClassName = hotInstance.getCellMeta(row, col).className || '';

                    if (className === 'fontSize') {
                        cellMeta.fontSize = value;
                        currentClassName = currentClassName.replace(/fontSize-\d+/g, '').trim();
                        currentClassName += ` fontSize-${value}`;
                    } else if (alignmentClasses.includes(className)) {
                        alignmentClasses.forEach(alignClass => {
                            delete cellMeta[alignClass];
                        });
                        cellMeta[className] = true;
                        alignmentClasses.forEach(alignClass => {
                            currentClassName = currentClassName.replace(alignClass, '').trim();
                        });
                        currentClassName += ` ${className}`;
                    } else {
                        cellMeta[className] = !cellMeta[className];
                        if (currentClassName.includes(className)) {
                            currentClassName = currentClassName.replace(className, '').trim();
                        } else {
                            currentClassName += ` ${className}`;
                        }
                    }

                    hotInstance.setCellMeta(row, col, 'className', currentClassName, cellMeta);
                }
            }
        });

        hotInstance.resumeRender();

        const [startRow, startCol, endRow, endCol] = selected[0];
        setTimeout(() => {
            hotInstance.selectCell(startRow, startCol, endRow, endCol, false, false);
            hotInstance.render();
        }, 0);

        updateFormattingStates();
    };

    const updateFormattingStates = useCallback(debounce(() => {
        if (!hotInstance) return;

        const selected = hotInstance.getSelected();
        if (!selected || !selected.length) return;

        const [startRow, startCol] = selected[0];
        const cellMeta = hotInstance.getCellMeta(startRow, startCol);

        const cellFontSize = cellMeta.fontSize || 12;
        setFontSize(cellFontSize);

        setActiveFormats({
            bold: cellMeta.htBold || false,
            italic: cellMeta.htItalic || false,
            underline: cellMeta.htUnderline || false,
            textAlign: alignmentClasses.find(alignmentClass => cellMeta[alignmentClass]) || ''
        });
    }, 200), [hotInstance]);

    useEffect(() => {
        updateFormattingStates();
    }, [hotInstance?.getSelected(), updateFormattingStates]);

    const increaseFontSize = () => {
        const newSize = Math.min(fontSize + 2, 36);
        setFontSize(newSize);
        applyFormatting('fontSize', newSize);
    };

    const decreaseFontSize = () => {
        const newSize = Math.max(fontSize - 2, 8);
        setFontSize(newSize);
        applyFormatting('fontSize', newSize);
    };

    const getButtonStyle = (isActive) => ({
        backgroundColor: isActive ? '#d3e3fd' : 'transparent',
    });


    return (
        <Box
            mx={1}
            my={0.8}
            bgcolor="#edf2fa"
            borderRadius="40px"
        >
            <Toolbar>
                <IconButton
                    onMouseDown={() => applyFormatting('htBold')}
                    sx={getButtonStyle(activeFormats.bold)}
                >
                    <FormatBoldIcon />
                </IconButton>
                <IconButton
                    onMouseDown={() => applyFormatting('htItalic')}
                    sx={getButtonStyle(activeFormats.italic)}
                >
                    <FormatItalicIcon />
                </IconButton>
                <IconButton
                    onMouseDown={() => applyFormatting('htUnderline')}
                    sx={getButtonStyle(activeFormats.underline)}
                >
                    <FormatUnderlinedIcon />
                </IconButton>
                <IconButton
                    onMouseDown={() => applyFormatting('htTextAlignLeft')}
                    sx={getButtonStyle(activeFormats.textAlign === 'htTextAlignLeft')}
                >
                    <FormatAlignLeftIcon />
                </IconButton>
                <IconButton
                    onMouseDown={() => applyFormatting('htTextAlignCenter')}
                    sx={getButtonStyle(activeFormats.textAlign === 'htTextAlignCenter')}
                >
                    <FormatAlignCenterIcon />
                </IconButton>
                <IconButton
                    onMouseDown={() => applyFormatting('htTextAlignRight')}
                    sx={getButtonStyle(activeFormats.textAlign === 'htTextAlignRight')}
                >
                    <FormatAlignRightIcon />
                </IconButton>
                <IconButton onMouseDown={decreaseFontSize}>
                    <RemoveIcon />
                </IconButton>
                <Typography variant="body1" style={{ padding: '0 10px' }}>
                    {fontSize}px
                </Typography>
                <IconButton onMouseDown={increaseFontSize}>
                    <AddIcon />
                </IconButton>
            </Toolbar>
        </Box>
    );
};

export default FormattingToolbar;
