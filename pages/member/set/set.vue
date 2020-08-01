<template>
	<view>
		<view class="line-list">
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/accountSafe/accountSafe')">
				<view class="line-item-l">
					<text class="txt">账户和安全</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" v-if="false" @click="tolink('/pages/member/changeLoginPwd/changeLoginPwd')">
				<view class="line-item-l">
					<text class="txt">修改登录密码</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/setpwd/setpwd')">
				<view class="line-item-l">
					<text class="txt">设置支付密码</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/address/address')">
				<view class="line-item-l">
					<text class="txt">收货地址</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/feedback/feedback')">
				<view class="line-item-l">
					<text class="txt">意见反馈</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/question/question')">
				<view class="line-item-l">
					<text class="txt">常见问题</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/message/agreement/agreement')">
				<view class="line-item-l">
					<text class="txt">用户协议</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/message/agreement2/agreement2')">
				<view class="line-item-l">
					<text class="txt">隐私政策</text>
				</view>
			</view>
			<!-- #ifdef APP-PLUS -->
			<view class="line-item line-arrow-r">
				<view class="line-item-l">
					<text class="txt">软件版本</text>
				</view>
				<view class="item-r">
					<text class="c_999">{{version}}</text>
				</view>
			</view>
			<!-- #endif -->
		</view>
		<view style="text-align: center;padding: 40px 0 40upx;color: #ccc;">
			<view class="">Copyright© 2020</view>
			<view class="">	壹舞有限责任公司 版本所有</view>
		</view>
		<view class="fixedbtn" style="background: #f7f7f7;">
			<view class="btn" @click="logOut">退出登录</view>
		</view>
	</view>
</template>

<script>
	import {host,post,get,toLogin} from '@/common/util.js';
	export default{
		data(){
			return{
				version:''
			}
		},
		onShow(){
			// #ifdef APP-PLUS
			this.version = plus.runtime.version
			// #endif
		},
		methods:{
			tolink(url){
				uni.navigateTo({
					url:url
				})
			},
			// 退出登录
			logOut() {
				uni.showModal({
					title:'退出登录',
					content:"是否退出登录！",
					success(res){
						if(res.confirm){
							uni.setStorageSync('token', '');
							uni.setStorageSync('userId', '');
							uni.setStorageSync('liveUserId', '');//清除商家直播账号
							uni.setStorageSync('liveToken', '');//清除商家直播账号
							uni.setStorageSync("unionid", ""); 
							uni.setStorageSync("openId", ""); 
							uni.setStorageSync("userInfo", "");
							uni.switchTab({
								url: '/pages/tabBar/index/index'
							});
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.line-arrow-r{
		.item-r{
			margin-right: 20upx;
		}
	}
	
	.btn_fix{
		background: #ff3333;text-align: center;
		height:88upx;line-height: 88upx;
		width:690upx;
		position: fixed;
		bottom:100upx;left:30upx;color:#ffffff;border-radius:15upx;
	}
</style>
