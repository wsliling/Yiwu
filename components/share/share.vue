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
export default {
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

            //#endif
        }
    },
    // #ifdef MP-WEIXIN
     //转发
    onShareAppMessage: function(e) {
        
        console.log(e,'sheare')
        let users = wx.getStorageSync('user');
        if (res.from === 'button') {}
        return {
        title: '壹舞',
        path: '/pages/tabbar/index/index',
        success: function(res) {}
        }
    }
    // #endif
}
</script>
<style scoped lang="scss">
.button{
    background-color:#fff;
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