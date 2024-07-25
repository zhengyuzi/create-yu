import CryptoJS from 'crypto-js'

// 十六位十六进制数作为密钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse('86f1fda459fa47c7')
// 十六位十六进制数作为密钥偏移量
const SECRET_IV = CryptoJS.enc.Utf8.parse('c18eea9cbe12489e')

/**
 * 加密方法
 */
export function encrypt(data: string) {
  const dataHex = CryptoJS.enc.Utf8.parse(data)
  const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.ciphertext.toString()
}

/**
 * 解密方法
 */
export function decrypt(data: string) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data)
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
