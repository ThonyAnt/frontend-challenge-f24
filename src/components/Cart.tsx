import { useState } from "react"
import { Link } from "react-router-dom"
import type { Course } from "../types"
import { formatCourseTitle, getCourseId } from "../utils/courseUtils"

type CartProps = {
	items: Course[]
	maxItems: number
	onRemove: (courseId: string) => void
	onCheckout: () => void
	onReorder?: (nextIds: string[]) => void
	variant: "summary" | "full"
}

const Cart = ({
	items,
	maxItems,
	onRemove,
	onCheckout,
	onReorder,
	variant,
}: CartProps) => {
	const isEmpty = items.length === 0
	const title = variant === "full" ? "Your Cart" : "Course Cart"
	const [dragId, setDragId] = useState<string | null>(null)

	const ids = items.map((course) => getCourseId(course))

	const handleDrop = (targetId: string) => {
		if (!dragId || dragId === targetId || !onReorder) {
			return
		}
		const nextIds = [...ids]
		const fromIndex = nextIds.indexOf(dragId)
		const toIndex = nextIds.indexOf(targetId)
		if (fromIndex === -1 || toIndex === -1) {
			return
		}
		nextIds.splice(fromIndex, 1)
		nextIds.splice(toIndex, 0, dragId)
		onReorder(nextIds)
		setDragId(null)
	}

	return (
		<section className={`cart ${variant}`}>
			<div className="cart-header">
				<div>
					<h2>{title}</h2>
					<p className="muted">
						{items.length} of {maxItems} courses selected
					</p>
					{variant === "full" && items.length > 1 && (
						<p className="muted">Drag courses to rank your preferences.</p>
					)}
				</div>
				{variant === "summary" && (
					<Link className="button secondary" to="/cart">
						View cart
					</Link>
				)}
			</div>

		{isEmpty ? (
			<div className="empty-state">
				<p>Your cart is currently empty.</p>
				{variant === "full" && (
					<Link className="button" to="/">
						Browse courses
					</Link>
				)}
			</div>
		) : (
			<>
				<ul className="cart-list">
					{items.map((course, index) => {
						const courseId = getCourseId(course)
						const isDraggable = variant === "full" && Boolean(onReorder)
						return (
							<li
								key={courseId}
								className={`cart-item ${
									isDraggable ? "draggable" : ""
								} ${dragId === courseId ? "dragging" : ""}`}
								draggable={isDraggable}
								onDragStart={() => setDragId(courseId)}
								onDragEnd={() => setDragId(null)}
								onDragOver={(event) => {
									if (isDraggable) {
										event.preventDefault()
									}
								}}
								onDrop={() => handleDrop(courseId)}>
							<div>
								{variant === "full" && (
									<span className="cart-rank">#{index + 1}</span>
								)}
								<span className="cart-title">
									{formatCourseTitle(course)}
								</span>
								{variant === "full" && (
									<p className="muted">{course.description}</p>
								)}
							</div>
							<button
								className="link-button"
								onClick={() => onRemove(getCourseId(course))}>
								Remove
							</button>
						</li>
						)
					})}
				</ul>

				<div className="cart-actions">
					<button className="button" onClick={onCheckout}>
						Checkout
					</button>
					{variant === "full" && (
						<Link className="button secondary" to="/">
							Continue browsing
						</Link>
					)}
				</div>
			</>
		)}
		</section>
	)
}

export default Cart
