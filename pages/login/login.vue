<template>
	<view class="content">
		<!-- #ifndef MP-WEIXIN -->
		<view class="nav" :style="{'padding-top':barHeight+'px'}">
			<view class="" @click="toback()"><image class="back" src="http://pintuan.wtvxin.com/static/hpicons/back.svg" mode=""></image></view>
			<view class="mine">登录</view>
			<view></view>
		</view> 
		<!-- #endif -->
		<view class="regLoginBox" v-if="isShowMolie">
			<view class="logo">
				<view class="img">
					<image class="logoimg" src="http://m.dance-one.com/static/logo.png" mode="widthFix"></image>
					<!-- <view class="Title">水连动氢力氧</view> -->
				</view>
			</view>
			<view class="from pd10">
				<view class="from-line">
					<view :class="['iconfont',logintype?'icon-zh1':'icon-shouji']"></view>
					<input type="text" class="ipt" v-model="tel" value="" placeholder="请输入手机号码" />
				</view>
				<view class="from-line" v-if="logintype">
					<view class="iconfont icon-mima"></view>
					<input type="password" class="ipt" v-model="pwd" value="" placeholder="请输入密码" />
				</view>
				<view class="from-line" v-else>
					<view class="iconfont icon-mima"></view>
					<input type="text" class="ipt" value="" v-model="code" placeholder="请输入验证码" />
					<view class="getcode" @click="getCode">{{codeMsg}}</view>
				</view>
				<view class="from-line text_r" style="margin:0;display: none;" @click="changeWay">
					<text class="c_theme" v-if="logintype">手机验证码登录</text>
					<text class="c_theme" v-if="!logintype">密码登录</text>
				</view>
				<view class="ftbtn" style="padding:40upx 0 20upx 0;">
					<button type="primary" @click="btnSubmit" class="btn">登录</button>
				</view>
				<view class="from-txt">
					<view  @click="isAgree=!isAgree" style="display: inline-block;vertical-align: middle;"><view class="IconsCK IconsCK-radio" :class="{'checked':isAgree}" style="margin-right: 8upx;"></view><text>我已阅读并同意</text></view>
					<navigator url="/pages/message/agreement/agreement" class="inline-block" style="color:#3fb1ea;">《用户协议》</navigator>
				</view>
				<view class="form-line aLine" style="margin:0 30upx;" v-if="false">
					<view @click="register" class="inline-block aline">没有账号？注册账号</view>
					<view v-if="logintype" @click="getPassword" class="inline-block aline fr">忘记密码?</view>
				</view>
			</view>
			<!-- 其他登录方式 -->
			<view class="Otherway center" v-if="false">
				<view class="title"><text class="txt">其他登录方式</text></view>
				<view class="waylist flex">
					<view class="flex-item" @click="changeWay(1)">
						<view class="iconfont icon-weixin1" style="background: #09BB07;"></view>
						<view class="name">微信</view>	
					</view>
					<view class="flex-item" @click="changeWay(2)" v-if="false">
						<view :class="['iconfont',logintype?'icon-shouji':'icon-zh1']"></view>
						<view class="name">{{logintype?'手机':'账号'}}</view>	
					</view>
				</view>	
			</view>
		</view>
		<!-- #ifdef MP-WEIXIN -->  
		<view class="MP-login" v-if="isShowminiApp">
		    <view class="logo">
				<view class="logoimg">
					<image class="img_bb" src="http://m.dance-one.com/static/logo.png" mode="widthFix"></image>
				</view>
				<!-- <view class="Title">水连动氢力氧</view> -->
		    </view> 
			<button v-if="isband" class="login-btn btn_gree" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">绑定手机号</button>
			<button v-else class="login-btn btn_gree" open-type="getUserInfo" @getuserinfo="oauth">微信登录</button>
		    <!-- <view class="c_blue uni-center" @click="loginTel">手机号登录/注册</view> -->
		</view>
		<!-- #endif -->  
	</view>
</template>

<script>
	import {host,post,get,valPhone,setRegular} from '@/common/util.js';
	export default {
		onLoad(e){
			if(e.inviteCode){
				this.inviteCode=e.inviteCode;
				uni.setStorageSync('inviteCode',e.inviteCode)
			}
			if(uni.getStorageSync('inviteCode')){
				this.inviteCode=uni.getStorageSync('inviteCode')
			}
			// #ifdef APP-PLUS
			if((e.askUrl!=undefined )&& (e.askUrl!="")&& (e.askUrl!=null)){
				this.askUrl=e.askUrl.toString().replace(/\%3F/g, '?').replace(/\%3D/g, '=').replace(/\%26/g, '&')
			}
			if(e.isResgister){
				this.isRegister = e.isResgister
			}
			if(e.isIndex){
				this.isIndex = e.isIndex
			}
			var height = plus.navigator.getStatusbarHeight();
			this.barHeight = height;
			// #endif
			// #ifndef MP-WEIXIN
			console.log(e.askUrl,"99999999999999")
			this.isShowMolie=false;
			this.isShowminiApp = true;
			// #endif
			// #ifdef H5
			this.barHeight = 0;
			// #endif
		},
		onShow(){ 
			// console.log(this.$root.$mp,111) 
			
			// #ifdef MP-WEIXIN
			this.isShowMolie=false;
			this.isShowminiApp = true;
			// #endif
			// #ifndef MP-WEIXIN
			console.log("7777777777777")
			this.isShowMolie=true;
			this.isShowminiApp = false;
			// #endif
			// #ifndef APP-PLUS
			if(this.$root.$mp.query.askUrl){
				this.askUrl = this.$root.$mp.query.askUrl.toString().replace(/\%3F/g, '?').replace(/\%3D/g, '=').replace(/\%26/g, '&');
			}
			if(this.$root.$mp.query.isResgister){
				this.isRegister = this.$root.$mp.query.isResgister
			}
			if(this.$root.$mp.query.isIndex){
				this.isIndex = this.$root.$mp.query.isIndex
			}
			// #endif
			console.log(this.isRegister,"8888888888")
		},
		data() {
			return {
				barHeight:0,//app端增加状态栏高度
				tel:"",
				pwd:"",
				askUrl: "",
				code:"",
				codeMsg: "获取验证码",
				timer : null,
				count:"",
				has_click: false,
				isRegister:false,
				isIndex:false,
				logintype:false,//true表示密码登录，false手机验证码登录
				isShowMolie:true,//是否显示号登录界面
				isShowminiApp:false,//是否显示小程序登录
				isAgree:true,
				inviteCode:'',
				isband:false,//是否绑定手机号
				jsonARR:{},
			};
		},
		methods: { 
			getPhoneNumber(e){
				console.log(e)
				if(e.detail.errMsg=="getPhoneNumber:ok"){
					this.jsonARR['iv']=e.detail.iv;
					this.jsonARR['encryptedData']=e.detail.encryptedData;
					this.bandPhoneNumber(this.jsonARR);
				}else{
					uni.showToast({
					  title: "获取授权失败！",
					  icon: "none",
					  duration: 2000
					});
				}
			},
			changeWay(e){
				if(e==1){
					// #ifdef APP-PLUS
					// this.isShowMolie=false;
					// this.isShowminiApp=true;
					uni.getProvider({
					    service: 'oauth',
					    success: function (res) {
					        console.log(res.provider)
					        if (~res.provider.indexOf('weixin')) {
					            uni.login({
					             provider: 'weixin',
					              success: function (loginRes) {
					                console.log(loginRes);
					                // 获取用户信息
					                uni.getUserInfo({
					                 provider: 'weixin',
					                  success: function (infoRes) {
					                    console.log(infoRes);
					                  }
					                });
					              }
					            });
					        }
					    }
					});

					// var it=this;
					// var  getAppid = plus.runtime.appid;
					// console.log('app端登陆')
					// uni.login({
					//   provider: 'weixin',
					//   success: function (loginRes) {
					// 	console.log(JSON.stringify(loginRes.authResult));
					// 	uni.showModal({
					// 		content: JSON.stringify(loginRes.authResult),
					// 		cancelText: "我再想想",
					// 		cancelColor: "#999",
					// 		confirmText: "转让",
					// 		confirmColor: "#DEC17C",
					// 		success: function(res) {
								
					// 		}
					// 	})
					//   }
					// });
					// var weixinService = null;
					// // http://www.html5plus.org/doc/zh_cn/oauth.html#plus.oauth.getServices
					// plus.oauth.getServices(function(services) {
					// 	console.log(312589340656548)
					// 	console.log(services)
					// 	if (services && services.length) {
					// 		for (var i = 0, len = services.length; i < len; i++) {
					// 			if (services[i].id === 'weixin') {
					// 				weixinService = services[i];
					// 				console.log('授权对象')
					// 				console.log(weixinService)
					// 				break;
					// 			}
					// 		}
					// 		if (!weixinService) {
					// 			console.log('没有微信登录授权服务');
					// 			return;
					// 		}
					// 		// http://www.html5plus.org/doc/zh_cn/oauth.html#plus.oauth.AuthService.authorize
					// 		weixinService.authorize(function(event) {  //此处获取code的关键
					// 		alert(JSON.stringify(event))
					// 			console.log(event)
					// 			console.log(event.code,'这次是真的授权后返回的code')
					// 			it.weixinCode = event.code; //用户换取 access_token 的 code
					// 			// it.requestLogin();
					// 			let data={code: it.weixinCode};
					// 			it.$api.user.login.getWeiXinCode(data).then(function(userInfo) {
					// 				console.log('是否走到这里')
					// 					console.log('第三方登录授权',it.weixinCode)
					// 					console.log('第三方登录授权1111',userInfo)
										
					// 					uni.navigateBack()
					// 				}).catch(res => {
					// 				console.log(res)        
					// 					});
								
					// 		}, function(error) {
					// 			console.error('authorize fail:' + JSON.stringify(error));
					// 		}, {
					// 			// http://www.html5plus.org/doc/zh_cn/oauth.html#plus.oauth.AuthOptions
					// 			appid: getAppid, //开放平台的应用标识。暂时填个假的充数，仅做演示。
					// 		});
					// 	} else {
					// 		console.log('无可用的登录授权服务');
					// 	}
					// }, function(error) {
					// 	console.error('getServices fail:' + JSON.stringify(error));
					// });
					 
					// #endif
					// #ifdef H5
					uni.showToast({
						title: "暂不支持该方式",
						icon: "none",
						duration: 2000
					});
					// #endif
				}else{
					this.logintype=!this.logintype;
					if(!this.logintype){
						this.pwd=""
					}
				}
			},
			//获取验证码
			getCode() {
				if (valPhone(this.tel)) {
					if (!this.has_click) {
						this.sendCode();
					}
				}
			},
			async sendCode() {
				let result = await post("Login/GetLoginSMSCode?mobile="+this.tel);
				if (result.code === 0) {
					this.has_click = true;
					const TIME_COUNT = 90; // 90s后重新获取验证码
					this.count = TIME_COUNT;
					uni.showToast({
						title: "发送成功，请注意查收!",
						icon: "none",
						duration: 2000
					});
					this.timer = setInterval(() => {
						if (this.count > 0 && this.count <= TIME_COUNT) {
							this.count--;
							this.codeMsg = this.count + "s后重新获取";
						} else {
							clearInterval(this.timer);
							this.timer = null;
							this.codeMsg = "获取验证码";
							this.has_click=false;
						}
					}, 1000);
			
				} else {
					this.has_click = false;
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
				}
			},
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
					if (!this.isAgree) {
						uni.showToast({
							title: "请勾选同意用户协议!",
							icon: "none",
							duration: 2000
						});
						return false;
					}
				}
				return true;
			},
			btnSubmit() {
				if(valPhone(this.tel) && this.valOther()){
					this.login();
				}
			},
			async login(){
				let result;
				if(this.logintype){
					result = await post("Login/LoginByMobile",{
						"mobile": this.tel,
					    "password": this.pwd
					})
				}else{
					result = await post("Login/RegisterLogin",{
						"mobile": this.tel,
					    "yzcode": this.code,
						"InviteCode":this.inviteCode
					})
				}
				if(result.code===0){
					const data = result.data;
					uni.setStorageSync('token', data.Token);
					uni.setStorageSync('userId', data.UserId);
					uni.setStorageSync('myInviteCode', data.ReferralCode);//邀请码
					//认证
					uni.setStorageSync('attestation', {
						IsDancer:data.IsDancer,//舞者
						IsOrganization:data.IsOrganization,//机构
						IsShop:data.IsShop//店铺
					});
					let _this = this;
					uni.showToast({
					     title: "登录成功",
					     duration: 1800,
						 success:function(){
							 //#ifdef H5
							 uni.showModal({
							 	title:"温馨提示",
							 	content: "更多功能体验尽在壹舞APP",
								confirmText:"下载APP",
								cancelText:"逛逛别的",
								confirmColor:"#DD196D",
								cancelColor:"#999999",
							 	success(res) {
							 		if (res.confirm) {
							 			uni.navigateTo({
							 			  url: "/pages/dowmApp/dowmApp"
							 			});
							 		} else if (res.cancel) {
										if(_this.isRegister){
											uni.switchTab({
												url: "/pages/tabBar/my/my"
											  });	
										}else{
											uni.navigateBack();
										}
							 		}
							 	}
							 });
							 //#endif
							 //#ifndef H5
							setTimeout(function() {
								if(_this.isRegister){
									uni.switchTab({
										url: "/pages/tabBar/my/my"
									  });	
								}else{
									uni.navigateBack();
								}
							 }, 1800);
							 //#endif
						 }
					});
					console.log(result.data);
				}else{
					uni.showToast({
					  title: result.msg,
					  icon: "none",
					  duration: 2000
					});
				}
			},
			// 小程序登录
			async MPlogin(code, iv, encryptedData,userInfo){
				let _this=this;
				let result=await post("Login/SignIn_New",{
					iv:iv,
					code:code,
					encryptedData:encryptedData
				})
				console.log(result)
				uni.setStorageSync("unionid", result.data.unionid);
				uni.setStorageSync("token", result.data.Token);
				uni.setStorageSync("userId", result.data.UserId);
				uni.setStorageSync("openId", result.data.openId);
				//console.log(result.data,"mmmmmmmmmmmm")
				if(result.code===0){
					let _this = this;
					uni.showToast({
					  title: "登录成功!",
					  icon: "none",
					  duration: 1500,
					  success:function(){
						setTimeout(function() {
							if(_this.isRegister){
								uni.switchTab({
									url: "/pages/tabBar/my/my"
								  });	
							}else{
								uni.navigateBack();
							}
						 }, 1500);
					  }
					});
				}else if (result.code === 2) {
					uni.showToast({
					  title: result.msg,
					  icon: "none",
					  duration: 2000
					});
					this.isband=true;
					this.jsonARR={
						openId:result.data.openId,
						unionid:result.data.unionid,
						userInfo:userInfo,
						session_key:result.data.session_key,
						InviteCode:_this.inviteCode
					}
					// uni.showToast({
					// 	title: result.msg,
					// 	icon: 'none',
					// 	duration: 1500,
					// 	success: function() {
					// 		setTimeout(function() {
					// 			wx.redirectTo({
					// 				url: '/pages/register/register?type=1'
					// 			})
					// 		}, 1500);
					// 	}
					// })
				}
				else{
					uni.showToast({
					  title: result.msg,
					  icon: "none",
					  duration: 2000
					});
				}
			},
			oauth(){
				uni.login({
					success:(res)=>{
						console.log(res)
						 uni.getUserInfo({
						    success: (infoRes) => {
						        /**
						         * 实际开发中，获取用户信息后，需要将信息上报至服务端。
						         * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
						         */
								uni.setStorageSync("userInfo", infoRes.userInfo);
								uni.setStorageSync("avatarUrl", infoRes.userInfo.avatarUrl);
								this.MPlogin(res.code, infoRes.iv, infoRes.encryptedData,infoRes.userInfo);
						    }
						});
					},
					fail: (err) => {
					    console.error('授权登录失败：' + JSON.stringify(err));
					}
				})
			},
			async bandPhoneNumber(json){
				let result=await post("Login/getPhoneNumber",json)
				if(result.code==0){
					console.log(result)
					uni.setStorageSync("token", result.data.Token);
					uni.setStorageSync("userId", result.data.UserId);
					let _this = this;
					uni.showToast({
					  title: "登录成功!",
					  icon: "none",
					  duration: 1500,
					  success:function(){
						setTimeout(function() {
							if(_this.isRegister){
								uni.switchTab({
									url: "/pages/tabBar/my/my"
								  });	
							}else{
								uni.navigateBack();
							}
						 }, 1500);
					  }
					});
				}
			},
			
			//微信跳转登录
			loginTel(){
				this.isShowminiApp=false;
				// setTimeout(()=>{
				this.isShowMolie=true;
				// },5)
				
			},
			//注册
			register(){
				uni.navigateTo({
					url: '/pages/register/register'
				})
			},
			//忘记密码
			getPassword(){
				uni.navigateTo({
					url: '/pages/getPassword/getPassword'
				})
			},
			toback(){
				if(this.isIndex){
					uni.switchTab({
						url:"/pages/tabBar/index/index"
					})
				}else if(this.isRegister){
					uni.switchTab({
						url: "/pages/tabBar/my/my"
					});
				}else{
					uni.navigateBack();
				}
			}
		}
	}
</script>
<style>
	@import '../../common/login.css';
	.logo {
		padding: 0 0 80upx;
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
	  background:#fff;
	  background-size: 100% 100%;
	  min-height: 100vh;
	  position: relative;
	  box-sizing: border-box;
  }
  .regLoginBox{
	  width: 90%;
	  position: absolute;
	  top: 50%;
	  left: 5%;
	  transform: translateY(-50%);
	  border-radius: 20rpx;
	  box-sizing: border-box;
  }
  .from-line{
	  background: #fff;
	  border-radius: 40rpx;
  }
  .nav {
  	height: 88upx;
  	width: 710upx;
  	padding: 0 20upx;
  	display: flex;
  	justify-content: space-between;
  	align-items: center;
  	position: fixed;
  	top: 0;
  	z-index: 12;
  	box-sizing: content-box;
  	background: #ffffff!important;
  }
  .back {
  	width: 35rpx;
  	height: 50rpx;
  }
  .mine {
  	font-size: 32rpx;
  	font-family: PingFang;
  	font-weight: 700;
  	color: #000;
  }
</style>
