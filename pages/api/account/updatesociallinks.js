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
    EMAIL_REGEX,
    USER_NOT_FOUND,
} from '../../../constants'
import {
    arrayContainElements,
    canContinueAPIRequests,
    canContinueAPIRequestsForHeaderElements,
    getFormattedCurrentTime,
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
        const user = String(request.headers.user || '')
        const ip = String(request.headers.ip || '')
        const github = String(request.headers.github || '')
        const twitter = String(request.headers.twitter || '')

        // we are knowing what the user have provided username or email.
        let whatTypeOfDataIsProvided = 'email=?'
        if (EMAIL_REGEX.test(user)) whatTypeOfDataIsProvided = 'email=?'
        else whatTypeOfDataIsProvided = 'username=?'

        if (canContinueAPIRequestsForHeaderElements(response, user, ip)) {
            database.query(
                `UPDATE users SET github=?, twitter=?, links_updated_on=?, links_updated_ip=? WHERE ${whatTypeOfDataIsProvided} LIMIT 1`,
                [github, twitter, getFormattedCurrentTime(), ip, user],
                (err, res) => {
                    if (err) {
                        response.status(200).json({
                            code: FAILURE,
                        })
                    } else {
                        database.query(
                            `SELECT * FROM users WHERE ${whatTypeOfDataIsProvided} LIMIT 1`,
                            [user],
                            (err1, res1) => {
                                if (err1) {
                                    response.status(200).json({
                                        code: PARTIAL_SUCCESS,
                                    })
                                } else if (!arrayContainElements(res1)) {
                                    response.status(200).json({
                                        code: USER_NOT_FOUND,
                                    })
                                } else {
                                    response.status(200).json({
                                        code: SUCCESS,
                                        data: res1[0],
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
