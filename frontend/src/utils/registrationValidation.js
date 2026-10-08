const EMAIL_PATTERN = /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;
const PHONE_PATTERN = /^\d{10}$/;

export const isValidEmail = (value) =>
  typeof value === 'string' && value.length <= 254 && value === value.trim() && EMAIL_PATTERN.test(value);

export const validateRegistration = (formData) => {
  if (!formData.name?.trim()) return 'Please enter your name.';
  if (!formData.email?.trim()) return 'Please enter your email address.';
  if (!isValidEmail(formData.email)) return 'Please enter a valid email address.';
  if (!formData.password) return 'Please enter a password.';
  if (formData.password.length < 6) return 'Password must be at least 6 characters.';

  for (const [label, value] of [
    ['Phone number', formData.phone],
    ['Alternate phone number', formData.alternatePhone],
    ['Emergency contact number', formData.emergencyContactNumber]
  ]) {
    if (value && !PHONE_PATTERN.test(value)) {
      return `${label} must contain exactly 10 digits.`;
    }
  }

  return null;
};
