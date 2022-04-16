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
    arrayContainElements,
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
        const questionSearchID = String(request.headers.id || '')

        if (
            canContinueAPIRequestsForHeaderElements(response, questionSearchID)
        ) {
            database.query(
                `SELECT question.qid, question.uid, question.search, question.title, question.body, question.added_at, question.tags, question.edited_at, question.total_answers, question.comments, question.upvotes, question.verified, question.hidden, user.username, user.fullname, user.profile_image FROM users user JOIN questions question ON user.uid=question.uid WHERE search=? OR qid=?`,
                [questionSearchID, questionSearchID],
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
