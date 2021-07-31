export const isDev = process.env.NODE_ENV !== 'production'
export const hostUrl = isDev ? process.env.LOCAL_URL : process.env.PROD_URL
