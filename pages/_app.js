import '../styles/globals.css'

function MyApp({ Component, pageProps, router }) {
	// * isRootPage => does nothing right meow
	const isRootPage = router.pathname === '/'
	return <Component {...pageProps} />
}

export default MyApp
