import { AuthStrategy } from 'payload'

export const SSOStrategy: AuthStrategy = {
    name: 'sso-strategy',
    authenticate: async ({ headers, payload }) => {
        const cookieHeader = headers.get('cookie') || ''

        // Check karein kya central payload token browser ki cookie me maujood hai
        // Payload default token ka naam 'payload-token' rakhta hai
        if (!cookieHeader.includes('payload-token')) {
            return { user: null }
        }
        console.log("Cookie found on consumer server:", { cookieHeader })
        try {
            // 1. Shared cookie ko direct central auth server par bhej kar check karein
            // 1. Cookie ko MANUAL headers me daal kar central server pr bhejein
            const response = await fetch('https://auth.devslix.com/api/users/verify-session', {
                method: 'GET',
                headers: {
                    'Cookie': cookieHeader, // Yeh line cookie central server tak pahonchaye gi
                    'Content-Type': 'application/json',
                },
                cache: 'no-store' // Cache disable karna lazmi hai taake stale data na aaye
            })
            if (!response.ok) {
                console.log("Central auth responded with error status:", response.status)
                return { user: null }
            }
            const session = await response.json()
            console.log("Central auth session response:", session)

            if (!session || !session.authenticated || !session.user) {
                return { user: null }
            }

            // 2. Local Database me check karein kya yeh user pehle se exist karta hai?
            const localUsers = await payload.find({
                collection: 'users',
                where: { email: { equals: session.user.email } },
                limit: 1,
            })

            let localUser = localUsers.docs[0]

            // 3. LAZY CREATION: Agar user local DB me nahi hai, to chupke se use create kar dein
            // Kyunki user central DB me register ho chuka hai, yahan hum bina login/register poochhe uska record bana rahe hain
            if (!localUser) {
                localUser = await payload.create({
                    collection: 'users',
                    data: {
                        email: session.user.email,
                        username: session.user.name,
                        // Yahan agar skillshelf hai, to multi-tenant creation ka code bhi aa sakta hai
                    },
                })
            }

            // 4. User mil gaya ya ban gaya, ab local app me session start ho gaya
            return { user: localUser }

        } catch (error) {
            console.error('SSO Authentication Error:', error)
            return { user: null }
        }
    },
}