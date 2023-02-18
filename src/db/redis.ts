import * as redis from 'redis';

const client = redis.createClient({
    url: process.env.CACHE_URL
})

client.on('error', err => console.log('Redis Client Error', err));

process.on('SIGINT', async () => {
    client.disconnect();
    process.exit();
})

client.connect();

export default client;