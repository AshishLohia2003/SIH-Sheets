// src/components/Spreadsheet.js
import React, { useRef, useState, useEffect } from 'react';
import Handsontable from 'handsontable';
import { HyperFormula } from 'hyperformula';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { registerAllModules } from 'handsontable/registry';
import { DropdownMenu, ManualColumnResize, ManualRowResize } from 'handsontable/plugins';
import FormattingToolbar from './Navabar';
import { io } from 'socket.io-client';

registerAllModules();

// const socket = io('http://localhost:3000');

const Spreadsheet = () => {
    const hotRef = useRef(null);
    console.log(hotRef.current)

    const [rows, setRows] = useState(100);
    const [columns, setColumns] = useState(26);

    const [hotAvailable, setHotAvailable] = useState(false);


    // useEffect(() => {
    //     if (hotRef.current) {
    //         const hotInstance = hotRef.current.hotInstance;

    //         hotInstance.addHook('afterChange', (changes, source) => {
    //             if (source === 'loadData') {
    //                 return; // Don't emit if data is just being loaded
    //             }

    //             if (changes) {
    //                 changes.forEach(([row, col, oldValue, newValue]) => {
    //                     const data = {
    //                         row,
    //                         col,
    //                         oldValue,
    //                         newValue
    //                     };
    //                     socket.emit('cellEdit', data); // Emit the event to the backend
    //                 });
    //             }
    //         });
    //     }
    // }, []);



    useEffect(() => {
        if (hotRef.current?.hotInstance) {
            setHotAvailable(true);
        }
    }, [hotRef.current]);

    const [data, setData] = useState(
        Array.from({ length: rows }, () => Array(columns).fill(''))
    );

    const hotSettings = {
        data: data,
        colHeaders: true,
        rowHeaders: true,
        contextMenu: true,
        formulas: {
            engine: HyperFormula,
        },
        licenseKey: 'non-commercial-and-evaluation',
        colWidths: 100,
        rowHeights: 30,
        manualColumnResize: true,
        manualRowResize: true,
        dropdownMenu: true,
        filters: true,
        copypaste: { copyColumnHeaders: true, copyColumnGroupHeaders: true, copyColumnHeadersOnly: true, },
    };

    // useEffect(() => {
    //     const hotInstance = hotRef.current.hotInstance;
    //     hotInstance.updateSettings(hotSettings);
    // }, [rows, columns]);

    return (
        <Box>
            <Box>
                <Toolbar>
                    {/* <IconButton edge="start" color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton> */}
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        SocialCalc
                    </Typography>
                </Toolbar>
            </Box>
            <Box>
                <FormattingToolbar hotInstance={hotRef.current ? hotRef.current?.hotInstance : null} />
            </Box>
            <HotTable
                ref={hotRef}
                settings={hotSettings}
                width="100%"
                height="100vh"
                stretchH="all"
                selectionMode='multiple'
            />
        </Box>
    );
};

export default Spreadsheet;
