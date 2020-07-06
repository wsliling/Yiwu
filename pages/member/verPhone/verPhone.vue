<template>
	<view>
		<block v-if="step===1">
			<div class="plr30 protophone pl30">向{{protoPhone}}手机号发送验证码</div>
			<view class="item bg_fff flex flexAlignCenter justifyContentBetween mt2">
				<input type="text" placeholder="请输入验证码" class="flex1 font26" v-model="protoPhoneCode">
				<text class="color_red" @click="sendCode(0)">{{codeMsg}}</text>
			</view>
		</block>
		<block v-else>
			<view class="item bg_fff flex flexAlignCenter justifyContentBetween mt2">
				<input type="text" placeholder="请输入手机号" class="flex1 font26" v-model="phone">
			</view>
			<view class="item bg_fff flex flexAlignCenter justifyContentBetween">
				<input type="text" placeholder="请输入验证码" class="flex1 font26" v-model="phoneCode">
				<text class="color_red" @click="bindSendCode(1)">{{codeMsg}}</text>
			</view>
		</block>
		<view class="btn_fix" @click="submit">{{step==1?'下一步':'确定'}}</view>
		<view class="tip color_gray pw3">
			<view>温馨提示:</view>
			<view class="mt2">
				1、为保障你的帐号安全，变更重要信息需要身份验证。
				2、绑定过程中有疑问请联系在线客服。
				3、更改绑定手机，如原手机号停用无法
			</view>
		</view>
	</view>
</template>

<script>
import {post,get,valPhone,toast,navigateBack} from '@/common/util.js';
export default {
	data(){
		return{
			userId:'',
			token:'',
			step:1,
			codeMsg:'获取验证码',
			count: "",
			TIME_COUNT:60,// 60s后重新获取验证码
			protoPhone:'',
			protoPhoneCode:'',
			phone:'',
			phoneCode:'',
		}
	},
	onLoad(e) {
		console.log(e)
		this.protoPhone = e.Mobile
	},
	onShow(){
		this.userId = uni.getStorageSync("userId");
		this.token = uni.getStorageSync("token");
		this.getProtoPhone();
		if(this.timer){
			clearInterval(this.timer);
		}
	},
	methods:{
		// 第一步验证本手机获取验证码
		async sendCode(type){
			if(this.timer)return;
			const res = await post('User/GetUpdatePswCode',{
				UserId:this.userId,
				Token:this.token,
				Mobile:this.protoPhone,
				Type:2,
			})
			if(res.code == 0){
				this.has_click = true;
				this.count = this.TIME_COUNT;
				toast('发送成功，请注意查收!')
				clearInterval(this.timer);
				this.timer = setInterval(() => {
					if (this.count > 0 && this.count <= this.TIME_COUNT) {
						this.count--;
						this.codeMsg = this.count + "s后重新获取";
					} else {
						this.has_click = false;
						clearInterval(this.timer);
						this.timer = null;
						this.codeMsg = "获取验证码";
					}
				}, 1000);
			}
		},
		// 第二步发送验证码
		async bindSendCode(){
			if(this.timer)return;
			if(!valPhone(this.phone)) return;
			if(this.phone==this.protophone){
				toast('请填写新的手机号');return;
			}
			const res = await post('User/GetBindTelCode',{
				UserId:this.userId,
				Token:this.token,
				Mobile:this.phone,
				Type:1,  //0-绑定手机号,1-手机号修改
			})
			if(res.code == 0){
				this.has_click = true;
				this.count = this.TIME_COUNT;
				toast('发送成功，请注意查收!')
				clearInterval(this.timer);
				this.timer = setInterval(() => {
					if (this.count > 0 && this.count <= this.TIME_COUNT) {
						this.count--;
						this.codeMsg = this.count + "s后重新获取";
					} else {
						this.has_click = false;
						clearInterval(this.timer);
						this.timer = null;
						this.codeMsg = "获取验证码";
					}
				}, 1000);
			}
		},
		async submit(){
				// 第一步
				if(this.step===1){
					if(!this.protoPhoneCode){toast('请输入验证码');return;}
				if(this.phone==this.protophone){
					toast('请填写新的手机号');return;
				}
				const res  = await post('User/MobileVlidate',{
					UserId:this.userId,
					Token:this.token,
					Mobile:this.protoPhone,
					VerifyCode:this.protoPhoneCode
				}).then( res=>{
					if(res.code == 0){
						this.has_click = false;
						clearInterval(this.timer);
						this.timer = null;
						this.codeMsg = "获取验证码";
						this.step=2;
					}else {
						toast(res.msg,{icon:none});
					}
				})
			}
			// 第二部
			else{
				if(!valPhone(this.phone)) return;
				if(!this.phoneCode){toast('请输入验证码');return;}
				const res = await post('User/UpdateMobile',{
					UserId:this.userId,
					Token:this.token,
					Mobile:this.phone,
					VerifyCode:this.phoneCode,
					Type:1, 
				}).then(res=>{
					if(res.code == 0){
						toast('修改成功',{icon:true});
						setTimeout( ()=>{
							uni.navigateBack({
							    delta: 2
							});
						},1000)
					} else {
						toast(res.msg,{icon:none});
					}
				})
			}
		}
	}
}
</script>

<style lang="scss">
	@import './style';
	.protophone{
		color:#999;
		line-height:2;
	}
</style>
