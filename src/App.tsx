import { useMemo, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import Nav from "./components/Nav"
import Courses from "./components/Courses"
import Cart from "./components/Cart"
import Receipt from "./components/Receipt"
import coursesData from "./data/courses.json"
import type { Course } from "./types"
import { getCourseId } from "./utils/courseUtils"

function App() {
	const navigate = useNavigate()
	const [cartIds, setCartIds] = useState<string[]>([])
	const maxItems = 7

	const courses = coursesData as Course[]

	const cartCourses = useMemo(
		() => courses.filter((course) => cartIds.includes(getCourseId(course))),
		[courses, cartIds]
	)

	const handleAddCourse = (courseId: string) => {
		if (cartIds.includes(courseId)) {
			return
		}
		if (cartIds.length >= maxItems) {
			return
		}
		setCartIds((prev) => [...prev, courseId])
	}

	const handleRemoveCourse = (courseId: string) => {
		setCartIds((prev) => prev.filter((id) => id !== courseId))
	}

	const handleCheckout = () => {
		if (cartIds.length === 0) {
			return
		}
		const query = encodeURIComponent(cartIds.join(","))
		navigate(`/checkout?courses=${query}`)
	}

	return (
		<>
			<Nav cartCount={cartIds.length} />
			<main className="container">
				<Routes>
					<Route
						path="/"
						element={
							<div className="layout">
								<Courses
									courses={courses}
									cartIds={cartIds}
									maxItems={maxItems}
									onAdd={handleAddCourse}
									onRemove={handleRemoveCourse}
								/>
								<Cart
									items={cartCourses}
									maxItems={maxItems}
									onRemove={handleRemoveCourse}
									onCheckout={handleCheckout}
									variant="summary"
								/>
							</div>
						}
					/>
					<Route
						path="/cart"
						element={
							<Cart
								items={cartCourses}
								maxItems={maxItems}
								onRemove={handleRemoveCourse}
								onCheckout={handleCheckout}
								variant="full"
							/>
						}
					/>
					<Route path="/checkout" element={<Receipt />} />
				</Routes>
			</main>
		</>
	)
}

export default App
