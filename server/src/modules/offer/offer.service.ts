import { Prisma } from '@prisma/client'
import { prisma } from '../../db/prisma'

export async function createOffer(data: Prisma.OfferCreateInput) {
  return await prisma.offer.create({ data })
}

export async function createRecruitmentStep(
  data: Prisma.RecruitmentStepCreateInput
) {
  return await prisma.recruitmentStep.create({ data })
}

export async function createRating(id: string, data: Prisma.RatingCreateInput) {
  return await prisma.rating.upsert({
    where: { id },
    update: data,
    create: data,
  })
}

export async function findOffers(
  skip = 0,
  take = 10,
  queryFilters: { [key: string]: any },
  sortBy: string
) {
  return await prisma.$transaction([
    prisma.offer.findMany({
      skip,
      take,
      where: { ...queryFilters, isVisible: true },
      orderBy: {
        createdAt: sortBy === 'newest' ? 'desc' : 'asc',
      },
      include: {
        employer: {
          include: { employerProfile: true },
        },
      },
    }),
    prisma.offer.count({
      where: { ...queryFilters, isVisible: true },
    }),
    prisma.offer.count(),
  ])
}

export async function findEmployerOffers(id: string) {
  return await prisma.offer.findMany({
    where: { employerId: id },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      applications: {
        include: {
          candidate: {
            include: {
              candidateProfile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      recruitmentSteps: {
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          ratings: {
            orderBy: {
              createdAt: 'asc',
            },
            include: {
              recruitmentStep: true,
            },
          },
        },
      },
    },
  })
}

export async function findOffer(id: string) {
  return await prisma.offer.findFirst({
    where: { id },
    include: {
      employer: { include: { employerProfile: true } },
      applications: {
        select: {
          candidateId: true,
        },
      },
    },
  })
}

export async function findOfferStats(id: string) {
  return await prisma.offer.findFirst({
    where: { id },
    include: {
      applications: {
        include: {
          candidate: {
            include: { candidateProfile: true },
          },
          ratings: {
            include: {
              recruitmentStep: true,
            },
          },
        },
      },
    },
  })
}

export async function deleteOffer(id: string) {
  return await prisma.offer.delete({ where: { id } })
}

export async function deleteRecruitmentStep(id: string) {
  return await prisma.recruitmentStep.delete({ where: { id } })
}

export async function updateOffer(id: string, data: Prisma.OfferUpdateInput) {
  return await prisma.offer.update({ where: { id }, data })
}
