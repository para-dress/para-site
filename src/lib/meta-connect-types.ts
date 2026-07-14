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

export type MetaDebugTokenScope = {
  scope: string;
  target_ids?: string[];
  expires_at?: number;
};

export type MetaDebugTokenData = {
  app_id?: string;
  user_id?: string;
  scopes?: string[];
  granular_scopes?: MetaDebugTokenScope[];
  expires_at?: number;
  data_access_expires_at?: number;
  is_valid?: boolean;
  type?: string;
};
