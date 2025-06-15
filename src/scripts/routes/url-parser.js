function extractPathnameSegments(path) {
  const splitUrl = path.split('/');

  return {
    resource: splitUrl[1] || null,
    id: splitUrl[2] || null,
  };
}

function constructRouteFromSegments(pathSegments) {
  let pathname = '';

  if (pathSegments.resource) {
    pathname = pathname.concat(`/${pathSegments.resource}`);
  }

  if (pathSegments.id) {
    pathname = pathname.concat('/:id');
  }

  return pathname || '/';
}

export function getActivePathname() {
  return location.hash.replace('#', '') || '/';
}

export function getActiveRoute() {
  const pathname = getActivePathname();
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parseActivePathname() {
  const pathname = getActivePathname();
  return extractPathnameSegments(pathname);
}

export function getRoute(pathname) {
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parsePathname(pathname) {
  return extractPathnameSegments(pathname);
}

const UrlParser = {
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase() || '/';
    const splitedUrl = this._splitUrl(url);
    return this._combineUrl(splitedUrl);
  },

  _splitUrl(url) {
    const urls = url.split('/');
    return {
      resource: urls[1] || null,
      id: urls[2] || null,
      verb: urls[3] || null,
    };
  },

  _combineUrl(splitedUrl) {
    return (
      (splitedUrl.resource ? `/${splitedUrl.resource}` : '/') +
      (splitedUrl.id ? '/:id' : '') +
      (splitedUrl.verb ? `/${splitedUrl.verb}` : '')
    );
  },
};

export default UrlParser;
