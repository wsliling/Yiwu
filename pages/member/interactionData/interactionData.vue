<template>
	<view>
		<view class="head">
			<view :style="{height:barHeight+'px'}"></view>
			<view class="tab_head flex-between">
				<view class="head_l" @click="backUrl">
					<text class="uni-icon uni-icon-arrowleft"></text>
				</view>
				<view class="tabList flex p_re">
					<view v-for="(item,index) in tabList" :key="index" class="item" :class="{'active':index==tabIndex}"  @click="cliTab(index,item.id)">{{item.name}}</view>
					<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
				</view>
				<view class="head_r"> </view>
			</view>
		</view>
		<view :style="{height:(44+barHeight)+'px'}"></view>
		<view class="Yi-Userlist bg_fff" v-if="hasData">
			<view class="user-item" v-for="(item,index) in datalist" :key="index" @click="tolink('/pages/homepage/homepage?id='+item.UserId)">
				<view class="flex-between">
					<view class="author flex-start">
						<view class="tx">
							<image v-if="item.Avatar" :src="item.Avatar" mode="aspectFill"></image>
							<image v-else src="http://yw.wtvxin.com/static/default.png" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="name uni-ellipsis">{{item.Name}}</view>
							<view class="fz12 c_999 uni-ellipsis">{{item.Intro}}</view>
						</view>
					</view>
					<view class="flow" :class="{'active':item.IsFollow}" @click.stop="getFollowOperation(item.UserId)">{{item.IsFollow?"已关注":"关注"}}</view>
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
				tabList:[{id:0,name:'粉丝'},{id:2,name:'被赞'},{id:1,name:'关注'}],
				datalist:[],
				tabIndex:0,
				myType:0,//0-我的粉丝，1-我的关注，2-被赞
				page:1,
				pageSize:12,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
			}
		},
		computed: {
		   tabStyle(){
		     return ((470/this.tabList.length)*this.tabIndex)+(((470/this.tabList.length)-80)/2)
		   }
		 },
		 onLoad(e) {
		 	// #ifdef APP-PLUS
		 	this.barHeight = plus.navigator.getStatusbarHeight();
			this.tabIndex = e.type;
		 	// #endif
		 },
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			// #ifndef APP-PLUS
			this.tabIndex = this.$mp.query.type;
			// #endif
			this.myType=this.tabList[this.tabIndex].id
			this.getList(this.myType)
		},
		methods: {
			/*获取列表*/
			async getList(type) {//type: 0-我的粉丝，1-我的关注，2-被赞
				let result=""
				if(type==2){
					result = await post("User/MyBepraisedList", {
						"UserId": this.userId,
						"Token": this.token,
						"page": this.page,
						"pageSize": this.pageSize,
					});
				}else{
					result = await post("Find/UserFollowList", {
						"UserId": this.userId,
						"Token": this.token,
						"page": this.page,
						"pageSize": this.pageSize,
						"myType": type//0我的粉丝
					});
				}
				if (result.code === 0) {
					if (result.data.length > 0) {
						this.hasData = true;
						this.noDataIsShow = false;
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
				}else {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
				}
			},
			backUrl(){
				uni.navigateBack()
			},
			//跳转
			tolink(Url) {
				uni.navigateTo({
					url: Url
				})
			},
			cliTab(index,id){
			  this.tabIndex = index
			  this.myType=id
			  this.getList(id)
			},
			// 关注或取消关注
			getFollowOperation(id){
				post('Find/FollowOperation',{
					"UserId": this.userId,
					"Token": this.token,
					"ToMemberId": id,
				}).then( res=> {
					if(res.code === 0){
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
						this.getList(this.myType)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import './style'
</style>
