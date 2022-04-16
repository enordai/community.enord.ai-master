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
    VOTE_UPDATED_SUCCESSFULLY,
    VOTE_CREATED_SUCCESSFULLY,
} from '../../../constants'
import {
    arrayContainElements,
    canContinueAPIRequests,
    canContinueAPIRequestsForHeaderElements,
    getFormattedCurrentTime,
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
        const qid = Number(request.headers.qid || '')
        const uid = Number(request.headers.uid || '')

        const uniqueID = uuidv4()
        const currentTime = getFormattedCurrentTime()

        const ip = String(request.headers.ip || '')

        const clientBrowser = String(request.headers.browser || '')
        const clientOs = String(request.headers.os || '')
        const clientDeviceDetail = `${clientBrowser} on ${clientOs}`

        const vote = Number(request.headers.vote || 0)
        let actualVote = 0
        if (vote > 0)
            // its a upvote
            actualVote = 1
        else if (vote < 0)
            // its a downvote
            actualVote = -1
        else if (vote === 0)
            // vote cleared
            actualVote = 0

        if (
            canContinueAPIRequestsForHeaderElements(
                response,
                qid,
                uid,
                ip,
                clientBrowser,
                clientOs,
            )
            // && isValidEmail(response)
        ) {
            database.query(
                'SELECT * FROM quevotes WHERE qid=? AND uid=?',
                [qid, uid],
                (err, res) => {
                    if (err) {
                        response.status(200).json({
                            code: FAILURE,
                        })
                    } else if (arrayContainElements(res)) {
                        // a vote is already present
                        // in this case just update the vote row
                        database.query(
                            'UPDATE quevotes SET vote=?, edited_at=?, edited_ip=? WHERE qid=? AND uid=?',
                            [actualVote, currentTime, ip, qid, uid],
                            (err1, res1) => {
                                if (err) {
                                    // an error occurred while updating
                                    response.status(200).json({
                                        code: FAILURE,
                                    })
                                } else {
                                    // now we are updating the the upvote column in the questions table also with the
                                    // latest data of upvoting and downvoting
                                    // DOUBLE ALSO BELOW
                                    database.query(
                                        'SELECT SUM(vote) as total_votes FROM quevotes WHERE qid=?',
                                        [qid],
                                        (err1, totalVotesData) => {
                                            database.query(
                                                'UPDATE questions SET upvotes=? WHERE qid=?',
                                                [
                                                    totalVotesData[0]
                                                        .total_votes,
                                                    qid,
                                                ],
                                                (err2, res2) => {},
                                            )
                                        },
                                    )

                                    response.status(200).json({
                                        code: VOTE_UPDATED_SUCCESSFULLY,
                                    })
                                }
                            },
                        )
                    } else {
                        // the vote is not present
                        // create a new vote row in the db
                        database.query(
                            'INSERT INTO quevotes (qid, uid, search, vote, added_ip, edited_ip, device) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [
                                qid,
                                uid,
                                uniqueID,
                                actualVote,
                                ip,
                                ip,
                                clientDeviceDetail,
                            ],
                            (err1, res1) => {
                                if (err) {
                                    // an error occurred while updating
                                    response.status(200).json({
                                        code: FAILURE,
                                    })
                                } else {
                                    // this step must be done only after creating vote
                                    // now we are updating the the upvote column in the questions table also with the
                                    // latest data of upvoting and downvoting
                                    // DOUBLE ALSO ABOVE
                                    database.query(
                                        'SELECT SUM(vote) as total_votes FROM quevotes WHERE qid=?',
                                        [qid],
                                        (err1, totalVotesData) => {
                                            database.query(
                                                'UPDATE questions SET upvotes=? WHERE qid=?',
                                                [
                                                    totalVotesData[0]
                                                        .total_votes,
                                                    qid,
                                                ],
                                                (err2, res2) => {},
                                            )
                                        },
                                    )

                                    response.status(200).json({
                                        code: VOTE_CREATED_SUCCESSFULLY,
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
