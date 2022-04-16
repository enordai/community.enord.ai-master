import React, {useContext, useEffect} from 'react'
import classes from './Forum.module.css'
import LeftPanel from './leftPanel/LeftPanel'
import RightPanel from './rightPanel/RightPanel'
import ForumContext from '../../context/forum/forumContext'
import CenterContent from './centerContent/CenterContent'

function Forum(props) {
    const forumContext = useContext(ForumContext)
    const {getLatestQuestions, questions, loading, searchResults} = forumContext

    useEffect(() => {
        if (questions.length === 0)
            setTimeout(() => getLatestQuestions({low: 0, high: 10}), 1000)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])

    return (
        <div className={classes.main_container}>
            <LeftPanel />
            {searchResults ? (
                <CenterContent
                    heading="Search Results"
                    questions={searchResults}
                    button="clear"
                />
            ) : (
                <CenterContent
                    heading="Recent Questions"
                    questions={questions}
                    button="ask"
                />
            )}
            {/* <RightPanel /> */}
        </div>
    )
}

export default Forum
