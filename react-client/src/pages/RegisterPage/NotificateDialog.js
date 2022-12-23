import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';

function NotificateDialog(props) {
    const { showDialog, handleDialogClose } = props;
    return (
        <div>
            <Dialog
                open={showDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Rất tiếc! Chức năng này đang được phát triển
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Xin lỗi bạn về bất tiện này, chúng tôi sẽ cập nhật chức năng này trong các phiên bản sắp tới!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default NotificateDialog;