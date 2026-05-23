import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styles from './ParticleBackground.module.css'

// ─── Pure helpers (exported for unit testing) ─────────────────────────────────

/**
 * Creates a single particle with random position, velocity and appearance.
 *
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {number} baseSpeed
 * @returns {object} particle
 */
export function createParticle(canvasWidth, canvasHeight, baseSpeed) {
  const angle = Math.random() * Math.PI * 2
  const speed = (Math.random() * 0.5 + 0.5) * baseSpeed
  const vx = Math.cos(angle) * speed
  const vy = Math.sin(angle) * speed

  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx,
    vy,
    originalVx: vx,
    originalVy: vy,
    radius: Math.random() * 2 + 1.5,   // 1.5 – 3.5 px
    opacity: Math.random() * 0.45 + 0.2, // 0.2 – 0.65
  }
}

/**
 * Applies border-bounce logic to a single particle in-place.
 * Exported for property-based testing.
 *
 * @param {object} p   - Particle (mutated in place)
 * @param {number} w   - Canvas width
 * @param {number} h   - Canvas height
 */
export function applyBounce(p, w, h) {
  if (p.x - p.radius <= 0) {
    p.vx = Math.abs(p.vx)
    p.originalVx = Math.abs(p.originalVx)
    p.x = p.radius
  } else if (p.x + p.radius >= w) {
    p.vx = -Math.abs(p.vx)
    p.originalVx = -Math.abs(p.originalVx)
    p.x = w - p.radius
  }

  if (p.y - p.radius <= 0) {
    p.vy = Math.abs(p.vy)
    p.originalVy = Math.abs(p.originalVy)
    p.y = p.radius
  } else if (p.y + p.radius >= h) {
    p.vy = -Math.abs(p.vy)
    p.originalVy = -Math.abs(p.originalVy)
    p.y = h - p.radius
  }
}

/**
 * Applies repulsion or gradual velocity restoration to a particle in-place.
 * Exported for property-based testing.
 *
 * @param {object} p           - Particle (mutated in place)
 * @param {number} mouseX
 * @param {number} mouseY
 * @param {number} repelRadius
 */
export function applyRepulsion(p, mouseX, mouseY, repelRadius) {
  const dx = mouseX - p.x
  const dy = mouseY - p.y
  const distSq = dx * dx + dy * dy
  const dist = Math.sqrt(distSq)

  if (dist < repelRadius && dist > 0) {
    // Push away from cursor — force proportional to proximity
    const force = (repelRadius - dist) / repelRadius
    p.vx -= (dx / dist) * force * 2.5
    p.vy -= (dy / dist) * force * 2.5
  } else {
    // Gradually restore original velocity (lerp factor 0.04)
    p.vx += (p.originalVx - p.vx) * 0.04
    p.vy += (p.originalVy - p.vy) * 0.04
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Full-screen animated particle background built with Canvas API only.
 * No external libraries — uses requestAnimationFrame for the render loop.
 *
 * @param {number}  [particleCount=80]                       Number of particles
 * @param {string}  [particleColor='rgba(245,158,11,0.55)']  CSS color string
 * @param {number}  [repelRadius=120]                        Mouse repel radius in px
 * @param {number}  [baseSpeed=0.8]                          Base movement speed
 */
export default function ParticleBackground({
  particleCount = 80,
  particleColor = 'rgba(245, 158, 11, 0.55)',
  repelRadius = 120,
  baseSpeed = 0.8,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId = null
    let particles = []

    // Mouse position — starts far off-screen so no initial repulsion
    const mouse = { x: -9999, y: -9999 }

    // ── Resize handler ──────────────────────────────────────
    function resize() {
      const { offsetWidth, offsetHeight } = canvas
      canvas.width = offsetWidth
      canvas.height = offsetHeight

      // Clamp existing particles inside new bounds
      for (const p of particles) {
        p.x = Math.min(Math.max(p.x, p.radius), canvas.width - p.radius)
        p.y = Math.min(Math.max(p.y, p.radius), canvas.height - p.radius)
      }
    }

    // ── Initialise ──────────────────────────────────────────
    function init() {
      resize()
      particles = Array.from({ length: particleCount }, () =>
        createParticle(canvas.width, canvas.height, baseSpeed),
      )
    }

    // ── Render loop ─────────────────────────────────────────
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        // 1. Repulsion / restoration
        applyRepulsion(p, mouse.x, mouse.y, repelRadius)

        // 2. Bounce off edges
        applyBounce(p, canvas.width, canvas.height)

        // 3. Move
        p.x += p.vx
        p.y += p.vy

        // 4. Draw
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.globalAlpha = p.opacity
        ctx.fill()
      }

      // Reset globalAlpha so other canvas operations aren't affected
      ctx.globalAlpha = 1

      animationId = requestAnimationFrame(draw)
    }

    // ── Event listeners ─────────────────────────────────────
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    function onMouseLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    // ── Bootstrap ───────────────────────────────────────────
    init()
    draw()

    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    // ── Cleanup ─────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [particleCount, particleColor, repelRadius, baseSpeed])

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-hidden="true"
    />
  )
}

ParticleBackground.propTypes = {
  particleCount: PropTypes.number,
  particleColor: PropTypes.string,
  repelRadius: PropTypes.number,
  baseSpeed: PropTypes.number,
}
