import redis from '../db/redis';

const setRefreshToken = (userId: string, refreshToken: string, expiration: number) => {
    redis.SET(userId, refreshToken, { EX: expiration });
}

export {
    setRefreshToken
}