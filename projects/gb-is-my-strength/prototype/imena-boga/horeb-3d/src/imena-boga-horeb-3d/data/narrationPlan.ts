// Bilingual audio contract for 42 canonical Research designations, not 42 personal names.
// A source-language performance may be Hebrew, Aramaic or Greek according to
// Exhibit.sourceLanguage. Never infer a reading from Latin transliteration.
import { EXHIBITS, type Exhibit, type Lang } from './exhibits';
import { isApprovedAudioPath } from '../engine/NarratorBus';

export const NARRATION_LANGUAGE_LABEL: Readonly<Record<Lang, string>> = {
  he: 'библейском древнееврейском',
  arc: 'библейском арамейском',
  grc: 'древнегреческом',
};

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
  playback: readonly string[]; // empty unless all recordings and approvals pass
  ready: boolean;
  status: 'HOLD' | 'approved';
}

export function narrationPlan(exhibit: Exhibit, russianDraft?: string): NarrationPlan {
  const originalSpoken = exhibit.id !== 'yhwh';
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
  const playback = approved ? (originalSpoken ?
    [approval!.original!.path, approval!.russian.path] : [approval!.russian.path]) : [];
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
