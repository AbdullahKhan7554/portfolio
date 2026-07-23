/**
 * Nova Sales Intelligence Engine — public API (Milestone 5A).
 *
 * Reusable, config-driven, in-memory sales reasoning: intent detection,
 * conversation state, qualification, and recommendation. No persistence, no
 * pricing, no UI/API coupling.
 *
 * @example
 *   import { salesEngine } from '@/lib/nova/sales';
 *   let s = salesEngine.start();
 *   s = salesEngine.ingestMessage(s, 'I need an online store');
 *   s = salesEngine.answer(s, s.nextQuestion, '50 products');
 */

// Config
export { INTENT, STAGE, SERVICES, INTENT_KEYWORDS } from './serviceConfig';

// Modules
export { detectIntent, scoreIntents } from './intentDetector';
export {
  createSalesState,
  updateState,
  setIntent,
  recordAnswer,
  setStage,
} from './conversationState';
export {
  selectService,
  nextQuestion,
  qualificationScore,
  isQualified,
} from './qualificationEngine';
export { rankServices, recommendService } from './recommendationEngine';

// Composition root
export { createSalesEngine, salesEngine } from './salesEngine';

// Package configuration system (config-driven; name-agnostic recommendation)
export {
  INDUSTRY,
  createPackage,
  createCompanyPackages,
  PackageRegistry,
  createPackageRegistry,
  getPackages,
  getPackageById,
  scorePackage,
  recommendPackage,
  avenixPackages,
  packageRegistry,
} from './packageConfig';
