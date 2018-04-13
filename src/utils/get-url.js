/**
 * @author  Dujishi
 * @create  18/4/10
 **/
const globalMock = true;
const devHosts = ['localhost', '127.0.0.1'];
const mockHost = 'https://www.easy-mock.com/mock/5accb5a5b7b3be6bd9b37574/mock';
const isDevHost = devHosts.indexOf(location.hostname) > -1;

export default function getUrl(key, mock) {
  if (isDevHost) {
    if (location.href.indexOf('mockServer') > -1 || mock || globalMock) {
      return `${mockHost}/${key}`;
    }
  }
  return key;
}

