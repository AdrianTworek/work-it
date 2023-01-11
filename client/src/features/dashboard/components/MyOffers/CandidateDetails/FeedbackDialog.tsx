import { Dispatch, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { object, string, TypeOf } from 'zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IApplication } from '../../../services/api/types';
import { useUpdateApplicationMutation } from '../../../services/api/applicationApi';
import { useCreateNotificationMutation } from '../../../../notifications/services/api/notificationApi';
import { useAppSelector } from '../../../../../store';
import { selectUser } from '../../../../authentication/services/slices/userSlice';
import { NotificationTypeEnum } from '../../../../notifications/services/api/types';
import { useSocketContext } from '../../../../../contexts/SocketContext';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import HelpIcon from '@mui/icons-material/Help';

import { FormInput } from '../../../../../components';
import useShowToastNotification from '../../../../../hooks/useShowToastNotification';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  application: IApplication | undefined;
};

const feedbackSchema = object({
  feedback: string()
    .min(1, 'Feedback message is required')
    .max(2048, 'Feedback message contain less than 2048 characters'),
});

export type FeedbackInput = TypeOf<typeof feedbackSchema>;

const FeedbackDialog = ({ open, setOpen, application }: Props) => {
  const { t } = useTranslation(['dashboard']);
  const user = useAppSelector(selectUser);
  const { sendNotification }: any = useSocketContext();
  const theme = useTheme();

  const [updateApplication, { isLoading, isSuccess, error, isError }] =
    useUpdateApplicationMutation();
  const [createNotification] = useCreateNotificationMutation();

  const methods = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
  });

  const { handleSubmit, reset } = methods;

  useShowToastNotification({
    message: t('SuccessfullySentFeedback'),
    type: 'success',
    isLoading,
    isSuccess,
    error,
    isError,
  });

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onSubmitHandler: SubmitHandler<FeedbackInput> = async ({
    feedback,
  }) => {
    if (user && application) {
      await updateApplication({
        id: application.id,
        feedback,
      });
      const notification = await createNotification({
        message: `${t('YourReceivedFeedbackFor')} ${
          application.offer.positionName
        }`,
        type: NotificationTypeEnum.FEEDBACK,
        image: user.photo || '',
        redirectUrl: `/candidate/dashboard/applications?applicationId=${application.id}`,
        recipientId: application.candidateId,
      });
      //   @ts-ignore
      sendNotification(notification.data);
      reset();
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography variant="h5" component="span">
          {t('SendFeedback')}
        </Typography>
        <Tooltip
          title={t('FeedbackGuide')!}
          arrow
          enterTouchDelay={0}
          leaveTouchDelay={30000}
        >
          <HelpIcon color="info" />
        </Tooltip>
      </DialogTitle>
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          noValidate
          autoComplete="off"
        >
          <DialogContent>
            <FormInput
              name="feedback"
              label={t('Message')}
              fullWidth
              multiline
              rows={14}
              sx={{ minWidth: { xs: 300, md: 500 } }}
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus color="inherit" onClick={handleClose}>
              {t('Cancel')}
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={() => {}}
            >
              {t('Send')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  );
};

export default FeedbackDialog;
