import type { Course } from "../types"

export const getCourseId = (course: Course) => `${course.dept}-${course.number}`

export const formatCourseTitle = (course: Course) =>
	`${course.dept} ${course.number}: ${course.title}`

export const getCourseLevel = (course: Course) =>
	Math.floor(course.number / 100) * 100
