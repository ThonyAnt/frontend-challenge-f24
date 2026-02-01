import { Link, useSearchParams } from "react-router-dom"
import coursesData from "../data/courses.json"
import type { Course } from "../types"
import { formatCourseTitle, getCourseId } from "../utils/courseUtils"

const Receipt = () => {
	const [searchParams] = useSearchParams()
	const rawCourseIds = searchParams.get("courses")
	const ids = rawCourseIds
		? rawCourseIds
				.split(",")
				.map((id) => id.trim())
				.filter(Boolean)
		: []

	const courseMap = new Map(
		(coursesData as Course[]).map((course) => [getCourseId(course), course])
	)

	const courses = ids
		.map((id) => courseMap.get(id))
		.filter((course): course is Course => Boolean(course))

	return (
		<div className="page">
			<div className="page-header">
				<h1>Checkout Receipt</h1>
				<p className="muted">
					Thanks for checking out! Review your selected courses below.
				</p>
			</div>

			{courses.length === 0 ? (
				<div className="empty-state">
					<p>Your receipt is empty. Try adding courses first.</p>
					<Link className="button" to="/">
						Back to courses
					</Link>
				</div>
			) : (
				<div className="receipt">
					<div className="receipt-summary">
						<span className="badge">{courses.length} course(s)</span>
						<span className="muted">Receipt ID: {ids.join("-")}</span>
					</div>
					<ul className="receipt-list">
						{courses.map((course) => (
							<li key={getCourseId(course)}>
								<div className="receipt-title">
									{formatCourseTitle(course)}
								</div>
								<p className="muted">{course.description}</p>
							</li>
						))}
					</ul>
					<Link className="button" to="/">
						Back to courses
					</Link>
				</div>
			)}
		</div>
	)
}

export default Receipt
