import mysql from 'mysql'

import {
    COMMENTS_LIMIT,
    MAX_SQL_CONCURRENT_CONNECTION,
} from '../../../../constants/limits'
import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_USER,
} from '../../../../constants/env'
import {
    SUCCESS,
    FAILURE,
    PARTIAL_SUCCESS,
    DATA_NOT_FOUND,
} from '../../../../constants'
import {
    arrayContainElements,
    canContinueAPIRequests,
    canContinueAPIRequestsForHeaderElements,
    isValidEmail,
    abs,
} from '../../../../utils'

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
        const aid = String(request.headers.aid || '')
        const limit = Number(request.headers.high || COMMENTS_LIMIT / 2) // to the comment limit
        const offset = Number(request.headers.low || 0) // from the starting of the data points

        if (
            canContinueAPIRequestsForHeaderElements(
                response,
                aid,
                limit >= 0,
                offset >= 0,
                abs(offset - limit) <= 15,
            )
            // && isValidEmail(response)
        ) {
            database.query(
                'SELECT u.username, u.fullname, ac.id, ac.aid, ac.uid, ac.search, ac.comment, ac.added_at, ac.edited_at, ac.verified, ac.hidden FROM users u JOIN anscomments ac ON u.uid = ac.uid WHERE ac.aid=? ORDER BY ac.id DESC LIMIT ? OFFSET ?',
                [aid, limit, offset],
                (err, res) => {
                    if (err) {
                        response.status(200).json({code: FAILURE, err})
                    } else {
                        if (arrayContainElements(res)) {
                            response.status(200).json({
                                code: SUCCESS,
                                data: res,
                                page: [offset, res.length],
                            })
                        } else {
                            response.status(200).json({
                                code: DATA_NOT_FOUND,
                            })
                        }
                    }
                },
            )
        }
    }
}
