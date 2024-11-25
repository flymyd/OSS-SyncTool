import Crypto from '@/utils/crypto/crypto.js';
import '@/utils/crypto/hmac.js';
import '@/utils/crypto/sha1.js';
import {Base64} from '@/utils/crypto/base64.js';

export function getConfigByHost(osshost) {
  return new Promise((resolve, reject) => {
    let date = new Date()
    date = date.setHours(date.getHours() + 1)
    let extime = "" + new Date(date).toISOString()
    let policyText = {
      "expiration": extime,
      "conditions": [
        ["content-length-range", 0, 1024 * 1024 * 100]
      ]
    };
    let bytes = Crypto.HMAC(Crypto.SHA1, Base64.encode(JSON.stringify(policyText)), '', {
      asBytes: true
    });
    let signature = Crypto.util.bytesToBase64(bytes);
    resolve(JSON.parse(JSON.stringify({
      name: 'aliyun',
      host: osshost,
      accessid: '',
      signature: signature,
      policyBase64: Base64.encode(JSON.stringify(policyText)),
    })))
  })
}
