import { Dispatch, SetStateAction, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../../store'
import { selectUser } from '../../../authentication/services/slices/userSlice'
import { useDeleteUserMutation } from '../../../authentication/services/api/userApi'
import useLogoutUser from '../../../../hooks/useLogoutUser'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Button,
} from '@mui/material'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const DeleteAccountDialog = ({ open, setOpen }: Props) => {
  const { t } = useTranslation(['common', 'dashboard'])
  const user = useAppSelector(selectUser)
  const [deleteUser] = useDeleteUserMutation()
  const { logoutHandler } = useLogoutUser()
  const navigate = useNavigate()

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleDeleteAccount = useCallback(() => {
    if (user?.id) {
      deleteUser({ id: user.id })
      logoutHandler()
      navigate('/')
    }
  }, [])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Typography variant="h5" component="span">
          {t('dashboard:DeleteYourAccount')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('dashboard:DeleteYourAccountText')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="error" variant="contained" onClick={handleDeleteAccount}>
          {t('dashboard:DeleteMyAccount')}
        </Button>
        <Button autoFocus color="inherit" onClick={handleClose}>
          {t('common:Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteAccountDialog
