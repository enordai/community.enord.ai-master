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
        // header variables...
        const low = Number(request.headers.low || 0) // by default from initial position irrespective of sorting or ordering
        const high = Number(request.headers.high || 15) // by default will provide 5 questions

        if (
            canContinueAPIRequestsForHeaderElements(
                response,
                abs(low - high) <= 15,
            )
            // && isValidEmail(response)
        ) {
            database.query(
                'SELECT question.qid, question.uid, question.search, question.title, question.body, question.tags, question.added_at, question.edited_at, question.total_answers, question.comments, question.upvotes, question.bookmarks, question.verified, question.hidden, user.username, user.fullname, user.profile_image FROM users user JOIN questions question ON user.uid=question.uid WHERE qid>0 ORDER BY added_at DESC LIMIT ? OFFSET ?',
                [high, low],
                (err, res) => {
                    if (err) {
                        response.status(200).json({
                            code: FAILURE,
                        })
                    } else if (arrayContainElements(res)) {
                        response.status(200).json({
                            code: SUCCESS,
                            data: res,
                        })
                    } else {
                        response.status(200).json({
                            code: QUESTION_NOT_FOUND,
                        })
                    }
                },
            )
        }
    }
}
