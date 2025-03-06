import serverConfig from '../../app/(shared)/config/serverConfig'

/** Prepend API base url to given path */
export function apiUrl(path: string) {
  const prefix = path.startsWith('/') ? '' : '/'
  const url = serverConfig.url + prefix + path

  return url
}
