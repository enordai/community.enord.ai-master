import mysql from 'mysql'
import nodemailer from 'nodemailer'

import {MAX_SQL_CONCURRENT_CONNECTION} from '../../../constants/limits'
import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_USER,
    MAIL_ID,
    MAIL_ID_PASSWORD,
    MAIL_SERVICE,
    MAIL_HOST,
    PASSWORD_RESET_MAIL_TITLE,
} from '../../../constants/env'
import {
    PARTIAL_SUCCESS,
    SUCCESS,
    FAILURE,
    USER_NOT_FOUND,
} from '../../../constants'
import {
    arrayContainElements,
    canContinueAPIRequests,
    canContinueAPIRequestsForHeaderElements,
    getFormattedCurrentTime,
    isValidEmail,
    randomOTPGenerator,
} from '../../../utils'
import OTPTemplate from '../../../mails/templates/OTPTemplate'

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
        // header variables...
        /**
         * @deprecated
         */
        const uid = String(request.headers.uid || '')
        const email = String(request.headers.email || '')
        const clientBrowser = String(request.headers.browser || '')
        const clientOs = String(request.headers.os || '')
        const clientDeviceDetail = `${clientBrowser} on ${clientOs}`

        if (
            canContinueAPIRequestsForHeaderElements(
                response,
                email,
                clientBrowser,
                clientOs,
            ) &&
            isValidEmail(response, email)
        ) {
            const OTP = randomOTPGenerator()
            const TIMESTAMP = getFormattedCurrentTime()

            database.query(
                'SELECT uid, email, disabled FROM accounts WHERE email=? ORDER BY uid DESC LIMIT 1',
                [email],
                (err1, res1) => {
                    if (!err1) {
                        if (arrayContainElements(res1)) {
                            database.query(
                                'UPDATE accounts SET otp=?, otp_generated_on=?, otp_details=? WHERE email=?',
                                [OTP, TIMESTAMP, clientDeviceDetail, email],
                                (err, res) => {
                                    if (!err) {
                                        nodemailer
                                            .createTransport({
                                                service: MAIL_SERVICE,
                                                auth: {
                                                    user: MAIL_ID,
                                                    pass: MAIL_ID_PASSWORD,
                                                },
                                                host: MAIL_HOST,
                                            })
                                            .sendMail({
                                                from: MAIL_ID,
                                                to: email,
                                                subject:
                                                    PASSWORD_RESET_MAIL_TITLE,
                                                html: OTPTemplate(
                                                    email,
                                                    OTP,
                                                    clientDeviceDetail,
                                                ),
                                            })
                                            .then(result => {
                                                response.status(200).json({
                                                    code: SUCCESS,
                                                })
                                            })
                                            .catch(err => {
                                                console.log(
                                                    err,
                                                    MAIL_ID,
                                                    MAIL_ID_PASSWORD,
                                                    MAIL_SERVICE,
                                                )
                                                response.status(200).json({
                                                    code: PARTIAL_SUCCESS,
                                                })
                                            })
                                    } else {
                                        response.status(200).json({
                                            code: FAILURE,
                                        })
                                    }
                                },
                            )
                        } else {
                            response.status(200).json({
                                code: USER_NOT_FOUND,
                            })
                        }
                    } else {
                        response.status(200).json({
                            code: FAILURE,
                        })
                    }
                },
            )
        }
    }
}

// how to get the browser's name and os's name of the client side device...
// import {browserName, osName} from 'react-device-detect'
