import { Children, forwardRef, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import gsap from 'gsap'
import styles from '../../styles/Post.module.css'

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

const imgDataForBlurring = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4=`

const Layout = ({ children }) => {
	return Children.map(children, (child) => {
		const isColumn = child.type.name === 'LayoutCol'
		const hasClassName = !!child.props.className

		if (child.type === 'string') {
			return child
		}

		return isColumn ? (
			<div className={`${styles.flexCol}`} {...child.props}>
				{child}
			</div>
		) : (
			<div className={`${styles.flexRow}`} {...child.props}>
				{child}
			</div>
		)
	})
}

const LayoutCol = ({ children }) => children
const LayoutRow = ({ children }) => children

const Content = ({ children }) => {
	return <div className={styles.flexCol}>{children}</div>
}

const Author = ({ author }) => {
	const {
		name,
		handle,
		picture: { fileName },
	} = author

	return (
		<Layout>
			<LayoutCol>
				<Image
					className={styles.avatar}
					src={fileName}
					placeholder={`blur`}
					blurDataURL={imgDataForBlurring}
					layout={'fixed'}
					width={'75px'}
					height={'75px'}
				/>

				<div>
					<b>{name}</b>
				</div>
				<div style={{ color: 'grey' }}>@{handle}</div>
			</LayoutCol>
		</Layout>
	)
}

const ImgHeader = forwardRef(({ coverImage, title }, ref) => {
	const [coverImgRef, titleRef] = ref
	return (
		<div style={{ position: 'relative', width: '100%' }}>
			<div
				ref={coverImgRef}
				style={{ width: '100%', height: '75px', overflow: 'hidden' }}
			>
				{/* * Image component https://nextjs.org/docs/api-reference/next/image */}
				<Image
					className={styles.coverImg}
					src={coverImage.url}
					alt={'cover image'}
					placeholder={`blur`}
					blurDataURL={imgDataForBlurring}
					layout={'responsive'}
					objectFit="cover"
					width={'100%'}
					height={'100%'}
				/>
			</div>
			<h1
				style={{
					position: 'absolute',
					textDecoration: 'underline',
					fontSize: '2.5rem',
					zIndex: 1,
					color: 'white',
					top: 0,
				}}
				ref={titleRef}
			>
				{title}
			</h1>
		</div>
	)
})
const Post = ({ post }) => {
	const titleRef = useRef(null)
	const coverImgRef = useRef(null)

	const router = useRouter()
	const createMarkup = (content) => ({ __html: content })

	const { author, title, date, tags, content, coverImage } = post

	let postTimeline = gsap.timeline()

	useEffect(() => {
		if (titleRef?.current || coverImgRef?.current) {
			postTimeline
				.from(titleRef?.current, {
					duration: 0.5,
					display: 'none',
					color: 'black',
					autoAlpha: 0,
					delay: 0.25,
					y: 25,
					ease: 'power1.in',
				})
				.from(coverImgRef?.current, {
					duration: 0.4,
					autoAlpha: 0,
					y: 25,
					ease: `power1.inOut`,
				})
			postTimeline.play()
		}
	}, [titleRef?.current, coverImgRef?.current])

	// * todo gsap from animate, and reverse
	return (
		<div className={styles.container}>
			<Layout>
				<LayoutRow style={{ width: '100%' }}>
					<Layout>
						<LayoutCol style={{ width: '20%' }}>
							<Author author={author} />
							<div style={{ margin: '2rem auto', width: '100%' }}>
								<Link href="/">
									<a
										style={{
											fontSize: '0.8rem',
											padding: '2px',
											borderBottom: `1px dotted black`,
										}}
									>
										back
									</a>
								</Link>
							</div>
						</LayoutCol>
					</Layout>
					<Layout>
						<LayoutCol style={{ width: '80%' }}>
							<ImgHeader
								ref={[coverImgRef, titleRef]}
								coverImage={coverImage}
								date={date}
								title={title}
							/>
							<Content>
								<div>
									<div dangerouslySetInnerHTML={createMarkup(content.html)} />
									<hr />
									<div className={styles.flexRowSpaceBtw}>
										<i style={{ fontSize: '0.8rem' }}>{date}</i>
										<div>
											{tags.map((tag, i) => (
												<span className={styles.tags} key={i}>
													{' '}
													#{tag}
												</span>
											))}
										</div>
									</div>
								</div>
							</Content>
						</LayoutCol>
					</Layout>
				</LayoutRow>
			</Layout>
		</div>
	)
}

export default Post
