import Head from 'next/head'
import { forwardRef, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import gsap from 'gsap'
import styles from '../../styles/Post.module.css'
import { hostUrl, isDev } from '../../utils/envCheck'
import { imgDataForBlurring } from '../../utils/images/imgData'
import posts from '../../data/posts.json'

// * 📚 recommended read:
// * https://nextjs.org/docs/basic-features/data-fetching#when-should-i-use-getstaticprops

export async function getStaticProps({ params }) {
	const res = isDev
		? await fetch(`${hostUrl}/api/post/${params.slug}`)
		: await fetch(`https://nextjs-gsap.vercel.app/api/post/${params.slug}`)

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
	// * import our posts data directly (alt), use fetch for external data
	// * https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
	// const res = await fetch(`${hostUrl}/api/posts`)
	// const {
	// 	data: { posts },
	// } = await res.json()

	const pathParams = posts.map(({ slug }) => ({
		params: { slug },
	}))

	return {
		paths: pathParams,
		fallback: false,
	}
}

const LayoutCol = (props) => (
	<div className={`${styles.flexCol}`} {...props}>
		{props.children}
	</div>
)
LayoutCol.displayName = LayoutCol

const LayoutRow = (props) => (
	<div className={`${styles.flexRow}`} {...props}>
		{props.children}
	</div>
)
LayoutRow.displayName = LayoutRow

const Content = forwardRef(({ children }, ref) => {
	return (
		<div ref={ref} className={styles.flexCol}>
			{children}
		</div>
	)
})
Content.displayName = 'Content'

const Author = forwardRef(({ author }, ref) => {
	const {
		name,
		handle,
		picture: { fileName },
	} = author

	return (
		<div ref={ref} style={{ position: 'sticky', top: '-1px' }}>
			<LayoutCol style={{ alignItems: 'center' }}>
				<Image
					alt={name}
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
				<div style={{ color: 'grey', wordBreak: 'break-all' }}>@{handle}</div>
			</LayoutCol>
		</div>
	)
})
Author.displayName = 'Author'

const ImgHeader = forwardRef(({ coverImage, title }, ref) => {
	const [coverImgRef, titleRef] = ref
	return (
		<div style={{ position: 'relative', width: '100%' }}>
			<div
				ref={coverImgRef}
				style={{
					width: '100%',
					height: '75px',
					overflow: 'hidden',
				}}
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
			<h1 className={styles.title} ref={titleRef}>
				{title}
			</h1>
		</div>
	)
})
ImgHeader.displayName = 'ImgHeader'

const ReplayHelperBtn = ({ fn }) => {
	return (
		<div
			style={{
				position: 'fixed',
				top: '2%',
				right: '2%',
			}}
		>
			<div
				title={`re-play the animation`}
				className={styles.replayBtn}
				onClick={() => fn()}
			>
				re-play
			</div>
		</div>
	)
}

const Post = ({ post }) => {
	const titleRef = useRef(null)
	const coverImgRef = useRef(null)
	const contentRef = useRef(null)
	const avatarRef = useRef(null)
	const backBtnRef = useRef(null)

	const router = useRouter()
	const createMarkup = (content) => ({ __html: content })

	const { author, title, date, tags, content, coverImage } = post

	let postTimeline = gsap.timeline()

	useEffect(() => {
		if (titleRef?.current || coverImgRef?.current) {
			postTimeline
				.from(
					titleRef?.current,
					{
						duration: 0.5,
						display: 'none',
						autoAlpha: 0,
						delay: 0.25,
						y: 25,
						ease: 'power1.in',
					},
					'<'
				)
				.from(
					avatarRef?.current,
					{
						duration: 0.5,
						autoAlpha: 0,
						x: -25,
						ease: `power1.inOut`,
					},
					'<'
				)
				.from(
					coverImgRef?.current,
					{
						duration: 0.3,
						autoAlpha: 0,
						y: 25,
						ease: `power1.inOut`,
					},
					'<'
				)
				.from(
					contentRef?.current,
					{
						duration: 0.2,
						autoAlpha: 0,
						y: 25,
						ease: `power1.inOut`,
					},
					'<0.5'
				)
				.from(
					backBtnRef?.current,
					{
						duration: 0.1,
						autoAlpha: 0,
						x: -25,
						ease: `power1.inOut`,
					},
					'<'
				)

			postTimeline.play()
		}
	}, [
		avatarRef?.current,
		backBtnRef?.current,
		contentRef?.current,
		coverImgRef?.current,
		titleRef?.current,
		postTimeline,
	])

	const handleChangePage = useCallback(
		(e, destination) => {
			e.preventDefault()
			const postTLduration = postTimeline.duration()
			const totalTimelineDuration = postTLduration * 900
			setTimeout(() => {
				router.push(destination)
			}, totalTimelineDuration)
			postTimeline.reverse()
		},
		[postTimeline, router]
	)

	// * replay helper for tutorial
	const replayAnim = useCallback(() => {
		const play = () => postTimeline.play()
		postTimeline.reverse().then(play)
	}, [postTimeline])
	// * helper end

	return (
		<div className={styles.container}>
			<Head>
				<title>{title}</title>
				<meta name="description" content={title} />
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

			<LayoutRow style={{ width: '100%' }}>
				<LayoutCol
					style={{
						width: '20%',
						height: '100%',
						justifyContent: 'space-between',
						alignItems: 'center',
						margin: '0 0.5rem',
					}}
				>
					<Author ref={avatarRef} author={author} />
					<div ref={backBtnRef}>
						<Link href="/">
							<a
								className={styles.backBtn}
								onClick={(e) => handleChangePage(e, `/`)}
								style={{
									fontSize: '0.9rem',
									padding: '5px',
									borderRight: `1px dotted rgba(49, 200, 255, 0.6)`,
									borderBottom: `1px dotted rgba(49, 200, 255, 0.9)`,
									transition: 'all 500ms',
								}}
							>
								back
							</a>
						</Link>
					</div>
				</LayoutCol>

				<LayoutCol style={{ width: '80%' }}>
					<ImgHeader
						ref={[coverImgRef, titleRef]}
						coverImage={coverImage}
						date={date}
						title={title}
					/>
					<Content ref={contentRef}>
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
			</LayoutRow>
			<ReplayHelperBtn fn={replayAnim} />
		</div>
	)
}

Post.displayName = 'Post'

export default Post
