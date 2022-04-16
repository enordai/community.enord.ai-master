import {useState} from 'react'
import ReactMde from 'react-mde'
import Markdown from './Markdown'
import 'react-mde/lib/styles/css/react-mde-all.css'

const MarkdownEditor = props => {
    const {body, setBody} = props
    const [selectedTab, setSelectedTab] = useState('write')

    return (
        <div className="container">
            <ReactMde
                value={body}
                onChange={setBody}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={markdown =>
                    Promise.resolve(<Markdown body={markdown} />)
                }
                childProps={{
                    writeButton: {
                        tabIndex: -1,
                    },
                }}
            />
        </div>
    )
}

export default MarkdownEditor
