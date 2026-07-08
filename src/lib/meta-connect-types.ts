export type MetaUserProfile = {
  id: string;
  name?: string;
};

export type MetaPage = {
  id: string;
  name: string;
  access_token?: string;
  tasks?: string[];
};

export type MetaInstagramAccount = {
  id: string;
  username?: string;
  name?: string;
  profile_picture_url?: string;
};

export type MetaTokenResponse = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
};
