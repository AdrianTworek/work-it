import { Router } from 'express';
import deserializeUser from '../../middleware/deserializeUser';
import requireUser from '../../middleware/requireUser';
import { restrictTo } from '../../middleware/restrictTo';
import { RoleEnum } from '../../types/role';
import {
  createOfferHandler,
  createRatingHandler,
  createRecruitmentStepHandler,
  deleteOfferHandler,
  deleteRecruitmentStepHandler,
  fetchAllCandidatesHandler,
  fetchEmployerOffersHandler,
  fetchOfferHandler,
  fetchOffersHandler,
  fetchOfferStatsHandler,
  updateOfferHandler,
} from './offer.controller';

const router = Router();

router.get('/', fetchOffersHandler);
router.get('/:offerId', fetchOfferHandler);

router.use(deserializeUser, requireUser);

router.get(
  '/employer/get',
  restrictTo(RoleEnum.EMPLOYER),
  fetchEmployerOffersHandler
);
router.get(
  '/candidates/get',
  restrictTo(RoleEnum.EMPLOYER),
  fetchAllCandidatesHandler
);
router.get(
  '/:offerId/stats',
  restrictTo(RoleEnum.EMPLOYER),
  fetchOfferStatsHandler
);
router.post('/', restrictTo(RoleEnum.EMPLOYER), createOfferHandler);
router.post(
  '/:offerId/recruitmentSteps',
  restrictTo(RoleEnum.EMPLOYER),
  createRecruitmentStepHandler
);
router.post(
  '/:offerId/recruitmentSteps/:recruitmentStepId/applications/:applicationId/ratings',
  restrictTo(RoleEnum.EMPLOYER),
  createRatingHandler
);
router.delete('/:offerId', restrictTo(RoleEnum.EMPLOYER), deleteOfferHandler);
router.delete(
  '/:offerId/recruitmentSteps/:recruitmentStepId',
  restrictTo(RoleEnum.EMPLOYER),
  deleteRecruitmentStepHandler
);
router.patch('/:offerId', restrictTo(RoleEnum.EMPLOYER), updateOfferHandler);

export default router;
