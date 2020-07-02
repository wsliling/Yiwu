<template>
    <view class="live">
        <view class="live-img">
            <image :src="item.BannerPicNo" mode="" @click="navigate('shopSon/shopHome/shopHome',{shopId:item.ShopId})"></image>
            <view class="islive">
                <view class="line line1"></view>
                <view class="line line2"></view>
                <view class="line line3"></view>
                <view class="txt">正在直播</view>
            </view>
        </view>
        <view class="live-item">
            <view class="live-box"  v-for="(item,index) in item.ProductList" :key="index"
                    @click="navigate('shopSon/product/productDetails',{proId:item.Id})">
                <image :src="item.PicNo" mode=""></image>
                <view class="live-day" v-if="item.IsExplosive||item.IsRecommend||item.IsNewProduct">
                    {{item.IsExplosive?'今日爆款':item.IsRecommend?'推荐':item.IsNewProduct?'新品':''}}
                </view>
                <view class="live-int">
                    <view class="live-tit">{{item.Name}}</view>
                    <view class="live-ef" v-if="item.IsPlatform||item.IsHot||item.IsRecommend">
                        {{item.IsPlatform?'自营':item.IsHot?'超级好物':item.IsRecommend?'推荐好物':''}}
                    </view>
                    <view class="live-price"><span>￥</span>{{item.Price}}</view>
                </view>
            </view>
        </view>
        
    </view>
</template>
<script>
import {navigate} from '@/common/util.js'
export default {
    props:{
        item:{
            type:Object,
            default(){return {}}
        }
    },
    data(){
        return {
            navigate
        }
    }
}
</script>
<style lang="scss" scoped>

// 正在直播
.live {
	width: 100%;
	margin-top: 20upx;
	padding: 30upx;
	.live-img {
		image {
			height: 386upx;
			border-radius: 6upx 6upx 0 0;
		}
		.islive {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			left: 48upx;
			bottom: -176upx;
			padding: 0 20upx;
			border-radius: 8upx;
			height: 45upx;
			background: rgba(52, 52, 52, 0.5);
			color: #fff;
			.line {
				width: 4upx;
				background: #DE1A6E;
				margin-right: 6upx;
			}
			.line1 {
				height: 24upx;
				animation: myanimation 0.6s infinite 0.5s;
				-webkit-animation: myanimation 0.6s infinite 0.5s;
			}
			.line2 {
				height: 10upx;
				animation: myanimation 0.6s infinite 1s;
				-webkit-animation: myanimation 0.6s infinite 1s;
			}
			.line3 {
				height: 14upx;
				animation: myanimation 0.6s infinite 1.5s;
				-webkit-animation: myanimation 0.6s infinite 1.5s;
			}
			.txt {
				font-size: 26upx;
				line-height: 1;
				font-weight: bold;
			}
		}
	}
	.live-item {
		display: flex;
		// justify-content: space-between;
		background: #fff;
		padding: 30upx 0 30upx 20upx;
		width: 100%;
		.live-box {
			padding-right: 25upx;
			width: 33%;
			image {
				width: 198upx;
				height: 198upx;
				border-radius: 6upx;
			}
			.live-int{
				.live-tit {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.live-ef{
					width:110upx;
					height: 30upx;
					line-height: 30upx;
					text-align: center;
					font-size: 22upx;
					color: #D2B86E;
					border:1px solid rgba(210,184,110,1);
					border-radius:4px;
					margin: 15upx 0;
				}
				.live-price{
					color: #343434;
					font-weight: bold;
					font-size: 30upx;
					span{
						font-size: 24upx;
					}
				}
			}
			.live-day{
				height:40upx;
				background:linear-gradient(90deg,rgba(229,70,138,1),rgba(222,26,110,1));
				border-radius:6upx 0 10upx 0;
				font-size:22upx;
				color:rgba(255,255,255,1);
				line-height:40upx;
				text-align: center;
				padding: 0 10upx;
				position: absolute;
				bottom: -48.5%;
			}
		}
	}
}
</style>