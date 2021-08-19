import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { ReplayHelperBtn } from './helpers'

export const Svg = ({ isRootPage }) => {
	const svgBackgroundRef = useRef(null)
	const svgTimeline = gsap.timeline()

	useEffect(() => {
		if (svgBackgroundRef?.current) {
			// * initial animation
			svgTimeline.from(
				'path',
				{ opacity: 0, duration: 0.8, yPercent: 100, stagger: 0.2 },
				'<'
			)
		}
	}, [svgBackgroundRef?.current])

	useEffect(() => {
		if (!isRootPage) {
			svgTimeline.to(
				'path',
				{ opacity: 0.5, duration: 0.8, stagger: 0.2, yPercent: 20 },
				'<'
			)
		} else {
			svgTimeline.to(
				'path',
				{ opacity: 1, duration: 0.8, stagger: 0.2, yPercent: 0 },
				'<'
			)
		}
	}, [isRootPage])

	return (
		<>
			<svg
				ref={svgBackgroundRef}
				style={{ width: '100%', position: 'absolute', bottom: 0 }}
				viewBox="0 0 1600 900"
			>
				<path fill="#c00" d="M957 450L539 900h857z" />
				<path fill="#a00" d="M957 450l-84.1 450H1396z" />
				<path fill="#d6002b" d="M-60 900l458-238 418 238z" />
				<path fill="#b10022" d="M337 900l61-238 418 238z" />
				<path fill="#d9004b" d="M1203 546l349 354H876z" />
				<path fill="#b2003d" d="M1203 546l349 354h-390z" />
				<path fill="#d3006c" d="M641 695l245 205H367z" />
				<path fill="#ac0057" d="M587 900l54-205 245 205z" />
				<path fill="#c4008c" d="M1710 900l-309-268-305 268z" />
				<path fill="#9e0071" d="M1710 900l-309-268-36 268z" />
				<path fill="#a0a" d="M1210 900L971 687 725 900z" />
				<path fill="#808" d="M943 900h267L971 687z" />
			</svg>
			<ReplayHelperBtn
				timelines={[{ name: 'SVG', timeline: svgTimeline }]}
				title={`SVG`}
			/>
		</>
	)
}
