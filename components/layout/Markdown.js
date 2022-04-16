import classes from './Markdown.module.css'
import ReactMarkdown from 'react-markdown/react-markdown.min'
import remarkGfm from 'remark-gfm'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {atomDark} from 'react-syntax-highlighter/dist/cjs/styles/prism'

const Markdown = props => {
    const customRenderer = {
        code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
                <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}{' '}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            )
        },
    }

    return (
        <ReactMarkdown
            components={customRenderer}
            remarkPlugins={[remarkGfm]}
            className={classes.description}
        >
            {props.body}
        </ReactMarkdown>
    )
}

export default Markdown
