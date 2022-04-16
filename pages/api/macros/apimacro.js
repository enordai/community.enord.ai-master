import mysql from 'mysql'

import {MAX_SQL_CONCURRENT_CONNECTION} from '../../../constants/limits'
import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_USER,
} from '../../../constants/env'
import {SUCCESS, FAILURE, PARTIAL_SUCCESS} from '../../../constants'
import {
    canContinueAPIRequests,
    canContinueAPIRequestsForHeaderElements,
    isValidEmail,
} from '../../../utils'

const database = mysql.createPool({
    host: DATABASE_HOST,
    database: DATABASE_NAME,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    connectionLimit: MAX_SQL_CONCURRENT_CONNECTION,
})

export default function handler(request, response) {
    if (canContinueAPIRequests(request, response)) {
        // header variables...
        const ____VAR = String(request.headers.____var || '')

        if (
            canContinueAPIRequestsForHeaderElements(response)
            // && isValidEmail(response)
        ) {
            database.query('', [], (err, res) => {
                response.status(200).json({
                    code: SUCCESS,
                })
            })
        }
    }
}
