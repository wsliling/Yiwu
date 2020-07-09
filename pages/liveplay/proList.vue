<template>
	<view class="bottom-content">
		<scroll-view scroll-y class="scroll">
			<view class="item" v-for="(item, index) in list" :key="index">
				<view class="imgbox"><image class="img" :src="item.PicNo" mode="aspectFill"></image></view>
				<view class="right">
					<text class="title">{{item.Name}}</text>
					<view class="txtBox">
						<text class="price">￥{{item.Price}}</text>
						<text class="r_btn" :class="{'bg999':item.confirmText=='取消推荐'}" @click="$emit('confirm',item)">{{item.confirmText?item.confirmText:confirmText}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	props:{
		list:{
			type:Array,
			default(){
				return [];
			}
		},
		confirmText:{
			type:String,
			default:'立即购买'
		}
	},
	data() {
		return {};
	}
};
</script>

<style scoped>
.bottom-content {
	padding: 20upx 0;
	background-color: #ffffff;
	width:750upx;
	height: 800upx;
}
.scroll {
	width:750upx;
	height: 800upx;
}
.item {
	width:750upx;
	padding:30upx 20upx;
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: #ffffff;
}
.imgbox {
	width: 200upx;
	height: 200upx;
}
.img{
	width: 200upx;
	height: 200upx;
	border-radius:15upx;
}
.right{
	height:200upx;width:510upx;
	display:flex;
	flex:1;
	flex-flow:column nowrap;
	justify-content: space-between;
}
.txtBox {
	width: 510upx;
	padding-right:30upx;
	display:flex;
	/* flex-flow:row nowrap!important; */
	/* flex-flow:column nowrap; */
	flex-direction: row;
	justify-content:space-between;
	align-items:center;
}
.price{
	color:#dd196d;
	font-size:30upx;
	font-weight:bold;
}
.r_btn {
	background-color: #dd196d;
	color: #ffffff;
	padding:0 30upx;
	border-radius:50upx;
	height: 50upx;
	text-align: center;
	line-height: 50upx;
	font-size: 24upx;
}
.bg999{
	background-color:#999999!important;
}
</style>
