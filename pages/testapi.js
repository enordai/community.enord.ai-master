import axios from 'axios'
import React, {useState} from 'react'

const ApiTestingComponent = testProps => {
    const [textareaValue, setTextareaValues] = useState('')
    const [data, setData] = useState({})

    return (
        <form
            onSubmit={value => {
                value.preventDefault()
                axios
                    .post(
                        'http://localhost:3000/api/question/answer/add',
                        textareaValue,
                        {
                            headers: {
                                key: '1fb59076000a488ad3c42b660a6c13f67846938e09ff05311cce75c47c89e2d5',
                                ip: '192.168.45.184',
                                uid: 1,
                                title: 'Demo Title',
                                tags: 'react react-native ',
                                browser: 'Chrome',
                                os: 'Linux',
                                'Content-Type': 'text/plain', // important for raw data
                            },
                        },
                    )
                    .then(res => {
                        setData(res.data)
                    })
                    .catch(err => {
                        setData(err)
                    })
            }}
        >
            <textarea
                value={textareaValue}
                onChange={value => setTextareaValues(value.target.value)}
            />

            <button type="submit">Submit</button>

            <h3>{JSON.stringify(data)}</h3>
        </form>
    )
}

export default ApiTestingComponent
