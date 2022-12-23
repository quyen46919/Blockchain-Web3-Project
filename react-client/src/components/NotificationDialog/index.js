import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

NotificationDialog.propTypes = {
    showDialog: PropTypes.bool.isRequired,
    handleAcceptDialog: PropTypes.func.isRequired,
    handleDialogClose: PropTypes.func.isRequired
};

function NotificationDialog(props) {
    const { showDialog, handleDialogClose, handleAcceptDialog } = props;
    return (
        <div>
            <Dialog
                open={showDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ fontSize: 20, color: '#366FB2' }}>
                    Liên kết web3 thất bại, cần làm mới website
                </DialogTitle>
                <DialogContent sx={{ pb: 0 }}>
                    <DialogContentText id="alert-dialog-description">
                        Việc này xảy ra có thể là do lỗi trong quá trình liên kết với các smart contract
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleAcceptDialog}
                        autoFocus
                        sx={{
                            fontSize: 16,
                            pl: 2, pr: 2,
                            textTransform: 'initial'
                        }}
                    >
                        Làm mới trang
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default NotificationDialog;