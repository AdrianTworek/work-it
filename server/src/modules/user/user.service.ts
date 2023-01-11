import { Prisma } from '@prisma/client'
import { prisma } from '../../db/prisma'
import { RoleEnum } from '../../types/role'

export async function createUser(data: Prisma.UserCreateInput) {
  let user

  if (data.role === RoleEnum.CANDIDATE) {
    user = await prisma.user.create({
      data: {
        ...data,
        candidateProfile: { create: {} },
        preferences: { create: {} },
      },
    })
  } else if (data.role === RoleEnum.EMPLOYER) {
    user = await prisma.user.create({
      data: { ...data, employerProfile: { create: {} } },
    })
  }

  return user
}

export async function findUniqueUser(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      candidateProfile: true,
      employerProfile: true,
      preferences: true,
    },
  })
}

export async function findUsers() {
  return await prisma.user.findMany({
    select: { id: true, email: true, name: true, password: false },
  })
}

export async function updateUser(email: string, data: Prisma.UserUpdateInput) {
  return await prisma.user.update({
    where: { email },
    data,
    include: {
      candidateProfile: true,
      employerProfile: true,
      preferences: true,
    },
  })
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({ where: { id } })
}
