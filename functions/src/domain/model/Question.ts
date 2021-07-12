import { Proposition } from './Proposition';

export type Question = {
  /** A ciphered string composed of: ${pictureName}|current_timestamp */
  question: string;
  propositions: Proposition[];
};
