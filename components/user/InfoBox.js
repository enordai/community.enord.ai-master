import React, {useContext, useState} from 'react'
import classes from './UserProfile.module.css'
import AuthContext from '../../context/auth/authContext'
import UserContext from '../../context/user/userContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen} from '@fortawesome/free-solid-svg-icons'
import {faGithub, faTwitter} from '@fortawesome/free-brands-svg-icons'
import Alert from '../alert/Alert'

const InfoBox = () => {
    const authContext = useContext(AuthContext)
    const {user, setAlert, alert} = authContext

    const userContext = useContext(UserContext)
    const {updateUserProfile, updateSocialLinks} = userContext

    const [selectedTab, setSelectedTab] = useState('details')

    const [details, setDetails] = useState({
        user: user.username,
        fullname: user.fullname,
        gender: user.gender != null ? user.gender : '',
        phone: user.phone != null ? user.phone : '',
    })

    const [socials, setSocials] = useState({
        user: user.username,
        github: user.github != null ? user.github : '',
        twitter: user.twitter != null ? user.twitter : '',
    })

    const {fullname, gender, phone} = details

    const {github, twitter} = socials

    const onDetailsChange = e => {
        setDetails({...details, [e.target.name]: e.target.value})
    }

    const onSocialsChange = e => {
        setSocials({...socials, [e.target.name]: e.target.value})
    }

    const submitDetails = e => {
        e.preventDefault()
        if (details.phone != '' && details.phone.length < 10) {
            setAlert('Error', 'Phone number Invaild')
        } else updateUserProfile(details)
    }

    const submitSocials = e => {
        e.preventDefault()
        console.log(socials)
        updateSocialLinks(socials)
    }

    const selectedStyle = {
        color: 'white',
        backgroundColor: '#272d6d',
    }

    const {last_updated_on, links_updated_on} = user
    const info_updated_date = new Date(last_updated_on).toLocaleDateString(
        'en-GB',
    )
    const links_updated_date = new Date(links_updated_on).toLocaleDateString(
        'en-GB',
    )

    return (
        <div className={classes.infoBox}>
            {alert && <Alert />}
            <div className={classes.tabs}>
                <h3
                    style={selectedTab == 'details' ? selectedStyle : null}
                    onClick={() => setSelectedTab('details')}
                >
                    Your Details{' '}
                    <FontAwesomeIcon
                        icon={faPen}
                        size="xs"
                        className={classes.editIcon}
                    />
                </h3>
                <h3
                    style={selectedTab == 'socials' ? selectedStyle : null}
                    onClick={() => setSelectedTab('socials')}
                >
                    Your Socials{' '}
                    <FontAwesomeIcon
                        icon={faPen}
                        size="xs"
                        className={classes.editIcon}
                    />
                </h3>
            </div>
            {selectedTab == 'details' ? (
                <div className={classes.details}>
                    <form
                        className={classes.details_form}
                        onSubmit={submitDetails}
                    >
                        <p className="time">
                            Last Updated on:{info_updated_date}
                        </p>
                        <label htmlFor="fullname">Fullname</label>
                        <input
                            type="text"
                            name="fullname"
                            placeholder="Fullname"
                            value={fullname}
                            onChange={onDetailsChange}
                        />
                        <label htmlFor="gender">Gender</label> <br />
                        <div style={{margin: '10px 0'}}>
                            <input
                                type="radio"
                                name="gender"
                                value="m"
                                checked={gender === 'm'}
                                onChange={onDetailsChange}
                            />{' '}
                            Male{' '}
                            <input
                                type="radio"
                                name="gender"
                                value="f"
                                checked={gender === 'f'}
                                onChange={onDetailsChange}
                            />{' '}
                            Female
                            <input
                                type="radio"
                                name="gender"
                                value="o"
                                checked={gender === 'o'}
                                onChange={onDetailsChange}
                            />{' '}
                            Other
                            <input
                                type="radio"
                                name="gender"
                                value="o"
                                checked={gender === 'p'}
                                onChange={onDetailsChange}
                            />{' '}
                            Prefer not to say <br />
                        </div>
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="number"
                            name="phone"
                            placeholder="Phone"
                            value={phone}
                            onChange={onDetailsChange}
                        />
                        <button className="btn btn-primary" type="submit">
                            Save
                        </button>
                    </form>
                </div>
            ) : (
                <div className={classes.socials}>
                    <form
                        className={classes.details_form}
                        onSubmit={submitSocials}
                    >
                        <p className="time">
                            Last Updated on:{links_updated_date}
                        </p>
                        <label htmlFor="github">
                            <FontAwesomeIcon icon={faGithub} size="2x" />{' '}
                            GitHub:{' '}
                        </label>
                        <input
                            type="text"
                            name="github"
                            placeholder="GitHub"
                            value={github}
                            onChange={onSocialsChange}
                        />
                        <label htmlFor="twitter">
                            <FontAwesomeIcon icon={faTwitter} size="2x" />{' '}
                            Twitter:{' '}
                        </label>
                        <input
                            type="text"
                            name="twitter"
                            placeholder="Twitter"
                            value={twitter}
                            onChange={onSocialsChange}
                        />
                        <button className="btn btn-primary" type="submit">
                            Save
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default InfoBox
