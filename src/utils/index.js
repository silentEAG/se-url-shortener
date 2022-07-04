export function getUrlPrefix (url) {
    const reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/)
    let matchObj = url.match(reg)
    if (matchObj) {
        return matchObj[0]
    } else {
        return null
    }
}