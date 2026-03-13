export type ModuleType = 'profiles' | 'identify' | 'authorities' | 'guide' | 'landing';

export type NavigationTarget = {
  module: ModuleType;
  query?: string;
  mode?: 'single' | 'compare';
};

export interface GroundingSource {
  uri: string;
  title: string;
}

// --- Profiles Module Types ---
export interface ConfusedTaxon {
  name: string;
  difference: string;
  keyFeature: string;
}

export interface TaxonProfile {
  scientificName: string;
  author: string;
  commonName: string;
  family: string;
  quickRecap: string;
  diagnosticDescription: string;
  confusedTaxa: ConfusedTaxon[];
  ecology: string;
  etymology: string;
  history: string;
  distribution: string;
}

export interface KeyDifference {
  feature: string;
  taxon1State: string;
  taxon2State: string;
  taxon3State?: string;
}

export interface ComparisonProfile {
  taxon1: TaxonProfile;
  taxon2: TaxonProfile;
  taxon3?: TaxonProfile;
  keyDifferences: KeyDifference[];
}

// --- Identify Module Types ---
export interface Character {
  id: string;
  label: string;
  category: string;
  description?: string;
}

export interface SuggestedFamily {
  name: string;
  authority: string;
  order: string;
  commonName: string;
  matchQuality: 'Strong Match' | 'Probable' | 'Possible' | 'Weak';
  matchingCharacters: number;
  totalCharacters: number;
  contradictingCharacters: string[];
  synapomorphies: string;
  diagnosticCharacters: string;
  fieldRecognitionTips: string;
  spotCharacters: string;
  charactersToVerifyNext: string;
  possibleGenera: { name: string; notes: string }[];
  differentialDiagnosis: string;
  regionalNotes: string;
}

export interface IdentifyResult {
  analysisNotes: string;
  suggestedFamilies: SuggestedFamily[];
  additionalRecommendations: string;
  taxonomicNotes: string;
}

// --- Authorities Module Types ---
export interface AuthorProfile {
  fullName: string;
  standardAbbreviation: string;
  lifespan: string;
  nationality: string;
  birthPlace: string;
  deathPlace: string;
  mainContribution: string;
  biography: string;
  historicalContext: string;
  almaMater: string[];
  institutions: string[];
  focusAreas: string[];
  awards: string[];
  fieldWorkRegions: string[];
  majorWorks: { year: string; title: string }[];
  taxaDescribed: { name: string; rank: string }[];
  eponymousTaxa: { name: string; rank: string; reason: string }[];
  herbariaCollections: { abbreviation: string; institution: string }[];
  taxonomicNotes: string;
  notableMentors: string[];
  notableStudents: string[];
  relatedBotanists: { name: string; connection: string }[];
}

// --- Guide Module Types ---
export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GeneratedGuide {
  markdown: string;
}
