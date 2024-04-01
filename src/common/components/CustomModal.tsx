import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';

import { TransitionProps } from '@mui/material/transitions';

import CustomButton from './CustomButton';
import { Grid, IconButton } from "@mui/material";

interface CustomModalProps {
    open: boolean,
    title?: string,
    content: any,
    closeIcon?:boolean,
    needCancelBtn?: boolean,
    needConfirmBtn?: boolean,
    cancelBtnLabel?: string,
    confirmBtnLabel?: string,
    handler?: any,
    onClose?: any,
    maxWidth?: any, // maxWidth supported values: xs, sm, md, lg, xl
    loaderConfirmBtn?: boolean,
    readOnlyConfirmBtn?: boolean,
    disableBackdropClick?: boolean,
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CustomModal = (props: CustomModalProps) => {
    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            fullWidth
            maxWidth={props.maxWidth ? props.maxWidth : 'md'}
            keepMounted
            onClose={(event, reason) => {
                if (props.disableBackdropClick && reason && reason == 'backdropClick') {
                    return;
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                props.onClose
            }}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle className="custom-dialog-title">{props.title}</DialogTitle>
          {props.closeIcon && (  <IconButton
                aria-label="close"
                onClick={props.onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>)}
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description" className="container">
                    {props.content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {props.needCancelBtn &&
                    <CustomButton label={props.cancelBtnLabel || "Close"} type="secondary" onClick={props.onClose} />
                }
                {props.needConfirmBtn &&
                    <Grid item>
                        <CustomButton label={props.confirmBtnLabel || "Confirm"} onClick={props.handler} disable={props.readOnlyConfirmBtn} loading={props.loaderConfirmBtn} />
                    </Grid>
                }
            </DialogActions>
        </Dialog>
    );
}

export default CustomModal;