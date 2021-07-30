import '../styles/globals.css'
import { Svg as SvgBackground } from '../components/svg'

function MyApp({ Component, pageProps, router }) {
	// * isRootPage => does nothing right now
	const isRootPage = router.pathname === '/'
	console.log('🚀 ~ file: _app.js ~ line 7 ~ MyApp ~ isRootPage', isRootPage)

	return (
		<div>
			<SvgBackground isRootPage={isRootPage} />
			<Component {...pageProps} />
		</div>
	)
}

export default MyApp
