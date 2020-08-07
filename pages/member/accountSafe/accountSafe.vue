<template>
	<view>
		<view class="line-list">
			<view class="line-item line-arrow-r" v-if="false">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="http://m.dance-one.com/static/share_weixin.png" mode="widthFix"></image>
					<text class="txt">绑定微信</text>
				</view>
				<view class="item_r text_right">
				  已绑定
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/verPhone/verPhone?Mobile='+Mobile)">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="http://m.dance-one.com/static/phone.png" mode="widthFix"></image>
					<text class="txt">手机号更换</text>
				</view>
				<view class="item_r text_right">
				  {{Mobile}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {post, toLogin} from '@/common/util.js';
	export default {
		data() {
			return {
				Mobile:''
			}
		},
		onShow(){
		 this.getMemberInfo()
		},
		methods: {
			tolink(Url) {
				if(toLogin()){
					uni.navigateTo({
						url: Url
					})
				}
			},
			async getMemberInfo() {
				let result = await post("User/GetCenterInfo", {
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token")
				})
				if (result.code === 0) {
					this.Mobile = result.data.Mobile; 
				} else if (result.code === 2) {
					let _this = this;
					uni.showModal({
						content: "您还没有登录，是否重新登录？",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
								  url: "/pages/login/login"
								});
							}
						}
					});
				}
			},
		}
	}
</script>

<style lang="scss">
	.line-item-l{ 
		.iconimg{
			display: block;
			width: 56upx; 
			height: 56upx;
			margin-right: 20upx;
		}
		.txt{font-size: 30upx;}
	}
	.item_r{ color: #999;}
</style>
