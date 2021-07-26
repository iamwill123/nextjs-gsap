import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import gsap from 'gsap'
import styles from './index.module.css'
import { sharedProps } from '../../pages'

// todo: un-stack posts animation
const Card = ({ post, handleChangePage }) => {
	// console.log('🚀 ~ file: index.js ~ line 9 ~ Card ~ post', post)
	const { coverImage } = post

	return (
		<div
			className={`${styles.card} card`}
			style={{
				background: `url(${coverImage.url}) center 10% no-repeat`,
				backgroundSize: 'cover',
			}}
		>
			<h3 className={styles.title}>
				{/* nextjs will complain if we remove the href prop */}
				<Link href={`/posts/${post.slug}`} scroll={false}>
					{/* we want more control of our page change */}
					<a onClick={(e) => handleChangePage(e, `/posts/${post.slug}`)}>
						<span>{post.title}</span>
					</a>
				</Link>
			</h3>
		</div>
	)
}

const Posts = ({ data: { posts }, titleTimeline }) => {
	const router = useRouter()
	const postsRef = useRef(null)

	if (!posts) return <p>Loading...</p>

	let postsTimeline = gsap.timeline({
		duration: 0.3,
		defaults: {
			// * children inherit these defaults
			duration: 0.5,
			ease: 'back.out(1.7)',
		},
	})

	const handleChangePage = (e, destination) => {
		e.preventDefault()
		const postTLduration = postsTimeline.duration()
		// * set a timeout to run the duration of our timeline animation (tweak it)
		const totalTimelineDuration = postTLduration * 800
		setTimeout(() => {
			// * access our router manually
			router.push(destination)
		}, totalTimelineDuration)

		// * reverse the posts animation when we change pages
		postsTimeline.reverse()
		titleTimeline.reverse()
	}

	useEffect(() => {
		if (postsRef?.current) {
			postsTimeline.set(postsRef.current, {
				x: 100,
				y: 0,
				color: 'transparent',
			})
			postsTimeline.set('.card', { yPercent: 0, position: 'absolute' })
			// * set card zIndex to fix overlap when animating
			const cardElm = gsap.utils.toArray('.card')
			cardElm.map((card, i) => {
				postsTimeline.set(card, {
					zIndex: -i,
					opacity: i === 0 ? 1 : 0,
				})
			})

			// * 🔎 animate entire posts component
			postsTimeline.to(postsRef.current, {
				...sharedProps,
				delay: 0.5,
				x: 0,
				ease: 'power2.inOut',
			})
			postsTimeline.to(postsRef.current, {
				...sharedProps,
				y: -100,
				ease: 'power1.inOut',
			})

			// * 🔎 then animate individual card components
			// * 	  grab each card element
			cardElm.map((card, i) => {
				postsTimeline.to(card, {
					// * provide some space btw each card
					duration: 0.6,
					yPercent: i * 100,
					opacity: 1,
					zIndex: 0,
				})
			})
		}
	}, [postsRef?.current])

	return (
		<div
			ref={postsRef}
			className={styles.posts}
			style={{
				opacity: 0,
				position: 'relative',
				width: '300px',
			}}
		>
			{posts.map((post, i) => (
				<Card key={i} post={post} handleChangePage={handleChangePage} />
			))}
		</div>
	)
}

export default Posts
