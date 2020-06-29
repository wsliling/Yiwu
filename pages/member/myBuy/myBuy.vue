<template>
	<view>
		<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x>
			<view style="width: 50%;" v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index)">{{tab.TypeName}}</view>
			<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
		</scroll-view>
		<view style="height:40px"></view>
		<view class="bb_pt uni-bg-white" v-if="hasData">
			<view :class="['listbox',tabIndex==1?'musicbox':'']" v-for="(val, index) in datalist" :key="index" @click="godetail(val.Id,index)">
				<view class="drawing flex">
					<view class=""><image class="imgs" v-if="tabIndex==0" :src="val.PicImg" mode=""></image><image class="imgs" v-if="tabIndex==1" :src="val.PicImg||'/static/default_music.png'" mode=""></image></view>
					<view class="brace">
						<view :class="['being',tabIndex==1?'uni-ellipsis':'uni-ellipsis2']">{{ val.Name }}</view>
						<view class="fz12 c_999" v-if="tabIndex==0">
							{{val.SalesNum}}人购买
						</view>
						<view class="correct">
							<span class="spanl">¥</span>{{ val.Price }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<noData :isShow="noDataIsShow"></noData>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType" v-if="noDataIsShow == false"></uni-load-more></view>
	</view>
</template>

<script>
import { post, get} from '@/common/util.js';
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import noData from '@/components/noData.vue'; //暂无数据
export default {
	data() {
		return {
			userId: '',
			token: '',
			tabIndex:0,
			tabnav:[
				{
					Id:1,
					TypeName:"课程"
				},
				{
					Id:2,
					TypeName:"舞曲"
				}
			],
			page:1,
			pageSize:10,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			datalist: {}, //列表
		};
	},
	components: {
		uniLoadMore,
		noData
	},
	computed: {
	  tabStyle(){
	    return ((750/this.tabnav.length)*this.tabIndex)+(((750/this.tabnav.length)-68)/2)
	  }
	 },
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.workeslist();
	},
	methods: {
		//跳转
		tolink(Url) {
			uni.navigateTo({
				url: Url
			})
		},
		 //点击tab-bar
		tapTab(index) {
			if (this.tabIndex === index) {
				return false;
			} else {
				this.tabIndex = index;
				this.page=1;
				this.hasData=false;
				this.noDataIsShow=false;
				this.workeslist();
			}
		},
		/*获取列表*/
		async workeslist() {
			let url="";
			if(this.tabIndex==0){
				url="Course/MyCourseBuyList"
			}else if(this.tabIndex==1){
				url="DanceMusic/MyDanceMusicBuyList"
			}
			let result = await post(url, {
				UserId: this.userId,
				Token: this.token,
				page: this.page,
				pageSize: this.pageSize
			});
			if (result.code === 0) {
				let _this=this;
				if (result.data.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
					result.data.forEach(function(item) {
						_this.$set(item, 'txt', '');
						_this.$set(item, 'checked', false);
					});
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
				this.datalength = this.datalist.length;
			}
		},
		godetail(id,index){
			if(this.tabIndex==0){
				uni.navigateTo({
					url:'/pages/video/videoDetails/videoDetails?id='+id
				})
			}else{
				uni.setStorageSync("musicList",this.datalist)
				uni.navigateTo({
					url:'/pages/music/playMusic/playMusic?nowIndex='+index+'&id='+id
				})
			}
		}
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			this.workeslist();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style scoped lang="scss">	
.index-swiper-tab{
	position: fixed;
	left: 0;
	top: 0;
	/* #ifdef H5 */
	top: 44px;
	/* #endif */
	width: 100%;
	z-index: 9;
}
.listbox {
	padding: 30upx;
	display: flex;
	border-bottom: 1upx solid #f5f5f5;
	.choose {
		width: 70upx;
		display: flex;
		align-items: center;
	}
	.imgs {
		width: 180upx;
		height: 180upx;
		display: block;
		border-radius: 10upx;
		background: #eee;
	}
	.brace {
		font-family: PingFang;
		font-weight: 500;
		padding-left: 20upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.being {
		line-height: 1.4;
	}
	.correct {
		font-size: 30upx;
		color: $primary;
	}
	.spanl {
		font-size: 20upx;
		color: $primary;
	}
	.spanr {
		font-size: 22upx;
		text-decoration: line-through;
		color:#999;
	}
	&.musicbox{
		.imgs {
			width: 84upx;
			height: 84upx;
			display: block;
			border-radius: 10upx;
			background: #eee;
		}
		.drawing{
			width: 100%; 
			align-items: center;
		}
		.brace{
			flex-direction: row;
			width: 100%;
			.being{ max-width: 400upx;}
		}
	}
}

.lect {
	height: 100upx;
	width: 100%;
	background: rgba(0, 0, 0, 0.8);
	position: fixed;
	bottom: 0;
	display: flex;
	padding-left: 30upx;
	.lects {
		display: flex;
		align-items: center;
	}
	.cancel {
		display: flex;
		align-items: center;
		width: 100%;
		.cover {
			width: 70%;
			height: 100upx;
			display: flex;
			align-items: center;
			font-size: 28upx;
			color: #fff;
		}
		.covers {
			width: 30%;
			height: 100upx;
			background: $primary;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32upx;
			color: #fff;
		}
	}
}
</style>
