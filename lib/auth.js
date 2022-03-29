import { hash, compare } from 'bcryptjs'

// hashes a plaintext password
export async function hashPassword(password) {
	const hashedPassword = await hash(password, 12)
	return hashedPassword
}

// checks a supplied password to see if it can be hashed to match the hashed password
export async function verifyPassword(password, hashedPassword) {
	const isValid = await compare(password, hashedPassword)
	return isValid
}
