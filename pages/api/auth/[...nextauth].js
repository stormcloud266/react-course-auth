import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { verifyPassword } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/db'

// [...nextauth].js catches all routes not otherwise specified in the api/auth folder

export default NextAuth({
	session: {
		jwt: true,
	},
	// providers are services that can be used to sign in a user
	providers: [
		// The Credentials provider allows you to handle signing in with arbitrary credentials, such as a username and password, two-factor authentication or hardware device
		Providers.Credentials({
			async authorize(credentials) {
				// connect to mongodb and users collection, tries to find a user with the supplied email
				const client = await connectToDatabase()
				const usersCollection = client.db().collection('users')
				const user = await usersCollection.findOne({ email: credentials.email })

				// error if there isn't a user with that email
				if (!user) {
					client.close()
					throw new Error('No user found')
				}

				// checks if supplied password can be hashed to match the saved password
				const isValid = await verifyPassword(
					credentials.password,
					user.password
				)

				// error if incorrect password
				if (!isValid) {
					client.close()
					throw new Error('Could not login')
				}

				// if email and password match return email. this will be visible on the front end, so don't return password
				client.close()
				return { email: user.email }
			},
		}),
	],
})
