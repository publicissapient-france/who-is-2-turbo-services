import { Gender } from './Gender';

export type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  pictureBase64: string;
};
