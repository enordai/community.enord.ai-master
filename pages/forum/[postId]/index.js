import React, {useContext, useEffect} from 'react'
import FullPost from '../../../components/forum/fullPost/FullPost'
import PrivateRoute from '../../../components/auth/PrivateRoute'

export default function Post(props) {
    return (
        <div>
            <main>
                <PrivateRoute emailRequired={true}>
                    <FullPost qid={props.qid} />
                </PrivateRoute>
            </main>
        </div>
    )
}

export async function getServerSideProps({params}) {
    return {
        props: {
            qid: params.postId,
        },
    }
}
