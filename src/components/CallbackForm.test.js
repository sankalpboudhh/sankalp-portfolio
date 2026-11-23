import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CallbackForm, { isValidPhone } from './CallbackForm';

jest.mock('react-ga4', () => ({ event: jest.fn() }));

const fill = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

beforeEach(() => {
  global.fetch = jest.fn();
});

test('isValidPhone accepts common formats and rejects junk', () => {
  expect(isValidPhone('+91 98765 43210')).toBe(true);
  expect(isValidPhone('(080) 1234-5678')).toBe(true);
  expect(isValidPhone('12345')).toBe(false);
  expect(isValidPhone('call me maybe')).toBe(false);
});

test('submits to Netlify Forms and shows confirmation', async () => {
  global.fetch.mockResolvedValue({ ok: true });
  render(<CallbackForm />);
  fill('Name', 'Asha');
  fill('Phone', '+91 98765 43210');
  fireEvent.click(screen.getByRole('button', { name: /request call back/i }));

  await screen.findByText(/request received/i);
  const [url, opts] = global.fetch.mock.calls[0];
  expect(url).toBe('/');
  const body = new URLSearchParams(opts.body);
  expect(body.get('form-name')).toBe('callback');
  expect(body.get('name')).toBe('Asha');
  expect(body.get('phone')).toBe('+91 98765 43210');
});

test('blocks an invalid phone number without sending', () => {
  render(<CallbackForm />);
  fill('Name', 'Asha');
  fill('Phone', '123');
  fireEvent.click(screen.getByRole('button', { name: /request call back/i }));
  expect(screen.getByText(/valid phone number/i)).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

test('shows an error when the submission fails', async () => {
  global.fetch.mockResolvedValue({ ok: false, status: 500 });
  render(<CallbackForm />);
  fill('Name', 'Asha');
  fill('Phone', '9876543210');
  fireEvent.click(screen.getByRole('button', { name: /request call back/i }));
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/couldn't send/i));
});
