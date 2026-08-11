export const OPEN_BOOKING_EVENT = "skilldwork:open-booking";

export function requestBookingOpen() {
  window.dispatchEvent(new Event(OPEN_BOOKING_EVENT));
}
