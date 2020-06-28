<template>
	<!-- 问大家 -->
	<view class="askeveryone">
		<view class="ask-box" v-for="(val,key) in 2" :key="key">
			<view class="ask"><span>问</span>衣服质量怎么样？</view>
			<view class="ask color"><span>答</span>质量很好，值得购买，要买的小伙伴可以去买了</view>
			<view class="flex-between">
				<view class="ask-txt">2010-03-12</view>
				<view class="flex">
					<view class="ask-txt txt">共26个回答</view>
					<image src="../../../static/my/icon-right.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="ask-bottom">问大家</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.askeveryone{
		.ask-box{
			margin-top: 20upx;
			background: #fff;
			padding: 30upx;
			.ask{
				padding-bottom: 20upx;
				span{
					height:26upx;
					background:rgba(222,27,110,1);
					border-radius:6upx;
					font-size:20upx;
					line-height: 26upx;
					color:rgba(255,255,255,1);
					padding: 0 6upx;
					margin-right: 10upx;
				}
			}
			.color{
				span{
					background:rgba(98,160,247,1);
				}
			}
			.ask-txt{
				font-size: 26upx;
				color: #999999;
				
			}
			.txt{
				color: #666666;
			}
			image{
				width:18upx;
				height:24upx;
				margin: 12upx 0 0 16upx;
			}
		}
		.ask-bottom{
			width: 90%;
			height:88upx;
			background:rgba(222,27,110,1);
			border-radius:44upx;
			font-size:32upx;
			color:rgba(255,255,255,1);
			line-height:88upx;
			position: fixed;
			bottom: 20upx;
			text-align: center;
			margin: 0 30upx;
		}
	}
</style>
