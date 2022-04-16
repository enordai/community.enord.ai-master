import mysql from 'mysql'

import {MAX_SQL_CONCURRENT_CONNECTION} from '../../../constants/limits'
import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_USER,
} from '../../../constants/env'
import {SUCCESS, FAILURE, QUESTION_NOT_FOUND} from '../../../constants'
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
        const uid = Number(request.headers.uid || 0)
        const latest_first = Number(request.headers.latest || 1) // by default we will return newest records first

        const low = Number(request.headers.llimit || 0) // by default from initial position irrespective of sorting or ordering
        const high = Number(request.headers.hlimit || 5) // by default will provide 5 questions

        if (
            canContinueAPIRequestsForHeaderElements(
                response,
                uid,
                abs(low - high) <= 15,
            )
        ) {
            database.query(
                `SELECT qid, uid, search, title, body, added_at, tags, edited_at, total_answers, comments, upvotes, bookmarks, verified, hidden FROM questions WHERE uid=? ORDER BY qid ${
                    latest_first > 0 ? 'DESC' : 'ASC'
                } LIMIT ? OFFSET ?`,
                [uid, high, low],
                (error, results) => {
                    if (error) {
                        response.status(200).json({
                            code: FAILURE,
                            message: error,
                        })
                    } else {
                        if (arrayContainElements(results)) {
                            response.status(200).json({
                                code: SUCCESS,
                                data: results,
                            })
                        } else {
                            response.status(200).json({
                                code: QUESTION_NOT_FOUND,
                            })
                        }
                    }
                },
            )
        }
    }
}

// how to get the browser's name and os's name of the client side device...
// import {browserName, osName} from 'react-device-detect'
