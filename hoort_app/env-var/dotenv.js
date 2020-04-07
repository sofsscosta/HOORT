module.exports = {
    config({ path = './env' }) {
        const env = require(path)

        for (const key in env) process.env[key] = env[key]
    }
}