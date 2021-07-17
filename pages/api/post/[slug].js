// * Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import posts from '../../../data/posts.json'

const findOneBySlug = (arr = [], _slug = '') =>
	arr.find(({ slug }) => slug === _slug)

export default function handler(req, res) {
	const post = findOneBySlug(posts, req.query.slug)

	if (!post) {
		res.status(404).json({
			data: {
				post: {
					error: {
						message: 'no post available',
					},
				},
			},
		})
		res.end()
	}

	res.status(200).json({
		data: { post },
	})
}
