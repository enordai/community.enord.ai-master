import React, {useContext, useState, useEffect} from 'react'
import classes from './answerQuestion.module.css'
import AuthContext from '../../../context/auth/authContext'
import ForumContext from '../../../context/forum/forumContext'
import MarkdownEditor from '../../layout/MarkdownEditor'

const AnswerQuestion = props => {
    const authContext = useContext(AuthContext)
    const {user} = authContext

    const forumContext = useContext(ForumContext)
    const {answerQuestion, loading} = forumContext

    const [body, setBody] = useState('You can use Markdown here')

    const {qid, search} = props.question

    const submitAnswer = e => {
        e.preventDefault()
        const answer = {
            qid: qid,
            uid: user.uid,
            search: search,
        }
        console.log(answer, body)
        // console.log(answer.search)
        if (body !== '') answerQuestion(answer, body)
    }

    return (
        <div className={classes.answer_form}>
            <h2>Your answer</h2>
            <form method="POST" onSubmit={submitAnswer}>
                <MarkdownEditor body={body} setBody={setBody} />
                <button className="btn btn-primary" type="submit">
                    Post
                </button>
            </form>
        </div>
    )
}

export default AnswerQuestion
