import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { auth } from './lib/auth'
import registrationRouter from './routes/registration/registration'
import marketplaceRouter from './routes/marketplace/marketplace'
import eoiRouter from './routes/eoi/eoi'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Add your frontend URLs
  credentials: true
}))

// Auth routes
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  return auth.handler(c.req.raw)
})

// Registration routes
app.route('/api/registration', registrationRouter)

// Marketplace routes
app.route('/api/marketplace', marketplaceRouter)

// EOI routes
app.route('/api/eoi', eoiRouter)


// Health check
app.get('/', (c) => {
  return c.json({ 
    message: 'ConnectHub API is running!',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.notFound((c) => {
  return c.json({ 
    error: 'Route not found',
    path: c.req.path 
  }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err)
  return c.json({ 
    error: 'Internal server error',
    message: err.message 
  }, 500)
})

// Bun server configuration
export default {
  port: process.env.PORT || 5000,
  fetch: app.fetch,
}
