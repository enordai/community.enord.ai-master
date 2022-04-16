import mysql from 'mysql'

import {MAX_SQL_CONCURRENT_CONNECTION} from '../../constants/limits'
import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_USER,
    SECRET_API_KEY,
} from '../../constants/env'
import {} from '../../constants'
import {sendDefaultAccessDeniedResponse} from '../../utils'

const database = mysql.createPool({
    host: DATABASE_HOST,
    database: DATABASE_NAME,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    connectionLimit: MAX_SQL_CONCURRENT_CONNECTION,
})

export default function handler(req, res) {
    /**
     * if the request is not post or the key is not provided then return a fallback status response
     * without this two conditions unwanted errors may occur
     * this two condition is also important for security purpose
     */
    if (req.method !== 'POST') return sendDefaultAccessDeniedResponse(res)
    else if (req.headers.key !== SECRET_API_KEY)
        return sendDefaultAccessDeniedResponse(res)
}
