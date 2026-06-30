// Web has no device-token cleanup on sign-out: a browser holds a single FCM
// token, so the next login's PUT reassigns ownership. Intentional no-op.
async function unregisterDevice(_authToken: string): Promise<void> {
  return;
}

export { unregisterDevice };
