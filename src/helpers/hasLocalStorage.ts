let cached: boolean | undefined;
export default function hasLocalStorage() {
  if (typeof localStorage === 'undefined') {
    return false;
  }
  if (typeof cached !== 'undefined') {
    return cached;
  }
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    cached = true;
  } catch (e) {
    cached = false;
  }
  return cached;
}