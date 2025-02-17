const MAX_LIMIT = 10

export default function getPaginationParams(
    page: string | string[] | undefined,
    limit: string | string[] | undefined
) {
    const pageValue = Array.isArray(page) ? page[0] : page
    const limitValue = Array.isArray(limit) ? limit[0] : limit

    const parsedPage = Math.max(
        1,
        typeof pageValue === 'string'
            ? parseInt(pageValue, 10)
            : (pageValue ?? 1)
    )
    const parsedLimit = Math.min(
        Math.max(
            1,
            typeof limitValue === 'string'
                ? parseInt(limitValue, 10)
                : (limitValue ?? 1)
        ),
        MAX_LIMIT
    )

    return { parsedPage, parsedLimit }
}