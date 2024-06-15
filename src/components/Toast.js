import { enqueueSnackbar } from "notistack";

const Toast = (message, variant, position) => {
  enqueueSnackbar(
    message,
    {
        variant: variant,
        anchorOrigin: position
    }
  )
}

export default Toast;