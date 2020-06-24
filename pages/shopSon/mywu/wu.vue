<template>
	<!-- 舞衣 舞裙 舞裤 舞鞋-->
	<view class="">
		<view class="search">
			<view class="seachbox">
				<!-- <text class="uni-icon uni-icon-search">请输入你想搜索的产品</text> -->
				
				<uni-icons color="#ccc" class="my-close" size="20" type="search" />
				<ans-input placeholder="请输入你想搜索的产品" @onConfirm="searchConfirm"
				:value="searchText"></ans-input>
			</view>
		</view>
		<div class="sort">
			<div class="item" :class="[{'active':sort==0},{'top':sortMode==1}]" @click="onSort(0)">
				默认
			</div>
			<div class="item" :class="[{'active':sort==1},{'top':sortMode==1}]" @click="onSort(1)">
				人气
			</div>
			<div class="item" :class="[{'active':sort==2},{'top':sortMode==1}]" @click="onSort(2)">
				价格
			</div>
		</div>
		<view class="wu-box">
			<!-- <image v-if="type == 4" class="wu-img" src="../../../static/of/p3.jpg" mode=""></image> -->
			<view class="wu-item" v-for="(val,key) in list" :key="key" @click="navigate('shopSon/product/productDetails',{proId:val.Id})">
				<image :src="val.PicNo" mode="aspectFill"></image>
				<view class="wu-tet">
					<view class="wu-name"><span v-if="val.IsPlatform">自营</span>{{val.Name}}</view>
					<view class="wu-price">￥{{val.Price}}</view>
				</view>
			</view>
		</view>
		<uni-load-more :loadingType="loadingType" v-if="list.length"></uni-load-more>
		<notData v-else></notData>
	</view>
</template>

<script>
	import {post,toast,navigate} from '@/common/util.js';
	import uniLoadMore from '@/components/uni-load-more.vue';
	import notData from '@/components/notData.vue';
	import ansInput from '@/components/ans-input/ans-input.vue';
	export default {
		components: {
			uniLoadMore,notData,ansInput
		},
		data(){
			return{
				navigate,
				userId:'',
				token:'',
				page:1,
				pageSize:12,
				loadingType:0,//0-loading前；1-loading中；2-没有更多了
				classId:0,//分类id
				brandId:0,//品牌id
				list:[],
				sort:0,//0-默认,1-人气,2-价格
				sortMode:0,//0- 升序（从小到大） 1-降序（从大到小）
				searchText:'',

			}
		},
		onLoad(e) {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.title = e.title;
			e.classId&&(this.classId = e.classId);
			e.brandId&&(this.brandId = e.brandId);
			if(e.title){
				uni.setNavigationBarTitle({
					title: e.title
				});
			}
			this.getData();
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		methods:{
			async getData(){
				this.loadingType =1;
				if(this.page===1){
					this.list=[];
				}
				const res = await post('Goods/GoodsList',{
					UserId:this.userId,
					Token:this.token,
					Page:this.page,
					PageSize:this.pageSize,
					TypeId:this.classId,
					BrandId:this.brandId,
					Sort:this.sort,
					Order:this.sortMode,
					Keywords:this.searchText
				});
				if(res.code)return;
				const data = res.data;
				this.list.push(...data);

				this.loadingType = 0;
				if(data.length<this.pageSize){
					this.loadingType=2;
				}
			},
			onSort(sort){
				if(this.sort == sort){
					this.sortMode = this.sortMode===1?0:1;
				}else{
					this.sortMode =0;
				}
				this.sort = sort;
				this.page = 1
				this.getData();
			},
			// 搜索
			searchConfirm(searchText){
				this.searchText = searchText;
				this.sort=0;
				this.sortMode=0;
				this.page = 1;
				this.getData();
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.sort=0;
			this.sortMode=0;
			this.searchText = '';
			this.page = 1;
			this.getData();
			// 停止下拉动画
			uni.stopPullDownRefresh()
		},
		// 上拉加载更多
		onReachBottom(){
			if(this.loadMore===2)return;
			this.page+=1;
			this.getData()
		},
	}
</script>

<style lang="scss" scoped>
	.search {
		padding: 20upx 30upx 0;
		background: #fff !important;
		.seachbox{
			display:flex;
			align-items:center;
		}
	}
	.index_swiper .swiper,
	.index_swiper .swiper .img {
		height: 380upx;
	}
	.sort{
		display:flex;
		justify-content:space-between;
		align-items:center;
		padding:0 30upx;
		line-height:3;
		background: #fff;
		.item{
			font-size:24upx;
			display:flex;
			align-items:center;
			&::after{
				content:'';
				display:block;
				border-right:8upx solid #fff;
				border-left:8upx solid #fff;
				border-bottom:15upx solid #666;
				border-top:1upx solid #fff;
				margin-left:8upx;
			}
			&.active{
				color:$primary;
				&.top{
					&::after{
						border-top:15upx solid #666;
						border-bottom:0upx solid #fff;
					}
				}
			}
		}
	}
	.wu-box{
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 0 20upx;
		.wu-img{
			margin-top: 30upx;
			width:702upx;
			height:386upx;
			border-radius:6upx;
		}
		.wu-item{
			width:350upx;
			margin-top: 30upx;
			background:#fff;
			image{
				width:100%;
				height:440upx;
				border-radius:6upx;
			}
			.wu-tet{
				width: 100%;
				font-weight: bold;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				padding:20upx 10upx;
				span{
					height:31upx;
					background:linear-gradient(90deg,rgba(222,26,110,1),rgba(233,56,132,1));
					border-radius:6upx;
					font-size:24upx;
					font-weight:bold;
					color:rgba(255,255,255,1);
					line-height:31upx;
					padding: 0 10upx;
					margin-right:10upx;
				}
				.wu-name{
					white-space:nowrap;
					overflow: hidden;
					text-overflow: ellipsis;//可以用来多行文本的情况下，用省略号“…”隐藏超出范围的文本 
					text-overflow: -o-ellipsis-lastline;
					width: 100%;

				}
			}
			.wu-price{
				font-weight: 400;
				font-size: 26upx;
				color: #DE1A6E;
			}
		}
		
	}
</style>
