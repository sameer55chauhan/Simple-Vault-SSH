import React, { useState, useContext } from 'react';

import Draggable from 'react-draggable';
import { SketchPicker } from 'react-color';

import ColorPicker from "./colorPicker"

import { makeStyles, hexToRgb } from '@material-ui/core/styles';

import CloseIcon from '@material-ui/icons/Close';

import { ThemeContext, DefaultThemeContext, FontContext, THEMES, FONT_FAMILY } from "../../hooks/theme"

import {
    Dialog,
    DialogContent,
    Paper,
    AppBar,
    Toolbar,
    Typography,
    TextField,
    ListItemText,
    Select,
    Divider,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@material-ui/core';

function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
        backgroundColor: ({ background }) => background,
        cursor: "move",
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    dialog: {
        maxHeight: "60vh",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    content: {
        maxWidth: '100%',
        padding: 20,
        backgroundColor: ({ background }) => {
            const rgb = hexToRgb(background)
            return `rgba(${rgb},0.5)`
        },
    },
    details: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
}));

export default function DraggableDialog({ open, setOpen }) {
    const { background, setBackground } = useContext(ThemeContext);
    const { theme, setTheme } = useContext(DefaultThemeContext);
    // const [fontFamily, setFontFamily] = useState(FONT_FAMILY[0])
    // const [fontSize, setFontSize] = useState(12)
    const { fontFamily, fontSize, setFontFamily, setFontSize } = useContext(FontContext)
    const classes = useStyles({ background });

    const handleClose = () => {
        setOpen(false);
    };

    const SETTINGS = [
        {
            title: "Background Color",
            variable: background,
            expandIcon: <ColorPicker color={background} />,
            summary: <SketchPicker color={background} onChangeComplete={(color) => setBackground(color.hex)} />,
        },
        {
            title: "Theme",
            variable: theme,
            expandIcon: null,
            summary: <Select native value={theme} onChange={e => setTheme(e.target.value)} >
                {THEMES.map(theme => {
                    return <option key={theme} value={theme}>{theme}</option>
                })}
            </Select>,
        },
        {
            title: "Font Family",
            variable: fontFamily,
            expandIcon: null,
            summary: <Select native value={fontFamily} onChange={e => setFontFamily(e.target.value)} >
                {FONT_FAMILY.map(font => {
                    return <option key={font} value={font}>{font}</option>
                })}
            </Select>
        },
        {
            title: "Font Size",
            variable: fontSize,
            expandIcon: null,
            summary: <TextField id="standard-basic" defaultValue={fontSize} autoComplete="off"
                inputProps={{ type: 'number' }} onChange={e => setFontSize(e.target.value)} />
        },
    ]

    return (
        <Dialog
            className={classes.dialog}
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
        >
            <AppBar className={classes.appBar} id="draggable-dialog-title">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Settings
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent className={classes.content}>
                {SETTINGS.map(item => {
                    return (
                        <Accordion key={item.title}>
                            <AccordionSummary
                                expandIcon={item.expandIcon}
                            >
                                <ListItemText primary={item.title} secondary={item.variable} />
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails className={classes.details}>
                                {item.summary}
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
            </DialogContent>
        </Dialog>
    );
}
