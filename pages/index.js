import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import Posts from '../components/posts'

export const sharedProps = {
	opacity: 1,
	stagger: 0.1,
	delay: 0.5,
	ease: 'power1.inOut',
}

const Home = ({ data }) => {
	const titleRef = useRef(null)

	let titleTimeline = gsap.timeline()
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
	}, [titleRef?.current])

	return (
		<div className={styles.container}>
			<Head>
				<title>NextJS + GSAP</title>
				<meta name="description" content="NextJS and GSAP app" />
				<link rel="icon" href="/favicon.ico" />
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
	// our localhost to fetch our api
	const res = await fetch(`http://localhost:3000/api/posts`)
	const { data } = await res.json()

	if (!data) {
		return {
			notFound: true,
		}
	}

	return {
		props: { data }, // will be passed to the page component as props
	}
}

export default Home
