import { Dispatch, SetStateAction, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: string
  message: string
}

const FeedbackMessageDialog = ({ open, setOpen, title, message }: Props) => {
  const { t } = useTranslation(['dashboard'])
  const navigate = useNavigate()

  const handleClose = useCallback(() => {
    navigate('/candidate/dashboard/applications')
    setOpen(false)
  }, [])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleClose}>
          {t('Close')!}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FeedbackMessageDialog
