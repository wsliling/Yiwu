<template>
	<view>
		<view class="head">
			<view :style="{height:barHeight+'px'}"></view>
			<view class="tab_head flex-between">
				<view class="head_l" @click="backUrl">
					<text class="uni-icon uni-icon-arrowleft"></text>
				</view>
				<view class="tabList flex p_re">
					<view v-for="(item,index) in tabList" :key="index" class="item" :class="{'active':item.id==tabIndex}"  @click="cliTab(item.id)">{{item.name}}</view>
					<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
				</view>
				<view class="head_r"> </view>
			</view>
		</view>
		<view :style="{height:(44+barHeight)+'px'}"></view>
		<view class="Yi-Userlist bg_fff" v-if="hasData">
			<view class="user-item" v-for="(item,index) in 10" :key="index">
				<view class="flex-between">
					<view class="author flex-start">
						<view class="tx"><image src="/static/default.png" mode="aspectFill"></image></view>
						<view class="info">
							<view class="name uni-ellipsis">会飞的象</view>
							<view class="fz12 c_999">慈悲如月，温暖如阳</view>
						</view>
					</view>
					<view class="flow active">已关注</view>
				</view>
			</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow"></noData>
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
				barHeight:0,
				tabList:[{id:0,name:'粉丝'},{id:1,name:'被赞'},{id:2,name:'关注'}],
				tabIndex:0,
				page:1,
				pageSize:12,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: true,
				noDataIsShow: false,
			}
		},
		computed: {
		   tabStyle(){
		     return ((470/this.tabList.length)*this.tabIndex)+(((470/this.tabList.length)-80)/2)
		   }
		 },
		 onLoad() {
		 	// #ifdef APP-PLUS
		 	this.barHeight = plus.navigator.getStatusbarHeight();
		 	// #endif
		 },
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.tabIndex = this.$mp.query.type;
			
		},
		methods: {
			backUrl(){
				uni.navigateBack()
			},
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
