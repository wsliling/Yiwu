<template>
	<view>
		
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	export default {
		components: {
			noData,
			uniLoadMore
		},
		data() {
			return {
				hasData: false,
				noDataIsShow: false,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				pageSize:6,
				page: 1,
				isLoad: false,
				datalist:[],//数据
			}
		},
		onShow() {
			
		},
		 computed: {
		   
		  },
		methods: {
			goUrl(url){
			  uni.navigateTo({
				url:url
			  })
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
</style>
