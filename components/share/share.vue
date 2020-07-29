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
import {webUrl} from '@/common/util'
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
        },
        appUrl:{
            type:String,
            default:''
        },
		url:{
            type:String,
            default:''
		}
    },
    data(){
        return {
			data:{}
        }
    },
    methods:{
		editUrl(params){
			if(!this[params])return;
			if(this[params].indexOf('?')==-1){
				this.data[params] =this[params]+'?'
			}else{
				this.data[params] =this[params]+'&'
			}
			console.log(this.data[params],params,'111')
			this.data[params] += `inviteCode=${uni.getStorageSync('myInviteCode')}`
		},
        // h5复制链接，app调用分享api
        share(e){
			this.editUrl('h5Url')
			this.editUrl('wxUrl')
			this.editUrl('appUrl')
			this.editUrl('url')
            // #ifdef APP-PLUS
				uni.share({
				    provider: "weixin",
				    scene: "WXSceneSession",
				    type: 0,
					title:'壹舞',
				    href: this.data.appUrl?webUrl+'/#'+this.data.appUrl:webUrl+'/#'+this.data.url,
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
            // #endif
            // #ifdef H5
            console.log('h5')
            console.log(window.location.origin)
            const status = h5Copy(this.data.h5Url?window.location.origin+'/#'+this.data.h5Url:window.location.origin+'/#'+this.data.url)
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
        path: this.data.wxUrl||this.data.url,
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
	border-width: 0;
	border-style: none;
	border-color: transparent;
}
.button::after{
	border-width: 0;
	border-style: none;
	border-color: transparent;
	border:none;
}
</style>