import { EmployerProfile, User } from '@prisma/client'
import { prisma } from '../../db/prisma'

type UpdatedUser = User & {
  employerProfile: EmployerProfile | null
}

export async function checkIfCanCreateOffer(
  user: UpdatedUser
): Promise<UpdatedUser> {
  let updatedUser: UpdatedUser

  if (
    user?.employerProfile?.address &&
    user?.employerProfile?.foundedIn &&
    user?.employerProfile?.bio &&
    user?.employerProfile?.companySize &&
    user?.employerProfile?.companyType
  ) {
    updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: {
        employerProfile: {
          update: {
            canCreateOffer: true,
          },
        },
      },
      include: { employerProfile: true },
    })
  } else {
    updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: {
        employerProfile: {
          update: {
            canCreateOffer: false,
          },
        },
      },
      include: { employerProfile: true },
    })
  }

  return updatedUser
}
