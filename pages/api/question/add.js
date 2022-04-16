import mysql from 'mysql'

import {MAX_SQL_CONCURRENT_CONNECTION} from '../../../constants/limits'
import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_USER,
} from '../../../constants/env'
import {SUCCESS, FAILURE} from '../../../constants'
import {
    canContinueAPIRequests,
    canContinueAPIRequestsForHeaderElements,
    getFormattedCurrentTime,
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
        // user id or user email provided by the client side
        // at least one field among uid and email is required to generate OTP.
        // getting from header data
        const uid = Number(request.headers.uid || 0)
        const title = String(request.headers.title || '').trim()
        const tags = String(request.headers.tags || '').trim()
        const ip = String(request.headers.ip || '')

        // taking from posted data
        const body = String(request.body || '')

        const clientBrowser = String(request.headers.browser || '')
        const clientOs = String(request.headers.os || '')
        const clientDeviceDetail = `${clientBrowser} on ${clientOs}`

        const uniqueID = uuidv4()
        const currentTime = getFormattedCurrentTime()

        if (
            canContinueAPIRequestsForHeaderElements(
                response,
                uid,
                title,
                body,
                tags,
                ip,
                clientBrowser,
                clientOs,
            )
        ) {
            database.query(
                'INSERT INTO questions (search, uid, title, body, added_at_ip, tags, device) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [uniqueID, uid, title, body, ip, tags, clientDeviceDetail],
                (err, res) => {
                    if (err) {
                        response.status(200).json({
                            code: FAILURE,
                        })
                    } else {
                        database.query(
                            'UPDATE users SET questions_count=questions_count+?, last_question_asked_id=?, last_question_asked_on=? WHERE uid=?',
                            [1, uniqueID, currentTime, uid],
                            (err, res) => {
                                if (err) {
                                    database.query(
                                        'DELETE FROM questions WHERE search=?',
                                        [uniqueID],
                                    )

                                    response.status(200).json({
                                        code: FAILURE,
                                    })
                                } else {
                                    response.status(200).json({
                                        code: SUCCESS,
                                        qid: uniqueID,
                                        time: currentTime,
                                    })
                                }
                            },
                        )
                    }
                },
            )
        }
    }
}

// how to get the browser's name and os's name of the client side device...
// import {browserName, osName} from 'react-device-detect'
