<template>
	<view class="content">
		<image src="http://pintuan.wtvxin.com/static/video_bg.png" class="bg_video"></image>
		<view class="regLoginBox" >
			<view class="logo">
				<view class="img">
					<image class="logoimg" src="http://pintuan.wtvxin.com/static/logo.png" mode="widthFix"></image>
					<view class="livetitle">商家直播登录</view>
				</view>
			</view>
			<view class="from pd10">
				<view class="from-line" style="position: relative;">
					<view :class="['iconfont',logintype?'icon-zh1':'icon-shouji']"></view>
					<input type="text" class="ipt" v-model="tel" value="" placeholder="请输入手机号码" placeholder-style="font-size:28rpx;font-family:PingFang;font-weight:normal;" />
					<view class="iconfont icon-cha quxiao_hh" @click="tel = ''"></view>
				</view>
				<view class="from-line" v-if="logintype">
					<view class="iconfont icon-mima"></view>
					<input type="password" class="ipt" v-model="pwd" value="" placeholder="请输入密码" />
				</view>
				<!-- <view class="from-line" v-else>
					<view class="iconfont icon-mima"></view>
					<input type="text" class="ipt" value="" v-model="code" placeholder="请输入验证码" />
					<view class="getcode" @click="getCode">{{codeMsg}}</view>
				</view>
				<view class="from-line text_r" style="margin:0;display: none;" @click="changeWay">
					<text class="c_theme" v-if="logintype">手机验证码登录</text>
					<text class="c_theme" v-if="!logintype">密码登录</text>
				</view> -->
				<view class="ftbtn" style="padding:40upx 0 20upx 0;width:80%;">
					<button type="primary" @click="btnSubmit" class="btn">登录</button>
				</view>
				<!-- <view class="form-line aLine" style="margin:0 30upx;display: none;">
					<view @click="register" class="inline-block aline">没有账号？注册账号</view>
					<view v-if="logintype" @click="getPassword" class="inline-block aline fr">忘记密码?</view>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import {host,post,get,valPhone,setRegular} from '@/common/util.js';
	export default {
		data() {
			return {
				tel:"",
				pwd:"",
				code:"",
				count:"",
				logintype:true,//true表示密码登录，false手机验证码登录
			};
		},
		onShow(){
			
		},
		methods: {
			valOther(){
				if(this.logintype){
					if(this.pwd==""){
						uni.showToast({
						  title: "请输入密码!",
						  icon: "none",
						  duration: 2000
						});
						return false;
					}
					if(this.pwd.length<6){
						uni.showToast({
						  title: "密码长度不能小于6个字符!",
						  icon: "none",
						  duration: 2000
						});
						return false;
					}
				}else{
					if(this.code == ""){
						uni.showToast({
						  title: "请输入验证码!",
						  icon: "none",
						  duration: 2000
						});
						return false;
					}
				}
				return true;
			},
			btnSubmit() {
				// if(valPhone(this.tel) && this.valOther()){
				if(this.valOther()){
					this.login();
				}
			},
			async login(){
				var	result = await post("TencentCloud/ShopLiveByMobile",{
						"mobile": this.tel,
					    "password": this.pwd
					})
				if(result.code===0){console.log(result.data)
					uni.setStorageSync('liveToken', result.data.Token);
					uni.setStorageSync('liveUserId', result.data.UserId);
					uni.setStorageSync('liveShopId', result.data.ShopId);
					let _this = this;
					uni.showToast({
					     title: "登录成功!",
					     icon: "none",
					     duration: 2000,
						 success:function(){
							setTimeout(function() {
								uni.redirectTo({
									url: "/pages/livepush/livepush"
								  });
							 }, 2000);
						 }
					});
				}else{
					uni.showToast({
					  title: result.msg,
					  icon: "none",
					  duration: 2000
					});
				}
			},
		}
	}
</script>
<style lang="scss">
	@import '../../common/login.css';
	.logo {
		padding: 0 0 80upx;
		margin-left:40upx;
	}
	
	.logo .img {
		width: 200upx;
		height:200upx;
		margin: 0 auto;
		
	}
	
	.logo .img image {
		width: 100%;
		height: 100%;
		margin:0 auto;
		/* border-radius: 25upx; */
	}
  .content{
	  background-size: 100% 100%;
	  min-height: 100%;
	  position: relative;
	  box-sizing: border-box;
	  
  }
  .bg_video{
	  position: absolute;
	  top:0;left:0;
	  width:100%;height:100%;
  }
  .regLoginBox{
	  width: 90%;
	  position: absolute;
	  top: 50%;
	  left: 3%;
	  transform: translateY(-50%);
	  border-radius: 20rpx;
	  box-sizing: border-box;
  }
  .from-line{
	  background: #fff;
	  width:80%;
	  margin: 0 auto;
	  border-radius: 0!important;
	  position: relative;
	  .iconfont{
		  font-size: 16px!important;
		  background:#e7e6ed;
		  width:82upx !important;
	  }
	  
  }
  .iconfont.quxiao_hh{
	  position: absolute;
	  left:80%!important;
	  right:0!important;
	  top:0!important;
	  font-size:18px!important;
	  background:#ebeaf1;
  }
  .livetitle{
	  color:#ffffff;
	  font-size: 32upx;
	  line-height: 80upx;
	  text-align: center;
	  font-weight: 600;
  }
  .from{
	  display: flex;flex-direction: column;justify-content: center;
	  background: #ffffff;
	  border-radius:25upx;
	  width:635upx;height:562upx;
	  margin-top:100upx;
	  margin-right:20upx;
	  box-shadow: 20upx 20upx 0px 0 rgba(134,132,158,0.5);
	  .ipt{
		  border-radius:10upx!important;
		  border:none!important;
		  background-color: #ebeaf1;
	  }
  }
  .ftbtn{
	  margin:0 auto;
	  .btn{
		  background: #756ab6;
		  border-radius:15upx;
		  padding:10upx 0;
		  font-size:28upx;
	  }
  }
</style>
