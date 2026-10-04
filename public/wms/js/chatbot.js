/* Hariyo Waste AI chat assistant */
(function () {
  'use strict';

  if (document.querySelector('.hariyo-chat')) return;

  const root = document.createElement('section');
  root.className = 'hariyo-chat';
  root.setAttribute('aria-label', 'Hariyo help assistant');
  root.innerHTML = `
    <div class="hariyo-chat-panel" id="hariyoChatPanel" hidden>
      <div class="hariyo-chat-head">
        <div><strong>Hariyo AI assistant</strong><small>Ask anything</small></div>
        <button class="hariyo-chat-close" type="button" aria-label="Close chat">&times;</button>
      </div>
      <div class="hariyo-chat-messages" id="hariyoChatMessages" role="log" aria-live="polite" aria-relevant="additions">
        <div class="hariyo-chat-message">Namaste! Ask me anything. I can also help with Hariyo collections, waste tracking, and compost.</div>
        <div class="hariyo-chat-suggestions" aria-label="Suggested questions">
          <button type="button">Book a pickup</button>
          <button type="button">Track my waste</button>
          <button type="button">Ask about compost</button>
        </div>
      </div>
      <form class="hariyo-chat-form">
        <label class="sr-only" for="hariyoChatInput">Ask a question</label>
        <input id="hariyoChatInput" type="text" maxlength="1200" placeholder="Write a message..." autocomplete="off" />
        <button type="submit" aria-label="Send message">${window.UI ? UI.iconSvg('send') : 'Send'}</button>
      </form>
    </div>
    <button class="hariyo-chat-toggle" type="button" aria-expanded="false" aria-controls="hariyoChatPanel">
      <span aria-hidden="true">&#10022;</span> Ask Hariyo
    </button>`;
  document.body.appendChild(root);

  const toggle = root.querySelector('.hariyo-chat-toggle');
  const panel = root.querySelector('.hariyo-chat-panel');
  const close = root.querySelector('.hariyo-chat-close');
  const messages = root.querySelector('.hariyo-chat-messages');
  const form = root.querySelector('.hariyo-chat-form');
  const input = root.querySelector('#hariyoChatInput');
  const sendButton = form.querySelector('button');
  const conversation = [];

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
    else toggle.focus();
  }

  function addMessage(text, who) {
    const message = document.createElement('div');
    message.className = `hariyo-chat-message${who === 'user' ? ' user' : ''}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  async function sendMessage(question) {
    addMessage(question, 'user');
    conversation.push({ role: 'user', content: question });
    root.querySelector('.hariyo-chat-suggestions')?.remove();
    const thinking = addMessage('Thinking...', 'assistant');
    input.disabled = true;
    sendButton.disabled = true;

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation.slice(-10) }),
      });
      const result = await response.json();
      thinking.remove();
      if (!response.ok) throw new Error(result.error || 'The assistant could not reply. Please try again.');
      const reply = String(result.reply || '').trim();
      if (!reply) throw new Error('The assistant returned an empty reply. Please try again.');
      conversation.push({ role: 'assistant', content: reply });
      addMessage(reply, 'assistant');
    } catch (error) {
      thinking.remove();
      addMessage(error instanceof Error ? error.message : 'I could not connect. Please try again.', 'assistant');
    } finally {
      input.disabled = false;
      sendButton.disabled = false;
      input.focus();
    }
  }

  toggle.addEventListener('click', () => setOpen(panel.hidden));
  close.addEventListener('click', () => setOpen(false));
  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
  messages.querySelectorAll('.hariyo-chat-suggestions button').forEach((button) => {
    button.addEventListener('click', () => {
      const question = button.textContent;
      sendMessage(question);
    });
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    input.value = '';
    sendMessage(question);
  });
})();