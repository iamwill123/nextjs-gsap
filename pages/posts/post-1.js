import Link from 'next/link'

export default function Post1() {
	return (
		<>
			<h1>Post 1</h1>
			<h2>
				<Link href="/">
					<a>Back to home</a>
				</Link>
			</h2>
		</>
	)
}
