import { Prisma } from '@prisma/client'
import { prisma } from '../../db/prisma'

export async function createApplication(data: Prisma.ApplicationCreateInput) {
  return await prisma.application.create({
    data,
    include: { candidate: { include: { candidateProfile: true } } },
  })
}

export async function findCandidateApplications(id: string) {
  return await prisma.application.findMany({
    where: { candidateId: id },
    include: {
      offer: {
        include: {
          employer: {
            include: {
              employerProfile: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function findApplication(id: string) {
  return await prisma.application.findUnique({
    where: { id },
    include: {
      candidate: {
        include: {
          candidateProfile: true,
          preferences: true,
        },
      },
      offer: {
        include: {
          recruitmentSteps: true,
          employer: {
            include: {
              employerProfile: true,
            },
          },
        },
      },
      ratings: {
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          recruitmentStep: true,
        },
      },
    },
  })
}

export async function deleteApplication(id: string) {
  return await prisma.application.delete({
    where: { id },
  })
}

export async function updateApplication(
  id: string,
  data: Prisma.ApplicationUpdateInput
) {
  return await prisma.application.update({
    where: { id },
    data,
  })
}
