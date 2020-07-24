<template>
    <view class="live">
        <view class="live-img">
			<!-- #ifdef MP-WEIXIN -->
            <view class="islive" v-if="item.IsLive==1" @click="navigate('liveplay/live',{id:item.MemberId})">
                <view class="line line1"></view>
                <view class="line line2"></view>
                <view class="line line3"></view>
                <view class="txt">正在直播</view>
            </view>
			<!-- #endif -->
            <image :src="item.BannerPicNo" mode="aspectFill" @click="navigate('shopSon/shopHome/shopHome',{shopId:item.ShopId})"></image>

        </view>
        <view class="live-item">
            <view class="live-box"  v-for="(item,index) in item.ProductList" :key="index"
                    @click="navigate('shopSon/product/productDetails',{proId:item.Id})">
                <image :src="item.PicNo" mode="aspectFill"></image>
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
	margin: 30upx 30upx 0;
	background: #fff;
	border-radius: 12upx;
	overflow: hidden;
	.live-img {
		position:relative;
		image {
			height: 386upx;
			border-radius: 6upx 6upx 0 0;
			background: #eee;
		}
		.islive {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			left: 30upx;
			top: 30upx;
			z-index:9;
			padding: 0 20upx;
			border-radius: 8upx;
			height: 45upx;
			width:auto;
			margin-left:0;
			color: #fff;
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
		padding: 20upx 0 20upx 20upx;
		.live-box {
			padding-right: 20upx;
			width: 33.33%;
			image {
				width: 100%;
				height: 216upx;
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