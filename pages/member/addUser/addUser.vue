<template>
	<view>
		<view class="Yi-Userlist bg_fff" v-if="hasData">
			<view class="user-item" v-if="item.IsMy==0" v-for="(item,index) in datalist" :key="index" @click="tolink('/pages/homepage/homepage?id='+item.Id)">
				<view class="flex-between">
					<view class="author flex-start">
						<view class="tx">
							<image v-if="item.Avatar" :src="item.Avatar" mode="aspectFill"></image>
							<image v-else src="http://m.dance-one.com/static/default.png" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="name uni-ellipsis">{{item.NickName}}</view>
							<view class="fz12 c_999 uni-ellipsis">{{item.Intro}}</view>
						</view>
					</view>
					<view class="flow" :class="{'active':item.IsFollow}" @click.stop="getFollowOperation(item.Id,index)">{{item.IsFollow?"已关注":"关注"}}</view>
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
	import {host,post,toLogin} from '@/common/util.js';
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
				datalist:[],
				page:1,
				pageSize:12,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
			}
		},
		 onLoad(e) {

		 },
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.getList()
		},
		methods: {
			/*获取列表*/
			async getList() {
				let result = await post("User/GetReCommendMember", {
					"UserId": this.userId,
					"Token": this.token,
					"page": this.page,
					"pageSize": this.pageSize
				});
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
				}
			},
			//跳转
			tolink(Url) {
				uni.navigateTo({
					url: Url
				})
			},
			// 关注或取消关注
			getFollowOperation(id,index){
				post('Find/FollowOperation',{
					"UserId": this.userId,
					"Token": this.token,
					"ToMemberId": id,
				}).then( res=> {
					let _this=this;
					if(res.code == 0){
						if(_this.datalist[index].IsFollow==0){
							_this.$set(_this.datalist[index],'IsFollow',1)
						}else{
							_this.$set(_this.datalist[index],'IsFollow',0)
						}
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
					}
				})
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			this.hasData=false;
			this.page=1;
			this.getList();
			uni.stopPullDownRefresh();
		},
		//上拉加载
		onReachBottom(){
			if (this.isLoad) {
				this.loadingType = 1;
				this.page++;
				this.getList();
			} else {
				this.loadingType = 2;
			}
		}
	}
</script>

<style lang="scss">
	.Yi-Userlist{
		.user-item{
			padding: 30upx;
			border-bottom: 1px solid #f5f5f5;
			.author{
				.tx{
					width: 100upx;
					height: 100upx;
					margin-right: 20upx;
					image{
						display: block;width: 100%; height: 100%;
						border-radius: 100%;
						background-color: #E6E6E6;
					}
				}
				.name{
					max-width: 300upx;
					font-size: 30upx;
					margin-right: 20upx;
					line-height: 1.5;
				}
				.info{
					width: 450upx;
				}
			}
		}
	}
	.flow{
		color: $primary;
		background: #fff;
		border: 1px solid #ddd;
		// color: #fff;
		// background: $primary;
		// border: 1px solid $primary;
		border-radius: 100px;
		width: 120upx;
		text-align: center;
		&.active{
			// color: $primary;
			// background: #fff;
			// border: 1px solid #ddd;
		}
	}
</style>
