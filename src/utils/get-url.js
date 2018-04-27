/**
 * @author  Dujishi
 * @create  18/4/10
 **/
const globalMock = false;
const devHosts = ['localhost', '172.31.50.163:8080'];
const mockHost = 'https://www.easy-mock.com/mock/5accb5a5b7b3be6bd9b37574/mock';
const testHost = '';
const isDevHost = devHosts.indexOf(location.hostname) > -1;

export default function getUrl(key, mock) {
  if (isDevHost) {
    if (location.href.indexOf('mockServer') > -1 || mock || globalMock) {
      return `${mockHost}/${key}`;
    }else{
      return `${testHost}/${key}`
    }

  }
  return key
}

