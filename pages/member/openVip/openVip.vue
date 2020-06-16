<template>
	<view>
		<view class="topbox">
			<view class="userbox flex-start">
				<view class="tx">
					<image src="/static/my/user.png" mode="widthFix"></image>
				</view>
				<view class="info">
					<view class="name uni-ellipsis">ladingwu</view>
					<view class="txt">
						开通后  立享特权
					</view>
				</view>
			</view>
			<view class="icon-menu">
				 <view class="item">
					 <image class="icon" src="/static/my/v1.png"></image>
					 <text class="txt">开直播</text>
				 </view>
				 <view class="item">
					 <image class="icon" src="/static/my/v2.png"></image>
					 <text class="txt">开课程</text>
				 </view>
				 <view class="item">
					<image class="icon" src="/static/my/v3.png"></image>
					<text class="txt">上传舞曲</text>
				 </view>
				 <view class="item">
					 <image class="icon" src="/static/my/v4.png"></image>
					 <text class="txt">优先权</text>
				 </view>
			</view>
		</view>
		<view class="mainbox">
			<view class="pricelist flex-center">
				<view class="item flex-column active">
					<view class="txt_1">
						<text class="yuan">￥</text>248
					</view>
					<view class="txt_2">包月</view>
				</view>
				<view class="item flex-column">
					<view class="txt_1">
						<text class="yuan">￥</text>499
					</view>
					<view class="txt_2">包年</view>
				</view>
			</view>
			<view class="btn_open flex-column uni-bold" @click="VipOrder">
				立即开通
			</view>
		</view>
		<!--放弃付款弹窗 -->
		<view class="backout" v-if="showgetout">
			<view class="backbox">
				<view class="backtxt">你的订单尚未付款成功，确认要暂时退出放弃付款吗？</view>
				<view class="select">
					<view @click="getout">放弃付款</view>
					<view class="keep" @click="togglePopup('mask-pay')">继续付款</view>
				</view>
			</view>
		</view>
		<!-- 支付弹窗 -->
		<uni-popup mode="fixed" :show="type === 'mask-pay'" :h5Top="true" position="bottom" @hidePopup="togglePopup('')">
			<view class="uni-modal payMethods__modal">
				<view class="uni-modal__hd pd15 text_left">支付方式</view>
				<view class="uni-modal__bd">
					<view class="line-list">
						<view class="line-item" v-for="(item,index) in payType" :key="index" @click="shiftPayMethods(item.Id)">
							<view class="line-item-l flex-start">
								<image class="iconimg" :src="item.iconimg" mode="widthFix"></image>
								<text class="txt">{{item.name}}</text>
							</view>
							<view :class="['uni-icon',payTypeIndex==item.Id?'uni-icon-checkbox-filled':'uni-icon-checkbox']"></view>
						</view>
					</view>
					<view class="btn" @click="surePop">确认支付</view>
				</view>
			</view>
		</uni-popup>
		<pay v-on:hidePay="hidePay" v-on:getPassword="getPassword" v-if="showPay" :allprice="totalprice"></pay>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import uniPopup from '@/components/uni-popup.vue';
	import pay from '@/components/pay.vue';
	export default {
		components: {
			uniPopup,pay
		},
		onLoad(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		onShow(){
			
		},
		data() {
			return {
				userId: "",
				token: "",
				showgetout: false, //显示放弃付款弹窗
				showPay:false,//支付密码弹框
				totalprice:0,//需支付的价格
				type: "",
				payTypeIndex: 0,
				payType:[
					{
						Id:0,
						iconimg:'/static/pay_alipay.png',
						name:"支付宝"
					},
					{
						Id:1,
						iconimg:'/static/pay_weixin.png',
						name:"微信"
					},
					{
						Id:2,
						iconimg:'/static/pay_yue.png',
						name:"余额"
					}
				]
			}
		},
		methods: {
			togglePopup(type) {
				this.showgetout=false;
				this.type=type;
				if (type == "") {
					this.showgetout = true;
					this.type="";
				}
			},
			//接收支付密码
			getPassword(Password){
				this.showgetout = false;
				this.ConfirmPay(Password);
			},
			//关闭支付密码弹窗
			hidePay(e){
				this.showPay=false;
				if(e==0){
					this.showgetout = false;
				}else{
					this.showgetout = true;
				}
			},
			//余额支付
			async ConfirmPay(Password){
				
			},
			//订单创建
			async VipOrder(){
				this.type = "mask-pay";
			},
			shiftPayMethods(index) {
				this.payTypeIndex = index;
			},
			getout(){
				this.showgetout = false;
			},
			//确认支付
			surePop(){
				if(this.payTypeIndex==0){
					
				}else if(this.payTypeIndex==1){
					
				}else if(this.payTypeIndex==2){//余额
					this.type = "";
					this.showPay=true;
				}
			}
			
		}
	}
</script>

<style lang="scss" scoped>
 @import './style';
 page{ 
	 background: #fff;
 }
</style>
