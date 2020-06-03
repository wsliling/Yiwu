<template>
	<view class="myPage uni-bg-white">
		<view class="pd15">
			<view class="flex-end">
				<view class="set iconfont icon-shezhi"></view>
			</view>
			<view class="memberTop flex-between">
				<view class="info">
					<view class="name uni-ellipsis">心善若水</view>
					<view class="c_theme">查看并编辑个人资料</view>
					<view class="datanum flex-start">
						<view class="flex-start">
							关注<text class="num">90</text>
						</view>
						<view class="flex-start">
							粉丝<text class="num">490</text>
						</view>
					</view>
				</view>
				<view class="tx">
					<image src="/static/default.png" mode="widthFix"></image>
				</view>
			</view>
			<!-- 消息中心 -->
			<view class="member_section border_bottom">
				<view class="section_hd">消息中心</view>
				<view class="section_bd">
					<view class="li_33">
						<view class="item">
							<view class="iconImg p_re">
								<view class="iconfont icon-xiaoxi"></view>
								<text class="circleNum"></text>
							</view>
							<view class="txt">未读消息</view>
						</view>
						<view class="item">
							<view class="iconImg">
								<view class="iconfont icon-youjian"></view>
							</view>
							<view class="txt">已读消息</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 我的圈子 -->
			<view class="member_section border_bottom">
				<view class="section_hd">我的圈子</view>
				<view class="section_bd">
					<view class="li_33">
						<view class="item">
							<view class="iconImg">
								<view class="iconfont icon-aixin2"></view>
							</view>
							<view class="txt">我的收藏</view>
						</view>
						<view class="item">
							<view class="iconImg">
								<view class="iconfont icon-xiangji"></view>
							</view>
							<view class="txt">我的发布</view>
						</view>
						<view class="item">
							<view class="iconImg">
								<view class="iconfont icon-guanzhu"></view>
							</view>
							<view class="txt">我的关注</view>
						</view>
						<view class="item">
							<view class="iconImg">
								<view class="iconfont icon-pinglun1"></view>
							</view>
							<view class="txt">查看回复</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 更多服务 -->
			<view class="member_section">
				<view class="section_hd">更多服务</view>
				<view class="section_bd">
					<view class="li_33">
						<view class="item">
							<view class="iconImg">
								<view class="iconfont icon-youhuiquan"></view>
							</view>
							<view class="txt">优惠券</view>
						</view>
						<view class="item">
							<view class="iconImg">
								<view class="iconfont icon-fapiao"></view>
							</view>
							<view class="txt">发票中心</view>
						</view>
						<view class="item">
							<view class="iconImg">
								<view class="iconfont icon-bianji"></view>
							</view>
							<view class="txt">我要评价</view>
						</view>
						<view class="item">
							<view class="iconImg">
								<view class="iconfont icon-help"></view>
							</view>
							<view class="txt">获取帮助</view>
						</view>
						<view class="item">
							<view class="iconImg">
								<view class="iconfont icon-fankui"></view>
							</view>
							<view class="txt">意见反馈</view>
						</view>
						<view class="item">
							<view class="iconImg">
								<view class="iconfont icon-anquan1"></view>
							</view>
							<view class="txt">安全中心</view>
						</view>
						<view class="item">
							<view class="iconImg">
								<view class="iconfont icon-kefu"></view>
							</view>
							<view class="txt">联系客服</view>
						</view>
					</view>
				</view>
			</view>
			<view class="ftbtn flex-column uni-mb10">
				我也想要星球客
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
