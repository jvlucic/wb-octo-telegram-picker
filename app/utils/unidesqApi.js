function composeHeaders(...headersGenerator) {
  return headersGenerator.reduce((headers, generator) => generator(headers), {});
}

export function generateURL(path, version = 'v2') {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  return `http://api-test.unidesq.com/${version}${adjustedPath}`;
}

export function secureHeader(token) {
  return (headers) => ({
    ...headers,
    Autorization: `Bearer ${token}`,
  });
}

export function applicationJsonHeader(headers) {
  return {
    ...headers,
    'Content-type': 'application/json; charset=UTF-8',
  };
}

export const secureApplicationJsonHeader = token => composeHeaders(
  secureHeader(token),
  applicationJsonHeader
);
