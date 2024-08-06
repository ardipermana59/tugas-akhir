require('dotenv').config()

const { SHA } = require('../utils')

describe('SHA Hashing', () => {
  it('should generate a hash from plaintext and verify it correctly', () => {
    const plaintext = 'test'
    const hash = SHA.generateHash(plaintext)
    const isVerified = SHA.verifyHash(plaintext, hash)
 
    expect(hash).not.toBe(plaintext)
    expect(isVerified).toBe(true)
  })

  it('should not verify incorrect hash', () => {
    const plaintext = 'test'
    const wrongHash = SHA.generateHash('wrongtext') 
    const isVerified = SHA.verifyHash(plaintext, wrongHash)
    
    expect(isVerified).toBe(false)
  })
})
