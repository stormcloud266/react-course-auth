import { connectToDatabase } from '../../../lib/db'
import { hashPassword } from '../../../lib/auth'

async function handler(req, res) {
	if (req.method !== 'POST') {
		return
	}

	const { email, password } = req.body

	if (
		!email ||
		!email.includes('@') ||
		!password ||
		password.trim().length < 7
	) {
		res.status(422).json({
			message:
				'Please enter valid email and password with at least 7 characters',
		})
		return
	}

	const client = await connectToDatabase()
	const db = client.db()

	const existingUser = await db.collection('users').findOne({ email })

	if (existingUser) {
		res.status(422).json({
			message: 'Email already in use',
		})
		client.close()
		return
	}

	const hashedPassword = await hashPassword(password)

	const result = await db.collection('users').insertOne({
		email,
		password: hashedPassword,
	})

	res.status(201).json({ message: 'Signed up successfully!' })
	client.close()
}

export default handler
