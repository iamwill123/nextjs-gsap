import '../styles/globals.css'

function MyApp({ Component, pageProps, router }) {
	const isRootPage = router.pathname === '/'
	return <Component {...pageProps} />
}

export default MyApp
