<template>
	<!-- 近视详情 -->
	<view class="details">
		<!-- 首图展示 -->
		<view class="detailsmap">
			<image src="../../../static/of/p3.jpg" mode=""></image>
			<view class="pagination">1/6</view>
		</view>
		<!-- 价格 -->
		<view class="listpt">
			<view class="price">
				<span>¥</span>
				9.99
			</view>
			<view class="brandname">
				<span>自营</span>
				拉丁很色舞蹈裙子 紧身 漂亮 显身材一舞拉 丁很色舞蹈裙子 紧身 漂亮 显身材
			</view>
		</view>
		<!-- 货品规格 -->
		<view class="shipments">
			<view class="pick">
				<view class="shipmentsbox">
					<view class="flex">
						<view class="">规格</view>
						<view class="txt26">1件</view>
					</view>
					<image class="exemption" src="http://shop.dadanyipin.com/static/hpicons/arrows.svg" mode=""></image>
				</view>
			</view>
			<view class="pick">
				<view class="shipmentsbox">
					<view class="flex">
						<view class="">送至</view>
						<view class="txt26">广东广州</view>
					</view>
					<view class="flex">
						<view class="">包邮</view>
						<image class="exemption" src="http://shop.dadanyipin.com/static/hpicons/arrows.svg" mode=""></image>
					</view>
				</view>
			</view>
			<view class="pick">
				<view class="shipmentsbox">
					<view class="flex">
						<view class="">服务</view>
					</view>
					<view class="flex" >
						<image class="drawimg" src="http://shop.dadanyipin.com/static/hpicons/draw.svg" mode=""></image>
						<view class="">品质保障</view>
					</view>
					<view class="flex">
						<image class="drawimg" src="http://shop.dadanyipin.com/static/hpicons/draw.svg" mode=""></image>
						<view class="">及时发货</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 商品评价 -->
		<view class="merchandise">
			<view class="evaluate">
				<view class="quiz">问大家<span>(3)</span>
				</view>
				<view class="flex" >
					<view class="">查看全部</view>
					<image class="arrows" src="http://shop.dadanyipin.com/static/hpicons/arrows.svg" mode=""></image>
				</view>
			</view>
			<view class="">
				<view class="question">
					<view class="dot"><span>问</span>衣服质量怎么样</view>
					<view class="">3个回答</view>
				</view>
				<view class="question">
					<view class="dot"><span>问</span>衣服质量怎么样</view>
					<view class="">3个回答</view>
				</view>
			</view>
		</view>
		<!-- 店铺 -->
		<view class="store">
			<view class="flex">
				<image class="storeimg" src="../../../static/logo.png" mode=""></image>
				<view class="">
					<view class="storename">壹舞店铺</view>
					<view class="flex exp">
						<view class="">综合体验</view>
						<image class="star" src="http://shop.dadanyipin.com/static/hpicons/collect.svg" mode=""></image>
						<image class="star" src="http://shop.dadanyipin.com/static/hpicons/collect.svg" mode=""></image>
						<image class="star" src="http://shop.dadanyipin.com/static/hpicons/collect.svg" mode=""></image>
						<image class="star" src="http://shop.dadanyipin.com/static/hpicons/collect.svg" mode=""></image>
						<image class="star" src="http://shop.dadanyipin.com/static/hpicons/collect.svg" mode=""></image>
					</view>
				</view>
			</view>
			<view class="flex">
				<view class="plan">全部宝贝</view>
				<view class="plan">进店逛逛</view>
			</view>
		</view>
		<!-- <view class="">
			<view class="plan">描述相符 4.8 <span>低</span></view>
			<view class="plan">卖家服务 4.7 <span>低</span></view>
			<view class="plan">物流服务 4.8 <span>低</span></view>
		</view> -->
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		toindex() {
			uni.navigateBack({
				delta: 2
			});
		},
		//
		toevaluation(Url) {
			uni.navigateTo({
				url: Url
			});
		}
	}
};
</script>

<style scoped lang="scss">
.details {
	background: #ffffff;
	.detailsmap {
		width: 100%;
		height: 750rpx;
		background: #c0c0c0;
		image {
			height: 750upx !important;
		}
	}
	.pagination {
		width: 80rpx;
		height: 40rpx;
		background: rgba(12, 34, 44, 0.2);
		border-radius: 20rpx;
		position: absolute;
		top: 650rpx;
		right: 31rpx;
		line-height: 40rpx;
		text-align: center;
		color: #fff;
	}
	// 价格
	.listpt {
		padding: 30rpx;
		width: 100%;
		.price {
			font-size: 44upx;
			font-weight: bold;
			color: #de1a6e;
			span {
				font-size: 36upx;
				margin-right: 10upx;
			}
		}
		.brandname {
			font-size: 30upx;
			font-weight: bold;
			color: rgba(52, 52, 52, 1);
			span {
				height: 30upx;
				background: linear-gradient(90deg, rgba(222, 26, 110, 1), rgba(233, 56, 132, 1));
				border-radius: 6upx;
				padding: 0 10upx;
				margin-right: 10upx;
				font-size: 24upx;
				color: rgba(255, 255, 255, 1);
			}
		}
	}
	/* 货品规格 */
	.shipments {
		border-top: 20upx solid #f9f9f9;
		.pick {
			border-bottom: 1rpx solid #f9f9f9;
			.shipmentsbox {
				display: flex;
				justify-content: space-between;
				font-size: 26rpx;
				font-family: PingFang;
				font-weight: bold;
				color: rgba(13, 34, 44, 0.6);
				margin: 30rpx;
				.txt26 {
					color: #343434;
					margin-left: 50upx;
				}
				.exemption {
					width: 20rpx;
					height: 20rpx;
					margin: 16rpx 0 0 16upx;
				}
				.drawimg{
					width:41upx;
					height:41upx;
					margin: 6upx 6upx 0 0;
				}
			}
		}
	}
	// 商品评价
	.merchandise{
		border-top: 20upx solid #f9f9f9;
		padding: 30upx;
		.evaluate{
			display: flex;
			justify-content: space-between;
			color: #DE1C6E;
			padding-bottom: 20upx;
			border-bottom: 1upx solid #f9f9f9;
			.quiz{
				font-size:30upx;
				font-weight:bold;
				color:rgba(52,52,52,1);
				span{
					font-size:22upx;
					color:rgba(154,154,154,1);
					margin-left: 10upx;
				}
			}
			image{
				width:20upx;
				height:20upx;
				margin: 16upx 0 0 10upx;
			}
		}
		.question{
			display: flex;
			justify-content: space-between;
			padding-top: 30upx;
			font-size: 26upx;
			color: #9A9A9A;
			.dot{
				font-size: 29upx;
				color: #343434;
				span{
					height:26upx;
					background:rgba(222,28,110,1);
					border-radius:6upx;
					font-size:20upx;
					color:rgba(255,255,255,1);
					line-height:26upx;
					padding: 0 6upx;
					margin-right: 10upx;
				}
			}
		}
	}
	// 店铺
	.store{
		display: flex;
		justify-content: space-between;
		padding: 30upx;
		border-top: 20upx solid #f9f9f9;
		.storeimg{
			width:96upx;
			height:96upx;
			border-radius:4upx;
			margin-right: 20upx;
		}
		.storename{
			font-size:29upx;
			color:rgba(0,0,0,1);
		}
		.exp{
			font-size: 18upx;
			color: #404040;
			height:50upx;
			background:rgba(245,245,245,1);
			border-radius:25upx;
			padding: 0 10upx;
			.star{
				width:16upx;
				height:16upx;
				margin: 16upx 0 0 5upx;
			}
		}
		.plan{
			height:48upx;
			border:1upx solid rgba(222,28,110,1);
			border-radius:24upx;
			font-size: 24upx;
			margin-left: 20upx;
			color: rgba(222,28,110,1);
			padding: 0 20upx;
		}
	}
	
}
</style>
