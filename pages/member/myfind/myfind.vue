<template>
	<view>
		<view class="list uni-bg-white" v-if="hasData">
			<block v-for="(item,index) in findlist" :key="index">
				<media-list :datajson="item" Grid="2" :isdel="true" @click="goDetail" @previewImg="previewImg"></media-list>
			</block>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import mediaList from '@/components/mediaList.vue';//发现列表
	import uniPopup from '@/components/uni-popup.vue';
	export default {
		components: {
			noData,
			uniLoadMore,
			mediaList,
			uniPopup
		},
		data() {
			return {
				userId: "",
				token: "",
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				page: 1,
				pageSize: 8,
				findlist:[],
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.FindList()
		},
		methods: {
			/*获取动态列表*/
			async FindList() {
				let result = await post("Find/FindList", {
					"UserId": this.userId,
					"Token": this.token,
					"page": this.page,
					"pageSize": this.pageSize,
					"myType": 0,
					// "MemberId": "",
					// "SearchKey": ""
				});
				if (result.code === 0) {
					let _this=this;
					if (result.data.length > 0) {
						this.hasData = true;
						this.noDataIsShow = false;
						result.data.forEach(function(item) {
							item.Title=decodeURIComponent(item.Title);
						})
					}
					if (result.data.length == 0 && this.page == 1) {
						this.noDataIsShow = true;
						this.hasData = false;
					}
					if (this.page === 1) {
						this.findlist = result.data;
					}
					if (this.page > 1) {
						this.findlist = this.findlist.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.isLoad = false;
						this.loadingType = 2;
					} else {
						this.isLoad = true;
						this.loadingType = 0
					}
				}
			},
			//链接动态详情页
			goDetail(e) {
				uni.navigateTo({
					url:'/pages/replylist/replylist?id='+e.id
				})
			},
			//预览图片
			previewImg(obj){
				uni.previewImage({
					current:obj.imgurls[obj.index],
					urls: obj.imgurls,
					indicator:obj.imgurls.length
				});
			},
		},
		//上拉加载
		onReachBottom(){
			if (this.isLoad) {
				this.loadingType = 1;
				this.page++;
				this.FindList();
			} else {
				this.loadingType = 2;
			}
		},
	}
</script>

<style>

</style>
