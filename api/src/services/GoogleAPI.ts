import axios from "axios";
import QueryString from "qs";
import { Env } from "../config/env";

type GetAccessTokenParams = {
  code: string;
  redirectURI: string;
};

type ParseCodeResult = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
};

type GetUserInfoResult = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};

export class GoogleAPI {
  static async getAccessToken(input: GetAccessTokenParams) {
    const payload = QueryString.stringify({
      client_id: Env.googleClientId,
      client_secret: Env.googleClientSecret,
      code: input.code,
      grant_type: "authorization_code",
      redirect_uri: input.redirectURI,
    });

    const { data } = await axios.post<ParseCodeResult>(
      "https://oauth2.googleapis.com/token",
      payload,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return data.access_token;
  }

  static async getUserInfo(accessToken: string) {
    const { data } = await axios.get<GetUserInfoResult>(
      "https://www.googleapis.com/userinfo/v2/me",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return {
      googleId: data.id,
      email: data.email,
      verifiedEmail: data.verified_email,
      name: data.name,
      givenName: data.given_name,
      familyName: data.family_name,
      picture: data.picture,
      locale: data.locale,
    };
  }

  static async revokeAccessToken(accessToken: string) {
    await axios.post(
      "https://oauth2.googleapis.com/revoke",
      QueryString.stringify({ token: accessToken }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
  }
}
