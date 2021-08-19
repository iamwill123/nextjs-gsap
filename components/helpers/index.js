import { useCallback, useState } from 'react'
import styles from './index.module.css'

// * replay helper for tutorial
const ReplayHelperBtn = ({ timelines = [], title = '' }) => {
	const [timelineInfo, setTimelineInfo] = useState([])

	const replayAnim = useCallback(() => {
		const arr = []
		timelines.forEach(({ name, timeline }) => {
			arr.push({
				name,
				duration: timeline.duration(),
			})
			const play = () => timeline.play()
			return timeline.reverse().then(play)
		})
		setTimelineInfo(arr)
	}, [timelines, timelineInfo])

	return (
		<div
			style={{
				position: 'fixed',
				top: '2%',
				right: '2%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-end',
			}}
		>
			<div
				title={`re-play the animation`}
				className={styles.replayBtn}
				onClick={replayAnim}
			>
				re-play {title && title}
			</div>
			<div style={{ fontSize: '12px', textAlign: 'right', marginTop: '10px' }}>
				{timelineInfo.length > 0 && (
					<u>
						<b>Animation data</b>
					</u>
				)}
				<br />
				{timelineInfo.map(({ name, duration }) => (
					<span key={name}>
						{name} [ <span className={styles.duration}>{duration}</span> secs ]
						<br />
					</span>
				))}
			</div>
		</div>
	)
}
ReplayHelperBtn.displayName = ReplayHelperBtn

export { ReplayHelperBtn }
