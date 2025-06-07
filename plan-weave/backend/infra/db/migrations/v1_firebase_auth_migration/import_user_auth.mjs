import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '../../../../internal/config/.env' })

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const usersToImport = [
    // ... rest omitted for privacy reasons
    {
        "email": "1@test.com",
        "created": "Sep 20, 2023",
        "signedIn": "Apr 14, 2025",
        "username": "ZXhScV4rVWUIb9Ep3dldI5brDXc2",
        "user_id": "745c122d-f7b6-455b-b3fb-093e79b7fc7e"
    }
]

const importUsers = async (users) => {
    let usersAdded = 0
    for (const { user_id, email, username, created, signedIn } of users) {
        const { error } = await supabase.auth.admin.createUser({ id: user_id, email, user_metadata: { username, full_name: username, legacy_created: created, legacy_signedIn: signedIn, } })
        if (error) console.error(`❌ Failed to create user ${email}:`, error.message)
    }
    usersAdded++
    console.log(`Total number of users added: ${usersAdded} of ${users?.length || 0}`)
}

importUsers(usersToImport)