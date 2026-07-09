import type { User } from './index';
import type { Service } from './service';
import type { Staff } from './staff';

// ==================== Booking Types ====================

export interface Booking {

    id?: string;
    _id?: string;

    user: User;

    service: Service;

    staff?: Staff;

    customerName:string;

    phone:string;

    email?:string;

    petName:string;

    petType:string;

    appointmentDate:string;

    appointmentTime:string;

    note?:string;

    status:

        |'pending'
        |'assigned'
        |'completed'
        |'cancelled';

    createdAt:string;

    updatedAt:string;
}

export interface BookingRequest {
  serviceId: string;

  customerName: string;

  phone: string;

  email?: string;

  petName: string;

  petType: string;

  appointmentDate: string;

  appointmentTime: string;

  note?: string;
}