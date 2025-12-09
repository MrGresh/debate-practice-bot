const BACKEND_BASE_URL = 'http://localhost:5000/api/v1';

export const API_CONSTANTS = {
  
  USER_REGISTER: `${BACKEND_BASE_URL}/user-auth/register`,
  USER_VERIFY_OTP: `${BACKEND_BASE_URL}/user-auth/verify-otp`,
  USER_RESEND_OTP: `${BACKEND_BASE_URL}/user-auth/resend-otp`,
  USER_LOGIN: `${BACKEND_BASE_URL}/user-auth/login`,
  FORGOT_PASSWORD_SEND_OTP: `${BACKEND_BASE_URL}/user-auth/forgot-password/send-otp`,
  FORGOT_PASSWORD_RESET: `${BACKEND_BASE_URL}/user-auth/forgot-password/reset`,
  VALIDATE_TOKEN: `${BACKEND_BASE_URL}/user-auth/validate-token`,
  USER_LOGOUT: `${BACKEND_BASE_URL}/user-auth/logout`,
  USER_CHANGE_PASSWORD: `${BACKEND_BASE_URL}/user-auth/change-password`,
  USER_CHANGE_EMAIL_SEND_OTP: `${BACKEND_BASE_URL}/user-auth/change-email/send-otp`,
  USER_CHANGE_EMAIL_VERIFY_OTP: `${BACKEND_BASE_URL}/user-auth/change-email/verify-otp`,
};