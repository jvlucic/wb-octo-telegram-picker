export function generateURL(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  return `http://api-test.unidesq.com${adjustedPath}`;
}

export function secureHeader(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function applicationJsonHeader() {
  return {
    'Content-type': 'application/json; charset=UTF-8',
  };
}
