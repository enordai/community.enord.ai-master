import mysql from 'mysql'
import bcrypt from 'bcrypt'

import {
    HASHING_MAX_SALT,
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
    INVALID_OTP,
    PASSWORD_NOT_MATCHED,
    PARTIAL_SUCCESS,
    PASSWORD_REGEX,
} from '../../../constants'
import {
    abs,
    arrayContainElements,
    canContinueAPIRequests,
    canContinueAPIRequestsForHeaderElements,
    getFormattedCurrentTime,
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
        const newPassword = String(request.headers.newpassword || '')
        const confirmNewPassword = String(
            request.headers.confirmnewpassword || '',
        )

        if (
            canContinueAPIRequestsForHeaderElements(
                response,
                otp,
                email,
                newPassword,
                confirmNewPassword,
            ) &&
            isValidEmail(response, email)
        ) {
            database.query(
                'SELECT * FROM accounts WHERE email=? AND otp=?',
                [email, otp],
                (err, res) => {
                    if (err) {
                        response.status(200).json({
                            code: FAILURE,
                        })
                    } else if (arrayContainElements(res)) {
                        // we are again verifying the otp
                        // milliseconds to hours
                        // taking the difference between the otp generation time and the current time..
                        if (
                            abs(
                                millisecondsToHours(
                                    dayjs().diff(
                                        dayjs(res[0]?.otp_generated_on),
                                    ),
                                ),
                            ) >= 24.0
                        ) {
                            response.status(200).json({
                                code: INVALID_OTP, // actualy in this case the otp is expired since the time when the otp is sent is much more than 1 day...
                                message:
                                    'This OTP is expired. Please request for a new OTP.',
                            })
                        } else {
                            // the OTP is correct and validated so continue in the process of updating pasword in the database.
                            // checking whether the passwords entered by user are correct

                            if (
                                newPassword === confirmNewPassword &&
                                PASSWORD_REGEX.test(newPassword)
                            ) {
                                // continue through one more condition
                                // change the password now...
                                const encryptedPassword = bcrypt.hashSync(
                                    newPassword,
                                    HASHING_MAX_SALT,
                                )
                                const currentTimeStamp =
                                    getFormattedCurrentTime()

                                database.query(
                                    'UPDATE accounts SET password=?, otp_generated_on=? WHERE email=? LIMIT 1',
                                    [
                                        encryptedPassword,
                                        currentTimeStamp,
                                        email,
                                    ],
                                    (err1, res1) => {
                                        if (err1) {
                                            response.status(200).json({
                                                code: FAILURE,
                                            })
                                        } else {
                                            database.query(
                                                'SELECT * FROM users WHERE email=? LIMIT 1',
                                                [email],
                                                (err2, res2) => {
                                                    if (err2) {
                                                        response
                                                            .status(200)
                                                            .json({
                                                                code: PARTIAL_SUCCESS,
                                                            })
                                                    } else {
                                                        response
                                                            .status(200)
                                                            .json({
                                                                code: SUCCESS,
                                                                data: res2,
                                                            })
                                                    }
                                                },
                                            )
                                        }
                                    },
                                )
                            } else {
                                response.status(200).json({
                                    code: PASSWORD_NOT_MATCHED,
                                    message:
                                        'Must be due to providing two different password or newpassword != confirmnewpassword. This could also be due to recieving not acceptable passwords.',
                                })
                            }
                        }
                    } else {
                        response.status(200).json({
                            code: INVALID_OTP,
                        })
                    }
                },
            )
        }
    }
}
