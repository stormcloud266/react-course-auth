import { connectToDatabase } from '../../../lib/db'
import { hashPassword } from '../../../lib/auth'

async function handler(req, res) {
	const data = req.body
	const { email, body } = data

	if (
		!email ||
		!email.includes('@') ||
		!password ||
		password.trim().length < 7
	) {
		res.status(422).json({ message: 'Invalid input data' })
		return
	}

	const client = await connectToDatabase()
	const db = client.db()

	const hashedPassword = hashPassword(password)

	const result = await db
		.collection('users')
		.insertOne({ email, password: hashedPassword })

	res.status(201).json({ message: 'Created user!' })
}

export default handler
