<template>
	<view class="uni-product" @click="getproid(data.Id)">
		<view class="itembox">
			<view class="image-view">
				<image class="uni-product-image" :src="data.ProductImg ? data.ProductImg : 'http://via.placeholder.com/150x200'"
				 mode="aspectFill"></image>
			</view>
			<view class="txtbox">
				<view class="uni-product-title">{{data.Name}}</view>
				<view class="uni-product-price">
					<text class="uni-product-price-original">￥{{data.Price}}</text>
					<text class="uni-product-price-favour" style="display: none;">￥{{data.MarketPrice}}</text>
					<text class="uni-product-sale">已售{{data.SalesVolume}}</text>
				</view>
				<view class="plus-price" v-if="data.IsPlusPrice==1">
					￥{{data.PlusPrice}}<text class="icon icon-plusprice"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'product',
		//props: ['image', 'title', 'originalPrice', 'favourPrice', 'tip']
		props: {
			data: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		},
		methods: {
			getproid(id) {
				this.$emit('goDetail', id);
			},
		}
	}
</script>

<style scoped>
	.uni-product {
		padding: 0;
		width: 365upx;
		/* #ifdef H5 */
		width: 50%;
		/* #endif */
		margin-bottom: 20upx;
	}

	.uni-product .itembox {
		height: 100%;
		margin-right: 20upx;
		background: #fff;
		border-radius: 6px;
		overflow: hidden;
	}

	.uni-product .image-view {
		margin: 0;
		width: 100%;
	}

	.uni-product .uni-product-image {
		width: 100%;
	}

	.uni-product .txtbox {
		padding: 18upx;
	}

	.uni-product .uni-product-sale {
		float: right;
		font-size: 24upx;
		color: #999;
	}
	/* .uni-product-price-original{ font-size: 36upx;} */
	.plus-price .icon-plusprice{ display: inline-block; vertical-align: middle; height: 28upx; width: 60upx; background: url(http://www.sc-mall.net/static/plus/plus_icon.png) right center no-repeat; background-size: 100%; }
</style>
