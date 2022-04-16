import mysql from 'mysql'

import {
    COMMENTS_LIMIT,
    FIRST_LIMIT,
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
    QUESTION_NOT_FOUND,
    PARTIAL_SUCCESS,
} from '../../../constants'
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
        /**
         * @deprecated for now since this variable in not needed to be provided
         * because this data could not be got from browser url
         * but for reference if any time qid is provided we can provided this data by that too
         */
        const qid = Number(request.headers.qid || 0)
        const uid = Number(request.headers.uid || 0)
        const search = String(request.headers.search || '')

        const uniqueID = uuidv4()
        const currentTime = getFormattedCurrentTime()

        if (canContinueAPIRequestsForHeaderElements(response, search)) {
            // getting the questions data from the database
            database.query(
                'SELECT question.qid, question.uid, question.search, question.title, question.body, question.added_at, question.tags, question.edited_at, question.total_answers, question.comments, question.upvotes, question.bookmarks, question.verified, question.hidden, user.username, user.fullname, user.profile_image, user.followers, user.followings, user.github, user.twitter FROM users user JOIN questions question ON user.uid=question.uid WHERE question.qid=? OR search=?',
                [qid, search],
                (questionErr, questionData) => {
                    // if any question with the data exists than
                    // rest of the error data will be handled in the final response data
                    if (questionErr) {
                        response.status(200).json({
                            code: QUESTION_NOT_FOUND,
                        })
                    } else if (arrayContainElements(questionData)) {
                        // loading first 10 answers given to the question
                        // this answers are the first one not the latest ones
                        database.query(
                            'SELECT answer.aid, answer.qid, answer.uid, answer.search, answer.body, answer.added_at, answer.edited_at, answer.comments, answer.upvotes, answer.verified, answer.hidden, user.username, user.fullname, user.profile_image, user.followers, user.followings, user.github, user.twitter FROM users user JOIN answers answer ON user.uid=answer.uid WHERE qid=? LIMIT ?',
                            [questionData[0].qid, FIRST_LIMIT], // since because qid from the header is optional because only search is provided in links in browser
                            (answerErr, answerData) => {
                                // getting comments given to the question
                                // this are latest comments first
                                // we are also getting the user data related to the comment
                                database.query(
                                    'SELECT qc.id, qc.qid, qc.uid, qc.search, qc.comment, qc.added_at, qc.edited_at, qc.verified, qc.hidden, u.username, u.fullname, u.profile_image FROM users u JOIN quecomments qc ON u.uid = qc.uid WHERE qc.qid=? ORDER BY qc.id DESC LIMIT ?',
                                    [questionData[0].qid, COMMENTS_LIMIT / 2], // comments limit value if somewhat high and if we load all those list for questions then screen will fill without no answer
                                    (
                                        questionCommentsErr,
                                        questionCommentsData,
                                    ) => {
                                        // getting comments done to answers
                                        // same here latest comments first
                                        // also getting the user data who commented in the answer
                                        database.query(
                                            'SELECT ac.id, ac.qid, ac.aid, ac.uid, ac.search, ac.comment, ac.added_at, ac.edited_at, ac.verified, ac.hidden, u.username, u.fullname, u.profile_image FROM users u JOIN anscomments ac ON u.uid = ac.uid WHERE ac.qid=? GROUP BY ac.comment, ac.aid, ac.uid ORDER BY ac.id DESC LIMIT ?',
                                            [
                                                questionData[0].qid,
                                                COMMENTS_LIMIT,
                                            ], // since we are getting different kind of comments that can be provided by any user or any aid so providing large data
                                            (
                                                answerCommentsErr,
                                                answerCommentsData,
                                            ) => {
                                                // fetching the data if the user who is fetching this all datas
                                                // have voted anything to the question
                                                database.query(
                                                    'SELECT vote FROM quevotes WHERE uid=? AND qid=?',
                                                    [uid, questionData[0].qid],
                                                    (
                                                        userVotedQuestionErr,
                                                        userVotedQuestionResponse,
                                                    ) => {
                                                        // fetching the data if the user who is fetching this all datas
                                                        // have bookmarked the question or not
                                                        database.query(
                                                            'SELECT search FROM bookmarked_questions WHERE uid=? AND qid=?',
                                                            [
                                                                uid,
                                                                questionData[0]
                                                                    .qid,
                                                            ],
                                                            (
                                                                userBookmarkedQuestionErr,
                                                                userBookmarkedQuestionResponse,
                                                            ) => {
                                                                // fetching the data if the user who is fetching this all datas
                                                                // have voted any of the answer or not
                                                                database.query(
                                                                    'SELECT vote.vote, vote.aid FROM ansvotes vote JOIN answers answer ON vote.uid=? AND vote.uid=answer.uid WHERE answer.qid=? GROUP BY vote.vote, vote.aid ORDER BY vote.aid DESC',
                                                                    [
                                                                        uid,
                                                                        questionData[0]
                                                                            .qid,
                                                                    ],
                                                                    (
                                                                        userVotedAnyAnswerErr,
                                                                        userVotedAnyAnswerResponse,
                                                                    ) => {
                                                                        response
                                                                            .status(
                                                                                200,
                                                                            )
                                                                            .json(
                                                                                {
                                                                                    code: SUCCESS,
                                                                                    warning:
                                                                                        uid <=
                                                                                        0
                                                                                            ? 'UID is not provided in headers.'
                                                                                            : undefined,
                                                                                    id: uniqueID,
                                                                                    timestamp:
                                                                                        currentTime,
                                                                                    data: {
                                                                                        question:
                                                                                            {
                                                                                                ...questionData[0],
                                                                                            },
                                                                                        questionVoted:
                                                                                            !Number.isNaN(
                                                                                                userVotedQuestionResponse[0]
                                                                                                    ?.vote,
                                                                                            )
                                                                                                ? userVotedQuestionResponse[0]
                                                                                                      ?.vote
                                                                                                : 0,
                                                                                        questionBookmarked:
                                                                                            userBookmarkedQuestionResponse[0]
                                                                                                ?.search
                                                                                                ? 1
                                                                                                : 0,
                                                                                        questionComments:
                                                                                            questionCommentsData ||
                                                                                            [],
                                                                                        questionCommentsPage:
                                                                                            [
                                                                                                0,
                                                                                                questionCommentsData.length,
                                                                                            ], // this is the range of which we have provided the comments in
                                                                                        answers:
                                                                                            answerData ||
                                                                                            [],
                                                                                        answersVoted:
                                                                                            userVotedAnyAnswerResponse ||
                                                                                            [],
                                                                                        answersComments:
                                                                                            answerData &&
                                                                                            answerCommentsData
                                                                                                ? answerCommentsData
                                                                                                : [], // if answerdata and its comment both are fetched then provide both
                                                                                    },
                                                                                },
                                                                            )
                                                                    },
                                                                )
                                                            },
                                                        )
                                                    },
                                                )
                                            },
                                        )
                                    },
                                )
                            },
                        )
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
