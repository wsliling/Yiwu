<template>
	<view>
		<view class="upbox">
			<textarea placeholder="请填写视频/课程的标题" />
			<view class="videobox">
				<image src="/static/videoUp.png"></image>
			</view>
		</view>
		<view class="pricebox" v-if="type==1">
			<text>价格</text>
			<input type="number" placeholder="请输入价格" />
			<label @click="hascheck=!hascheck">
				<radio class="radio" :color="hascheck?'#de1b6e':'#999'" checked="true"></radio><text>免费</text>
			</label>
		</view>
		<view class="btnbox">确定</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:0,//0：拍视频 1：课程
				hascheck:false,//是否选中免费
			};
		},
		onLoad(e){
			this.type=e.type
		}
	}
</script>

<style lang="scss">
.upbox{
	display: flex;
	padding: 70upx 30upx 40upx 30upx;
	background-color: #fff;
	textarea{
		width: 430upx;
		height: 245upx;
		margin-right: 30upx;
	}
	.videobox{
		width: 230upx;
		height: 245upx;
		image{
			width: 230upx;
			height: 245upx;
			border-radius: 6upx;
		}
	}
}
.pricebox{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30upx;
	height: 90upx;
	border-top: 1px #ececec solid;
	border-bottom: 1px #ececec solid;
	background-color: #fff;
	.radio{
		transform:scale(0.76)
	}
}
.btnbox{
	width: 690upx;
	height: 88upx;
	line-height: 88upx;
	border-radius: 44upx;
	text-align: center;
	font-size: 32upx;
	color: #fff;
	background-color: #de1b6e;
	position: fixed;
	left: 30upx;
	bottom: 20upx;
}
</style>
