import React, {useContext, useEffect} from 'react'
import UserProfile from '../../../components/user/UserProfile'
import PrivateRoute from '../../../components/auth/PrivateRoute'

export default function Profile(props) {
    return (
        <div>
            <main>
                <PrivateRoute emailRequired={false}>
                    <UserProfile user={props.user} />
                </PrivateRoute>
            </main>
        </div>
    )
}
export async function getServerSideProps({params}) {
    return {
        props: {
            user: params.userId,
        },
    }
}
