<template>
	<view>
		<view class="bg_fff tabList flex p_re">
			<view v-for="(item,index) in tabList" :key="index" class="item" :class="{'active':item.id==tabIndex}"  @click="cliTab(item.id)">{{item.name}}</view>
			<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
		</view>
		<view style="height: 80upx;"></view>
		<view class="list pp3">
			<view class="order_item bg_fff" v-for="(item,index) in 5" :key="index">
				<view class="flex-between">
					<view class="shopbox flex-start">
						<view class="iconfont icon-dianpu"></view>
						<text class="shopName uni-ellipsis">炫宝迪旗舰店</text>
						<view class="iconfont icon-arrow_r"></view>
					</view>
					<view class="color_red font26">待付款</view>
				</view>
				<view class="flex-between mt2" v-for="(ite, ind) in 2" :key="ind">
					<image src="/static/music/music-item.png" mode="aspectFit" class="img mr2"></image>
					<view class="flex1 order_info">
						<view class="proname uni-ellipsis2">拉丁舞服拉丁舞服拉丁</view> 
						<view class="c_999 font18">黑色</view> 
						<view class="flex-between mt1">
							<text class="c_999">x1</text>
							<text>¥6800</text>
						</view>
					</view>
				</view>
				<view class="text_right mt2">总计：¥<span class="font32 uni-bold">6800</span></view>
				<view class="btns flex-end">
					<view class="btn">取消订单</view>
					<view class="btn bg_red">立即支付</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {host,post,get,toLogin} from '@/common/util.js';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue';
	export default {
		components: {
			noData,
			uniLoadMore
		},
		data() {
			return {
				userId: "",
				token: "",
				tabList:[{id:0,name:'全部'},{id:1,name:'待付款'},{id:2,name:'待发货'},{id:3,name:'待收货'},{id:4,name:'待评价'}],
				tabIndex:0,
			}
		},
		computed: {
		   tabStyle(){
		     return ((750/this.tabList.length)*this.tabIndex)+(((750/this.tabList.length)-80)/2)
		   }
		 },
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		methods: {
			//跳转
			tolink(Url) {
				uni.navigateTo({
					url: Url
				})
			},
			cliTab(index){
			  this.tabIndex = index
			},
		}
	}
</script>

<style lang="scss">
	 @import './style'
</style>
