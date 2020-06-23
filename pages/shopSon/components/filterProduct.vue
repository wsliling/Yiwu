<template>
	<view class="filterContent">
		<view :class="['filterMenu',isfixed?'scroll':'']">
			<view class="menu li_25 clear center">
				<view class="item" :class="{'active':item.active}" @click="shiftFilterTab(index)" v-for="(item,index) in filterTab"
				 :key="index">{{item.name}}<text v-if="item.isSortorder" class="filterBtn" :class="{'upBtn':item.sortorder==1,'downBtn':item.sortorder==0}"></text></view>
				<view class="item" v-if="isFilter" @click="visible">筛选<text class="icon-filter"></text></view>
			</view>
			<view class="shift" :class="{'dan-filter':!shiftType}" @click="btnShiftType"></view>
		</view>
		<view :class="['filterProductBox',isfixed?'pd0':'']">
			<block v-if="prolist.length">
				<view class="uni-product-list uni-mt10" :class="{'level__product-list':shiftType}" style="padding-left: 20upx;">
					<block v-for="(item,index2) in prolist" :key="index2">
						<product :data="item" v-on:goDetail="goDetail"></product>
					</block>
				</view>
				<view class="uni-tab-bar-loading">
					<uni-load-more :loadingType="loadingType"></uni-load-more>
				</view>
			</block>
			<noData :isShow="noDataIsShow"></noData>
		</view>
		<!-- 筛选右侧弹窗 -->
		<view v-if="showRigth" class="uni-drawer uni-drawer--right" :class="{'uni-drawer--visible':showDrawer}">
			<view class="uni-drawer__mask" @click="closeDrawer"></view>
			<view class="uni-drawer__content">
				<view class="filterdrawer">
					<view class="filter__hd">
						<view class="title filter_title">筛选</view>
						<view class="filterPrice">
							<view class="title">价格区间</view>
							<view class="inputPrice flex">
								<view class="flex1 inputBox flexItem">
									<input type="text" class="weui-input" v-model="minPrice" placeholder="最低价">
								</view>
								<view class="flexItem line__flexItem"></view>
								<view class="flex1 inputBox flexItem">
									<input type="text" class="weui-input" v-model="maxPrice" placeholder="最高价">
								</view>
							</view>
						</view>
						<view class="filterTypeList">
							<view class="uni-list-cell" @click="shiftAllTypeDrawer">
								<view class="uni-list-cell-navigate uni-navigate-right">
									<view class="title">全部分类</view>
									<view class="uni-list-cell-r" style="margin-right: 40upx;">
										全部
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="filter__bd">
						<view class="filterTypeList" v-if="isBrand&&brandlist.length">
							<view class="uni-list-cell" @click="shiftbrandDown">
								<view class="uni-list-cell-navigate uni-navigate-right" :class="[bandShow?'active':'']">
									<view class="title">品牌</view>
									<view class="uni-list-cell-r" style="margin-right: 40upx;">
										全部
									</view>
								</view>
							</view>
							<view class="tagList li_33 clear" :class="{'show':bandShow}">
								<view class="tag" v-for="(item2,index2) in brandlist" :key="index2">
									<view class="s ellipsis" :class="{'active':brandindex===index2}" @click="selectedBrand(item2.Id,index2)">{{item2.BrandName}}</view>
								</view>
							</view>
						</view>
						<view class="filterTypeList" v-if="filterAttr.length">
							<block  v-if="item.ValueList" v-for="(item,index) in filterAttr" :key="index">
								<view class="uni-list-cell" @click="shiftAttrDown(index)">
									<view class="uni-list-cell-navigate uni-navigate-right" :class="[item.arrowdown?'active':'']">
										<view class="title">{{item.AttributeName}}</view>
										<view class="uni-list-cell-r" style="margin-right: 40upx;">
											全部
										</view>
									</view>
								</view>
								<view class="tagList li_33 clear" :class="{'show':item.arrowdown}">
									<view class="tag" v-for="(item2,index2) in item.ValueList" :key="index2">
										<view class="s ellipsis" :class="{'active':item.selected==index2}" @click="selectedAttr(index,index2)">{{item2}}</view>
									</view>
								</view>
							</block>
						</view>
					</view>
				</view>
				<view class="filter__ft btns flex center">
					<button type="primary" class="btn flex1 radius0" style="background: #ededed;color:#5e5e5e;" @click="resetFilter">重置</button>
					<button type="primary" class="btn flex1 radius0" style="background: #f0370b;" @click="sureFilter">确定</button>
				</view>
			</view>
		</view>
		<!-- 筛选全部中的全部分类v-if="showAllTypeDrawer" -->
		<view v-if="showAllTypeDrawer" class="uni-drawer uni-drawer--right" :class="{'uni-drawer--visible':showDrawer}">
			<view class="uni-drawer__mask" @click="closeAllTypeDrawer"></view>
			<view class="uni-drawer__content">
				<view class="allClassDrawer">
					<view class="filter__hd filter__head" style="border-bottom: 1px solid #F2F2F2;">
						<view class="flex">
							<view class="flex__hd" @click="closeAllTypeDrawer">
								<view class="uni-icon uni-icon-arrowleft"></view>
							</view>
							<view class="flex__bd flex1">
								<view class="title">全部分类</view>
							</view>
							<view class="flex__ft" @click="btnSureFilterType">
								<text class="btnSure">确定</text>
							</view>
						</view>
					</view>
					<view class="filter__bd">
						<view class="filterTypeList weui-cells" style="margin-top:0;">
							<view class="weui-cell" @click="selectAllClassify">
								<view class="weui-cell__bd">
									<view class="title">全部分类</view>
								</view>
								<view class="weui-cell__ft">
									<view class="icon" :class="{'uni-icon-checkmarkempty':isSelectedAllType}"></view>
								</view>
							</view>
							<block v-for="(item,index) in proCateList" :key="index">
								<view class="uni-list-cell">
									<view class="uni-list-cell-navigate uni-navigate-right" :class="[item.arrowdown?'active':'']" @click="shiftClassify(index)">
										<view class="title">{{item.type.TypeName}}</view>
									</view>
								</view>
								<view class="subTypeList" :class="{'show':item.arrowdown}">
									<view class="uni-list-cell-navigate" v-for="(item2,index2) in item.subType" :key="index2" @click="shiftSubClassfy(index,index2)">
										<view class="title">{{item2.ClassName}}</view>
										<view class="uni-list-cell-r"><view class="icon" :class="{'uni-icon-checkmarkempty':item2.selected}"></view></view>
									</view>
								</view>
							</block>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		host,
		post,
		get
	} from '@/common/util.js';
	// import '@/common/dd_style.css';
	import product from '../components/productItem.vue';
	import uniLoadMore from '@/components/uni-load-more.vue';
	import noData from '@/components/noData.vue'; //暂无数据
	export default {
		props: {
			para: Object,
			cidId: String,
			typeid: String,
			searchkey: String,
			couponid: String,
			shopid: String, //店铺id
			Brandid: String, //品牌id
			isBrand: {//是否显示品牌筛选
				type: Boolean,
				default: false
			}, 
			isfixed: {
				type: Boolean,
				default: true
			},
			isFilter:{//是否显示筛选
				type: Boolean,
				default: false
			}
		},
		created() {
			this.getProductlist();
			this.getFilterAttribute();
			this.getProductType();
			this.GetProductBrand();
		},
		onShow() {

		},
		components: {
			product,
			noData,
			uniLoadMore
		},
		data() {
			return {
				shiftType: false,
				showRigth: false,
				showDrawer: false,
				closeTimer: null,
				watchTimer: null,
				noDataIsShow: false,
				isLoad: false,
				isOved: false,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				page: 1,
				pageSize: 6,
				count: 0,
				allPage: 0,
				shopId: this.shopid,
				cid: this.cidId, //分类id
				sortname: "m", //j：价格排序；s：时间排序；m：默认排序
				sortorder: "", //0:倒序；1：顺序;箭头向上的是从最低到最高
				minPrice: "", //筛选最小单价
				maxPrice: "", //筛选最大单价
				attributeName: "", //筛选属性集合字符串
				attributeValue: "", //筛选属性值集合字符串
				typeId: this.typeid, //产品类型Id
				//classId: "", //顶级分类id,如果为-1，就是查询全部
				brandId: this.Brandid, //产品品牌Id
				brandindex: "",
				brandlist: {}, //产品品牌数据
				couponId: this.couponid,
				prolist: [], //商品列表
				filterAttr: [], //筛选的属性
				showAllTypeDrawer: false, //显示全部分类的弹窗
				categoryList: [], //产品类型
				proCateList: [], //把产品类型对应的产品分类组合起来
				isSelectedAllType: false, //是否选择了全部分类的弹窗的全部类型选择
				filterTab: [{
						name: "综合",
						sortname: "m",
						isSortorder: false,
						active: true
					},
					{
						name: "价格",
						sortorder: "", //0：倒序；1:为顺序
						sortname: "j",
						isSortorder: true,
						active: false
					},
					{
						name: "新品",
						sortorder: "", //0：倒序；1:为顺序
						sortname: "s",
						isSortorder: true,
						active: false
					}
				],
				bandShow:false
			};
		},
		watch: {
			searchkey(newVal) {
				this.searchkey = newVal
			},
		},
		methods: {
			//搜索商品
			searchPro() {
				this.prolist = [];
				this.page = 1;
				this.shiftFilterTab(0)
			},
			btnShiftType() {
				this.shiftType = !this.shiftType;
			},
			shiftFilterTab(index) {
				let _this = this;
				_this.filterTab.forEach(function(item, subIndex) {
					if (subIndex === index) {
						_this.$set(item, 'active', true);
						if (item.isSortorder) {
							if (item.sortorder == "") {
								_this.$set(item, 'sortorder', "1");
								return false;
							} else if (item.sortorder == "0") {
								_this.$set(item, 'sortorder', "1");
								return false;
							} else {
								_this.$set(item, 'sortorder', "0");
								return false;
							}
						}
					} else {
						_this.$set(item, 'active', false);
						_this.$set(item, 'sortorder', "");
						return false;
					}
				});
				_this.sortname = _this.filterTab[index].sortname;
				if (_this.filterTab[index].isSortorder) {
					_this.sortorder = _this.filterTab[index].sortorder;
				} else {
					_this.sortorder = "";
				}
				_this.page = 1;
				_this.prolist = [];
				_this.noDataIsShow = false;
				_this.isLoad = false;
				_this.isOved = false;
				_this.loadingType = 0; //0加载前，1加载中，2没有更多了
				_this.getProductlist();
			},
			visible() {
				this.showRigth = true;
				clearTimeout(this.watchTimer);
				setTimeout(() => {
					this.showDrawer = this.showRigth
				}, 100)
				if (this.showRigth) {
					clearTimeout(this.closeTimer)
				}
				if (this.showRigth) {
					this.showRigth = this.showRigth
				} else {
					this.watchTimer = setTimeout(() => {
						this.showRigth = this.showRigth
					}, 300)
				}
			},
			closeDrawer() {
				this.showRigth = false;
			},
			resetFilter() { //点击重置的时候
				let _this = this;
				_this.minPrice = "";
				_this.maxPrice = "";
				_this.attributeName = "";
				_this.attributeValue = "";
				_this.isSelectedAllType = false;
				_this.brandindex = "";
				_this.brandId = "";
				_this.filterAttr.forEach(function(item) {
					_this.$set(item, 'selected', "-1");
				});
				_this.proCateList.forEach(function(item) {
					item.subType.forEach(function(item2) {
						_this.$set(item2, 'selected', false);
					})
				});
			},
			sureFilter() { //点击筛选中的确定
				this.page = 1;
				this.showRigth = false;
				this.noDataIsShow = false;
				this.prolist = [];
				let _this = this;
				let attributeNameArr = [];
				let attributeValueArr = [];
				_this.filterAttr.forEach(function(item) {
					if (parseInt(item.selected) > -1) {
						attributeNameArr.push(item.AttributeName);
						attributeValueArr.push(item.ValueList[item.selected]);
					}
				})
				_this.attributeName = attributeNameArr.join(",");
				_this.attributeValue = attributeValueArr.join(",");
				console.log("attributeName:" + attributeNameArr.join(","));
				console.log("attributeValue:" + attributeValueArr.join(","));
				// if(Number(_this.minPrice) || )
				_this.getProductlist();
			},
			shiftAttrDown(index) { //收起展开
				this.$set(this.filterAttr[index], 'arrowdown', !this.filterAttr[index].arrowdown);
			},
			shiftbrandDown() { //收起展开品牌
				this.bandShow = !this.bandShow;
			},
			selectedBrand(id, index) {
				this.brandindex = index;
				this.brandId = id;
			},
			selectedAttr(index, index2) { //选中属性值
				this.$set(this.filterAttr[index], 'selected', index2);
			},
			shiftAllTypeDrawer() { //显示全部分类的弹窗
				this.showDrawer = true;
				setTimeout(() => {
					this.showAllTypeDrawer = !this.showAllTypeDrawer;
				}, 100)
			},
			closeAllTypeDrawer() { //关闭全部分类的弹窗
				this.closeTimer = setTimeout(() => {
					this.showAllTypeDrawer = false;
				}, 200)
			},
			shiftClassify(index) { //全部分类弹窗中的选择类型
				this.$set(this.proCateList[index], 'arrowdown', !this.proCateList[index].arrowdown);
				console.log("这个是选择类型中的值：" + this.proCateList[index].arrowdown);
			},
			shiftSubClassfy(index, index2) { //切换全部分类弹窗中的选择分类,如果选择了分类，这全部分类就要去掉
				this.isSelectedAllType = false;
				this.$set(this.proCateList[index].subType[index2], 'selected', !this.proCateList[index].subType[index2].selected);
			},
			selectAllClassify() { //全部分类弹窗中的选择全部类型
				this.isSelectedAllType = !this.isSelectedAllType;
				if (this.isSelectedAllType) { //如果选中了，清除掉之前已选的类型的对应的分类
					this.cid = "";
					let _this = this;
					_this.proCateList.forEach(function(item) {
						item.subType.forEach(function(item2) {
							_this.$set(item2, 'selected', false);
						})
					})
				}
			},
			btnSureFilterType() { //点击筛选中的全部分类中的确定按钮
				let _this = this;
				let arr = []; //分类的id
				if (_this.isSelectedAllType) { //如果选择了全部的
					_this.cid = "";
				} else {
					_this.proCateList.forEach(function(item) {
						item.subType.forEach(function(item2) {
							if (item2.selected) {
								arr.push(item2.Id);
							}
						})
					})
					_this.cid = arr.join(",");
				}
				_this.showAllTypeDrawer = false;

			},
			goDetail(id) {
				uni.navigateTo({
					url: '/pages/productDetail/productDetail?proId=' + id,
				})
			},
			async getProductType() { //获取产品类型
				let result = await get("Goods/GetProductType");
				if (result.code === 0) {
					if (result.data.length > 0) {
						this.categoryList = result.data;
					}
					for (let i = 0; i < this.categoryList.length; i++) {
						this.getProductClass(this.shopId, this.categoryList[i].Id, "", this.categoryList[i]);
					}
				} else {
					uni.showToast({
						title: result.msg,
						icon: 'none',
						duration: 1500
					})
				}
			},
			async getProductClass(shopid, typeId, parentId, paraObj) { //获取产品类型对应的分类
				let result = await post("Goods/GetProductClass", {
					shopId: shopid,
					typeId: typeId,
					parentId: parentId
				});
				if (result.code === 0) {
					if (result.data.length > 0) {
						for (let j = 0; j < result.data.length; j++) {
							this.$set(result.data[j], "selected", false);
						}
						let obj = Object.assign({}, obj, {
							arrowdown: false,
							type: paraObj,
							subType: result.data
						});
						this.proCateList.push(obj);
					}
				} else {
					uni.showToast({
						title: result.msg,
						icon: 'none',
						duration: 1500
					})
				}
			},
			async getProductlist() { //获取商品列表
				let result = await post("Goods/GoodsList", {
					page: this.page,
					pageSize: this.pageSize,
					sortname: this.sortname,
					sortorder: this.sortorder,
					attributeName: this.attributeName,
					attributeValue: this.attributeValue,
					minPrice: this.minPrice,
					maxPrice: this.maxPrice,
					cid: this.cid,
					shopId: this.shopId,
					searchkey: this.searchkey,
					couponId: this.couponId,
					brandlst: this.brandId
				});
				if (result.code === 0) {
					this.count = result.count;
					if (this.count == 0) {
						this.noDataIsShow = true;
					}
					if (parseInt(this.count) % this.pageSize === 0) {
						this.allPage = this.count / this.pageSize;
					} else {
						this.allPage = parseInt(this.count / this.pageSize) + 1;
					}
					if (this.page === 1) {
						this.prolist = [];
					}
					if (result.data.length > 0) {
						this.prolist = this.prolist.concat(result.data);
					}
					if (this.allPage > this.page) {
						this.isLoad = true;
						this.loadingType = 0
					} else {
						this.isLoad = false;
						this.loadingType = 2;
					}
				}
			},
			async getFilterAttribute() { //获取产品属性
				let result = await post("Goods/GetFilterAttribute", {
					//TypeId: this.typeId,
					ClassId: this.cid,
					BrandId: this.brandId,
					ShopId: this.shopId
				});
				if (result.code === 0) {
					let _this = this;
					if (result.data.length > 0) {
						result.data.forEach(function(item) {
							if (item.ValueList) {
								item.ValueList = item.ValueList.split(",");
							}
							_this.$set(item, 'arrowdown', false);
							_this.$set(item, 'selected', '-1');
						})
						_this.filterAttr = result.data;
					}
				}
			},
			//获取产品品牌
			async GetProductBrand() {
				let result = await post("Goods/GetProductBrand", {
					TypeId: this.typeId,
					ClassId: this.cid,
					ShopId: this.shopId
				});
				if (result.code === 0) {
					if (result.data.length > 0) {
						this.brandlist = result.data;
						//this.$set(result.data, "arrowdown", false);
					}
				}
			},
			loadMore() {
				if (this.isLoad) {
					this.loadingType = 1;
					this.page++;
					this.getProductlist();
				} else {
					if (this.page > 1) {
						this.isOved = true;
					} else {
						this.isOved = false;
					}
				}
			},
			//刷新
			Refresh(){
				let _this=this;
					_this.page=1;
					_this.loadingType = 1;
					_this.prolist=[];
				setTimeout(function () {
					_this.getProductlist();;
					uni.stopPullDownRefresh();  //停止下拉刷新动画
				}, 1000);
			}
		}

	}
</script>

<style scoped>
	.btns {
		margin-top: 0;
		margin-bottom: 0;
		position: fixed;
		bottom: 0;
		width: 100%;
	}

	.uni-product-list {
		padding-top: 0;
	}

	.uni-drawer {
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		visibility: hidden;
		z-index: 10001;
		height: 100%
	}

	.uni-drawer.uni-drawer--right .uni-drawer__content {
		left: auto;
		right: 0;
		transform: translatex(100%)
	}

	.uni-drawer.uni-drawer--visible {
		visibility: visible
	}

	.uni-drawer.uni-drawer--visible .uni-drawer__content {
		transform: translatex(0)
	}

	.uni-drawer.uni-drawer--visible .uni-drawer__mask {
		display: block;
		opacity: 1
	}

	.uni-drawer__mask {
		display: block;
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .4);
		transition: opacity .3s 
	}

	.uni-drawer__content {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 61.8%;
		height: 100%;
		background: #fff;
		transition: all .3s ease-out;
		transform: translatex(-100%)
	}
	/deep/ .uni-drawer__content .filterdrawer{
		height: calc(100% - 92upx);
		overflow-y: auto;
		padding-bottom: 40upx;
	}
	.uni-drawer__content .filter__hd{
		border-bottom: 20upx solid #F2F2F2;
	}
	.uni-drawer__content .title{
		font-size: 30upx;
	}
	.uni-drawer__content .filter_title {
		padding:20upx;
		font-size: 32upx;
	}
	/deep/ .uni-drawer__content{
		width: 80% !important;
	}
	.filterdrawer .uni-list-cell::after{ display: none;}
	.uni-list-cell-navigate.uni-navigate-right.active::after {
		font-family: uniicons;
		content: '\E580';
		position: absolute;
		right: 12px;
		top: 50%;
		color: #bbb;
		-webkit-transform: translateY(-50%);
		-ms-transform: translateY(-50%);
		transform: translateY(-50%);
	}
	.subTypeList{ background: #f5f5f5;}
</style>
