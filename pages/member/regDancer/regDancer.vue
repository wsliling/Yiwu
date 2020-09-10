<template>
	<view>
		<view v-if="AuditStatus == -1">
			<view class="line-list" style="margin-top: 20upx;">
				<view class="line-item">
					<view class="lab">真实姓名<span>*</span></view>
					<view class="item_r flex1"><input type="text" placeholder="请输入姓名" class="flex1" v-model="name" /></view>
				</view>
				<view class="line-item">
					<view class="lab">联系方式<span>*</span></view>
					<view class="item_r flex1"><input type="text" placeholder="请输入联系方式" class="flex1" v-model="phone" /></view>
				</view>
				<view class="line-item" style="flex-wrap: wrap;">
					<view class="lab" style="width: 100%;">认证说明<span>*</span></view>
					<view class="item_r" style="width: 100%;"><textarea value="" maxlength="300" v-model="explain" placeholder="请填写院校/培训机构、相关头衔和简介" /></view>
				</view>
				<view class="line-item" @click="uplLoadImg">
					<view class="picbox flex-column">
						<image class="img" v-if="picStr" :src="picStr" mode="aspectFill"></image>
						<text class="c_999" v-else>头衔相关证明<span>*</span></text>
					</view>
				</view>
			</view>
			<view class="tips flex-start pp3">
				<text class="red">*</text>
				全部为必填信息，务必认真填写
			</view>
			<view style="height: 110upx;"></view>
			<view class="fixedbtn" @click="submit"><view class="btn">提交</view></view>
		</view>
		<attestation v-if="AuditStatus!=''" :AuditStatus="AuditStatus" @toAnew="anew"></attestation>
	</view>
</template>

<script>
import { post, toast, valPhone, navigateBack } from '@/common/util';
import { pathToBase64 } from '@/common/image-tools.js';
import attestation from '@/components/attestation.vue'; //认证中心
export default {
	data() {
		return {
			picStr: '',
			name: '',
			phone: '',
			explain: '', //说明
			AuditStatus: '' //审核状态  0-审核通过  1-待审核  2-审核失败  -1未提交过
		};
	},
	components: { attestation },
	onLoad() {
		this.getData();
	},
	onShow() {},
	methods: {
		async getData() {
			// "AuditStatus": //审核状态 0-审核通过1-待审核2-审核失败-1未提交过
			const res = await post('User/GetDancerInfo', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token')
			});

			if (res.code !== 0) return;
			const data = res.data;
			this.name = data.Name;
			this.phone = data.Mobile;
			this.explain = data.Remark;
			this.AuditStatus = data.AuditStatus;
			this.picStr = data.PicImg;
			// 跨域的下载图片
			// const that = this;
			// uni.downloadFile({
			// 	url:data.PicImg,
			// 	success(e){
			// 		that.picStr = e.tempFilePath;
			// 		console.log(e,'download')
			// 	}
			// })
		},
		//上传
		uplLoadImg() {
			console.log('尝试打开上传图片');
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: res => {
					console.log('成功打开上传图片', res);
					// tempFilePath可以作为img标签的src属性显示图片
					this.picStr = res.tempFilePaths[0];
				},
				fail(err) {
					console.log('打开失败', err);
				}
			});
		},
		async submit() {
			let tips = this.verify();
			if (tips && tips !== Boolean) {
				toast(tips);
				return;
			}
			let img = await pathToBase64(this.picStr);
			const res = await post('User/DanCerAuthentication', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token'),
				Mobile: this.phone,
				Name: this.name,
				Remark: this.explain,
				PicImg: img
			});
			if (res.code === 0) {
				toast('提交成功！等待管理员审核', { icon: false });
				navigateBack();
			}
		},
		verify() {
			if (!this.name) {
				return '请输入姓名';
			}
			if (!valPhone(this.phone)) return true;
			if (!this.explain) {
				return '请输入认证说明';
			}
			if (!this.picStr) {
				return '请上传头衔相关证明';
			}
			return false;
		},
		// 重新认证
		anew() {
			this.AuditStatus = -1;
			this.picStr = '';
			this.name = '';
			this.phone = '';
			this.explain = '';
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	// background: #fff;
}
.lab {
	width: 160upx;
}
.picbox {
	width: 100%;
	background: #f2f2f2;
	border-radius: 12upx;
	overflow: hidden;
	height: 360upx;
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
.line-item{
	span{
		color:#ff3333;
	}
}
.line-item textarea {
	width: 100%;
}
</style>
