import { Gender } from './Gender';
import { Capability } from "./Capability";

export type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  pictureBase64?: string;
  capability?: Capability;
  arrivalDate?: Date;
};
