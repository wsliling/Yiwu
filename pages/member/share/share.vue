<template>
	<view class="share">
		<img src="/static/icons/share-bg.png" alt="" class="bg" mode="widthFix">
		<div class="content">
			<div class="code">
				<img :src="inviteCode" alt="">
				<div class="number">
					<span>邀请码:</span>{{myInviteCode}}
				</div>
				<div class="btn" @click="copy">复制</div>
			</div>
			<share :url="'/pages/register/register?inviteCode='+myInviteCode">
			<div class="shareBtn" >分享</div>
			</share>
		</div>
	</view>
</template>

<script>
	import {webUrl,post} from '@/common/util'
import h5Copy from '@/common/junyi-h5-copy'
	export default {
		data() {
			return {
				myInviteCode:'',
				inviteCode:'',
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
			copy(){
				const status = h5Copy(this.myInviteCode)
				if(status){
				    uni.showToast({title:'复制成功'})
				}else{
				    uni.showToast({title:'复制失败',icon:'none'})
				}
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
			}
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
