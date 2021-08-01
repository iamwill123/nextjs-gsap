import '../styles/globals.css'
import { Svg as SvgBackground } from '../components/svg'

function MyApp({ Component, pageProps, router }) {
	const isRootPage = router.pathname === '/'

	return (
		<div>
			<SvgBackground isRootPage={isRootPage} />
			<Component {...pageProps} />
		</div>
	)
}

export default MyApp
