<template>
	<view>
		<view v-if="AuditStatus == -1">
			<view class="line-list" style="margin-top: 20upx;">
				<view class="line-item">
					<view class="lab star">
						姓名
						<span>*</span>
					</view>
					<view class="item_r flex1"><input type="text" v-model="Name" placeholder="请输入姓名" class="flex1" /></view>
				</view>
				<view class="line-item">
					<view class="lab star">
						电话
						<span>*</span>
					</view>
					<view class="item_r flex1"><input type="text" v-model="Mobile" placeholder="请输入联系方式" class="flex1" /></view>
				</view>
				<view class="line-item">
					<view class="lab star">
						微信
						<span>*</span>
					</view>
					<view class="item_r flex1"><input type="text" v-model="WeChat" placeholder="请输入微信" class="flex1" /></view>
				</view>
				<view class="line-item">
					<view class="lab">QQ</view>
					<view class="item_r flex1"><input type="text" v-model="QQmark" placeholder="请输入QQ" class="flex1" /></view>
				</view>
				<view class="line-item">
					<view class="lab">品牌</view>
					<view class="item_r flex1"><input type="text" v-model="brand" placeholder="请输入品牌,可不填" class="flex1" placeholder-style="color: #666;" /></view>
				</view>
				<view class="line-item" style="flex-wrap: wrap;">
					<view class="lab" style="width: 100%;">简述</view>
					<view class="item_r" style="width: 100%;border-bottom: 1upx solid #f2f2f2;">
						<textarea value="" v-model="sketch" maxlength="300" placeholder="请输入简要说明" />
					</view>
				</view>
			</view>
			<!-- <view class="tips flex-start pp3">
				<text class="red">*</text>请留下您的联系方式，我们会和您联系
			</view> -->
			<view style="height: 110upx;"></view>
			<view class="fixedbtn" @click="submit"><view class="btn">提交</view></view>
		</view>
		<attestation :AuditStatus="AuditStatus" @toAnew="anew"></attestation>
	</view>
</template>

<script>
import { post, toast, valPhone, navigateBack } from '@/common/util';
import attestation from '@/components/attestation.vue'; //认证中心
export default {
	data() {
		return {
			userId: '',
			token: '',
			Name: '', //姓名
			Mobile: '', //电话
			WeChat: '', //微信
			QQmark: '', //QQ
			brand: '', //品牌
			sketch: '', //简述
			AuditStatus: '' //审核状态  0-审核通过  1-待审核  2-审核失败  -1未提交过
		};
	},
	components: { attestation },
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getApplyShop();
	},
	onShow() {},
	methods: {
		async getApplyShop() {
			// "AuditStatus": //审核状态 0-审核通过1-待审核2-审核失败-1未提交过
			const res = await post('Shop/GetApplyShopInfo', {
				userId: this.userId,
				token: this.token
			});
			const data = res.data;
			(this.Name = data.Name), (this.Mobile = data.Mobile), (this.WeChat = data.WeChat), (this.QQmark = data.QQ), (this.brand = data.Brand), (this.sketch = data.Description);
			this.AuditStatus = data.AuditStatus;
		},
		async submit() {
			const verify = this.verify();
			if (verify && verify !== Boolean) {
				toast(verify);
				return;
			}
			const res = await post('Shop/ApplyShop', {
				userId: this.userId,
				token: this.token,
				Name: this.Name,
				Mobile: this.Mobile,
				Wechat: this.WeChat,
				QQ: this.QQmark,
				Brand: this.brand,
				Email: '',
				Description: this.sketch
			});
			if (res.code === 0) {
				toast('提交成功！等待管理员审核', { icon: true });
				navigateBack();
			}
		},
		verify() {
			if (!this.Name) {
				return '请输入姓名';
			}
			if (!valPhone(this.Mobile)) return true;
			if (!this.WeChat) {
				return '请输入微信号';
			}
			return;
		},
		// 重新认证
		anew() {
			this.AuditStatus = -1;
			this.Name = ''; //姓名
			this.Mobile = ''; //电话
			this.WeChat = ''; //微信
			this.QQmark = ''; //QQ
			this.brand = ''; //品牌
			this.sketch = ''; //简述
		}
	}
};
</script>

<style lang="scss">
page {
	// background: #fff;
}
.lab {
	width: 160upx;
}
.tips {
	font-size: 24upx;
	color: #666;
	text {
		font-size: 40upx;
		font-weight: bold;
		line-height: 1;
		margin-right: 10upx;
	}
}
.star {
	span {
		color: #ff3333;
	}
}
</style>
