import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import AIChat from './AIChat';

const reply = (body, status = 200) =>
  Promise.resolve({ ok: status >= 200 && status < 300, status, json: () => Promise.resolve(body) });

function deferred() {
  let resolve;
  const promise = new Promise((r) => { resolve = r; });
  return { promise, resolve };
}

const openChat = () => fireEvent.click(screen.getByRole('button', { name: /chat with sankalp/i }));
const input = () => screen.getByLabelText('Your question');
const typeAndEnter = (text) => {
  fireEvent.change(input(), { target: { value: text } });
  fireEvent.keyDown(input(), { key: 'Enter' });
};
const sentBodies = () => global.fetch.mock.calls.map(([, opts]) => JSON.parse(opts.body));

beforeEach(() => {
  global.fetch = jest.fn(() => reply({ reply: 'He has 4 years of experience.' }));
});
afterEach(() => {
  delete global.fetch;
});

test('opens and closes; launcher reflects aria-expanded and focus moves sensibly', async () => {
  render(<AIChat />);
  const launcher = screen.getByRole('button', { name: /chat with sankalp/i });
  expect(launcher).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  fireEvent.click(launcher);
  expect(screen.getByRole('dialog', { name: 'Portfolio assistant' })).toBeInTheDocument();
  expect(launcher).toHaveAttribute('aria-expanded', 'true');
  await waitFor(() => expect(input()).toHaveFocus());

  fireEvent.click(screen.getAllByRole('button', { name: 'Close chat' })[0]);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  await waitFor(() => expect(launcher).toHaveFocus());
});

test('Escape closes the panel and returns focus to the launcher', async () => {
  render(<AIChat />);
  openChat();
  fireEvent.keyDown(input(), { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('button', { name: /chat with sankalp/i })).toHaveFocus());
});

test('shows the intro and suggested questions; a suggestion sends that question', async () => {
  render(<AIChat />);
  openChat();
  expect(screen.getByText(/I'm Sankalp's portfolio assistant/)).toBeInTheDocument();
  const suggestion = screen.getByRole('button', { name: 'What projects has he built?' });
  fireEvent.click(suggestion);

  expect(await screen.findByText('He has 4 years of experience.')).toBeInTheDocument();
  expect(sentBodies()[0]).toEqual({
    message: 'What projects has he built?',
    history: [],
    conversationId: expect.stringMatching(/^[A-Za-z0-9-]{8,64}$/),
  });
  expect(screen.queryByRole('group', { name: 'Suggested questions' })).not.toBeInTheDocument();
});

test('empty or whitespace input is not sent', () => {
  render(<AIChat />);
  openChat();
  typeAndEnter('   ');
  expect(global.fetch).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
});

test('Enter sends; Shift+Enter does not', async () => {
  render(<AIChat />);
  openChat();
  fireEvent.change(input(), { target: { value: 'line one' } });
  fireEvent.keyDown(input(), { key: 'Enter', shiftKey: true });
  expect(global.fetch).not.toHaveBeenCalled();

  fireEvent.keyDown(input(), { key: 'Enter' });
  await screen.findByText('He has 4 years of experience.');
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch.mock.calls[0][0]).toBe('/api/chat');
});

test('shows a loading state, disables sending while waiting, and renders both messages', async () => {
  const pending = deferred();
  global.fetch = jest.fn(() => pending.promise);
  render(<AIChat />);
  openChat();
  typeAndEnter('Tell me about React');

  expect(screen.getByLabelText('Assistant is typing')).toBeInTheDocument();
  expect(screen.getByText('Tell me about React')).toHaveClass('aichat-msg--user');
  fireEvent.change(input(), { target: { value: 'second question' } });
  fireEvent.keyDown(input(), { key: 'Enter' });
  expect(global.fetch).toHaveBeenCalledTimes(1);

  await act(async () => pending.resolve(await reply({ reply: 'React answer' })));
  expect(await screen.findByText('React answer')).toBeInTheDocument();
  expect(screen.queryByLabelText('Assistant is typing')).not.toBeInTheDocument();
});

test('sends only completed exchanges as history (latest 4)', async () => {
  let n = 0;
  global.fetch = jest.fn(() => reply({ reply: `answer ${++n}` }));
  render(<AIChat />);
  openChat();
  for (let i = 1; i <= 6; i++) {
    typeAndEnter(`question ${i}`);
    await screen.findByText(`answer ${i}`);
  }
  const last = sentBodies()[5];
  expect(last.message).toBe('question 6');
  expect(last.history).toHaveLength(8);
  expect(last.history[0]).toEqual({ role: 'user', content: 'question 2' });
  expect(last.history[7]).toEqual({ role: 'assistant', content: 'answer 5' });
});

test.each([
  [429, { error: 'The portfolio assistant has reached its daily limit. Please try again tomorrow.' }, /daily limit/],
  [503, { error: 'x' }, /unavailable right now/],
  [502, {}, /unavailable right now/],
  [504, {}, /took too long/],
])('HTTP %i shows a friendly error and is not retried', async (status, body, text) => {
  global.fetch = jest.fn(() => reply(body, status));
  render(<AIChat />);
  openChat();
  typeAndEnter('hello');
  expect(await screen.findByRole('alert')).toHaveTextContent(text);
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('network failure shows a connection error; failed turns are left out of history', async () => {
  global.fetch = jest.fn(() => Promise.reject(new TypeError('Failed to fetch')));
  render(<AIChat />);
  openChat();
  typeAndEnter('hello');
  expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't reach/i);

  global.fetch = jest.fn(() => reply({ reply: 'ok' }));
  typeAndEnter('again');
  await screen.findByText('ok');
  expect(sentBodies()[0].history).toEqual([]);
});

test('new conversation clears the chat', async () => {
  render(<AIChat />);
  openChat();
  typeAndEnter('hello');
  await screen.findByText('He has 4 years of experience.');
  fireEvent.click(screen.getByRole('button', { name: 'Start a new conversation' }));
  expect(screen.queryByText('hello')).not.toBeInTheDocument();
  expect(screen.queryByText('He has 4 years of experience.')).not.toBeInTheDocument();
  expect(screen.getByRole('group', { name: 'Suggested questions' })).toBeInTheDocument();
});

test('URLs in replies become safe external links; markup is not rendered', async () => {
  global.fetch = jest.fn(() => reply({ reply: 'See https://qkart-sankalp.netlify.app/. <img src=x onerror=alert(1)>' }));
  render(<AIChat />);
  openChat();
  typeAndEnter('links?');
  const link = await screen.findByRole('link', { name: 'https://qkart-sankalp.netlify.app/' });
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  expect(screen.getByText(/<img src=x onerror=alert\(1\)>/)).toBeInTheDocument(); // shown as text
});

test('enforces the 300-character limit on the input', () => {
  render(<AIChat />);
  openChat();
  expect(input()).toHaveAttribute('maxLength', '300');
});

test('shows the anonymous-logging notice', () => {
  render(<AIChat />);
  openChat();
  expect(screen.getByText(/saved anonymously/i)).toBeInTheDocument();
});

test('keeps one conversation id per conversation and starts a new one after reset', async () => {
  let n = 0;
  global.fetch = jest.fn(() => reply({ reply: `answer ${++n}` }));
  render(<AIChat />);
  openChat();
  typeAndEnter('one');
  await screen.findByText('answer 1');
  typeAndEnter('two');
  await screen.findByText('answer 2');
  fireEvent.click(screen.getByRole('button', { name: 'Start a new conversation' }));
  typeAndEnter('three');
  await screen.findByText('answer 3');

  const [a, b, c] = sentBodies().map((body) => body.conversationId);
  expect(a).toBe(b);
  expect(c).not.toBe(a);
});
