<template>
<view>
	<button open-type="share" @click.stop="share" class="button" :data-param="param">
	    <slot>
	        分享
	    </slot>
	</button>
    <!-- #ifdef APP-PLUS -->
   <uni-popup type="bottom" :show="showPopupShare" :h5Top="true" position="bottom" @hidePopup='hide'>
	   <view class="uni-popup">
		   <view class="pop-hd">分享</view>
			<view class="sharelist flex-between">
				<view class="share-item" @click.stop="appShare('WXSceneSession')">
					<image class="imgico" src="http://m.dance-one.com/static/wx.png" mode="aspectFit"></image>
					<text class="txt">微信好友</text>
				</view>
				<view class="share-item" @click.stop="appShare('WXSenceTimeline')">
					<image class="imgico" src="http://m.dance-one.com/static/ico_quan.png" mode="aspectFit"></image>
					<text class="txt">微信朋友圈</text>
				</view>
				<view class="share-item" @click.stop="appShare()">
					<image class="imgico" src="http://m.dance-one.com/static/share_link.png" mode="aspectFit"></image>
					<text class="txt">复制链接</text>
				</view>
			</view>
			<view style="height: 100upx;"></view>
			<view class="uni-close-bottom" @click.stop="hide">关闭</view>
	   </view>
   </uni-popup>
    <!-- #endif -->
</view>
</template>
<script>
import {webUrl} from '@/common/util'
import h5Copy from '@/common/junyi-h5-copy'
import uniPopup from '@/components/uni-popup.vue';
export default {
	components: {
		uniPopup
	},
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
        },
        // 小程序分享在button里传参，解决列表拿不到当前参数问题
        param:{
            type:String,
            default:''
        }
    },
    data(){
        return {
			data:{},
			showPopupShare:false,
			offsetTop:0
        }
    },
    methods:{
		//统一的关闭popup方法
		hide: function() {
			this.showPopupShare = false;
		},
		moveHandle() {},
		editUrl(params){
			console.log(params)
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
			this.showPopupShare = true;
				// uni.shareWithSystem({
				// 	summary:'DanceOne',
				// 	type:'image',
				// 	// href:this.data.appUrl?webUrl+'/#'+this.data.appUrl:webUrl+'/#'+this.data.url,
				// 	imageUrl:'../../static/logo.png',
				// 	success(res){
				// 	   console.log("success:" + JSON.stringify(res));
				// 	},
				// 	fail(err){
				// 	   console.log("fail:" + JSON.stringify(err));
				// 	}
				// })
            // #endif
            // #ifdef H5
            console.log(this.data.url)
            console.log(window.location.origin)
            const status = h5Copy(this.data.h5Url?window.location.origin+'/#'+this.data.h5Url:window.location.origin+'/#'+this.data.url)
            if(status){
                uni.showToast({title:'链接复制成功，快去分享给好友吧~'})
            }else{
                uni.showToast({title:'分享失败',icon:'none'})
            }
            //#endif
        },
		appShare(Scene){
			if(Scene){
				uni.share({
				    provider: "weixin",
				    scene: Scene,
				    type: 0,
					title:'壹舞',
					imageUrl:'/static/logo.png',
				    href: this.data.appUrl?webUrl+'/#'+this.data.appUrl:webUrl+'/#'+this.data.url,
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
			}else{
				let txt = this.data.appUrl?webUrl+'/#'+this.data.appUrl:webUrl+'/#'+this.data.url;
				uni.setClipboardData({
				  data: txt,
				  success: function (res) {
				    uni.getClipboardData({ 
				      success: function (res) {
				        console.log(res.data) // data
				      }
				    })
				  }
				})
			}
		}
    },
    // #ifdef MP-WEIXIN
     //转发
    onShareAppMessage: function(e) {
		console.log(11111111111111)
		console.log(this.data.url,'13')
		this.editUrl('h5Url')
		this.editUrl('wxUrl')
		this.editUrl('appUrl')
		this.editUrl('url')
		console.log(this.data.url)
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
	width: 100%;
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
.uni-mask {
		position: fixed;
		z-index: 99999;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .4);
	}
	.uni-popup {
		// position: fixed;
		// z-index: 999999;
		background-color: #ffffff;
		box-shadow: 0 0 30upx rgba(0, 0, 0, .1);
		// left: 0;
		// bottom: 0;
		// width: 100%;
		// text-align: center;
		border-radius: 20upx 20upx 0 0;
		.pop-hd{ font-size: 32upx;}
	}
	.sharelist{ padding: 20upx 30upx;}
	.sharelist .share-item{ width: 25%; margin-bottom: 20upx;}
	.imgico{ display: block; width: 100upx; height: 100upx; margin: 0 auto;}
	.txt{ color: #333; font-size: 26upx;}
	.uni-close-bottom{ height: 100upx; line-height: 100upx; width: 100%; position: absolute;bottom: 0; left: 0; font-size: 30upx; border-top: 1px solid #eee;color: #999;}
</style>