import { Prisma } from '@prisma/client'
import { prisma } from '../../db/prisma'

export async function createNotification(data: Prisma.NotificationCreateInput) {
  return await prisma.notification.create({
    data,
  })
}

export async function findNotification(id: string) {
  return await prisma.notification.findUnique({
    where: { id },
  })
}

export async function findUserNotifications(id: string) {
  return await prisma.notification.findMany({
    where: { recipientId: id },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function updateNotification(
  id: string,
  data: Prisma.NotificationUpdateInput
) {
  return await prisma.notification.update({
    where: { id },
    data,
  })
}

export async function deleteNotification(id: string) {
  return await prisma.notification.delete({
    where: { id },
  })
}
