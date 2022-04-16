import mysql from 'mysql'

import {MAX_SQL_CONCURRENT_CONNECTION} from '../../../../constants/limits'
import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_USER,
} from '../../../../constants/env'
import {SUCCESS, FAILURE, PARTIAL_SUCCESS} from '../../../../constants'
import {
    canContinueAPIRequests,
    canContinueAPIRequestsForHeaderElements,
    getFormattedCurrentTime,
    isValidEmail,
    uuidv4,
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
        const qid = Number(request.headers.qid || '')
        const uid = Number(request.headers.uid || '')

        // taking from posted data
        const body = String(request.body || '')

        const ip = String(request.headers.ip || '')

        const clientBrowser = String(request.headers.browser || '')
        const clientOs = String(request.headers.os || '')
        const clientDeviceDetail = `${clientBrowser} on ${clientOs}`

        const uniqueID = uuidv4()
        const currentTime = getFormattedCurrentTime()

        if (
            canContinueAPIRequestsForHeaderElements(
                response,
                qid,
                uid,
                body,
                ip,
                clientBrowser,
                clientOs,
            )
            // && isValidEmail(response)
        ) {
            database.query(
                'INSERT INTO answers (qid, uid, search, body, added_ip, edited_ip, device) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [qid, uid, uniqueID, body, ip, ip, clientDeviceDetail],
                (err, res) => {
                    if (err) {
                        response.status(200).json({
                            code: FAILURE,
                        })
                    } else {
                        database.query(
                            'UPDATE users SET answers_count=answers_count+?, last_question_answered_id=?, last_question_answered_on=? WHERE uid=?',
                            [1, uniqueID, currentTime, uid],
                            (err, res) => {
                                if (err) {
                                    database.query(
                                        'DELETE FROM answers WHERE search=?',
                                        [uniqueID],
                                    )

                                    response.status(200).json({
                                        code: FAILURE,
                                    })
                                } else {
                                    database.query(
                                        'UPDATE questions SET total_answers=total_answers+?, last_activity=? WHERE qid=?',
                                        [1, currentTime, qid],
                                        (err1, res1) => {
                                            if (err1) {
                                                database.query(
                                                    'DELETE FROM answers WHERE search=?',
                                                    [uniqueID],
                                                )

                                                response.status(200).json({
                                                    code: FAILURE,
                                                })
                                            } else {
                                                response.status(200).json({
                                                    code: SUCCESS,
                                                    aid: uniqueID,
                                                    time: currentTime,
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
