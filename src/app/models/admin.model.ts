export interface Key {
  id: number;
  api_key: string;
  created_at: Date;
  status: boolean
  test: boolean;
}

export interface Log {
  id: number;
  username: string
  action: string;
  timestamp: string;
  ip_address: string;
  status: string;
  details: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}