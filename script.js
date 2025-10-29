(function () {
  'use strict';

  const VALID = { username: 'admin', password: 'Coffee123' };
  const MAX_ATTEMPTS = 5;
  const LOCK_SECONDS = 30;

  let failed = 0;
  let lockedUntil = 0;

  const form = document.getElementById('loginForm');
  const userInput = document.getElementById('username');
  const passInput = document.getElementById('password');
  const msgEl = document.getElementById('msg');
  const submitBtn = document.getElementById('submitBtn');
  const clearBtn = document.getElementById('clearBtn');

  function showMessage(text, isSuccess = false) {
    msgEl.textContent = text;
    msgEl.className = isSuccess ? 'msg success' : 'msg';
  }

  function updateLockUI() {
    const now = Date.now();
    if (lockedUntil > now) {
      const secs = Math.ceil((lockedUntil - now) / 1000);
      submitBtn.disabled = true;
      showMessage(`Too many attempts — try again in ${secs}s`);
      return true;
    } else {
      submitBtn.disabled = false;
      if (failed >= MAX_ATTEMPTS) failed = 0;
      return false;
    }
  }

  setInterval(updateLockUI, 500);

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();

    if (updateLockUI()) return;

    const username = userInput.value.trim();
    const password = passInput.value;

    if (!username || !password) {
      showMessage('Please fill both fields.');
      return;
    }

    if (username === VALID.username && password === VALID.password) {
      showMessage('Access Granted! Redirecting...', true);
      setTimeout(() => {
        window.location.href = 'congrats.html';
      }, 1200);
    } else {
      failed++;
      if (failed >= MAX_ATTEMPTS) {
        lockedUntil = Date.now() + LOCK_SECONDS * 1000;
        showMessage(`Too many failed attempts. Locked for ${LOCK_SECONDS} seconds.`);
      } else {
        showMessage('Access Denied!');
      }
    }
  });

  clearBtn.addEventListener('click', function () {
    userInput.value = '';
    passInput.value = '';
    showMessage('');
  });

  userInput.focus();
})();
