export default function OTPTemplate(email, OTP, device) {
    return `
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OTP Verification</title>
    </head>
        <p>
            <p>Hello There!</p>

            <br />

            <p>A sign in attempt requires further verification because we did not recognize your device. To complete the sign in, enter the verification code on the unrecognized device.</p>
            
            <br />
            
            <p>Email: ${email}</p>
            <p>Device: ${device}</p>
            <p>Verification code: ${OTP}</p>
            
            <br />
            
            <p>If you did not attempt to sign in to your account, your password may be compromised. Change your password at profile's settings page.</p>

            <br />

            </p>Thanks,</p>
            <p>The Enord Team</p>
        </p>
    </body>
</html>
`
}
