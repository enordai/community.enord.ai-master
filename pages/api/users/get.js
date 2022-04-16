import mysql from 'mysql'

import {MAX_SQL_CONCURRENT_CONNECTION} from '../../../constants/limits'
import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_USER,
} from '../../../constants/env'
import {
    SUCCESS,
    FAILURE,
    PARTIAL_SUCCESS,
    USER_NOT_FOUND,
} from '../../../constants'
import {
    arrayContainElements,
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
        const username = String(request.headers.username || '')

        if (
            canContinueAPIRequestsForHeaderElements(response, username)
            // && isValidEmail(response)
        ) {
            database.query(
                'SELECT username, fullname, profile_image, gender, created_on, last_login_on, github, twitter, questions_count, answers_count, verified_account FROM users WHERE username=?',
                [username],
                (err, res) => {
                    if (err) {
                        response.status(200).json({
                            code: FAILURE,
                        })
                    } else if (arrayContainElements(res)) {
                        response.status(200).json({
                            code: SUCCESS,
                            data: res[0],
                        })
                    } else {
                        response.status(200).json({
                            code: USER_NOT_FOUND,
                        })
                    }
                },
            )
        }
    }
}
