
const tokenKey = 'token'
const refreshTokenKey = 'refresh_token'
const userKey = 'user'

function logout() {
    localStorage.removeItem(tokenKey);
    // localStorage.removeItem(userKey);
}


const decodeJWT = (token) => {
    try {
        const base64Url = token.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        return JSON.parse(atob(base64))
    } catch (error) {
        // console.error("Invalid token", error);
        return null;
    }
};



function getCurrentUser() {
    try {
        let jwt = getJWT()
        jwt = JSON.parse(jwt)
        const expiration = jwt?.expiration
        const timestampExp = Math.floor(new Date(expiration).getTime() / 1000);

        const date = new Date()
        const now = date.getTime()
        const timeStamp = (Math.ceil(now / 1000))

        if (timeStamp > timestampExp) {
            localStorage.removeItem(userKey)
            return null
        }
        else {
            return jwt
        }
    } catch (error) {
        return null
    }
}

const setJWT = (token) => {
    localStorage.setItem(tokenKey, token);
}

const setRefreshJWT = (token) => {
    localStorage.setItem(refreshTokenKey, token);
}

const getJWT = () => {
    return localStorage.getItem(tokenKey)
}

const getRefreshJWT = () => {
    return localStorage.getItem(refreshTokenKey)
}

export const auth = { getCurrentUser, logout, setJWT, getJWT, setRefreshJWT, getRefreshJWT }
export default auth



