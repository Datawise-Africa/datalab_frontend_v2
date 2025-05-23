export type CountyName =
  | 'Baringo'
  | 'Bomet'
  | 'Bungoma'
  | 'Busia'
  | 'Elgeyo-Marakwet'
  | 'Embu'
  | 'Garissa'
  | 'Homa Bay'
  | 'Isiolo'
  | 'Kajiado'
  | 'Kakamega'
  | 'Kericho'
  | 'Kiambu'
  | 'Kilifi'
  | 'Kirinyaga'
  | 'Kisii'
  | 'Kisumu'
  | 'Kitui'
  | 'Kwale'
  | 'Laikipia'
  | 'Machakos'
  | 'Makueni'
  | 'Mandera'
  | 'Marsabit'
  | 'Meru'
  | 'Migori'
  | 'Mombasa'
  | "Murang'a"
  | 'Murang’a'
  | 'Nairobi'
  | 'Nakuru'
  | 'Nandi'
  | 'Narok'
  | 'Nyamira'
  | 'Nyandarua'
  | 'Nyeri'
  | 'Samburu'
  | 'Siaya'
  | 'Taita Taveta'
  | 'Tana River'
  | 'Tharaka-Nithi'
  | 'Trans-Nzoia'
  | 'Turkana'
  | 'Uasin Gishu'
  | 'Vihiga'
  | 'Wajir'
  | 'West Pokot';

type QualificationLevel = 'CRAFT' | 'DEGREE' | 'DIPLOMA';
type InstitutionType = 'Private' | 'Public';

type Qualifications = Record<QualificationLevel, number>;
type Institutions = Record<InstitutionType, number>;
type CategoriesPerCounty = Record<
  string,
  {
    College: number;
    University: number;
  }
>;

// type CountyName = string;

export interface IEdukenDataStructure {
  qualifications_per_county: Record<string, Qualifications>;
  institutions_per_county: Record<string, Institutions>;
  categories_per_county: Record<string, CategoriesPerCounty>;
}
