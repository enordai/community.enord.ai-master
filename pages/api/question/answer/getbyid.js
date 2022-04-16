import mysql from 'mysql'

import {MAX_SQL_CONCURRENT_CONNECTION} from '../../../../constants/limits'
import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_USER,
} from '../../../../constants/env'
import {SUCCESS, FAILURE, ANSWER_NOT_FOUND} from '../../../../constants'
import {
    arrayContainElements,
    canContinueAPIRequests,
    canContinueAPIRequestsForHeaderElements,
    getFormattedCurrentTime,
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
        // user id or user email provided by the client side
        // at least one field among uid and email is required to generate OTP.
        // getting from header data
        const answerSearchID = String(request.headers.id || '')

        if (canContinueAPIRequestsForHeaderElements(response, answerSearchID)) {
            database.query(
                `SELECT answer.aid, answer.qid, answer.uid, answer.search, answer.body, answer.added_at, answer.edited_at, answer.comments, answer.upvotes, answer.verified, answer.hidden, user.username, user.fullname, user.profile_image FROM users user JOIN answers answer ON user.uid=answer.uid WHERE search=? OR aid=?`,
                [answerSearchID, answerSearchID],
                (error, results) => {
                    if (error) {
                        response.status(200).json({
                            code: FAILURE,
                        })
                    } else {
                        if (arrayContainElements(results)) {
                            response.status(200).json({
                                code: SUCCESS,
                                data: results[0],
                            })
                        } else {
                            response.status(200).json({
                                code: ANSWER_NOT_FOUND,
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
