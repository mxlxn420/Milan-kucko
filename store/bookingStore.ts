import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { BookingState, PriceBreakdown } from "@/types";

export const useBookingStore = create<BookingState>()(
  devtools(
    (set) => ({
      checkIn:        null,
      checkOut:       null,
      guests:         2,
      priceBreakdown: null,
      isCalculating:  false,
      step:           "dates",
      isSubmitting:   false,
      bookingId:      null,

      setCheckIn:        (date) => set({ checkIn: date, checkOut: null, priceBreakdown: null }),
      setCheckOut:       (date) => set({ checkOut: date }),
      setGuests:         (n)    => set({ guests: Math.max(1, Math.min(6, n)) }),
      setStep:           (step) => set({ step }),
      setPriceBreakdown: (b)    => set({ priceBreakdown: b, isCalculating: false }),
      setBookingId:      (id)   => set({ bookingId: id }),
      reset: () => set({
        checkIn: null, checkOut: null, guests: 2,
        priceBreakdown: null, isCalculating: false,
        step: "dates", isSubmitting: false, bookingId: null,
      }),
    }),
    { name: "milan-kucko-booking" }
  )
);