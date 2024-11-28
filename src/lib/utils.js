import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Make sure to export the cn function
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function latLongToVector3(lat, long, radius = 1) {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (long + 180) * (Math.PI / 180)
    const x = -(radius * Math.sin(phi) * Math.cos(theta))
    const z = radius * Math.sin(phi) * Math.sin(theta)
    const y = radius * Math.cos(phi)
    return [x, y, z]
  }

  