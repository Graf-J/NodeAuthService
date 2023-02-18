import redis from '../db/redis';

const setRefreshToken = async (userId: string, refreshToken: string, expiration: number) => {
    await redis.SET(userId, refreshToken, { EX: expiration });
}

const getRefreshToken = async (userId: string): Promise<string | null> => {
    const refreshToken = await redis.GET(userId);
    return refreshToken;
}

const deleteRefreshToken = async (userId: string) => {
    await redis.DEL(userId);
}

export {
    setRefreshToken,
    getRefreshToken,
    deleteRefreshToken
}