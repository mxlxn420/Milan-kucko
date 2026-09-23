export type BookingStatus = "PENDING" | "CONFIRMED" | "PAID" | "CANCELLED" | "BLOCKED";

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress?: string | null;
  numberOfGuests: number;
  numberOfAdults: number;
  numberOfTeens: number;
  numberOfBabies: number;
  numberOfChildren2to6: number;
  numberOfChildren6to12: number;
  notes?: string | null;
  checkIn: Date | string;
  checkOut: Date | string;
  nights: number;
  basePrice: number;
  childPrice2to6: number;
  childPrice6to12: number;
  guestSurcharge: number;
  cleaningFee: number;
  touristTax: number;
  totalPrice: number;
  depositAmount: number;
  depositPaidAt?: Date | string | null;
  depositPaidAmount?: number | null;
  depositPaidMethod?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraServices?: any;
  extraServicesTotal?: number;
  discountPercent?: number;
  discountAmount?: number;
  status: BookingStatus;
  paymentIntentId?: string | null;
  paidAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PricingRule {
  id: string;
  name: string;
  pricePerNight: number;
  price3: number;
  price4: number;
  weekendPrice: number;
  weekendPrice3: number;
  weekendPrice4: number;
  dateFrom?: Date | string | null;
  dateTo?: Date | string | null;
  minNights: number;
  childPrice2to6: number;
  childPrice6to12: number;
  extraGuestFee: number;
  extraGuestFrom: number;
  isActive: boolean;
  priority: number;
  depositPercent?: number;
}
