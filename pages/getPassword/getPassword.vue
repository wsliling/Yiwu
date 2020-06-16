<template>
	<view class="content">
		<view class="regLoginBox" style="padding-top:30upx;">
			<view class="from pd10">
				<view class="from-line">
					<view class="iconfont icon-shouji"></view>
					<input type="text" class="ipt" v-model="PhoneNO" placeholder="请输入手机号码" />
				</view>
				<view class="from-line">
					<view class="iconfont icon-mima"></view>
					<input type="text" class="ipt" v-model="codeNo" placeholder="请输入验证码" />
					<button :class="['getcode',has_click?'disabled':'']" :disabled="has_click" @click="getcode">{{btnText}}</button>
				</view>
				<view class="from-line">
					<view class="iconfont icon-mima"></view>
					<input type="password" class="ipt" v-model="newPwd1" placeholder="请输入新密码" />
				</view>
				<view class="from-line">
					<view class="iconfont icon-mima"></view>
					<input type="password" class="ipt" v-model="newPwd2" placeholder="确认密码" />
				</view>
				<view class="ftbtn" style="padding:40upx 0 20upx 0;">
					<button type="primary" class="btn" @click="submit">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {post,get,valPhone} from '@/common/util.js';
	export default {
		onLoad() {
			
		},
		data() {
			return {
				PhoneNO:"",
				codeNo:"",
				newPwd1:"",//新密码
				newPwd2:"",//确认密码
				btnText:"获取验证码",
				timer : null,
				count:"",
				has_click: false,
			};
		},
		methods: {
			//获取验证码
			async GetForgetPswCode() {
				let result = await post("Login/FindPwdCode?mobile="+this.PhoneNO, {
				});
				if (result.code === 0) {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
					this.has_click = true;
					let TIME_COUNT = 60;
					if (!this.timer) {
						this.count = TIME_COUNT; 
						this.timer = setInterval(() => {
						if (this.count > 0 && this.count <= TIME_COUNT) {
						  this.count--;
						  this.btnText = this.count+"s后重新获取";
						  } else {
						  clearInterval(this.timer);
						  this.has_click = false;
						  this.timer = null;
						  this.btnText = "获取验证码";
						  }
						}, 1000)
					}
				} else if (result.code === 2) {
					
				} else {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
					this.has_click = false;
				}
			},
			//忘记密码找回
			async ForgetPassword() {
				let result = await post("Login/ChangeLoginPwd", {
					"mobile":this.PhoneNO,
					"yzcode":this.codeNo,
					"password":this.newPwd1
				});
				if (result.code === 0) {
					let _this=this;
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
					setTimeout(function() {
						uni.redirectTo({
							url: "/pages/login/login"
						})
					},2000)
				} else if (result.code === 2) {
					
				} else {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
				}
			},
			getcode(){
				if(valPhone(this.PhoneNO)) {
					this.GetForgetPswCode();
				}
			},
			//验证
			Verify(){
				if(valPhone(this.PhoneNO)==false){
					return false;
				}
				if(this.codeNo == ""){
					uni.showToast({
						title: "验证码不能为空！",
						icon: "none",
						duration: 2000
					});
					return false;
				}
				if(this.newPwd1 == ""||this.newPwd2 == ""){
					uni.showToast({
						title: "密码不能为空！",
						icon: "none",
						duration: 2000
					});
					return false;
				}
				if(this.newPwd1 !== this.newPwd2){
					uni.showToast({
						title: "两次输入的密码不相同",
						icon: "none",
						duration: 2000
					});
					return false;
				}
				if(this.newPwd1.length){
				    if(this.newPwd1.length < 6 || this.newPwd1.length > 18){
				        uni.showToast({
							title: "密码必须为6到18位",
							icon: "none",
							duration: 2000
				        });
						return false;
				    }
				}
				return true;
			},
			//提交
			submit(){
				if(this.Verify()){
					this.ForgetPassword();
				}
			}
		}
	}
</script>

<style>
	@import '../../common/login.css';
.content{
	height: 100%;
	background: #fff;
}
.from .from-line .getcode{font-size: 28upx;}
.from .from-line .getcode.disabled{ background: #ccc;}
</style>
