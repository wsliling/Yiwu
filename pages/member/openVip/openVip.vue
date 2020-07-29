<template>
	<view>
		<view class="topbox">
			<view class="userbox flex-start">
				<view class="tx">
					<image src="http://yw.wtvxin.com/static/my/user.png" mode="aspectFill" v-if="!info.avatar"></image>
					<image :src="info.avatar" mode="aspectFill" v-else></image>
				</view>
				<view class="info">
					<view class="name uni-ellipsis">{{info.name||'用户名'}}</view>
					<view class="txt">
						开通后  立享特权
					</view>
					<view class="endTime" v-if="info.endTime">{{info.endTime}}&nbsp;到期</view>
				</view>
			</view>
			<view class="icon-menu">
				 <view class="item">
					 <image class="icon" src="http://yw.wtvxin.com/static/my/v1.png"></image>
					 <text class="txt">开直播</text>
				 </view>
				 <view class="item">
					 <image class="icon" src="http://yw.wtvxin.com/static/my/v2.png"></image>
					 <text class="txt">开课程</text>
				 </view>
				 <view class="item">
					<image class="icon" src="http://yw.wtvxin.com/static/my/v3.png"></image>
					<text class="txt">上传舞曲</text>
				 </view>
				 <view class="item">
					 <image class="icon" src="http://yw.wtvxin.com/static/my/v4.png"></image>
					 <text class="txt">优先权</text>
				 </view>
			</view>
		</view>
		<view class="mainbox">
			<view class="pricelist flex-center" v-if="data.length">
				<view class="item flex-column" :class="{'active':setmeal==item.Id}" v-for="(item,index) in data" :key="index" @click="chooseitem(item.Id)">
					<view class="txt_1">
						<text class="yuan">￥</text>{{item.PlusPrice}}
					</view>
					<view class="txt_2">{{item.PlusTitle}}</view>
				</view>
			</view>
			<view class="btn_open flex-column uni-bold" @click="VipOrder">
				{{info.isVIP?'立即续费':'立即开通'}}
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
			:orderNumber="orderNo" :payMode="['wx','balance']"></pay>
		</uni-popup>
	</view>
</template>

<script>
	import {post,get,toLogin,throttle, getUrlParam,isWeixin,GetUrlRelativePath} from '@/common/util.js';
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
				info:{},
			}
		},
		onLoad(option){
			console.log(option)
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.info ={
				avatar:option.avatar,
				name:option.name,
				endTime:option.endTime.slice(0,option.endTime.lastIndexOf(':')),
				isVIP:option.isVIP
			} 
			this.getData();
			// #ifdef H5
			this.WxCode=getUrlParam("code");
			this.WxOpenid = uni.getStorageSync("openId");
			if(this.WxCode){//首次跳转获取code地址都直接调起支付
				let orderNo=option.orderNo;
				this.payweixin(orderNo)
			}
			// #endif
		},
		onShow(){
			
		},
		methods: {
			chooseitem(id){
				this.setmeal=id
			},
			async getData(){
				const res = await post('User/GetPlusMemberList',{
					UserId:uni.getStorageSync("userId"),
					Token:uni.getStorageSync("token")
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
				throttle(()=>{
					this.data.map(item=>{
						if(item.Id===this.setmeal){
							this.totalprice = item.PlusPrice;
						}
					})
					this.$refs.payWin.open();
				},2000)
			},
			shiftPayMethods(index) {
				this.payTypeIndex = index;
			},
			getout(){
				this.showgetout = false;
			},
			//确认支付
			async paySuccess(e,payPassword){console.log(111)
				
				//e.id= 0--微信支付.1--余额支付,2--支付宝
				const res = await post('User/PlusBuyOrder',{
					UserId:this.userId,
					Token:this.token,
					PlusId:this.setmeal
				})
				const data= res.data;
				this.orderNo =data.plusNo;
				// #ifdef H5
				if(e.id==0){
					this.payweixin(this.orderNo)
				}else{
					payFn(e,{
						orderNo:data.plusNo,
						TotalPrice:this.totalprice,
						payPassword
					})
				}
				// #endif
				// #ifndef H5
				payFn(e,{
					orderNo:data.plusNo,
					TotalPrice:this.totalprice,
					payPassword
				})
				// #endif
				// if(e.payType==0){
					
				// }else if(e.payType==2){
					
				// }else if(e.payType==1){//余额
				// 	const password = e.password;
				// }
			},
			//微信公众号支付  微信自带浏览器的h5支付
			async payweixin(orderNo) {
			    let NewUrl=GetUrlRelativePath() +'/#/pages/member/openVip/openVip?orderNo='+orderNo+'&avatar='+this.info.avatar+'&name='+this.info.name+'&endTime='+this.info.endTime+'&isVIP='+this.info.isVIP;
			    let result = await post("User/WeiXinPlus", {
			        UserId: uni.getStorageSync('userId'),
			        Token: uni.getStorageSync('token'),
			        orderNo:orderNo,
			        NewUrl:NewUrl,//支付后的回调地址
			        WxCode:this.WxCode,
			        WxOpenid:this.WxOpenid,
			        paytype:0
			    })
			    if (result.code == 201) { //检测不到openid需要进行微信授权
			        window.location.href=result.data;
			    }else if(result.code == 0){console.log(result.data)
			        uni.setStorageSync('openId', result.data.openid);
			        this.WxOpenid = uni.getStorageSync("openId");
			        if(this.WxOpenid!=""&&this.WxOpenid!="undefined"){
			            this.WxCode="";//每次获取的code只能使用一次，有openid时用openid调起支付数据
			        }
			        this.callpay(result.data.JsParam);
			    }else {
			        uni.showToast({
			            title: result.msg,
			            icon: "none",
			            duration: 1500
			        });
			    }
			},
			// GetUrlRelativePath() {
			// 	var urlStr = '';　　　　
			// 	var url = document.location.toString();　　　　
			// 	var arrUrl = url.split("//");　　　　
			// 	var start = arrUrl[1].split("/");
			// 	urlStr = arrUrl[0] + '//' + start[0];　　　　
			// 	return urlStr;　　
			// },
			//微信公众号支付
			callpay(param) {
				if(typeof WeixinJSBridge === 'undefined') {
					if(document.addEventListener) {
						document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(), false);
					} else if(document.attachEvent) {
						document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady());
						document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady());
					}
				} else {
					this.onBridgeReady(param);
				}
			},
			onBridgeReady(param){
				var _this=this;
				var parameter = JSON.parse(param);
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', parameter,
					function(res){
					if(res.err_msg == "get_brand_wcpay_request:ok" ){
					// 使用以上方式判断前端返回,微信团队郑重提示：
					//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
						setTimeout(()=>{
							uni.navigateBack();
						},1500)
					}else{
						uni.showToast({
							title: "支付失败",
							icon: "none",
							duration: 1500
						});
					} 
				}); 
			},
		}
	}
</script>
<style>
	page{
		 background: #fff;
	}
</style>
<style lang="scss" scoped>
 @import './style';
</style>
