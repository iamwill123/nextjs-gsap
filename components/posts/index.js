import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import styles from './index.module.css'
import { sharedProps } from '../../pages'

// todo: un-stack posts animation
const Card = ({ post }) => {
	return (
		<div className={`${styles.card} card`}>
			<h3 className="title">
				<Link href={`/posts/${post.slug}`}>
					<a>{post.title}</a>
				</Link>
			</h3>
		</div>
	)
}

const Posts = ({ data: { posts } }) => {
	const postsRef = useRef(null)

	if (!posts) return <p>Loading...</p>

	let tl = gsap.timeline({
		duration: 0.5,
		defaults: {
			// children inherit these defaults
			duration: 0.7,
			ease: 'none',
		},
	})

	useEffect(() => {
		if (postsRef?.current) {
			tl.set(postsRef.current, { x: 100, y: 0, color: 'transparent' })
			tl.set('.card', { yPercent: 0, position: 'absolute' })

			// * 🔎 animate entire posts component
			tl.to(postsRef.current, {
				...sharedProps,
				x: 0,
				ease: 'power2.inOut',
			})
			tl.to(postsRef.current, {
				...sharedProps,
				y: -100,
				ease: 'power1.inOut',
			})
			// * 🔎 then animate individual card components
			// * grab each card element
			const cardElm = gsap.utils.toArray('.card')

			cardElm.map((card, i) => {
				tl.to(card, {
					...sharedProps,
					ease: 'back.out(1.7)',
					yPercent: i * 110,
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
				<Card key={i} post={post} />
			))}
		</div>
	)
}

export default Posts
