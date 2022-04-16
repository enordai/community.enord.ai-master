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
    EMAIL_REGEX,
    USER_NOT_FOUND,
    WRONG_PASSWORD,
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
        const user = String(request.headers.user || '')
        const oldPassword = String(request.headers.oldpassword || '')
        const newPassword = String(request.headers.newpassword || '')
        const confirmNewPassword = String(
            request.headers.confirmnewpassword || '',
        )

        // we are knowing what the user have provided username or email.
        let whatTypeOfDataIsProvided = 'email=?'
        if (EMAIL_REGEX.test(user)) whatTypeOfDataIsProvided = 'email=?'
        else whatTypeOfDataIsProvided = 'username=?'

        if (
            canContinueAPIRequestsForHeaderElements(
                response,
                user,
                oldPassword,
                newPassword,
                confirmNewPassword,
            )
        ) {
            database.query(
                `SELECT * FROM accounts WHERE ${whatTypeOfDataIsProvided}`,
                [user],
                (err, res) => {
                    if (err) {
                        response.status(200).json({
                            code: FAILURE,
                        })
                    } else if (!arrayContainElements(res)) {
                        response.status(200).json({
                            code: USER_NOT_FOUND,
                        })
                    } else if (
                        bcrypt.compareSync(oldPassword, res[0].password)
                    ) {
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

                            database.query(
                                `UPDATE accounts SET password=? WHERE ${whatTypeOfDataIsProvided} LIMIT 1`,
                                [encryptedPassword, user],
                                (err1, res1) => {
                                    if (err1) {
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
                        } else {
                            response.status(200).json({
                                code: PASSWORD_NOT_MATCHED,
                                message:
                                    'Must be due to providing two different password or newpassword != confirmnewpassword. This could also be due to recieving not acceptable passwords.',
                            })
                        }
                    } else {
                        response.status(200).json({
                            code: WRONG_PASSWORD,
                            message:
                                'Must be due to providing two different password or newpassword != confirmnewpassword. This could also be due to recieving not acceptable passwords.',
                        })
                    }
                },
            )
        }
    }
}
