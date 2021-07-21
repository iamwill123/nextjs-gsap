import Link from 'next/link'
import { useRouter } from 'next/router'

// * 📚 recommended read:
// * https://nextjs.org/docs/basic-features/data-fetching#when-should-i-use-getstaticprops

export async function getStaticProps({ params }) {
	const res = await fetch(`http://localhost:3000/api/post/${params.slug}`)
	const {
		data: { post },
	} = await res.json()

	return {
		props: {
			post,
		},
	}
}

// * 📚 recommended read:
// * https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation

export async function getStaticPaths() {
	const res = await fetch(`http://localhost:3000/api/posts`)
	const {
		data: { posts },
	} = await res.json()

	const pathParams = posts.map(({ slug }) => ({
		params: { slug },
	}))

	return {
		paths: pathParams,
		fallback: false,
	}
}

const Post = ({ post }) => {
	console.log('🚀 ~ file: [slug].js ~ line 41 ~ Post ~ post', post)
	const router = useRouter()

	// * todo gsap from animate, and reverse
	return (
		<>
			<h1>Post: {router.query.slug}</h1>
			<h2>
				<Link href="/">
					<a>Back to home</a>
				</Link>
			</h2>
		</>
	)
}

export default Post
