import React from 'react'
import classes from '../styles/Home.module.css'
import Image from 'next/image'
import DroneImg from '../public/Drone_Isometric.svg'
import ForumImg from '../public/forumpage.png'
import FullPost1Img from '../public/fullpost1.png'
import FullPost2Img from '../public/fullpost2.png'
import Link from 'next/link'

export default function Home() {
    return (
        <div className={classes.container}>
            <main className={classes.main}>
                <div className={classes.left}>
                    <div className={classes.shape_container}>
                        <div className={classes.shape}></div>
                    </div>
                    <h1 className={classes.title}>
                        Join the fastest growing community{' '}
                        <a
                            href="community-enord-ai.vercel.app"
                            className="logo"
                        >
                            Enord.Ai
                        </a>
                    </h1>
                    <p className={classes.description}>
                        Ask and answer questions, discover the latest in tech.
                    </p>
                    <Link href="/auth" passHref={true}>
                        <button>Join Now</button>
                    </Link>
                </div>
                <div className={classes.right}>
                    <Image
                        src={DroneImg}
                        alt="Drone Img"
                        width={500}
                        height={500}
                    />
                </div>
            </main>
            <main className={classes.main}>
                <div className={classes.left}>
                    <div className={classes.snapshot}>
                        <Image
                            src={ForumImg}
                            alt="Forum Img"
                            width={1898}
                            height={897}
                        />
                    </div>
                </div>
                <div>
                    <div className={classes.shape_container}>
                        <div className={classes.shape}></div>
                    </div>
                    <h1>Discover the forum and contribute to the community </h1>
                    <p className={classes.description}>
                        Ask and answer questions, discover the latest in tech.
                    </p>
                    <Link href="/forum" passHref={true}>
                        <button>Go to Forum</button>
                    </Link>
                </div>
            </main>
            <main className={classes.main}>
                <div className={classes.left}>
                    <div className={classes.shape_container}>
                        <div className={classes.shape}></div>
                    </div>
                    <h1>
                        Upvote & bookmark questions, comment on questions and
                        answers{' '}
                    </h1>
                    <p className={classes.description}>
                        Questions and answers support markdown.
                    </p>
                </div>
                <div className={classes.right}>
                    <div className={classes.snapshot}>
                        <Image
                            src={FullPost1Img}
                            alt="FullPost1 Img"
                            width={1896}
                            height={896}
                        />
                    </div>
                    <div className={classes.snapshot_overlap}>
                        <Image
                            src={FullPost2Img}
                            alt="FullPost2 Img"
                            width={1895}
                            height={898}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}
