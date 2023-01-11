import { useEffect } from 'react'
import { toast } from 'react-toastify'

type Props = {
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  isLoading: boolean
  isSuccess: boolean
  error: any
  isError: boolean
}

const useShowToastNotification = ({
  message,
  type,
  isLoading,
  isSuccess,
  error,
  isError,
}: Props) => {
  useEffect(() => {
    if (isSuccess) {
      if (type === 'info') {
        toast.info(message)
      } else if (type === 'success') {
        toast.success(message)
      } else if (type === 'error') {
        toast.error(message)
      } else if (type === 'warning') {
        toast.warning(message)
      }
    }

    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        ;(error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: 'top-right',
          })
        )
      } else {
        toast.error((error as any).data.message, {
          position: 'top-right',
        })
      }
    }
  }, [isLoading])
}

export default useShowToastNotification
