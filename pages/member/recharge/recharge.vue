<template>
	<view>
		<view class="uni-bg-white pp3">
			<view class="across">
				<view class="livebi flex-between" v-if="rechargeType == 2">
					<text>我的直播币:</text>
					<view class="right flex-end">
						{{ LiveStreamMoney || 0 }}
						<image class="icon" src="/static/my/jf.png" mode=""></image>
					</view>
				</view>
				<view class="withdraw">充值金额</view>
				<view class="drawing">
					<view class="sign">¥</view>
					<!-- #ifdef MP-WEIXIN -->
					<input
						class="sign signs"
						type="digit"
						v-model="money"
						placeholder="请输入要充值的金额"
						placeholder-style="font-size:30rpx;font-family:PingFang;font-weight:normal;"
					/>
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN -->
					<input class="sign signs" type="digit" v-model="money" placeholder="请输入要充值的金额" placeholder-class="sign2" />
					<!-- #endif -->
				</view>
			</view>
			<view class="carry">{{ rechargeType == 2 ? '一个直播币=1元钱' : '' }}</view>
			<view class="pay-hd uni-mb10">充值方式</view>
			<view class="pay-bd line-list payMethods__modal">
				<block v-for="(item, index) in payway" :key="index" v-if="rechargeType == 2 || item.Id == 1 || item.type == 0">
					<view class="line-item flex-between" @click="tabBtn(item.Id)">
						<view class="item-l flex-start">
							<image class="iconimg" :src="item.iconimg" mode="widthFix"></image>
							<view class="txt">{{ item.name }}</view>
						</view>
						<view class="item-r"><view :class="['uni-icon', payType == item.Id ? 'uni-icon-checkbox-filled' : 'uni-icon-checkbox']"></view></view>
					</view>
				</block>
			</view>
		</view>
		<view class="present"><view class="btn active" @click="Submit">确认充值</view></view>
		<!-- 支付宝H5表单 -->
		<view class="alipayfram" v-if="isshowalipay"><view id="alipayfram" v-html="alipayCon"></view></view>
		<pay v-on:hidePay="hidePay" v-on:getPassword="getPassword" @success="CourseBuy" v-if="showPay" :allprice="allprice"></pay>
	</view>
</template>

<script>
import { host, post, get, toLogin, getUrlParam } from '@/common/util.js';
import pay from '@/components/payPaw.vue';
export default {
	components: { pay },
	data() {
		return {
			userId: '',
			token: '',
			payway: [
				// #ifdef APP-PLUS||H5
				// {
				// 	Id:1,
				// 	iconimg:'/static/pay_alipay.png',
				// 	name:"支付宝"
				// },
				// #endif
				{
					Id: 0,
					type: 0,
					iconimg: '/static/pay_weixin.png',
					name: '微信'
				},
				{
					Id: 2,
					iconimg: '/static/pay_yue.png',
					name: '余额'
				}
			],
			rechargeType: 1, //1余额充值，2直播币充值
			payType: 0, //0微信支付
			money: '', //充值金额
			WxOpenid: '', //微信支付ID
			showPay: false, //支付密码弹框
			LiveStreamMoney: '', //直播币
			WxCode: '',
			isshowalipay: false,
			alipayCon: ''
		};
	},
	onLoad() {
		// #ifdef H5
		this.WxCode = getUrlParam('code');
		this.WxOpenid = uni.getStorageSync('openId');
		if (this.WxCode) {
			//首次跳转获取code地址都直接调起支付
			this.payweixin();
		}
		// #endif
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.rechargeType = this.$mp.query.type;
		if (this.rechargeType == 2) {
			uni.setNavigationBarTitle({
				title: '直播币充值'
			});
			this.getMyIncome();
		} else {
			uni.setNavigationBarTitle({
				title: '钱包充值'
			});
		}
		// #ifdef  MP-WEIXIN
		this.WxOpenid = uni.getStorageSync('openId');
		this.getcode();
		// #endif
		// #ifdef H5
		this.WxOpenid = uni.getStorageSync('openId');
		// #endif
	},
	methods: {
		// 判断浏览器环境
		isWeixin() {
			var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				return true;
			} else {
				return false;
			}
		},
		tabBtn(index) {
			console.log(index, 'index');
			this.payType = index;
			this.allprice = this.money;
		},
		Submit() {
			if (this.money > 0) {
				if (this.payType == 0) {
					// #ifdef  H5
					if (this.isWeixin()) {
						this.AddRecharge();
					} else {
						this.H5AddRecharge();
					}
					// #endif
					// #ifdef MP-WEIXIN
					this.ConfirmWeiXinSmallPay();
					// #endif
					// #ifdef APP-PLUS
					this.AppAddRecharge();
					// #endif
				} else if (this.payType == 1) {
					console.log(22);
					// #ifdef APP-PLUS
					this.AppAddRecharge();
					// #endif
					// #ifdef H5
					if (this.isWeixin()) {
						uni.showToast({
							title: '微信暂不支持支付宝支付，请在浏览器中打开！',
							icon: 'none',
							duration: 2500
						});
					} else {
						this.H5ZfbRecharge();
					}
					// #endif
				} else if (this.payType == 2) {
					//余额
					this.showPay = true;
				}
			} else {
				uni.showToast({
					title: '请输入充值金额',
					icon: 'none',
					duration: 1500
				});
			}
		},
		//app支付(payType:0 微信app 1：支付宝app)
		async AppAddRecharge() {
			// if (this.payType == 0) {
			// 	var apiUrl = 'Order/WechatPayCZYE';
			// 	var provider = 'wxpay';
			// } else if (this.payType == 1) {
			// 	var apiUrl = 'Order/AliPayCZYE';
			// 	var provider = 'alipay';
			// }
			if (this.rechargeType == 2) {
				var apiUrl = 'Order/WechatPayCZZBB';
				var provider = 'wxpay';
			}else{
				var apiUrl = 'Order/WechatPayCZYE';
				var provider = 'wxpay';
			}
			let result = await post(apiUrl, {
				UserId: this.userId,
				Token: this.token,
				RechargeAmount: this.money,
				paytype: 2
			});
			if (result.code == 0) {
				console.log(result.data);
				let _this = this;
				if (this.payType == 0) {
					var orderInfo = result.data.JsParam;
				} else if (this.payType == 1) {
					var orderInfo = result.data;
				}
				uni.requestPayment({
					provider: provider,
					orderInfo: orderInfo,
					success(res) {
						console.log(res);
						uni.showToast({
							title: '充值成功'
						});
						setTimeout(res => {
							uni.navigateBack({});
						}, 1500);
					},
					fail(err) {
						console.log(err);
						uni.showToast({
							title: '充值失败',
							icon: 'none'
						});
					}
				});
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 1500
				});
			}
		},
		//微信付款
		async AddRecharge() {
			let NewUrl = this.GetUrlRelativePath() + '/#/pages/tabBar/my/topup';
			let result = '';
			if (this.rechargeType == 2) {
				result = await post('Order/WechatPayCZZBB', {
					UserId: this.userId,
					Token: this.token,
					RechargeAmount: this.money,
					WxOpenid: this.WxOpenid,
					WxCode: this.WxCode,
					NewUrl: NewUrl,
					paytype: 0
				});
			}else{
				result = await post('Order/WechatPayCZYE', {
					UserId: this.userId,
					Token: this.token,
					RechargeAmount: this.money,
					WxOpenid: this.WxOpenid,
					WxCode: this.WxCode,
					NewUrl: NewUrl,
					paytype: 0
				});
			}
			if (result.code == 201) {
				window.location.href = result.data;
			} else if (result.code == 0) {
				uni.setStorageSync('openId', result.data.openid);
				this.WxOpenid = uni.getStorageSync('openId');
				if (this.WxOpenid != '' && this.WxOpenid != 'undefined') {
					this.WxCode = ''; //每次获取的code只能使用一次，有openid时用openid调起支付数据
				}
				this.callpay(result.data.JsParam);
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 1500
				});
			}
		},
		//非微信环境 使用微信支付H5
		async H5AddRecharge() {
			let NewUrl = this.GetUrlRelativePath() + '/#/pages/tabBar/my/wallet';
			let result = '';
			if (this.rechargeType == 2) {
				result = await post('Order/WechatPayCZZBB', {
					//直播币
					UserId: this.userId,
					Token: this.token,
					RechargeAmount: this.money,
					NewUrl: NewUrl,
					paytype: 3
				});
			} else {
				result = await post('Order/WechatPayCZYE', {
					//钱包充值
					UserId: this.userId,
					Token: this.token,
					RechargeAmount: this.money,
					NewUrl: NewUrl,
					paytype: 3
				});
			}
			if (result.code == 0) {
				window.location.href = result.data.mweb_url;
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 1500
				});
			}
		},
		//支付宝支付H5
		async H5ZfbRecharge() {
			let NewUrl = this.GetUrlRelativePath() + '/#/pages/tabBar/my/wallet';
			let result = await post('Order/AliPayCZYE', {
				UserId: this.userId,
				Token: this.token,
				RechargeAmount: this.money,
				NewUrl: NewUrl,
				QuitUrl: NewUrl,
				paytype: 3
			});
			if (result.code == 0) {
				this.isshowalipay = true;
				this.alipayCon = result.data;
				console.log(result.data);
				this.$nextTick().then(() => {
					document.forms['alipaysubmit'].submit();
				});
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none'
				});
			}
		},
		//小程序支付
		async ConfirmWeiXinSmallPay() {
			let result = '';
			if (this.rechargeType == 2) {
				result= await post("Order/WechatPayCZZBB",{
					WxCode: this.WxCode,
					UserId: this.userId,
					Token: this.token,
					RechargeAmount:this.money,
					WxOpenid:this.WxOpenid,
					paytype:4
				  });
			} else {
				result = await post('Order/WechatPayCZYE', {
					WxCode: this.WxCode,
					UserId: this.userId,
					Token: this.token,
					RechargeAmount: this.money,
					WxOpenid: this.WxOpenid,
					paytype: 4
				});
			}

			var payData = JSON.parse(result.data.JsParam);
			if (result.code === 0) {
				let _this = this;
				uni.requestPayment({
					timeStamp: payData.timeStamp,
					nonceStr: payData.nonceStr,
					package: payData.package,
					signType: payData.signType,
					paySign: payData.paySign,
					success(res) {
						uni.showToast({
							title: '充值成功'
						});
						setTimeout(res => {
							uni.navigateBack({});
						}, 1500);
					},
					fail(res) {}
				});
			}
		},
		callpay(param) {
			if (typeof WeixinJSBridge === 'undefined') {
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(), false);
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady());
					document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady());
				}
			} else {
				this.onBridgeReady(param);
			}
		},
		onBridgeReady(param) {
			var parameter = JSON.parse(param);
			WeixinJSBridge.invoke('getBrandWCPayRequest', parameter, function(res) {
				if (res.err_msg == 'get_brand_wcpay_request:ok') {
					// 使用以上方式判断前端返回,微信团队郑重提示：
					//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
					uni.showToast({
						title: '充值成功'
					});
					setTimeout(res => {
						uni.navigateBack({});
					}, 1500);
				} else {
					uni.showToast({
						title: '支付失败',
						icon: 'none',
						duration: 1500
					});
				}
			});
		},
		getcode() {
			let _this = this;
			uni.login({
				success: function(res) {
					if (res.code) {
						_this.WxCode = res.code;
					} else {
						console.log('登录失败！' + res.errMsg);
					}
				}
			});
		},
		//获取域名
		GetUrlRelativePath() {
			var urlStr = '';
			var url = document.location.toString();
			var arrUrl = url.split('//');
			var start = arrUrl[1].split('/');
			urlStr = arrUrl[0] + '//' + start[0];
			return urlStr;
		},
		//接收支付密码
		getPassword(Password) {
			console.log(Password, 'Password');
			this.CourseBuy(Password);
		},
		//关闭支付密码弹窗
		hidePay(e) {
			this.showPay = false;
		},
		//余额支付
		CourseBuy(e, Password) {
			post('Order/PayRechLiveStream', {
				UserId: this.userId,
				Token: this.token,
				RechargeAmount: this.money,
				Password: e
			}).then(res => {
				if (res.code === 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
					setTimeout( ()=> {
						this.getMyIncome();
					},1000)
					
				}
			});
		},
		// 获取直播币
		async getMyIncome() {
			let result = await post('User/GetMyIncome', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token')
			});
			if (result.code === 0) {
				this.LiveStreamMoney = result.data.LiveStreamMoney;
			}
		}
	}
};
</script>

<style scoped lang="scss">
.alipayfram {
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	background: #fff;
	z-index: 999;
}
.across {
	padding-bottom: 30rpx;
	border-bottom: 1px solid rgba(236, 236, 236, 1);
	.livebi {
		font-size: 30upx;
		.right {
			font-size: 32upx;
			.icon {
				width: 40upx;
				height: 40upx;
				margin-left: 10upx;
			}
		}
	}
	.drawing {
		display: flex;
		align-items: center;
	}
	.withdraw {
		font-size: 30rpx;
		font-family: PingFang;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 120rpx;
	}
	.sign {
		font-size: 35upx;
		font-family: PingFang;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
	}
	.sign2 {
		font-size: 30upx;
		font-family: PingFang;
		font-weight: normal;
		color: #999;
	}
	.signs {
		display: flex;
		padding: 0 20upx;
		height: 80upx;
		font-size: 50upx;
	}
}
.carry {
	font-size: 24rpx;
	font-family: PingFang;
	font-weight: 500;
	color: $primary;
	padding-top: 25rpx;
}
.present {
	padding: 100upx 30upx 0 30upx;
	.btn {
		width: 100%;
		height: 80upx;
		background: $primary;
		color: #fff;
		border-radius: 40upx;
		font-size: 32upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
.pay-hd {
	padding: 20upx 0 0;
	font-size: 32upx;
	font-weight: 600;
}
</style>
