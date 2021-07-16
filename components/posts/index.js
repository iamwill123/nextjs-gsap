import Link from 'next/link'
import styles from './index.module.css'

// another animation
// useEffect(() => {
// 	gsap.set('#message', { x: 100, color: 'transparent' })
// 	gsap.to('#message', {
// 		...sharedProps,
// 		x: 0,
// 		y: 0,
// 		color: 'black',
// 		duration: 1, // seconds
// 	})
// }, [])

// todo: stack post on each other
const Card = ({ post }) => {
	return (
		<div className={styles.card}>
			<h3 className="title">
				<Link href={`/posts/${post.slug}`}>
					<a>{post.title}</a>
				</Link>
			</h3>
			{/* <h2>{post.title}</h2> */}
		</div>
	)
}
const Posts = ({ data: { posts } }) => {
	if (!posts) return <p>Loading...</p>
	return (
		<div className={styles.posts}>
			{posts.map((post, i) => (
				<Card key={i} post={post}></Card>
			))}
		</div>
	)
}

export default Posts
