<template>
	<!-- 我的收藏 -->
	<view>
		<view class="head" :style="{'padding-top':barHeight+'px'}">
			<view class="tab_head flex-between">
				<!-- #ifndef MP-WEIXIN -->
				<view class="head_l" @click="toback"><text class="uni-icon uni-icon-arrowleft"></text></view>
				<view class="mine">我的下载</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view></view>
				<view></view>
				<!-- #endif --> 
				<view class="redact" @click="ShowDel">{{isShowDel?'完成':'管理'}}</view>
			</view>
			<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x>
				<view style="width: 50%;" v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index,tab.Id)">{{tab.TypeName}}</view>
				<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
			</scroll-view>
		</view> 
		<view :style="{height:(84+barHeight)+'px'}"></view>
		
		<view class="bb_pt uni-bg-white" v-if="hasData">
			<view class="listbox" v-for="(val, index) in datalist" :key="index">
				<view class="choose" v-if="isShowDel" @click.stop="shiftChecked(index)"><view class="IconsCK IconsCK-radio" :class="{ checked: val.checked }"></view></view>
				<view class="drawing flex">
					<view class="" v-if="val.Type == 1"><video controls :src="'http://m.dance-one.com'+ val.Video"></video></view>
					<view class="" v-else><image class="imgs" :src="val.PicImg" mode=""></image></view>
					<view class="brace">
						<view class="being uni-ellipsis2">{{ val.Title }}</view>
						<view class="fz12 c_999" v-if="val.LikeNum">
							{{val.LikeNum}}人点赞
						</view>
						<view class="correct">
							<block v-if="val.Is_Charge==0">免费</block>
							<block v-else><span class="spanl">¥</span>{{ val.Price }}</block>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="lect" v-if="isShowDel">
			<view class="lects" @click="cancelDel()"><view class="IconsCK IconsCK-radio" :class="{ checked }"></view></view>
			<view class="cancel">
				<view class="cover">全选</view>
				<view class="covers" @click="btnDel">删除</view>
			</view>
		</view>
		<noData :isShow="noDataIsShow"></noData>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType" v-if="noDataIsShow == false"></uni-load-more></view>
	</view>
</template>

<script>
import { post, get } from '@/common/util.js';
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import noData from '@/components/noData.vue'; //暂无数据
export default {
	data() {
		return {
			barHeight:0,
			isShowDel: false, //编辑完成
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
			pageSize:5,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			datalist: {}, //列表
			datalength: 0,
			Ids: [], //保存要删除数据
			checked: false,
			Type : 1, //  2-舞曲  1-视频
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
		// #ifdef APP-PLUS
		var height = plus.navigator.getStatusbarHeight();
		this.barHeight = height;
		// #endif
		// #ifdef H5
		this.barHeight = 0;
		// #endif
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
		toback() {
			uni.switchTab({
				url: '/pages/tabBar/my/my'
			});
		},
		//点击编辑 完成
		ShowDel() {
			this.isShowDel = !this.isShowDel;
		},
		 //点击tab-bar
		tapTab(index,id) {
			if (this.tabIndex === index) {
				return false;
			} else {
				this.tabIndex = index;
				this.Type = id
				this.page = 1
				this.workeslist()
			}
		},
		// 全选
		cancelDel() {
			this.checked = !this.checked;
			if (this.checked) {
				this.datalist.forEach(function(item) {
					item.checked = true;
				});
			} else {
				this.datalist.forEach(function(item) {
					item.checked = false;
				});
			}
		},
		//选择
		shiftChecked(key) {
			this.datalist[key].checked = !this.datalist[key].checked;
			let _this = this;
			let sum = 0;
			_this.datalist.forEach(function(item) {
				if (item.checked !== _this.checked) {
					sum += 1;
				}
			});
			if (sum == this.datalist.length) {
				_this.checked = this.datalist[0].checked;
			} else {
				_this.checked = false;
			}
		},
		/*获取列表*/
		async workeslist() {
			let result = await post('User/MyDownload', {
				UserId: this.userId,
				Token: this.token,
				Page: this.page,
				pageSize: this.pageSize,
				TypeInt: this.Type
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
		// 删除
		btnDel() {
			let _this = this;
			this.datalist.forEach(function(item) {
				if (item.checked == true) {
					_this.Ids.push(item.Id);
				}
				console.log(_this.Ids, '_this.Ids');
			});
			if (this.Ids.length > 0) {
				//#ifndef APP-PLUS
				uni.showModal({
				  content: "您确定要删除所选项吗？",
				  confirmColor:"#df2271",
				  success: function(res) {
					if (res.confirm) {
						  _this.DeleteMyFootprint();
						} else if (res.cancel) {
						
						}
					}
				}) 
				//#endif
				//#ifdef APP-PLUS
				this.$showModal({
					content: "您确定要删除所选项吗？",
				}).then(res=>{
					 _this.DeleteMyFootprint();
					//确认
				  }).catch(res=>{
					//取消
				  })
				//#endif
			} else {
				uni.showToast({
					title: '请选择需要删除的项！',
					icon: 'none',
					duration: 1500
				});
			}
		},
		async DeleteMyFootprint() {
			let result = await post('User/DelCollections', {
				UserId: this.userId,
				Token: this.token,
				IdArr: this.Ids.join(',')
			});
			if (result.code === 0) {
				let _this = this;
				for (let j = 0; j < _this.Ids.length; j++) {
					for (let i = 0; i < _this.datalength; i++) {
						if (_this.datalist[i]) {
							if (_this.Ids[j] == _this.datalist[i].Id) {
								_this.datalist.splice(i, 1);
							}
						}
					}
				}
				_this.datalength = _this.datalist.length;
				_this.Ids = [];
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
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
	}
};
</script>

<style scoped lang="scss">	
.head {
	.tab_head{
		height: 44px;
	}
	.head_l{
		.uni-icon{ font-size: 26px; margin: 0 5px;}
	}
	.mine {
		font-size: 16px;
		font-family: PingFang;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
	}
	.redact {
		font-size: 14px;
		font-family: PingFang;
		font-weight: 500;
		color: #999;
		padding-right: 15px;
	}
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
video{
	width: 180upx;height: 180upx;border-radius: 10upx;
}
</style>
