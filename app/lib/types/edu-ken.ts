export type QualificationLevel = 'CRAFT' | 'DEGREE' | 'DIPLOMA';
export type InstitutionType = 'Private' | 'Public';

export type Qualifications = Record<QualificationLevel, number>;
export type Institutions = Record<InstitutionType, number>;
export type CategoriesPerCounty = Record<
  string,
  { College: number; University: number }
>;

export interface IEdukenDataStructure {
  qualifications_per_county: Record<string, Qualifications>;
  institutions_per_county: Record<string, Institutions>;
  categories_per_county: CategoriesPerCounty;
}
