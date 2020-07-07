<template>
<div>
    <button open-type="share" @click="share" class="button">
        <slot>
            分享
        </slot>
    </button>
</div>
</template>
<script>
import h5Copy from '@/common/junyi-h5-copy'
export default {
    props:{
        h5Url:{
            type:String,
            default:''
        },
        wxUrl:{
            type:String,
            default:''
        }
    },
    data(){
        return {

        }
    },
    methods:{
        // h5复制链接，app调用分享api
        share(e){
            // #ifdef APP-PLUS
            console.log(e,'app')

            // #endif
            // #ifdef H5
            console.log('h5')

            const status = h5Copy(this.h5Url?window.location.origin+'/#'+this.h5Url:window.location.href)
            if(status){
                uni.showToast({title:'链接复制成功，快去分享给好友吧~'})
            }else{
                uni.showToast({title:'分享失败',icon:'none'})
            }
            //#endif
        }
    },
    // #ifdef MP-WEIXIN
     //转发
    onShareAppMessage: function(e) {
        let res = wx.getStorageSync('user');
        if (res.from === 'button') {}
        return {
        title: '壹舞',
        path: this.wxUrl,
        success: function(res) {}
        }
    }
    // #endif
}
</script>
<style scoped lang="scss">
.button{
    background-color:transparent;
    padding-left:0;
    padding-right:0;
    line-height:1;
    border-radius: 0;
    &::after{
        border:0;
        border:none;
    }
}
</style>