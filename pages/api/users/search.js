import mysql from 'mysql'

import {MAX_SQL_CONCURRENT_CONNECTION} from '../../../constants/limits'
import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_USER,
} from '../../../constants/env'
import {SUCCESS, FAILURE, USER_NOT_FOUND} from '../../../constants'
import {
    abs,
    arrayContainElements,
    canContinueAPIRequests,
    canContinueAPIRequestsForHeaderElements,
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
        // user id or user email provided by the client side
        // at least one field among uid and email is required to generate OTP.
        // getting from header data
        const searchQuery = String(request.headers.query || '').replace(
            ' ',
            '%',
        ) // so that any spaces also count and search as fzf searcher

        const low = Number(request.headers.low || 0) // by default from initial position irrespective of sorting or ordering
        const high = Number(request.headers.high || 10) // by default will provide 5 questions

        if (
            canContinueAPIRequestsForHeaderElements(
                response,
                searchQuery,
                abs(low - high) <= 15,
            )
        ) {
            database.query(
                `SELECT username, fullname, profile_image, gender, created_on, last_login_on, github, twitter, questions_count, answers_count, verified_account FROM users WHERE username LIKE "%${searchQuery}%" OR fullname LIKE "%${searchQuery}%" LIMIT ? OFFSET ?`,
                [high, low],
                (error, results) => {
                    if (error) {
                        response.status(200).json({
                            code: FAILURE,
                        })
                    } else {
                        if (arrayContainElements(results)) {
                            response.status(200).json({
                                code: SUCCESS,
                                data: results,
                            })
                        } else {
                            response.status(200).json({
                                code: USER_NOT_FOUND,
                            })
                        }
                    }
                },
            )
        }
    }
}
