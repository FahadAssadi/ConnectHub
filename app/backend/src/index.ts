import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { auth } from './lib/auth'

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

export default app
