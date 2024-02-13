import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface CustomSnackbarProps extends AlertProps {
  open: boolean;
  onClose: () => void;
}

//* Composant d'alerte material UI

function CustomSnackbar({
  open,
  onClose,
  ...alertProps
}: CustomSnackbarProps): JSX.Element {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <MuiAlert
        {...alertProps}
        elevation={6}
        variant="filled"
        sx={{ width: '100%' }}
      />
    </Snackbar>
  );
}

export default CustomSnackbar;
