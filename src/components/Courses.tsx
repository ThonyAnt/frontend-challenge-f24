import { useMemo, useState } from "react"
import type { Course } from "../types"
import { formatCourseTitle, getCourseId, getCourseLevel } from "../utils/courseUtils"

type CoursesProps = {
	courses: Course[]
	cartIds: string[]
	maxItems: number
	onAdd: (courseId: string) => void
	onRemove: (courseId: string) => void
}

const Courses = ({ courses, cartIds, maxItems, onAdd, onRemove }: CoursesProps) => {
	const [searchTerm, setSearchTerm] = useState("")
	const [numberFilter, setNumberFilter] = useState("")
	const [levelFilter, setLevelFilter] = useState("all")
	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

	const cartSet = useMemo(() => new Set(cartIds), [cartIds])
	const isAtLimit = cartIds.length >= maxItems

	const filteredCourses = useMemo(() => {
		const search = searchTerm.trim().toLowerCase()
		const numberQuery = numberFilter.trim()
		return courses.filter((course) => {
			const titleMatch = course.title.toLowerCase().includes(search)
			const descriptionMatch = course.description.toLowerCase().includes(search)
			const searchMatch = search.length === 0 || titleMatch || descriptionMatch

			const numberMatch =
				numberQuery.length === 0 ||
				course.number.toString().includes(numberQuery)

			const levelMatch =
				levelFilter === "all" ||
				getCourseLevel(course).toString() === levelFilter

			return searchMatch && numberMatch && levelMatch
		})
	}, [courses, searchTerm, numberFilter, levelFilter])

	const toggleExpanded = (courseId: string) => {
		setExpandedIds((prev) => {
			const next = new Set(prev)
			if (next.has(courseId)) {
				next.delete(courseId)
			} else {
				next.add(courseId)
			}
			return next
		})
	}

	return (
		<section className="courses">
			<div className="page-header">
				<h1>Explore Courses</h1>
				<p className="muted">
					Search by title or description, filter by course number, and add up to
					 {maxItems} courses to your cart.
				</p>
			</div>

			<div className="filters">
				<label className="field">
					<span>Search</span>
					<input
						type="search"
						placeholder="Search by title or description"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
					/>
				</label>
				<label className="field">
					<span>Course number</span>
					<input
						type="text"
						inputMode="numeric"
						placeholder="e.g., 120"
						value={numberFilter}
						onChange={(event) => setNumberFilter(event.target.value)}
					/>
				</label>
				<label className="field">
					<span>Level</span>
					<select
						value={levelFilter}
						onChange={(event) => setLevelFilter(event.target.value)}>
						<option value="all">All levels</option>
						<option value="100">100-level</option>
						<option value="200">200-level</option>
						<option value="300">300-level</option>
						<option value="400">400-level</option>
					</select>
				</label>
			</div>

			{isAtLimit && (
				<div className="alert">
					You reached the {maxItems}-course limit. Remove a course to add more.
				</div>
			)}

			{filteredCourses.length === 0 ? (
				<div className="empty-state">
					<p>No courses match your filters yet.</p>
				</div>
			) : (
				<div className="course-grid">
					{filteredCourses.map((course) => {
						const courseId = getCourseId(course)
						const isInCart = cartSet.has(courseId)
						const isExpanded = expandedIds.has(courseId)

						return (
							<article
								key={courseId}
								className={`course-card ${isInCart ? "in-cart" : ""}`}>
								<div className="course-header">
									<div>
										<h3>{formatCourseTitle(course)}</h3>
										<span className="muted">
											Level {getCourseLevel(course)}
										</span>
									</div>
									{isInCart && <span className="badge">In cart</span>}
								</div>

								<div className="course-actions">
									<button
										className="link-button"
										onClick={() => toggleExpanded(courseId)}>
										{isExpanded ? "Hide details" : "Show details"}
									</button>
									{isInCart ? (
										<button
											className="secondary"
											onClick={() => onRemove(courseId)}>
											Remove
										</button>
									) : (
										<button
											disabled={isAtLimit}
											onClick={() => onAdd(courseId)}>
											Add to cart
										</button>
									)}
								</div>

								{isExpanded && (
									<div className="course-details">
										<p>{course.description}</p>
										{course.prereqs && (
											<p className="muted">
												Prerequisites: {Array.isArray(course.prereqs)
													? course.prereqs.join(", ")
													: course.prereqs}
											</p>
										)}
										{course["cross-listed"] && course["cross-listed"].length > 0 && (
											<p className="muted">
												Cross-listed: {course["cross-listed"].join(", ")}
											</p>
										)}
									</div>
								)}
							</article>
						)
					})}
				</div>
			)}
		</section>
	)
}

export default Courses
