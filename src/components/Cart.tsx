import { Link } from "react-router-dom"
import type { Course } from "../types"
import { formatCourseTitle, getCourseId } from "../utils/courseUtils"

type CartProps = {
	items: Course[]
	maxItems: number
	onRemove: (courseId: string) => void
	onCheckout: () => void
	variant: "summary" | "full"
}

const Cart = ({ items, maxItems, onRemove, onCheckout, variant }: CartProps) => {
	const isEmpty = items.length === 0
	const title = variant === "full" ? "Your Cart" : "Course Cart"

	return (
		<section className={`cart ${variant}`}>
			<div className="cart-header">
				<div>
					<h2>{title}</h2>
					<p className="muted">
						{items.length} of {maxItems} courses selected
					</p>
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
					{items.map((course) => (
						<li key={getCourseId(course)} className="cart-item">
							<div>
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
					))}
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
