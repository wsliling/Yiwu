<template>
	<view class="bg_fff">
		<view class="head" :style="{'padding-top':barHeight+'px'}">
			<view class="search" @click="tolink('/pages/music/list/list?type=3')">
				<view class="seachbox">
					<text class="uni-icon uni-icon-search">请输入你想搜索的舞曲</text>
				</view>
			</view>
			<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index,tab.Id)">{{tab.TypeName}}</view>
				<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
			</scroll-view>
		</view>
		<view :style="{'height':(80+barHeight)+'px'}"></view>
		<view class="music-content" v-if="tabIndex==0">
			<!--轮播图-->
			<view class="index_swiper uni-mt10">
				<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
					<swiper-item v-for="(item,index) in banner" :key="index">
						<view class="swiper-item pd15">
							<image class="img" :src="item.Pic" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>
				<view class="dots">
					<view v-for="(item,index) in 3" :key="index" :class="['dot',currentSwiper==index?'active':'']"></view>
				</view>
			</view>
			<!-- 快捷导航 -->
			 <view class="icon-menu">
				 <view class="item" @click="tolink('/pages/music/list/list?type=0')">
					 <image class="icon" src="http://yw.wtvxin.com/static/music/icon15.png"></image>
					 <text class="txt">每日推荐</text>
				 </view>
				 <view class="item" @click="tolink('/pages/music/list/list?type=1')">
					 <image class="icon" src="http://yw.wtvxin.com/static/music/icon16.png"></image>
					 <text class="txt">最新推荐</text>
				 </view>
				 <view class="item" @click="tolink('/pages/music/list/list?type=2')">
					 <image class="icon" src="http://yw.wtvxin.com/static/music/icon17.png"></image>
					 <text class="txt">最热</text>
				 </view>
				 <view class="item" @click="tolink('/pages/music/recently/recently')">
					 <image class="icon" src="http://yw.wtvxin.com/static/music/icon18.png"></image>
					 <text class="txt">最近播放</text>
				 </view>
			 </view>
			 <view class="music-list pd15" v-if="classifylist.length">
				 <view class="item" v-for="(item,index) in classifylist " :key="index" @click="tolink('/pages/music/classify_list/classify_list?id='+item.Id+'&Logo='+item.Logo+'&Name='+item.Name)">
					 <view class="img">
						 <image v-if="item.Logo" :src="item.Logo"></image>
						 <image v-else src="http://yw.wtvxin.com/static/music/music-item.png"></image>
						<view class="img-top">
							<image class="icon" src="http://yw.wtvxin.com/static/music/listen.png" mode=""></image>
							<span>{{item.PlayNum}}</span>
						</view>
						<view class="img-bottom">
							<image class="play" src="http://yw.wtvxin.com/static/music/play.png" mode=""></image>
						</view>
					 </view>
					 <view class="uni-ellipsis">{{item.Name}}</view>
				 </view>
			 </view>
			<noData :isShow="classifylist.length==0"></noData>
		</view>
		<block v-if="tabIndex==1">
			<view class="list" v-if="hasData">
				<block v-for="(item,index) in findlist" :key="index">
					<media-list :datajson="item" Grid="2" @click="goDetail" @previewImg="previewImg"></media-list>
				</block>
			</view>
			<view class="uni-tab-bar-loading" v-if="hasData">
				<uni-load-more :loadingType="loadingType"></uni-load-more>
			</view>
			<noData :isShow="noDataIsShow"></noData>
		</block>
		<view v-if="tabIndex==0" @click="tolink('/pages/music/uploadMusic/uploadMusic')" class="uploadbtn flex-column"><image class="icon" src="http://yw.wtvxin.com/static/music/upload.png"></image>上传</view>
		<view v-if="tabIndex==1" @click="tolink('/pages/music/artPost/artPost')" class="uploadbtn flex-column"><text class="uni-icon uni-icon-plusempty"></text>发布</view>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import mediaList from '@/components/mediaList.vue';//发现列表
	export default {
		components: {
			noData,
			uniLoadMore,
			mediaList
		},
		data() {
			return {
				userId: "",
				token: "",
				barHeight:0,
				classifylist:[],//舞曲分类列表
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				page: 1,
				pageSize: 5,
				currentSwiper :0,
				scrollLeft: 0,
				tabIndex:0,
				tabnav:[{Id:1,TypeName:"舞曲分类"},{Id:2,TypeName:"动态"}],
				findlist:[],
				banner:[],
			}
		},
		onLoad() {
			//#ifdef APP-PLUS
			this.barHeight=plus.navigator.getStatusbarHeight();
			//#endif
			this.getclassifyList();
			this.getBanner();
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.hasData=true;
			this.page=1;
			this.findlist=[];
			this.workeslist()
		},
		computed: {
		    tabStyle(){
		     return ((750/this.tabnav.length)*this.tabIndex)+(((750/this.tabnav.length)-68)/2)
		    }
		},
		methods: {
			getclassifyList(){
				post('DanceMusic/DanceMusicClassList',{}).then(res=>{
					if(res.code===0){
						this.classifylist=res.data
					}
				})
			},
			async getBanner(){
				const res = await post('Banner/BannerList',{Cid:2})
				if(res.code)return;
				this.banner = res.data;
			},
			/*获取动态列表*/
			async workeslist() {
				let result = await post("Find/FindList", {
					"UserId": this.userId,
					"Token": this.token,
					"page": this.page,
					"pageSize": this.pageSize,
					"myType": 4,
					// "MemberId": "",
					// "SearchKey": ""
				});
				if (result.code === 0) {
					let _this=this;
					if (result.data.length > 0) {
						this.hasData = true;
						this.noDataIsShow = false;
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
			//跳转
			tolink(Url) {
				uni.navigateTo({
					url: Url
				})
			},
			tapTab(index,id) { //点击tab-bar
				if (this.tabIndex === index) {
					return false;
				} else {
					this.tabIndex = index;
				}
			},
			changeSwiper(e){
				this.currentSwiper=e.detail.current;
			},
			//链接详情页
			goDetail(e) {
				if(e.artType==0){//用户发布详情
					uni.navigateTo({
						// url: '/pages/music/artDetail/artDetail?id='+e.id
						url:'/pages/replylist/replylist?id='+e.id
					})
				}
				// else{//资讯详情、店铺
				// 	uni.navigateTo({
				// 		url: '/pages/Article/NewsDetail/NewsDetail?id='+e.id
				// 	})
				// }
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
		onReachBottom(){
			if(this.tabIndex==1){
				if (this.isLoad) {
					this.loadingType = 1;
					this.page++;
					this.workeslist();
				} else {
					this.loadingType = 2;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
	.index-swiper-tab .item{
		width: 50%;
	}
</style>
