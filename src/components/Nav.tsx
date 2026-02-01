import { NavLink } from "react-router-dom"

type NavProps = {
	cartCount: number
}

const Nav = ({ cartCount }: NavProps) => (
	<header className="nav">
		<div className="nav-inner">
			<div className="nav-brand">
				<h2>Penn Course Cart</h2>
				<span className="muted">Spring 2022 courses</span>
			</div>
			<nav className="nav-links">
				<NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/">
					Explore
				</NavLink>
				<NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/cart">
					View cart
					<span className="badge">{cartCount}</span>
				</NavLink>
			</nav>
		</div>
	</header>
)

export default Nav
