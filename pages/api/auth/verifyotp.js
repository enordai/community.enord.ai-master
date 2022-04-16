import mysql from 'mysql'

import {MAX_SQL_CONCURRENT_CONNECTION} from '../../../constants/limits'
import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_USER,
} from '../../../constants/env'
import {SUCCESS, FAILURE, INVALID_OTP} from '../../../constants'
import {
    abs,
    arrayContainElements,
    canContinueAPIRequests,
    canContinueAPIRequestsForHeaderElements,
    isValidEmail,
    millisecondsToHours,
} from '../../../utils'
import dayjs from 'dayjs'

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
        const otp = String(request.headers.otp || '')
        const email = String(request.headers.email || '')

        if (
            canContinueAPIRequestsForHeaderElements(response, otp, email) &&
            isValidEmail(response, email)
        ) {
            database.query(
                'SELECT * FROM accounts WHERE email=? AND otp=?',
                [email, otp],
                (err, res) => {
                    if (err)
                        response.status(200).json({
                            code: FAILURE,
                        })
                    else if (arrayContainElements(res))
                        if (
                            abs(
                                millisecondsToHours(
                                    dayjs().diff(
                                        dayjs(res[0]?.otp_generated_on),
                                    ),
                                ),
                            ) >= 24.0
                        )
                            // milliseconds to hours
                            // taking the difference between the otp generation time and the current time..
                            response.status(200).json({
                                code: INVALID_OTP, // actualy in this case the otp is expired since the time when the otp is sent is much more than 1 day...
                                message:
                                    'This OTP is expired. Please request for a new OTP.',
                            })
                        else
                            response.status(200).json({
                                code: SUCCESS,
                            })
                    else
                        response.status(200).json({
                            code: INVALID_OTP,
                        })
                },
            )
        }
    }
}
