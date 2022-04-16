import mysql from 'mysql'

import {
    COMMENTS_LIMIT,
    MAX_SQL_CONCURRENT_CONNECTION,
} from '../../../constants/limits'
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
    DATA_NOT_FOUND,
} from '../../../constants'
import {
    abs,
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
        const qid = String(request.headers.qid || '')
        const limit = Number(request.headers.high || COMMENTS_LIMIT / 2) // to the comment limit
        const offset = Number(request.headers.low || 0) // from the starting of the data

        if (
            canContinueAPIRequestsForHeaderElements(
                response,
                qid,
                limit >= 0,
                offset >= 0,
                abs(offset - limit) <= 15,
            )
            // && isValidEmail(response)
        ) {
            database.query(
                'SELECT u.username, u.fullname, qc.id, qc.qid, qc.uid, qc.search, qc.comment, qc.added_at, qc.edited_at, qc.verified, qc.hidden FROM users u JOIN quecomments qc ON u.uid = qc.uid WHERE qc.qid=? ORDER BY qc.id DESC LIMIT ? OFFSET ?',
                [qid, limit, offset],
                (err, res) => {
                    if (err) {
                        response.status(200).json({
                            code: FAILURE,
                            err,
                        })
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
