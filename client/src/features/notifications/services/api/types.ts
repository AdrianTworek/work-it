export interface INotification {
  id: string
  type: NotificationTypeEnum
  unread: boolean
  message: string
  recipientId: string
  redirectUrl?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface INotificationCreate {
  type: string
  message: string
  recipientId: string
  redirectUrl?: string
  image?: string
}

export interface INotificationUpdate {
  unread: boolean
}

export enum NotificationTypeEnum {
  NEW_CANDIDATE = 'newCandidate',
  FEEDBACK = 'feedback',
}
