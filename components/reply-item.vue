<template>
	<view class="comment-item">
		<view class="comment-hd flex-between">
			<view class="flex-start">
				<view class="tx">
					<image src="@/static/of/2.png" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="name">高晓丽</view>
					<view class="time">2020-06-04</view>
				</view>
			</view>
			<view class="flex-end">
				<view class="txt_info reply">
					<image class="icon" src="@/static/reply2.png"></image>
					{{"回复"||"256"}}
				</view>
				<view class="txt_info zan"><image class="icon" src="@/static/zan.png"></image>{{"点赞"||"256"}}</view>
			</view>
		</view>
		<view class="comment-con">
			这个拉丁舞蹈妆容真的爱了爱了，显得超级高级，显得五官更加立体了哦！
		</view>
		<view class="comment-reply">
			<view class="item">
				<view class="reply-hd flex-between">
					<view class="flex-start">
						<view class="tx">
							<image src="@/static/of/1.png" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="name">高晓丽</view>
							<view class="time">2020-06-04</view>
						</view>
					</view>
					<view class="flex-end">
						<view class="txt_info zan"><image class="icon" src="@/static/zan.png"></image>点赞</view>
					</view>
				</view>
				<view class="reply-con">
					真的吗，不敢相信
				</view>
			</view>
			<view class="item">
				<view class="reply-hd flex-between">
					<view class="flex-start">
						<view class="tx">
							<image src="@/static/of/2.png" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="name">小小酥</view>
							<view class="time">2020-06-04</view>
						</view>
					</view>
					<view class="flex-end">
						<view class="txt_info zan active"><image class="icon" src="@/static/zan2.png"></image>15</view>
					</view>
				</view>
				<view class="reply-con">
					<text class="c_999">回复</text>小小酥：好的，是的
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'reply',
		props: {
			itemData: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			//跳转
			tolink(Url) {
				uni.navigateTo({
					url: Url
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.comment-item{
		padding: 30upx;
		border-bottom: 1px solid #f5f5f5;
		.comment-hd{
			.tx{
				height: 90upx; width: 90upx;
			}
			.name{ font-size: 28upx;}
			
		}
		.info{ line-height: 1.3;}
		.time{
			color: #999; font-size: 24upx;
		}
		.tx {
			border-radius: 50%; 
			overflow: hidden;
			margin-right: 20upx;
			image{
				width: 100%; height: 100%; 
			}
		}
		.comment-con{
			line-height: 1.5;margin-left: 110upx;
		}
		.comment-reply{
			margin-left: 14upx;
			.item{ margin-top: 20upx;}
			.tx{
				height: 76upx; width: 76upx;
			}
			.name{ font-size: 26upx;}
			.time{
				font-size: 22upx;
			}
			.reply-con{
				margin-left: 96upx;
				color: #555; font-size: 26upx;
			}
		}
		.name{
			max-width: 200upx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.txt_info{ 
			color: #999;
		    font-size: 24upx;
			margin-left: 20upx;
			display: flex;
			justify-content: flex-start;
			.icon{
				display: block;
				height: 34upx;
				width: 34upx;
				margin-right: 6upx;
			}
			&.active{
				color: $primary;
			}
		}
	}
</style>
