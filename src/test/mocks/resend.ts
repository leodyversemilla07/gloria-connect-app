import { vi } from 'vitest';

/**
 * Mock Resend email service
 * Use this to mock email sending in tests
 */
export const mockResend = {
  emails: {
    send: vi.fn().mockResolvedValue({
      id: 'email_mock_123',
      from: 'noreply@gloriaconnect.com',
      to: 'test@example.com',
      subject: 'Test Email',
    }),
  },
};

/**
 * Reset Resend mocks between tests
 */
export function resetResendMock() {
  mockResend.emails.send.mockClear();
}

/**
 * Mock successful email send
 */
export function mockEmailSendSuccess(emailId = 'email_mock_123') {
  mockResend.emails.send.mockResolvedValueOnce({
    id: emailId,
    from: 'noreply@gloriaconnect.com',
    to: 'test@example.com',
    subject: 'Test Email',
  });
}

/**
 * Mock email send failure
 */
export function mockEmailSendFailure(error = 'Failed to send email') {
  mockResend.emails.send.mockRejectedValueOnce(new Error(error));
}
