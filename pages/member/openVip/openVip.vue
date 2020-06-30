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
			<view class="pricelist flex-center" v-if="data.length">
				<view class="item flex-column" :class="{'active':setmeal==item.Id}" 
					v-for="(item,index) in data" :key="index"
					@click="setmeal = item.Id"
					>
					<view class="txt_1">
						<text class="yuan">￥</text>{{item.PlusPrice}}
					</view>
					<view class="txt_2">{{item.PlusTitle}}</view>
				</view>
			</view>
			<view class="btn_open flex-column uni-bold" @click="VipOrder">
				立即开通
			</view>
		</view>
		<!--放弃付款弹窗 -->
		<!-- <view class="backout" v-if="showgetout">
			<view class="backbox">
				<view class="backtxt">你的订单尚未付款成功，确认要暂时退出放弃付款吗？</view>
				<view class="select">
					<view @click="getout">放弃付款</view>
					<view class="keep" @click="togglePopup('mask-pay')">继续付款</view>
				</view>
			</view>
		</view> -->
		<!-- 支付弹窗 -->
		<uni-popup type="bottom" ref="payWin">
			<pay :total="totalprice" @onClose="$refs.payWin.close()" @success="paySuccess" 
			:orderNumber="orderNo" :payMode="['wx','alipay','balance']"></pay>
		</uni-popup>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import pay from '@/components/pay.vue';
	import {payFn} from './payvip';
	export default {
		components: {
			pay
		},
		data() {
			return {
				userId: "",
				token: "",
				totalprice:0,//需支付的价格
				payTypeIndex: 0,
				data:[],
				setmeal:'',
				orderNo:'',
			}
		},
		onLoad(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.getData();
		},
		onShow(){
			
		},
		methods: {
			async getData(){
				const res = await post('User/GetPlusMemberList',{
					UserId:this.userId,
					Token:this.token
				})
				if(res.code)return;
				this.setmeal = res.data[0].Id;
				this.data = res.data;
			},
			//接收支付密码
			getPassword(Password){
				this.showgetout = false;
				this.ConfirmPay(Password);
			},
			//余额支付
			async ConfirmPay(Password){
				
			},
			//打开支付窗口
			async VipOrder(){
				this.data.map(item=>{
					if(item.Id===this.setmeal){
						this.totalprice = item.PlusPrice;
					}
				})
				this.$refs.payWin.open();
			},
			shiftPayMethods(index) {
				this.payTypeIndex = index;
			},
			getout(){
				this.showgetout = false;
			},
			//确认支付
			async paySuccess(e,payPassword){
				
				//e.id= 0--微信支付.1--余额支付,2--支付宝
				const res = await post('User/PlusBuyOrder',{
					UserId:this.userId,
					Token:this.token,
					PlusId:this.setmeal
				})
				const data= res.data;
				this.orderNo =data.plusNo;
				payFn(e,{
					orderNo:data.plusNo,
					TotalPrice:this.totalprice,
					payPassword
				})
				// if(e.payType==0){
					
				// }else if(e.payType==2){
					
				// }else if(e.payType==1){//余额
				// 	const password = e.password;
				// }
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
