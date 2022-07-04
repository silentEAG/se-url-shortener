export function getCurrentTime() {
    const date = new Date();//当前时间
    const year = date.getFullYear(); //年
    const month = repair(date.getMonth() + 1);//月
    const day = repair(date.getDate());//日
    const hour = repair(date.getHours());//时
    const minute = repair(date.getMinutes());//分
    const second = repair(date.getSeconds());//秒
    //当前时间
    return year + "-" + month + "-" + day
        + " " + hour + ":" + minute + ":" + second;
}
//若是小于10就加个0

function repair(i){
    if (i >= 0 && i <= 9) {
        return "0" + i;
    } else {
        return i;
    }
}
