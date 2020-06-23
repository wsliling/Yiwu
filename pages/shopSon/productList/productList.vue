<template>
	<view class="content">
		<!-- --#ifdef MP-WEIXIN -->
		<view class="MP-header header-search">
			<view class="input-view">
				<view class="uni-icon uni-icon-search"></view>
				<input confirm-type="search" class="input" type="text" placeholder="想搜什么？" v-model="searchkey" />
			</view>
			<view class="searchbtn c_theme" @click="search">搜索</view>
		</view>
		<view style="height: 80upx;"></view>
		<!-- #endif -->
		<filter-Product :cidId="cid" :typeid="TypeId" :searchkey="searchkey" :couponid="couponId" :isBrand="true" :isFilter="true" ref="filterProduct"></filter-Product>
	</view>
</template>

<script>
	import {host,post,get,SEOTitle} from '@/common/util.js';
	// import '@/common/dd_style.css';
	import filterProduct from '../components/filterProduct.vue';
	export default {
		components: {
			filterProduct
		},
		onLoad:function(option){
			this.cid=option.id;
			this.TypeId=option.typeId;
			this.couponId=option.couponid;
		},
		onShow(){
			// #ifndef MP-WEIXIN
			   SEOTitle('');
			// #endif
		},
		data() {
			return {
				shiftType:false,
				showRigth: false,
				showLeft: false,
				cid:"",     //分类id
				searchkey:"",//输入框的值
				TypeId:"",
				couponId:""
			};
		},
		methods: {
			goDetail(id){
				let proId=id;console.log(proId)
				uni.navigateTo({
					url: '/pages/productDetail/productDetail?proId='+proId,
				})
			},
			btnShiftType(){
				this.shiftType = !this.shiftType;
			},
			show(e) {
				if (e === 'left') {
					this.showLeft = true
				} else {
					this.showRigth = true
				}
			},
			closeDrawer(e) {
				if (e === 'left') {
					this.showLeft = false
				} else {
					this.showRigth = false
				}
			},
			sureFilter(){
				this.showLeft = false
				this.showRigth = false
			},
			// #ifdef MP-WEIXIN
			search(){
				if(this.searchkey==""){
					uni.showModal({
						title: '提示',
						content: '请输入内容。',
						success: res => {
							if (res.confirm) {
							}
						}
					});
					return;
				}else{
					this.$refs.filterProduct.searchPro();
				}
			}
			// #endif
		},
		onPullDownRefresh(){  //下拉刷新
			//监听下拉刷新动作的执行方法，每次手动下拉刷新都会执行一次
			this.$refs.filterProduct.Refresh();
		},
		onReachBottom() {  //上拉加载
			this.$refs.filterProduct.loadMore();
		},
		onNavigationBarButtonTap(){
			this.$refs.filterProduct.searchPro();
		},
		onNavigationBarSearchInputChanged(e){
			this.searchkey=e.text;
		}
	}
</script>

<style lang="scss" scoped>
  .content{
	  height: 100%;
  }
  .filterProductBox{
	  height: calc(100% - 76upx);
	  overflow: hidden;
	  overflow-y: auto;
  }
  
.MP-header {
	display: flex;
	flex-direction: row;
	padding: 0 20upx 20upx;
	box-sizing: border-box;
	align-items: center;
	position: fixed;
	width: 100%;
	left: 0;
	top: 0;
	z-index: 99;
	background: #f5f5f5;
}
.MP-header .input-view {
	display: flex;
	align-items: center;
	flex-direction: row;
	background-color: #fff;
	height: 30px;
	border-radius: 15px;
	padding: 0 10px;
	flex: 1;
}
.MP-header .input {
	flex: 1;
	padding: 0 5px;
	height: 24px;
	line-height: 24px;
	font-size: 14px;
}
.MP-header .searchbtn{padding-left: 20upx;}
</style>
