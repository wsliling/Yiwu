<template>
	<view>
		<view class="Messagelist" v-if="hasData">
			<view class="list-item" v-for="(item,index) in datalist" :key="index">
				<view class="center uni-mb10">
					<text class="time">{{item.PubTime}}</text>
				</view>
				<view v-if="Msgtype==0" class="txtbox p_re">
					<view class="dian" v-if="item.Islook==0"></view>
					<view class="title">
						{{item.title}}
					</view>
					<view class="uni-list-cell-navigate uni-navigate-right" @click="tolink('/pages/message/msgDetail/msgDetail?id='+item.id)">
						<view class="desc text-line2">
							<uParse :content="item.Memo" />
						</view>
					</view>
				</view>
				<!-- 私信消息 -->
				<view v-else-if="Msgtype==8" class="txtbox p_re">
					<view class="dian" v-if="item.Islook==0"></view>
					<view class="title">
						【{{item.NickName}}】
					</view>
					<view class="uni-list-cell-navigate uni-navigate-right" @click="tolink('/pages/homepage/homepage?id='+item.MemberId)">
						<view class="desc text-line2">
							<uParse :content="item.Memo" />
						</view>
					</view>
				</view>
				<view v-else class="txtbox">
					<view class="title">
						{{item.title}}
					</view>
					<view class="uni-list-cell-navigate">
						<view class="desc">
							{{item.Memo}}
						</view>
					</view>
				</view>
			</view>
			<view class="uni-tab-bar-loading">
				<uni-load-more :loadingType="loadingType"></uni-load-more>
			</view>
		</view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
	import {host,post,get,dateUtils,toLogin} from '@/common/util.js';
	import uParse from '@/components/uParse/src/wxParse.vue';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	export default {
		components: {
			uParse,
			noData,
			uniLoadMore
		},
		data() {
			return {
				userId: "",
				token: "",
				curPage:"",
				Msgtype:"",
				keyname:"消息",
				shopId:"",
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				page: 1,
				pageSize: 10,
				datalist:{},
				Id:0,
			}
		},
		onLoad: function(e) {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.keyname=e.keyname;
			this.Msgtype=e.type;
			this.shopId=e.shopId;
		},
		onShow(){
			if (toLogin()) {
				this.NoticeList();
				uni.setNavigationBarTitle({
					title: this.keyname
				})
			}
		},
		methods: {
			/*获取消息列表*/
			async NoticeList() {
				let result = await post("News/MyNoticeList", {
					Page: this.page,
					PageSize: this.pageSize,
					UserId: this.userId,
					Token: this.token,
					MsgType: this.Msgtype,
				});
				if (result.code === 0) {
					let _this=this;
					if (result.data.length > 0) {
						this.hasData = true;
						this.noDataIsShow = false;
						if(this.Msgtype!=0){
							result.data.forEach(function(item) {
								item.PubTime=dateUtils.format(item.PubTime);
								if(item.Islook==0){
									if(_this.Msgtype!=8){
										_this.ReadNoticeInfo(item.id);
									}
								}
							})
						}
					}
					if (result.data.length == 0 && this.page == 1) {
						this.noDataIsShow = true;
						this.hasData = false;
					}
					if (this.page === 1) {
						this.datalist = result.data;
					}
					if (this.page > 1) {
						this.datalist = this.datalist.concat(
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
			//添加阅读记录
			async ReadNoticeInfo(Msgid){
				let result = ""
				if(this.Msgtype==8){
					result = await post("Message/ReadMessage",{
						 UserId: this.userId,
						 Token: this.token,
						 ToMemberId:Msgid
					})
				}else{
					result = await post("News/ReadNoticeInfo",{
						 UserId: this.userId,
						 Token: this.token,
						 newsid:Msgid
					})
				}
				if (result.code === 0) {
					
				}
			}
		},
		onReachBottom: function() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.page++;
				this.NoticeList();
			} else {
				this.loadingType = 2;
			}
		}
	}
</script>

<style scoped lang="scss">
	.list-item{margin: 20upx 20upx 0;}
	.txtbox{ background: #fff; border-radius: 6px;}
	.txtbox .title{ border-bottom: 1px solid #eee; padding: 20upx; font-size: 30upx; line-height: 1.2;}
	.txtbox .desc{
		width: 100%;
		color: #666;
	}
	.txtbox .desc.text-line2{
		padding-right: 40upx;
		word-break: break-all;
		display: -webkit-box;
		overflow: hidden;
		-o-text-overflow: ellipsis;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	.list-item .time{ color: #fff; background: #e2e2e2; font-size: 24upx; border-radius: 4px; padding: 4upx 10upx;}
	.dian{ height: 10upx; width: 10upx;
	border-radius: 50%; 
	background: #ff0000;
	position: absolute;
	right: 20upx;
	top: 30upx;}
</style>
