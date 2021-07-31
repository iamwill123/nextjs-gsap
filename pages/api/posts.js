// * Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import posts from '../../data/posts.json'

export default function handler(req, res) {
	res.status(200).json({
		data: { posts },
	})
}
