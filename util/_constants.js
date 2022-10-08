import { Redis } from '@upstash/redis'

const redisURL = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

export const redis = new Redis({
  url: redisURL,
  token: redisToken,
})

export default async function handler(req, res) {
  let count = await redis.incr("counter")
  res.status(200).json({count: count})
}