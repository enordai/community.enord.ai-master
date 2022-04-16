import React, {useContext, useState, useEffect} from 'react'
import classes from './askQuestion.module.css'
import LeftPanel from '../leftPanel/LeftPanel'
import RightPanel from '../rightPanel/RightPanel'
import AuthContext from '../../../context/auth/authContext'
import ForumContext from '../../../context/forum/forumContext'
import Alert from '../../alert/Alert'
import {useRouter} from 'next/dist/client/router'
import MarkdownEditor from '../../layout/MarkdownEditor'

const AskQuestion = () => {
    const authContext = useContext(AuthContext)
    const {user, alert} = authContext

    const forumContext = useContext(ForumContext)
    const {addQuestion, selectedQuestion, questionAdded, loading} = forumContext

    const router = useRouter()
    useEffect(() => {
        if (questionAdded && Object.keys(selectedQuestion).length !== 0)
            router.push(`/forum/${selectedQuestion.question.search}`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionAdded, loading])

    const [question, setQuestion] = useState({
        uid: user.uid,
        title: '',
        tags: '',
    })

    const [body, setBody] = useState('You can use Markdown here')

    const onQuestionChange = e => {
        setQuestion({...question, [e.target.name]: e.target.value})
    }

    const submitQuestion = e => {
        e.preventDefault()
        console.log(question, body)
        addQuestion(question, body)
    }

    if (!user) {
        return null
    }

    return (
        <div className={classes.container}>
            <LeftPanel />
            <div className={classes.center}>
                {alert && <Alert />}
                <h1>Ask a Question</h1>
                <div className={classes.form_container}>
                    <form method="POST" onSubmit={submitQuestion}>
                        <h4>Title</h4>
                        <label htmlFor="title">Enter a oneline question</label>
                        <input
                            type="text"
                            name="title"
                            value={question.title}
                            onChange={onQuestionChange}
                            required
                        />
                        <h4>Body</h4>
                        <label htmlFor="body">
                            Describe your question in detail. Include all the
                            information
                        </label>

                        <MarkdownEditor body={body} setBody={setBody} />

                        <h4>Tags</h4>
                        <label htmlFor="tags">
                            Add Tags about your question
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={question.tags}
                            onChange={onQuestionChange}
                            placeholder="Space separated values(max 5)"
                            required
                        />
                        <button className="btn btn-primary" type="submit">
                            Post
                        </button>
                    </form>
                </div>
            </div>
            {/* <RightPanel /> */}
        </div>
    )
}

export default AskQuestion
