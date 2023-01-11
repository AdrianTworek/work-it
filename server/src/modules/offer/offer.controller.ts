import {
  AgreementTypeEnum,
  Application,
  CandidateProfile,
  CompanySizeEnum,
  CompanyTypeEnum,
  ExperienceLevelEnum,
  Rating,
  RecruitmentStep,
  User,
} from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';
import { AppError } from '../../utils/appError';
import {
  createOffer,
  createRating,
  createRecruitmentStep,
  deleteOffer,
  deleteRecruitmentStep,
  findEmployerOffers,
  findOffer,
  findOffers,
  findOfferStats,
  updateOffer,
} from './offer.service';

export async function createOfferHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = res.locals.user;

    const offer = await createOffer({
      ...req.body,
      employer: { connect: { id } },
    });

    return res.status(StatusCodes.CREATED).json(offer);
  } catch (error) {
    console.log(error);
    next(new AppError(StatusCodes.BAD_REQUEST, 'Could not create offer'));
  }
}

export async function createRecruitmentStepHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = res.locals.user;
    const { offerId } = req.params;

    const offer = await findOffer(offerId);

    if (!offer) {
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `Could not find offer with id ${offerId}`
        )
      );
    }

    if (offer.employerId !== id) {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          `You are not author of that offer`
        )
      );
    }

    const recruitmentStep = await createRecruitmentStep({
      ...req.body,
      offer: { connect: { id: offerId } },
    });

    return res.status(StatusCodes.CREATED).json(recruitmentStep);
  } catch (error) {
    console.log(error);
    next(
      new AppError(StatusCodes.BAD_REQUEST, 'Could not create recruitment step')
    );
  }
}

export async function createRatingHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = res.locals.user;
    const { offerId, applicationId, recruitmentStepId } = req.params;

    const offer = await findOffer(offerId);

    if (!offer) {
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `Could not find offer with id ${offerId}`
        )
      );
    }

    if (offer.employerId !== id) {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          `You are not author of that offer`
        )
      );
    }

    const rating = await createRating(req.body.ratingId, {
      grade: req.body.grade,
      application: {
        connect: {
          id: applicationId,
        },
      },
      recruitmentStep: {
        connect: { id: recruitmentStepId },
      },
    });

    return res.status(StatusCodes.CREATED).json(rating);
  } catch (error) {
    console.log(error);
    next(new AppError(StatusCodes.BAD_REQUEST, 'Could not create rating'));
  }
}

export async function fetchOffersHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 10;
    const query = (req.query.query as string) || '';
    const sortBy = (req.query.sortBy as string) || '';
    const category = (req.query.category as string) || '';
    const experienceLevel = (req.query.experienceLevel as string) || 'all';
    const isRemote = req.query.isRemote === 'true' ? true : false;
    const companySize = (req.query.companySize as string) || 'all';
    const companyType = (req.query.companyType as string) || 'all';
    const salaryFrom = +(req.query.salaryFrom as string) || 0;
    const salaryTo = +(req.query.salaryTo as string) || 100000;
    const agreementType = (req.query.agreementType as string) || 'all';

    const queryFilters: { [key: string]: any } = {
      OR: [
        {
          positionName: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          location: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          employer: {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
      ],
      category: {
        contains: category === 'all' ? '' : category,
        mode: 'insensitive',
      },
      experienceLevel: {
        in:
          experienceLevel !== 'all'
            ? experienceLevel
            : Object.values(ExperienceLevelEnum),
      },
      salaryFrom: {
        gte: salaryFrom,
      },
      salaryTo: {
        lte: salaryTo,
      },
      agreementType: {
        in:
          agreementType !== 'all'
            ? agreementType
            : Object.values(AgreementTypeEnum),
      },
      employer: {
        employerProfile: {
          companySize: {
            in:
              companySize !== 'all'
                ? companySize
                : Object.values(CompanySizeEnum),
          },
          companyType: {
            in:
              companyType !== 'all'
                ? companyType
                : Object.values(CompanyTypeEnum),
          },
        },
      },
    };

    if (isRemote) {
      queryFilters['isRemote'] = isRemote;
    }

    const [offers, offersCount, totalOffers] = await findOffers(
      skip,
      take,
      queryFilters,
      sortBy
    );

    const results = offers.map((offer) => {
      const employer = omit(offer.employer, 'password');
      return { ...offer, employer };
    });

    return res
      .status(StatusCodes.OK)
      .json({ data: results, offersCount, totalOffers });
  } catch (error) {
    next(new AppError(StatusCodes.NOT_FOUND, 'Could not found any offer'));
  }
}

export async function fetchEmployerOffersHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user } = res.locals;

    const offers = await findEmployerOffers(user.id);

    const results = offers.map((offer) => {
      const applications = offer.applications.map((application) => {
        const candidate = omit(application.candidate, 'password');
        return { ...application, candidate };
      });
      return { ...offer, applications };
    });

    return res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(new AppError(StatusCodes.NOT_FOUND, 'Could not found any offer'));
  }
}

export async function fetchOfferHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const offer = await findOffer(req.params.offerId);

    if (!offer) {
      next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `Could not found offer with ID: ${req.params.offerId}`
        )
      );
    }

    const employer = omit(offer?.employer, 'password');
    const result = { ...offer, employer };

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(
      new AppError(
        StatusCodes.NOT_FOUND,
        `Could not found offer with ID: ${req.params.offerId}`
      )
    );
  }
}

export async function fetchOfferStatsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { offerId } = req.params;

    const offer = await findOfferStats(offerId);

    if (!offer) {
      next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `Could not found offer with ID: ${req.params.offerId}`
        )
      );
    }

    const applications = offer?.applications;

    type ApplicationsStatsReturnType = (Application & {
      candidate: User & {
        candidateProfile: CandidateProfile | null;
      };
      ratings: (Rating & {
        recruitmentStep: RecruitmentStep;
      })[];
    } & { score: number })[];

    const applicationsStats = applications?.reduce<ApplicationsStatsReturnType>(
      (acc, curr) => {
        let score = 0;
        curr.ratings.forEach((rating) => {
          score += rating.grade * rating.recruitmentStep.importanceLevel;
        });
        acc.push({ ...curr, score });

        return acc;
      },
      []
    );

    const filteredApplicationsStats = applicationsStats?.map((application) => {
      const candidate = omit(application.candidate, 'password');
      return { ...application, candidate };
    });

    const result = filteredApplicationsStats?.sort((a, b) => b.score - a.score);

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(
      new AppError(
        StatusCodes.NOT_FOUND,
        `Could not found offer with ID: ${req.params.offerId}`
      )
    );
  }
}

export async function fetchAllCandidatesHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = res.locals.user;

    const offers = await findEmployerOffers(id);

    const allCandidates = offers.reduce((acc: any[], curr) => {
      curr.applications.forEach((app) => acc.push(app));
      return acc;
    }, []);

    const uniqueCandidates = [
      ...new Map(
        allCandidates.map((candidate) => [candidate['candidateId'], candidate])
      ).values(),
    ];

    return res.status(StatusCodes.OK).json(uniqueCandidates);
  } catch (error) {
    next(
      new AppError(
        StatusCodes.NOT_FOUND,
        `Could not found fetch any candidates`
      )
    );
  }
}

export async function deleteOfferHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = res.locals.user;
    const { offerId } = req.params;

    const offer = await findOffer(offerId);

    if (!offer) {
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `Could not find offer with id ${offerId}`
        )
      );
    }

    if (offer.employerId !== id) {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          `You are not author of that offer`
        )
      );
    }

    await deleteOffer(offerId);

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Successfully deleted offer' });
  } catch (error) {
    next(new AppError(StatusCodes.BAD_REQUEST, 'Could not delete this offer'));
  }
}

export async function deleteRecruitmentStepHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = res.locals.user;
    const { offerId, recruitmentStepId } = req.params;

    const offer = await findOffer(offerId);

    if (!offer) {
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `Could not find offer with id ${offerId}`
        )
      );
    }

    if (offer.employerId !== id) {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          `You are not author of that offer`
        )
      );
    }

    await deleteRecruitmentStep(recruitmentStepId);

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Successfully deleted recruitment step' });
  } catch (error) {
    next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        'Could not delete this recruitment step'
      )
    );
  }
}

export async function updateOfferHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = res.locals.user;
    const { offerId } = req.params;

    const offer = await findOffer(offerId);

    if (!offer) {
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `Could not find offer with id ${offerId}`
        )
      );
    }

    if (offer.employerId !== id) {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          `You are not author of that offer`
        )
      );
    }

    const updatedOffer = await updateOffer(offerId, req.body);

    return res.status(StatusCodes.OK).json(updatedOffer);
  } catch (error) {
    next(new AppError(StatusCodes.BAD_REQUEST, 'Could not delete this offer'));
  }
}
