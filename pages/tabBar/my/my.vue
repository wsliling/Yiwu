<template>
	<view>
		<view class="header">
			<view class="editor ">
				<image class="img30" src="@/static/tabbar/my/editor.png"></image>
			</view>
			<view class="user">
				<view class="user-left">
					<view class="user-img">
						<view>
							<image src="@/static/tabbar/my/user.png" mode=""></image>
						</view>
					</view>
					<view class="user-name">
						<view class="name">ladingwu</view>
						<view class="text">简介：一个热爱拉丁舞的爱好...</view>
					</view>
				</view>
				<view class="user-right">
					<image src="@/static/tabbar/my/sign.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="info">
			<view class="item">
				<view>
					896. <span>26</span>
				</view>
				<span class="text">
					零钱(元)
				</span>
			</view>
			<view class="item">
				<view>25</view>
				<span class="text">粉丝</span>
			</view>
			<view class="item">
				<view>628</view>
				<span class="text">被赞</span>
			</view>
			<view class="item">
				<view>221</view>
				<span class="text">关注</span>
			</view>
		</view>
		<view class="info1">
			<view class="item">
				<image src="@/static/tabbar/my/icon1.png" mode="aspectFit"></image>
				<view>我的收入<span>24.6w</span></view>
				
			</view>
			<view class="item">
				<image src="@/static/tabbar/my/icon2.png" mode="aspectFit"></image>
				<view>我的积分<span>890</span></view>
				
			</view>
			<view class="item">
				<image src="@/static/tabbar/my/icon3.png" mode="aspectFit"></image>
				<view>
					直播币
					<span>4567</span>
				</view>
			</view>
			<view class="item">
				<image src="@/static/tabbar/my/icon4.png" mode="aspectFit"></image>
				<view>我的订单
				<span>12</span>
				</view>
			</view>
		</view>
		<view class="sevice">
			<view class="item">
				<view class="item-left">
					<image  src="@/static/tabbar/my/icon5.png" mode="aspectFit"></image>
					<view>购物车</view>
				</view>
				<view class="item-right">
					<image src="@/static/tabbar/my/icon-right.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="item">
				<view class="item-left">
					<image  src="@/static/tabbar/my/icon6.png" mode="aspectFit"></image>
					<view>认证中心</view>
				</view>
				<view class="item-right">
					<image src="@/static/tabbar/my/icon-right.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="item">
				<view class="item-left">
					<image  src="@/static/tabbar/my/icon7.png" mode="aspectFit"></image>
					<view>我的作品</view>
				</view>
				<view class="item-right">
					<image src="@/static/tabbar/my/icon-right.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="item">
				<view class="item-left">
					<image  src="@/static/tabbar/my/icon8.png" mode="aspectFit"></image>
					<view>我上传的舞曲</view>
				</view>
				<view class="item-right">
					<image src="@/static/tabbar/my/icon-right.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="item">
				<view class="item-left">
					<image  src="@/static/tabbar/my/icon9.png" mode="aspectFit"></image>
					<view>我的收藏</view>
				</view>
				<view class="item-right">
					<image src="@/static/tabbar/my/icon-right.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="item">
				<view class="item-left">
					<image  src="@/static/tabbar/my/icon10.png" mode="aspectFit"></image>
					<view>我购买的课程</view>
				</view>
				<view class="item-right">
					<image src="@/static/tabbar/my/icon-right.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="item">
				<view class="item-left">
					<image  src="@/static/tabbar/my/icon11.png" mode="aspectFit"></image>
					<view>加入官方交流</view>
				</view>
				<view class="item-right">
					<image src="@/static/tabbar/my/icon-right.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="item">
				<view class="item-left">
					<image  src="@/static/tabbar/my/icon12.png" mode="aspectFit"></image>
					<view>客服服务</view>
				</view>
				<view class="item-right">
					<image src="@/static/tabbar/my/icon-right.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="item">
				<view class="item-left">
					<image  src="@/static/tabbar/my/icon13.png" mode="aspectFit"></image>
					<view>关于我们</view>
				</view>
				<view class="item-right">
					<image src="@/static/tabbar/my/icon-right.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="item">
				<view class="item-left">
					<image  src="@/static/tabbar/my/icon14.png" mode="aspectFit"></image>
					<view>设置</view>
				</view>
				<view class="item-right">
					<image src="@/static/tabbar/my/icon-right.png" mode="aspectFit"></image>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
</style>
