// ==================== Staff Types ====================


export interface Staff {
    id?: string;
   _id?: string;
  name: string;
  email: string;
  phone: string;

  position: string;

  avatar?: string;

  status: 'active' | 'inactive';

  services: string[];

  createdAt: string;
  updatedAt: string;
}