import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { selectUser } from '../features/authentication/services/slices/userSlice'
import { INotification } from '../features/notifications/services/api/types'
import { addNotification } from '../features/notifications/services/slices/notificationsSlice'
import { useSocket } from '../hooks/useSocket'
import { useAppDispatch, useAppSelector } from '../store'

interface ISocketContextState {
  socket: Socket | null
  sendNotification: (notification: INotification) => void
}

const initialSocketContextState = {
  socket: null,
  sendNotification: () => {},
}

const SocketContext = createContext<ISocketContextState>(
  initialSocketContextState
)

const SocketContextProvider = ({ children }: PropsWithChildren) => {
  const socket = useSocket('http://localhost:5000')
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()

  useEffect(() => {
    socket.on('receive_notification', (data: INotification) => {
      dispatch(addNotification(data))
    })
    socket.emit('user_connected', user?.id)

    return () => {
      socket.off('users')
      socket.off('receive_notification')
    }
  }, [socket, user])

  const sendNotification = (notification: INotification) => {
    socket.emit('send_notification', notification)
  }

  return (
    <SocketContext.Provider value={{ socket, sendNotification }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext)

export default SocketContextProvider
