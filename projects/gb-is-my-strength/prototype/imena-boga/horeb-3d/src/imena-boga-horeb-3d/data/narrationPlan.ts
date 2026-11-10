// Bilingual audio contract for 42 canonical Research designations, not 42 personal names.
// A source-language performance may be Hebrew, Aramaic or Greek according to
// Exhibit.sourceLanguage. Never infer a reading from Latin transliteration.
import { EXHIBITS, isOriginalVoiced, type Exhibit, type Lang } from './exhibits';
export { NARRATION_LANGUAGE_LABEL } from './exhibits';
import { isApprovedAudioPath, type ApprovedNarrationTrack } from '../engine/NarratorBus';

// The sign-off is per recording, not just per author or file name.
// No certificates or files have been provided: do not fabricate an approval.
// A future approved cue must have both authorized masters and independent
// original-language phonetic review, Russian script approval and file checksums.
export interface VoiceMasterApproval {
  path: string;
  sha256: string;
  performerConsent: string;
  rightsEvidence: string;
  approvedTranscriptRevision: string;
}
export interface BilingualCueApproval {
  sourceLanguage: Lang;
  original?: VoiceMasterApproval;
  russian: VoiceMasterApproval;
  pronunciationReview: string;
  editorialReview: string;
  approvedOn: string;
}
export const APPROVED_BILINGUAL_CUES: Readonly<Partial<Record<string, BilingualCueApproval>>> =
  Object.freeze({});

const verifiedMaster = (master: VoiceMasterApproval | undefined) =>
  !!master &&
  isApprovedAudioPath(master.path) &&
  /^[a-f0-9]{64}$/i.test(master.sha256) &&
  !!master.performerConsent.trim() && !!master.rightsEvidence.trim() &&
  !!master.approvedTranscriptRevision.trim();

export interface NarrationPlan {
  exhibitId: string;
  sourceLanguage: Lang;
  originalUnicode: string;
  originalSpoken: boolean;
  order: 'original-then-russian' | 'written-original-then-russian';
  russianDraft: string | null;
  playback: readonly ApprovedNarrationTrack[]; // signed path + SHA-256 for each master
  ready: boolean;
  status: 'HOLD' | 'approved';
}

export function narrationPlan(exhibit: Exhibit, russianDraft?: string): NarrationPlan {
  const originalSpoken = isOriginalVoiced(exhibit);
  const approval = APPROVED_BILINGUAL_CUES[exhibit.id];
  const canonical = EXHIBITS.find((item) => item.id === exhibit.id);
  const matchesCanonical = canonical != null &&
    canonical.originalUnicode === exhibit.originalUnicode &&
    canonical.sourceLanguage === exhibit.sourceLanguage;
  // For the written Tetragrammaton the Hebrew is DISPLAY ONLY. Neither
  // speculative reading nor a substituted "Adonai" master is authorised here.
  const approved = matchesCanonical && !!russianDraft?.trim() && !!approval &&
    approval.sourceLanguage === exhibit.sourceLanguage &&
    !!approval.pronunciationReview.trim() && !!approval.editorialReview.trim() &&
    !!approval.approvedOn.trim() && verifiedMaster(approval.russian) &&
    (originalSpoken ? verifiedMaster(approval.original) : !approval.original) &&
    (originalSpoken ? approval.original!.path !== approval.russian.path : true);
  const playback: ApprovedNarrationTrack[] = approved ? (originalSpoken ?
    [
      { path: approval!.original!.path, sha256: approval!.original!.sha256 },
      { path: approval!.russian.path, sha256: approval!.russian.sha256 },
    ] : [{ path: approval!.russian.path, sha256: approval!.russian.sha256 }]) : [];
  // Preserve the original Unicode exactly, including Hebrew niqqud and Greek
  // breathing marks, for screen readers, editorial review and text export.
  return {
    exhibitId: exhibit.id,
    sourceLanguage: exhibit.sourceLanguage,
    originalUnicode: exhibit.originalUnicode,
    originalSpoken,
    order: originalSpoken ? 'original-then-russian' : 'written-original-then-russian',
    russianDraft: russianDraft?.trim() || null,
    playback,
    ready: approved,
    status: approved ? 'approved' : 'HOLD',
  };
}
