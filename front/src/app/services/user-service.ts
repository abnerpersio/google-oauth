import { httpClient } from "./http";

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type GetProfileResult = {
  profile: UserProfile;
};

export class UserService {
  async getProfile() {
    const result = await httpClient.get<GetProfileResult>("/me");
    return result.data?.profile;
  }
}
