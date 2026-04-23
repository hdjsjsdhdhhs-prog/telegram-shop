export function getTelegram() {
  if (typeof window === 'undefined') return null;
  return window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
}

export function initTelegram() {
  const tg = getTelegram();
  if (!tg) return null;
  try {
    tg.ready();
    tg.expand();
  } catch (e) {
    // noop
  }
  return tg;
}

export function getTelegramUser() {
  const tg = getTelegram();
  const user = tg?.initDataUnsafe?.user;
  if (!user) return null;
  return {
    id: user.id,
    username: user.username || null,
    first_name: user.first_name || null,
    last_name: user.last_name || null,
    language_code: user.language_code || null,
  };
}
