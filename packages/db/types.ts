export type Account = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  refresh_token_expires_in: number | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  created_at: Date;
  updated_at: Date;
};
export type Post = {
  id: string;
  userId: string;
  title: string;
  content: string;
};
export type Session = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
};
export type Organization = {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
  authorId: string;
  userId: string;
};
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  created_at: Date;
  updated_at: Date;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  stripe_current_period_end: Date | null;
};
export type DB = {
  accounts: Account;
  sessions: Session;
  organizations: Organization;
  users: User;
};
