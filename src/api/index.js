
import http from '@/utils/http'


export function getShortenUrl(params) {
    return http.post("/u", params)
}