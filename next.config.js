/**
 * @type {import('next').NextConfig}
 */

module.exports = {
    trailingSlash: false,
    images: {
        loader: 'akamai',
        path: '/',
    },
}