import { useEffect, useRef, useState } from 'react'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { storage } from '../firebase'
import { useAppSelector } from '../store'
import { selectUser } from '../features/authentication/services/slices/userSlice'
import { useUpdateUserMutation } from '../features/authentication/services/api/userApi'
import { uploadFile } from '../utils/uploadFile'

import { Avatar as AvatarMUI } from '@mui/material'

const Avatar = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [updateUser] = useUpdateUserMutation()
  const user = useAppSelector(selectUser)
  const filePickerRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectedFile) {
      updatePhoto()
    }
  }, [selectedFile])

  const updatePhoto = async () => {
    if (selectedFile) {
      const imgRef = ref(storage, `avatars/${user?.id}/`)

      await uploadString(imgRef, selectedFile, 'data_url').then(async () => {
        const downloadURL = await getDownloadURL(imgRef)
        updateUser({ id: user?.id, photo: downloadURL })
      })
    }

    setSelectedFile(null)
  }

  return (
    <>
      <AvatarMUI
        sx={{ width: 150, height: 150, cursor: 'pointer' }}
        src={
          user?.photo ||
          'https://firebasestorage.googleapis.com/v0/b/work-it-4635f.appspot.com/o/placeholder_img.jpg?alt=media&token=0283222b-84b5-4945-9f44-b342c8efe844'
        }
        alt="user photo"
        onClick={() => filePickerRef?.current && filePickerRef.current.click()}
      />
      <input
        type="file"
        ref={filePickerRef}
        accept="image/*"
        hidden
        onChange={(e) => {
          uploadFile(e, setSelectedFile)
          updatePhoto()
        }}
        onClick={(e: any) => (e.target.value = null)}
      />
    </>
  )
}

export default Avatar
