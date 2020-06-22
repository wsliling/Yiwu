<template>
	<!-- 舞衣 舞裙 舞裤 舞鞋-->
	<view class="">
		<view class="search">
			<view class="seachbox">
				<text class="uni-icon uni-icon-search">请输入你想搜索的产品</text>
			</view>
		</view>
		<view class="wu-box">
			<image v-if="type == 4" class="wu-img" src="../../../static/of/p3.jpg" mode=""></image>
			<view class="wu-item" v-for="(val,key) in 6" :key="key">
				<image src="../../../static/shop/shop9.png" mode=""></image>
				<view class="wu-tet">
					<view class=""><span>自营</span>一舞拉丁黑色舞蹈一舞拉丁黑色舞蹈显身显身...</view>
					<view class="wu-price">￥79.99</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				type:0
			}
		},
		onLoad(e) {
			this.type = e.type
			if(e.type == 1){
				uni.setNavigationBarTitle({
					title: '舞裙'
				});
			}
			if(e.type == 2){
				uni.setNavigationBarTitle({
					title: '舞裤'
				});
			}
			if(e.type == 3){
				uni.setNavigationBarTitle({
					title: '舞鞋'
				});
			}
			if(e.type == 4){
				uni.setNavigationBarTitle({
					title: '产品列表'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		padding: 20upx 30upx 20upx;
		background: #fff !important;
	}
	.index_swiper .swiper,
	.index_swiper .swiper .img {
		height: 380upx;
	}
	.wu-box{
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		padding: 0 16upx;
		.wu-img{
			margin-top: 30upx;
			width:702upx;
			height:386upx;
			border-radius:6upx;
		}
		.wu-item{
			width: 48.5%;
			padding: 30upx 0;
			image{
				width:348upx;
				height:440upx;
				border-radius:6upx;
			}
			.wu-tet{
				width: 100%;
				font-weight: bold;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				padding-top: 10upx;
				span{
					height:31upx;
					background:linear-gradient(90deg,rgba(222,26,110,1),rgba(233,56,132,1));
					border-radius:6upx;
					font-size:24upx;
					font-weight:bold;
					color:rgba(255,255,255,1);
					line-height:31upx;
					padding: 0 10upx;
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
