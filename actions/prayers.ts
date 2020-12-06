export const CANCEL_PRAYER = 'CANCEL_PRAYER';

export function cancelPrayer(payload: string) {
  return {
    type: CANCEL_PRAYER,
    payload,
  };
}
