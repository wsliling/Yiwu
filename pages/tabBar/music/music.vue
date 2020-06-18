<template>
	<view>
		<view class="head">
			<view class="search">
				<view class="seachbox">
					<text class="uni-icon uni-icon-search">请输入你想搜索的舞曲</text>
				</view>
			</view>
			<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index,tab.Id)">{{tab.TypeName}}</view>
				<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
			</scroll-view>
		</view>
		<view style="height: 80px;"></view>
		<view class="music-content" v-if="tabIndex==0">
			<!--轮播图-->
			<view class="index_swiper uni-mt10">
				<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
					<swiper-item v-for="(item,index) in 3" :key="index">
						<view class="swiper-item pd15">
							<image class="img" src="@/static/of/p1.jpg" mode="aspectFill"></image>
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
					 <image class="icon" src="@/static/music/icon15.png"></image>
					 <text class="txt">每日推荐</text>
				 </view>
				 <view class="item" @click="tolink('/pages/music/list/list?type=1')">
					 <image class="icon" src="@/static/music/icon16.png"></image>
					 <text class="txt">最新推荐</text>
				 </view>
				 <view class="item" @click="tolink('/pages/music/list/list?type=2')">
					 <image class="icon" src="@/static/music/icon17.png"></image>
					 <text class="txt">最热</text>
				 </view>
				 <view class="item" @click="tolink('/pages/music/recently/recently')">
					 <image class="icon" src="@/static/music/icon18.png"></image>
					 <text class="txt">最近播放</text>
				 </view>
			 </view>
			 <view class="music-list pd15" v-if="hasData">
				 <view class="item" v-for="(item,index) in classifylist " :key="index" @click="tolink('/pages/music/classify_list/classify_list?id='+item.Id+'&Logo='+item.Logo+'&Name='+item.Name)">
					 <view class="img">
						 <image src="@/static/music/music-item.png"></image>
						<view class="img-top">
							<image class="icon" src="@/static/music/listen.png" mode=""></image>
							<span>2367</span>
						</view>
						<view class="img-bottom">
							<image class="play" src="@/static/music/play.png" mode=""></image>
						</view>
					 </view>
					 <view class="uni-ellipsis">{{item.Name}}</view>
				 </view>
			 </view>
		</view>
		<view class="list" v-if="tabIndex==1&&hasData">
			<block v-for="(item,index) in findlist" :key="index">
				<media-list :datajson="item" Grid="2" @click="goDetail" @previewImg="previewImg"></media-list>
			</block>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData&&tabIndex==1">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow"></noData>
		<view v-if="tabIndex==0" @click="tolink('/pages/music/uploadMusic/uploadMusic')" class="uploadbtn flex-column"><image class="icon" src="@/static/music/upload.png"></image>上传</view>
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
				tabnav:[
					{
						Id:1,
						TypeName:"舞曲分类"
					},
					{
						Id:2,
						TypeName:"动态"
					}
				],
				findlist:[
					{
						Addtime: "2020-05-27 18:08:24",
						Avatar: "http://mall.sc-mall.net/upload/avatar/20200429/2020042916434333883.jpg",
						BrowseNum: 1,
						CommentNum: 0,
						ContentAbstract: "",
						ContentDetails: "",
						ExternalLink: "",
						FindType: 0,
						Id: 124,
						ImgList: "http://mall.sc-mall.net/upload/UFind/2020052718082329615506.jpg,http://mall.sc-mall.net/upload/UFind/2020052718082337462762.jpg,http://mall.sc-mall.net/upload/UFind/2020052718082343720215.jpg,http://mall.sc-mall.net/upload/UFind/2020052718082351531051.jpg,http://mall.sc-mall.net/upload/UFind/2020052718082357744717.jpg,http://mall.sc-mall.net/upload/UFind/2020052718082365550816.jpg,http://mall.sc-mall.net/upload/UFind/2020052718082373301282.jpg,http://mall.sc-mall.net/upload/UFind/2020052718082381223454.jpg,http://mall.sc-mall.net/upload/UFind/2020052718082384351617.jpg",
						InnerLink: "",
						IsFollow: 1,
						IsLike: 1,
						IsMy: 0,
						LikeNum: 256,
						Location: "",
						MemberId: "2B953DA7C2CC7087",
						NickName: "悠游白书",
						PicImg: "http://mall.sc-mall.net/upload/UFind/2020052718082329615506.jpg",
						PicNo: "20052910083028376",
						ShopId: "36F2EACC4C78A301",
						Sort: 0,
						Title: "舞曲文学，品舞曲就是品生活，品生活就是陶冶情操，陶冶情操有利于人的身心健康。",
					},
					{
						Addtime: "2020-05-18 15:21:05",
						Avatar: "http://mall.sc-mall.net/upload/admin/2020-04-27/2020042711401879998.png",
						BrowseNum: 4,
						CommentNum: 0,
						ContentAbstract: "",
						ContentDetails: "",
						ExternalLink: "",
						FindType: 0,
						Id: 123,
						ImgList: "http://mall.sc-mall.net/upload/20200518/2020051815210560107.jpg",
						InnerLink: "",
						IsFollow: 0,
						IsLike: 0,
						IsMy: 0,
						LikeNum: 0,
						Location: "",
						MemberId: "16EBFAA2B42D58E4",
						NickName: "qckuh394",
						PicImg: "http://mall.sc-mall.net/upload/20200518/2020051815210560107.jpg",
						PicNo: "20051815210516910",
						ShopId: "36F2EACC4C78A301",
						Sort: 0,
						Title: "测试测试",
					}
				]
			}
		},
		onLoad() {
			this.getclassifyList()
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.hasData=true;
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
					// uni.navigateTo({
					// 	url: '/pages/Article/artDetail/artDetail?id='+e.id
					// })
				}else{//资讯详情、店铺
					// uni.navigateTo({
					// 	url: '/pages/Article/NewsDetail/NewsDetail?id='+e.id
					// })
				}
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
			if (this.isLoad) {
				this.loadingType = 1;
				this.page++;
				// this.getList();
			} else {
				this.loadingType = 2;
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
