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
        const qid = Number(request.headers.qid || 0)
        const aid = Number(request.headers.aid || 0)
        const uid = Number(request.headers.uid || 0)
        const comment = String(request.headers.comment || '')
        /**
         * @deprecated since this feature is only taken as may be required in future
         * this feature may be required in future
         */
        const replied_to = String(request.headers.replied_to || '')

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
                aid,
                uid,
                comment,
                clientBrowser,
                clientOs,
                ip,
            )
            // && isValidEmail(response)
        ) {
            // may be we can first check wheather the user have already commented on the same question
            // then continue to add a new one if not
            database.query(
                'INSERT INTO anscomments (qid, aid, uid, search, comment, added_ip, edited_ip, device) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [qid, aid, uid, uniqueID, comment, ip, ip, clientDeviceDetail],
                (err, res) => {
                    if (err) {
                        response.status(200).json({
                            code: FAILURE,
                        })
                    } else {
                        database.query(
                            'UPDATE answers SET comments=comments+? WHERE qid=? AND aid=?',
                            [1, qid, aid],
                            (err1, res1) => {
                                if (err1) {
                                    database.query(
                                        'DELETE FROM anscomments WHERE search=?',
                                        [uniqueID],
                                    )

                                    response.status(200).json({
                                        code: FAILURE,
                                    })
                                } else {
                                    response.status(200).json({
                                        code: SUCCESS,
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
