export function editShareUrl(url){
    if(url.indexOf('?')==-1){
        url =url+'?'
    }else{
        url =url+'&'
    }
    console.log(url,'111')
    url += `inviteCode=${uni.getStorageSync('myInviteCode')}`
    return url;
}
