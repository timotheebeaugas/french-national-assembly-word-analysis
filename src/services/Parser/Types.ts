export interface ParsedData {
    [key: string]: any;
};

export interface MetaData {
  dateSeance: number;
  dateSeanceJour: string;
  numSeanceJour: number;
  numSeance: number;
  typeAssemblee: string;
  legislature: number;
  session: string;
  nomFichierJo: number;
  validite: string;
  etat: string;
  diffusion: string;
  version: string;
  environnement: string;
  heureGeneration: string;
  sommaire: object[];
}

export interface Content {
    quantiemes: object[],
    ouvertureSeance: object[],
    point: [],
    finSeance: object[]
}