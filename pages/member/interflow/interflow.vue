<template>
	<!-- 加入官方交流 -->
	<view class="interflow">
		<view class="inter-img">
			<image :src="list.WebLogo" mode=""></image>
		</view>
		<view class="inter-box">
			<view class="flex-between inter-bott">
				<view class="txt30">官方微博</view>
				<view class="txt">{{list.Microblog}}</view>
			</view>
			<view class="flex-between inter-bott">
				<view class="txt30">官方微信</view>
				<image :src="list.Wechat" mode=""></image>
			</view>
			<view class="flex-between inter-bott">
				<view class="txt30">官方QQ</view>
				<view class="txt">{{list.WebQQ}}</view>
			</view>
			<view class="flex-between inter-bott">
				<view class="txt30">Facebook</view>
				<view class="txt">{{list.FaceBook}}</view>
			</view>
			<view class="flex-between inter-bott">
				<view class="txt30">INS</view>
				<view class="txt">{{list.INS}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { post } from '@/common/util.js';
	export default {
		data(){
			return {
				list: {},
			}
		},
		onLoad() {
			this.getWebConfiguration()
		},
		methods:{
			getWebConfiguration(){
				post('System/GetWebConfiguration').then( res=> {
					this.list = res.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.interflow{
		.inter-img{
			padding: 95upx 0 63upx;
			text-align: center;
			image{
				width:171upx;
				height:171upx;
			}
		}
		.inter-box{
			background: #fff;
			padding: 0 30upx;
			.inter-bott{
				padding: 30upx 0 ;
				border-bottom: 1upx solid #f2f2f2;
				image{
					width:180upx;
					height:180upx;
				}
				.txt30{
					font-size: 30upx;
					font-weight: bold;
				}
				.txt{
					color: #666;
				}
				&:last-child{
					border-bottom:none;
				}
			}
		}
	}
</style>
