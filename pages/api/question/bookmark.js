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
    BOOKMARK_ADDED,
    BOOKMARK_REMOVED,
} from '../../../constants'
import {
    arrayContainElements,
    canContinueAPIRequests,
    canContinueAPIRequestsForHeaderElements,
    isValidEmail,
    uuidv4,
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
        const qid = Number(request.headers.qid || 0)
        const uid = Number(request.headers.uid || 0)

        const ip = String(request.headers.ip || '')

        const clientBrowser = String(request.headers.browser || '')
        const clientOs = String(request.headers.os || '')
        const clientDeviceDetail = `${clientBrowser} on ${clientOs}`

        const uniqueID = uuidv4()

        if (
            canContinueAPIRequestsForHeaderElements(
                response,
                qid,
                uid,
                clientBrowser,
                clientOs,
                ip,
            )
            // && isValidEmail(response)
        ) {
            database.query(
                'SELECT * FROM bookmarked_questions WHERE qid=? AND uid=?',
                [qid, uid],
                (err, res) => {
                    if (err) {
                        response.status(200).json({
                            code: FAILURE,
                        })
                    } else if (arrayContainElements(res)) {
                        // the user have already bookmarked the question
                        // in this case delete the bookmark
                        database.query(
                            'DELETE FROM bookmarked_questions WHERE qid=? AND uid=?',
                            [qid, uid],
                            (err1, res1) => {
                                if (err1) {
                                    response.status(200).json({
                                        code: FAILURE,
                                    })
                                } else {
                                    // also decrementing the bookmarks value in the particular question table
                                    database.query(
                                        'UPDATE questions SET bookmarks=bookmarks-? WHERE qid=?',
                                        [1, qid],
                                        (err2, res1) => {
                                            response.status(200).json({
                                                code: BOOKMARK_REMOVED,
                                            })
                                        },
                                    )
                                }
                            },
                        )
                    } else {
                        // create a new bookmark row
                        // we can also make a new column in database which provides a data whether the row is deleted or not
                        // in this case we will not delete the row really but provide the row where it show not deleted when asked...
                        database.query(
                            'INSERT INTO bookmarked_questions (qid, uid, search, added_ip, device) VALUES (?, ?, ?, ?, ?)',
                            [qid, uid, uniqueID, ip, clientDeviceDetail],
                            (err1, res1) => {
                                if (err1) {
                                    response.status(200).json({
                                        code: FAILURE,
                                    })
                                } else {
                                    // also incrementing the bookmarks value in the particular question table
                                    database.query(
                                        'UPDATE questions SET bookmarks=bookmarks+? WHERE qid=?',
                                        [1, qid],
                                        (err2, res1) => {
                                            if (err2) {
                                                database.query(
                                                    'DELETE FROM bookmarked_questions WHERE search=?',
                                                    [uniqueID],
                                                )

                                                response.status(200).json({
                                                    code: FAILURE,
                                                })
                                            } else {
                                                response.status(200).json({
                                                    code: BOOKMARK_ADDED,
                                                })
                                            }
                                        },
                                    )
                                }
                            },
                        )
                    }
                },
            )
        }
    }
}
