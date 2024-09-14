/**
 * Generates a unique patient ID based on the current timestamp and a random number.
 * @returns {string} The generated unique patient ID.
 */
export function generatePatientId() {
  const timestamp = Date.now().toString(36); // Current timestamp in base-36
  const randomNumber = Math.random().toString(36); // Random string of 5 characters
  return `patient-${timestamp}-${randomNumber}`; // Combine them with a prefix
}
