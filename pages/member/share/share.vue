<template>
	<view class="share">
		<img src="http://m.dance-one.com/static/icons/share-bg.png" alt="" class="bg" mode="widthFix">
		<div class="content">
			<div class="code">
				<img :src="inviteCode" alt="">
				<div class="number">
					<span>邀请码:</span>{{myInviteCode}}
				</div>
				<!-- #ifdef H5 -->
				<input type="text" @focus="blur()" :disabled="disabled" v-model="myInviteCode" style="opacity: 0;position: fixed;top: -10000px;">
				<!-- #endif -->
				<div class="btn" @click="copy">复制</div>
			</div>
			<share :url="shareUrl">
				<div class="shareBtn">分享</div>
			</share>
		</div>
	</view>
</template>

<script>
	import {webUrl,post} from '@/common/util'
	import {editShareUrl} from '@/common/common'
	export default {
		data() {
			return {
				myInviteCode:'',
				inviteCode:'',
				disabled:false,
				shareUrl:'/pages/login/login',
			};
		},
		onLoad(){
			this.getInfo();
		},
		methods:{
			getInfo(){
				post('User/InviteFriends',{
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token")
				}).then(res=>{
					this.inviteCode = res.data.InviteQRcode;
					this.myInviteCode = res.data.ReferralCode;
				})
			},
			blur() {
				this.disabled = true;
			},
			copy(){
				// #ifdef  H5
				let url = document.getElementsByTagName("input")[0];
				url.select(); // 选择对象
				document.execCommand("Copy");
				 uni.showToast({title:'复制成功'})
				// #endif
				// #ifdef  MP-WEIXIN
				let _this = this;
				uni.setClipboardData({
					data: _this.myInviteCode,
					success: function() {
						 uni.showToast({title:'复制成功'})
					}
				});
				// #endif
				uni.setClipboardData({
				  data: this.myInviteCode,
				  success: function (res) {
				    uni.getClipboardData({ 
				      success: function (res) {
				        console.log(res.data) // data
				      }
				    })
				  }
				})
			},
			onShare(){
				uni.share({
				    provider: "weixin",
				    scene: "WXSceneSession",
				    type: 0,
				    href: webUrl+'/#/pages/register/register?inviteCode='+this.myInviteCode,
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
			},
		},
		onShareAppMessage: function(res,i) {
			// setTimeout(()=>{
				if (res.from === 'button') {
					return {
						title: '壹舞',
						path: editShareUrl(this.shareUrl),
						success: function(res) {}
					}
				}
			// },500)
		}
	}
</script>

<style lang="scss" scoped>
	.share{
		padding-top:var(--status-bar-height);
		position:relative;
		background:#ff2d46;
		min-height:100vh;
	}
	.bg{
		position:absolute;
		top:0;left:0;width:100%;
		z-index:0;
	}
	.content{
		position:relative;
		z-index:1;
		padding-top:410upx;
		.code{
			width:60%;margin:0 auto 0;
			background:#fff;
			border-radius:20upx;
			padding:60upx 0 50upx;  
			box-shadow: 0 0 15upx rgba(0,0,0,.1);
			img{
				width:312upx;height:312upx;
				margin:0 auto;display:block;
			}
			.number{
				text-align:center;
				font-weight:bold;
				line-height:3.5;
				span{
					color:#666;
				}
			}
			.btn{
				width:180upx;
				border:1upx solid #ff3045;
				color:#ff3045;
				text-align:center;
				line-height:2;
				border-radius:40upx;
				margin:0 auto;
			}
		}
		.shareBtn{
			width:60%;
			margin:60upx auto;
			border-radius:40upx;
			text-align:center;
			color:#ff3045;
			font-weight:bold;
			line-height:2.5;
			font-size:32upx;
			background:#ffef93;
			background-image: linear-gradient(#ffef93, #ffd84b);
			box-shadow:2upx 4upx 5upx 5upx rgba(255,239,147,.4);
			&:hover{
			background:#ffd84b;
			background-image: linear-gradient(#ffd84b, #ffd84b);
			}
		}
	}
</style>
