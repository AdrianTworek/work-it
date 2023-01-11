import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { uploadFile } from '../../../../utils/uploadFile'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from 'firebase/storage'
import { storage } from '../../../../firebase'
import { useAppSelector } from '../../../../store'
import { selectUser } from '../../../authentication/services/slices/userSlice'

import { Box, Button, Paper, Stack, Typography } from '@mui/material'

import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import FileOpenIcon from '@mui/icons-material/FileOpen'

import { FormInput } from '../../../../components'

type Props = {
  updateUser: any
}

const UploadCV = ({ updateUser }: Props) => {
  const { t } = useTranslation(['dashboard'])
  const user = useAppSelector(selectUser)
  const [filename, setFilename] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const filePickerRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectedFile && filename) {
      updateCV()
    }
  }, [selectedFile, filename])

  const updateCV = async () => {
    if (selectedFile && filename) {
      const imgRef = ref(storage, `cv/${user?.id}/${filename}`)

      await uploadString(imgRef, selectedFile, 'data_url').then(async () => {
        const downloadURL = await getDownloadURL(imgRef)
        updateUser({
          id: user?.id,
          candidateProfile: {
            update: {
              cv: downloadURL,
            },
          },
        })
      })
    }

    setSelectedFile(null)
  }

  const deleteCV = async () => {
    const cvRef = ref(storage, user?.candidateProfile?.cv)

    deleteObject(cvRef)
      .then(() => {
        updateUser({
          id: user?.id,
          candidateProfile: { update: { cv: '' } },
        })
      })
      .catch((error) => {
        console.log(error)
      })

    setFilename(null)
  }

  return (
    <Paper
      elevation={3}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}
    >
      <Typography variant="body2" color="text.secondary" mb={2}>
        {t('dashboard:SocialLinks')}
      </Typography>

      <FormInput
        name="linkedInProfile"
        label={t('dashboard:LinkedInProfile')}
        type="text"
        startAdornment={<LinkedInIcon sx={{ mr: 1 }} />}
      />
      <FormInput
        name="githubProfile"
        label={t('dashboard:GithubProfile')}
        type="text"
        startAdornment={<GitHubIcon sx={{ mr: 1 }} />}
      />

      <Typography variant="body1" color="text.secondary" mb={0}>
        {t('dashboard:UploadYourCV')}
      </Typography>

      {user?.candidateProfile?.cv ? (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body1">
            <a
              href={user?.candidateProfile?.cv}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                textDecoration: 'none',
                color: '#0ea5e9',
              }}
            >
              <FileOpenIcon /> {t('dashboard:SeeYourCV')}
            </a>
          </Typography>
          <Button color="error" onClick={deleteCV}>
            <DeleteIcon /> {t('dashboard:DeleteCV')}
          </Button>
        </Stack>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 135,
              borderRadius: 5,
              border: '2px dotted #0ea5e9',
            }}
            onClick={() =>
              filePickerRef?.current && filePickerRef.current.click()
            }
          >
            <CloudUploadIcon sx={{ width: 70, height: 70 }} />
            <Typography>{t('dashboard:ClickToBrowse')}</Typography>
          </Box>

          <input
            type="file"
            ref={filePickerRef}
            accept="application/pdf"
            hidden
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e?.target?.files?.length) {
                setFilename(e.target.files[0].name || '')
                uploadFile(e, setSelectedFile)
                updateCV()
              }
            }}
            onClick={(e: any) => (e.target.value = null)}
          />
        </>
      )}
    </Paper>
  )
}

export default UploadCV
