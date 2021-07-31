import Head from 'next/head'
import styles from '../styles/Home.module.css'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import Posts from '../components/posts'
import { hostUrl, isDev } from '../utils/envCheck'

export const sharedProps = {
	opacity: 1,
	stagger: 0.1,
	delay: 0.5,
	ease: 'power1.inOut',
}

const Home = ({ data }) => {
	const titleRef = useRef(null)
	const titleTimeline = gsap.timeline()

	useEffect(() => {
		if (titleRef?.current) {
			titleTimeline.set(titleRef?.current, { x: -100, color: 'transparent' })
			titleTimeline.to(titleRef?.current, {
				...sharedProps,
				x: 0,
				color: 'black',
				duration: 0.5, // seconds
			})
		}
	}, [titleRef?.current, titleTimeline])

	return (
		<div className={styles.container}>
			<Head>
				<title>NextJS + GSAP</title>
				<meta name="description" content="NextJS and GSAP app" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="true"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Lora&display=swap"
					rel="stylesheet"
				/>
			</Head>

			<main className={styles.main}>
				<h1
					ref={titleRef}
					id={`title`}
					style={{ opacity: 0 }}
					className={styles.title}
				>
					blog.
				</h1>

				<Posts data={data} titleTimeline={titleTimeline} />
			</main>
		</div>
	)
}

export async function getStaticProps() {
	// * when hosting on vercel, you will have to update your production link ⬇
	const res = isDev
		? await fetch(`${hostUrl}/api/posts`)
		: await fetch(`https://nextjs-gsap.vercel.app/api/posts`)

	const { data } = await res.json()

	if (!data) {
		return {
			notFound: true,
		}
	}

	return {
		props: { data, fallback: false }, // will be passed to the page component as props
	}
}

Home.displayName = 'Home'

export default Home
