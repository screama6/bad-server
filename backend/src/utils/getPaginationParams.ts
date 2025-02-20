const getPaginationParams = (page?: string, limit?: string) => {
    const parsedPage = Math.max(1, Number(page) || 1)
    const parsedLimit = Math.min(10, Math.max(1, Number(limit) || 10))
    return {
        parsedPage,
        parsedLimit,
    }
}

export default getPaginationParams