<template>
	<view>
		<view class="uni-bg-white">
			<view class="proInfo flex pp3" v-if="proType==0">
				<view class="imgbox">
					<image src="/static/music/music-item.png" mode="widthFix"></image>
				</view>
				<view class="txtbox flex1">
					<view class="name uni-ellipsis2">
						拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞
					</view>
					<view class="price c_theme">
						<text class="fz12">￥</text>16.80(需要1680积分)
					</view>
				</view>
			</view>
			<view class="proInfo1 flex-between pp3" v-if="proType==1">
				<view class="imgbox">
					<image src="/static/default_music.png" mode="widthFix"></image>
				</view>
				<view class="txtbox flex1 flex-between">
					<view class="name uni-ellipsis flex1">
						拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞拉丁舞
					</view>
					<view class="price c_theme flex-column">
						<text>
							<text class="fz12">￥</text>16.80
						</text>
						<text class="fz12">(需要1680积分)</text>
					</view>
				</view>
			</view>
			<view class="pay-hd pd15">付款方式</view>
			<view class="pay-bd line-list payMethods__modal">
				<block v-for="(item,index) in payway" :key="index"> 
					<view class="line-item flex-between" @click="tabBtn(item.Id)">
					  <view class="item-l flex-start">
						<image class="iconimg" :src="item.iconimg" mode="widthFix"></image>
						<view class="txt">{{item.name}}</view>
					  </view>
					  <view class="item-r">
						<view :class="['uni-icon',payType==item.Id?'uni-icon-checkbox-filled':'uni-icon-checkbox']"></view>
					  </view>
					</view>
				</block>
			</view>
		</view>
		<view style="height: 110upx;"></view>
		<view class="fixedbtn" style="background: #f8f8f8;">
			<view class="btn">确认支付</view>
		</view>
	</view>
</template>

<script>
	import { post, get } from '@/common/util.js';
	export default {
		data() {
			return {
				userId: "",
				token: "",
				proType:0,//0课程，1舞曲
				payType:0, //0微信支付
				payway:[
				// #ifdef APP-PLUS||H5	
				{
					Id:1,
					iconimg:'/static/pay_alipay.png',
					name:"支付宝"
				}
				// #endif
				,{
					type:0,
					iconimg:'/static/pay_weixin.png',
					name:"微信"
				},
				{
					Id:2,
					iconimg:'/static/pay_yue.png',
					name:"余额"
				},
				{
					Id:3,
					iconimg:'/static/pay_jf.png',
					name:"积分"
				}],
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.proType=this.$mp.query.type;
		},
		methods: {
			tabBtn(index){
				this.payType=index;
			},
		}
	}
</script>

<style lang="scss">
	.proInfo{
		.imgbox{
			width: 180upx;
			height: 180upx;
			border-radius: 12upx;
			overflow: hidden;
			margin-right: 20upx;
		}
		.txtbox{
			justify-content: space-between;
			.price{
				font-size: 32upx;
				margin-top: 20upx;
			}
		}
	}
	.proInfo1{
		.imgbox{
			width: 84upx;
			height: 84upx;
			border-radius: 10upx;
			overflow: hidden;
			margin-right: 20upx;
		}
		.txtbox{
			justify-content: space-between;
			.price{
				font-size: 32upx;
				margin-top: 20upx;
				align-items: flex-end;
			}
		}
	}
	.pay-hd{ font-size: 32upx; font-weight: 600}
</style>
