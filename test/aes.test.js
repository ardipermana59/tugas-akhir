require('dotenv').config()

const { AES } = require('../utils')
const KEY = process.env.SECRET_KEY

describe('AES Encryption', () => {
  const testEncryption = (text, key, shouldSucceed) => {
    const encryptedData = AES.encrypt(text, key)

    if (shouldSucceed) {
      expect(encryptedData).not.toBe(text)
      expect(encryptedData).toMatch(/^[A-Za-z0-9+/=]+$/)
    } else {
      expect(encryptedData).toBeNull()
    }
  }

  it('should encrypt plaintext of length 16 characters with key', () => {
    const text = '1234567890123456'
    testEncryption(text, KEY, true)
  })

  it('should encrypt plaintext of length <16 characters with key', () => {
    const text = '12345'
    testEncryption(text, KEY, true)
  })

  it('should encrypt plaintext of length >16 characters with key', () => {
    const text = 'This is a longer plaintext'
    testEncryption(text, KEY, true)
  })

  it('should return null for encryption with key as null', () => {
    const text = '1234567890123456'
    testEncryption(text, null, false)
  })

  it('should return null for encryption with key as undefined', () => {
    const text = '1234567890123456'
    testEncryption(text, undefined, false)
  })
})

describe('AES Decription', () => {
  const testDecryption = (ciphertext, key, shouldSucceed) => {
    try {
      const decryptedData = AES.decrypt(ciphertext, key)
      if (shouldSucceed) {
        expect(decryptedData).toBeTruthy() 
        expect(decryptedData).not.toBe(ciphertext) 
      } else {
        expect(decryptedData).toBeNull() 
      }
    } catch (error) {
      if (shouldSucceed) {
        throw error 
      } else {
        expect(error).toBeTruthy() 
      }
    }
  }

  it('should decrypt valid ciphertext with valid key', () => {
    const text = '1234567890123456'
    const encryptedData = AES.encrypt(text, KEY)
    
    const decryptedData = AES.decrypt(encryptedData, KEY)
    
    expect(decryptedData).toBe(text)
  })

  it('should fail to decrypt ciphertext longer than expected with valid key', () => {
    const text = 'This is a longer plaintext'
    const encryptedData = AES.encrypt(text, KEY)
    testDecryption(encryptedData.encryptedData + 'extra', KEY, false)
  })

  it('should fail to decrypt ciphertext shorter than expected with valid key', () => {
    const text = '12345'
    const encryptedData = AES.encrypt(text, KEY)
    testDecryption(encryptedData.slice(0, -1), KEY, false)
  })

  it('should fail to decrypt valid ciphertext with invalid key', () => {
    const text = '1234567890123456'
    const encryptedData = AES.encrypt(text, KEY)
    testDecryption(encryptedData.encryptedData, 'invalid-key', false)
  })
})
