<template>
	<!-- 近视详情 -->
	<view class="details">
		<!-- 首图展示 -->
		<view class="detailsmap">
			<swiper indicator-dots indicator-active-color="#de1a6e" class="swiper" @change="changeSwiper">
				<swiper-item v-if="data.Video" :show-fullscreen-btn="false" :show-play-btn="false" show-mute-btn :enable-progress-gesture="false">
					<video :src="data.Video" class="video" id="proVideo"></video>
				</swiper-item>
				<swiper-item v-for="(item,index) in data.PicData" :key="index">
					<image :src="item.PicUrl" mode="aspectFill" @click="previewImages(index)"></image>
				</swiper-item>
			</swiper>
			<!-- <view class="pagination">1/6</view> -->
		</view>
		<!-- 价格 -->
		<view class="listpt">
			<div class="priceBox">
				<view class="price">
					<span>¥</span>
					{{data.Price}}
				</view>
				<view class="o-price">
					￥{{data.MarketPrice}}
				</view>
			</div>
			<view class="brandname">
				<span v-if="data.IsPlatform">自营</span>{{data.Name}}
			</view>
		</view>
		<!-- 货品规格 -->
		<view class="shipments">
			<view class="pick" v-if="data.IsSku">
				<view class="shipmentsbox" @click="showSku()">
					<view class="flex">
						<view class="">规格</view>
						<view class="txt26">{{selectSku.text?'已选：':'请选择商品规格'}}{{selectSku.text||''}}</view>
					</view>
					<image class="exemption" src="http://shop.dadanyipin.com/static/hpicons/arrows.svg" mode=""></image>
				</view>
			</view>
			<view class="pick">
				<view class="shipmentsbox">
					<view class="flex">
						<view class="">发货</view>
						<view class="txt26">{{data.Area}}</view>
					</view>
					<view class="flex">
						<view class="">{{data.IsPinkage?'':'不'}}包邮</view>
						<!-- <image class="exemption" src="http://shop.dadanyipin.com/static/hpicons/arrows.svg" mode=""></image> -->
					</view>
				</view>
			</view>
			<view class="pick" v-if="data.ServiceInfo&&data.ServiceInfo.length">
				<view class="shipmentsbox">
					<view class="flex">
						<view class="">服务</view>
					</view>
					<block v-for="(item,index) in data.ServiceInfo" :key="index">
						<view class="flex" v-if="index<3">
							<image class="drawimg" src="http://shop.dadanyipin.com/static/hpicons/draw.svg" mode=""></image>
							<view class="">{{item.Name}}</view>
						</view>
					</block>
					<!-- <view class="flex">
						<image class="drawimg" src="http://shop.dadanyipin.com/static/hpicons/draw.svg" mode=""></image>
						<view class="">及时发货</view>
					</view> -->
				</view>
			</view>
		</view>

		<!-- 商品评价 -->
		<view class="merchandise">
			<view class="evaluate">
				<view class="quiz">问大家<span>({{problemCount}})</span>
				</view>
				<view class="flex" @click="navigate('shopSon/product/productProblem',{proId})">
					<view class="">查看全部</view>
					<image class="arrows" src="http://shop.dadanyipin.com/static/hpicons/arrows.svg" mode=""></image>
				</view>
			</view>
			<view class="">
				<view class="question" v-for="(item,index) in problemList" :key="index" @click="navigate('shopSon/product/productProblemDetail',{item:JSON.stringify(item)})">
					<view class="dot ellipsis"><span>问</span>{{item.Content}}</view>
					<view class="">{{item.count}}个回答</view>
				</view>
			</view>
		</view>
		<!-- 店铺 -->
		<view class="store" v-if="data.ShopData">
			<view class="flex">
				<image class="storeimg" :src="data.ShopData.Logo" mode=""></image>
				<view class="">
					<view class="storename">{{data.ShopData.ShopNick}}</view>
					<!-- <view class="flex exp">
						<view class="">综合体验</view>
						<image class="star" src="http://shop.dadanyipin.com/static/hpicons/collect.svg" mode="" v-for="(item,index) in data.ShopData.ServiceScore/20" :key="index"></image>
					</view> -->
					<p>{{data.ShopData.Address}}</p>
				</view>
			</view>
			<view class="flex">
				<!-- <view class="plan">全部宝贝</view> -->
				<view class="plan" @click="navigate('shopSon/shopHome/shopHome',{shopId:data.ShopData.ShopId})">进店逛逛</view>
			</view>
		</view>
		<!-- <view class="">
			<view class="plan">描述相符 4.8 <span>低</span></view>
			<view class="plan">卖家服务 4.7 <span>低</span></view>
			<view class="plan">物流服务 4.8 <span>低</span></view>
		</view> -->
		<div class="contentDetail" v-html="data.ContentDetail"></div>
		
		<div class="foot ali-c jus-b">
			<div class="left ali-c">
				<div @click="navigate('member/kefu/kefu')">
					<img src="http://jd.wtvxin.com/images/images/index/ans.png" alt="" />
					<p>客服</p>
				</div>
				<div @click="collect">
					<img v-if="data.IsCollection&&data.IsCollection.Value" src="http://jd.wtvxin.com/images/images/index/collect_y.png" alt="" />
					<img v-else src="http://jd.wtvxin.com/images/images/index/collect_n.png" alt="" />
					<p>收藏</p>
				</div>
				<div @click="navigate('member/cart/cart')">
					<img src="http://jd.wtvxin.com/images/images/index/cart.png" alt="" />
					<p>购物车</p>
					<!-- <span class="num flexc" v-if="CartNumber > 0">{{ CartNumber }}</span> -->
				</div>
			</div>
			<div class="right flex">
				<p :class="['flex1 flexc']" @click="showSku('addCar')">加入购物车</p>
				<!-- <p :class="['flex1 flexc', starTimetype != 1 ? 'dis' : '']" @click="showSku(2)">立即购买</p> -->
				<p :class="['flex1 flexc']" @click="showSku('buy')">立即购买</p>
			</div>
		</div>
		<uni-popup ref="skuWin" type="bottom">
			<sku :sku="sku" :skuAll="skuAll" :proInfo="productInfo" :submitBtnType="submitBtnType"
				 @getSkuData="getSkuData" @close="$refs.skuWin.close()" @success="planOrder"
				>
			</sku>
		</uni-popup>
	</view>
</template>

<script>
import {post,get,toLogin,navigate,toast,previewImage} from '@/common/util.js';
import sku from '@/components/sku/popsku.vue'
export default {
	components:{
		sku
	},
	data() {
		return {
			navigate,
			userId: "",
			token: "",
			proId:'',
			data:{},
			problemList:[],
			problemCount:0,

			sku:{},
			skuAll:[],
			productInfo:{
				img:'',
				Name:'',
				num:0,
				price:0,
				minbuy:0,
				maxbuy:0
			},
			selectSku:{},
			submitBtnType:'',//确定按钮的类型
			videoContext:null,
		};
	},
	onLoad(e) {
		e.proId &&(this.proId = e.proId);
		this.userId = uni.getStorageSync("userId");
		this.token = uni.getStorageSync("token");
		this.getData();
		this.getProblemList();
	},
	onShow() {
		this.userId = uni.getStorageSync("userId");
		this.token = uni.getStorageSync("token");
	},
	methods: {
		changeSwiper(){
			this.videoContext.pause();
		},
		async getData(){
			const res = await post('Goods/Goodsxq',{
					UserId:this.userId,
					Token:this.token,
					Id:this.proId
			})
			if(res.code!=0) return;
			const data = res.data;
			this.videoContext=uni.createVideoContext('proVideo');
			// data.ServiceKeyss = data.ServiceKeys.split('，');
			data.ContentDetail = data.ContentDetail.replace(/<img/g,'<img style="max-width:100%;"')
			this.productInfo={
				img:data.PicData[0].PicUrl,//默认产品图片
				maxbuy:data.MaxBuyNum,//最大购买量
				minbuy:data.MinBuyNum, //最小购买量
				stock:data.Stock,
				price:data.Price,
				name:data.Name,
			}
			// 初始化sku数据
			let skuAll = [];
			data.Sku.map(item => {
				skuAll.push({
					img: item.SpecImage, //sku图片
					num: item.ProStock, //sku数量
					price: item.Price, //sku价格
					text: item.SpecText, //sku组合，下划线分隔
					value: JSON.parse(item.SpecValue) //sku的key和值
				});
			});
			this.skuAll = skuAll;
			let sku = {};
			const SpecificationValue = JSON.parse(data.SpecificationValue);
			Object.keys(SpecificationValue).map((item, index) => {
				const arrr = SpecificationValue[item];
				sku[item] = [];
				arrr.map(arrItem => {
					sku[item].push({
						selectStatus: false, //选中状态
						status: false, //可选状态
						val: arrItem.name
					});
				});
			});
			this.sku = sku;
			// this.product = data;
			console.log()
			console.log(this.sku,this.skuAll,'sku')

			this.data = data;
		},
		getSkuData(selectSku){
			this.selectSku = selectSku;
		},
		// type;1--加入购物车；2--立即购买
		showSku(type){
			console.log(type,'type')
			this.submitBtnType = type||'';
			this.$refs.skuWin.open();
			this.videoContext.pause();
			// if(this.data.IsSku&&!this.selectSku.value){
			// }else{
			// 	if(type==1){
			// 		this.addcart();
					
			// 	}else{
			// 		this.buy();
			// 	}
			// }
		},
		// 下单
		// addCar--加入购物车  buy--立即购买
		planOrder(type,selectSku){
			if(!toLogin())return;
			this.$refs.skuWin.close();
			this.selectSku = selectSku;
			if(type==='addCar'){
				this.addcart();
			}else if(type==='buy'){
				this.buy();
			}
		},
		// 加入购物车
		async addcart(){
			console.log(this.selectSku)
			const res = await post('Cart/AddCart',{
				UserId:this.userId,
				Token:this.token,
				ProId:this.proId,
				Count:this.selectSku.buyNum,
				SpecText:this.selectSku.text
			})
			if(res.code) return;
			toast('添加成功',{icon:true})
		},
		// 立即购买
		buy(){
			this.$refs.skuWin.close();
			navigate('shopSon/submitOrder/submitOrder',{
				proId:this.proId,
				buyNum:this.selectSku.buyNum,
				SpecText:this.selectSku.text||'',
				orderSType:0
			})
		},
		setBuyNum(num){
			this.selectSku.buyNum = num;
		},
        async getProblemList(){
            const res = await post('Goods/QuestionsdList',{
				UserId:this.userId,
				Token:this.token,
				ProductId:this.proId,
				Page:1,
				PageSize:2
			})
			if(res.code!=0) return;
			this.problemCount = res.count;
            this.problemList= res.data;
        },
		//添加取消收藏
		async collect() {
			if(!toLogin())return;
			const params = {
				UserId: this.userId,
				Token: this.token,
				Type: 0,
				Id: this.proId
			}
			let url="";
			if (!this.data.IsCollection.Value) {
				url = 'User/AddCollections';
			} else {
				url="User/ReCollections"
			}
			let res = await post(url,params);
			if (res.code != 0) return;
			toast(res.msg)
			this.data.IsCollection.Value = !this.data.IsCollection.Value;
		},
		toindex() {
			uni.navigateBack({
				delta: 2
			});
		},
		//
		toevaluation(Url) {
			uni.navigateTo({
				url: Url
			});
		},
		// 预览图片
		previewImages(index){
			let arr=[];
			this.data.PicData.map(item=>{
				arr.push(item.PicUrl)
			})
			previewImage(arr,index)
		}
	}
};
</script>

<style scoped lang="scss">
.video{
	width:100%;height:750upx;
}
.details {
	background: #ffffff;
	padding-bottom:100upx;
	.detailsmap {
		width: 100%;
		height: 750upx;
		background: #c0c0c0;
		image {
			height: 750upx !important;
		}
		.swiper{
			height:750upx;
		}
	}
	.pagination {
		width: 80upx;
		height: 40upx;
		background: rgba(12, 34, 44, 0.2);
		border-radius: 20upx;
		position: absolute;
		top: 650upx;
		right: 31upx;
		line-height: 40upx;
		text-align: center;
		color: #fff;
	}
	// 价格
	.listpt {
		padding: 30upx;
		width: 100%;
		.priceBox{
			display:flex;
			align-items:flex-end;
		}
		.o-price{
			color:#999;
			font-size:16upx;
			text-decoration:line-through;
			line-height:2.1;
			margin-left:10upx;
		}
		.price {
			font-size: 44upx;
			font-weight: bold;
			color: #de1a6e;
			span {
				font-size: 36upx;
				margin-right: 10upx;
			}
		}
		.brandname {
			font-size: 30upx;
			font-weight: bold;
			color: rgba(52, 52, 52, 1);
			span {
				height: 30upx;
				background: linear-gradient(90deg, rgba(222, 26, 110, 1), rgba(233, 56, 132, 1));
				border-radius: 6upx;
				padding: 0 10upx;
				margin-right: 10upx;
				font-size: 24upx;
				color: rgba(255, 255, 255, 1);
			}
		}
	}
	/* 货品规格 */
	.shipments {
		border-top: 20upx solid #f9f9f9;
		.pick {
			border-bottom: 1upx solid #f9f9f9;
			.shipmentsbox {
				display: flex;
				justify-content: space-between;
				font-size: 26upx;
				font-family: PingFang;
				font-weight: bold;
				color: rgba(13, 34, 44, 0.6);
				margin: 30upx;
				.txt26 {
					color: #343434;
					margin-left: 50upx;
				}
				.exemption {
					width: 20upx;
					height: 20upx;
					margin: 16upx 0 0 16upx;
				}
				.drawimg{
					width:41upx;
					height:41upx;
					margin: 6upx 6upx 0 0;
				}
			}
		}
	}
	// 商品评价
	.merchandise{
		border-top: 20upx solid #f9f9f9;
		padding: 30upx;
		.evaluate{
			display: flex;
			justify-content: space-between;
			color: #DE1C6E;
			padding-bottom: 20upx;
			border-bottom: 1upx solid #f9f9f9;
			.quiz{
				font-size:30upx;
				font-weight:bold;
				color:rgba(52,52,52,1);
				span{
					font-size:22upx;
					color:rgba(154,154,154,1);
					margin-left: 10upx;
				}
			}
			image{
				width:20upx;
				height:20upx;
				margin: 16upx 0 0 10upx;
			}
		}
		.question{
			display: flex;
			justify-content: space-between;
			padding-top: 30upx;
			font-size: 26upx;
			color: #9A9A9A;
			.dot{
				font-size: 29upx;
				color: #343434;
				width:82%;
				span{
					height:26upx;
					background:rgba(222,28,110,1);
					border-radius:6upx;
					font-size:20upx;
					color:rgba(255,255,255,1);
					line-height:26upx;
					padding: 0 6upx;
					margin-right: 10upx;
				}
			}
		}
	}
	// 店铺
	.store{
		display: flex;
		justify-content: space-between;
		padding: 30upx;
		border-top: 20upx solid #f9f9f9;
		.storeimg{
			width:96upx;
			height:96upx;
			border-radius:4upx;
			margin-right: 20upx;
		}
		.storename{
			font-size:29upx;
			color:rgba(0,0,0,1);
		}
		.exp{
			font-size: 18upx;
			color: #404040;
			height:50upx;
			background:rgba(245,245,245,1);
			border-radius:25upx;
			padding: 0 10upx;
			.star{
				width:16upx;
				height:16upx;
				margin: 16upx 0 0 5upx;
			}
		}
		p{
			color: #888;
			font-size: 14upx;
		}
		.plan{
			height:48upx;
			line-height:48upx;
			border:1upx solid rgba(222,28,110,1);
			border-radius:24upx;
			font-size: 24upx;
			margin-left: 20upx;
			color: rgba(222,28,110,1);
			padding: 0 20upx;
		}
	}

	.foot {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		width: 100vw;
		height: 98upx;
		box-sizing: border-box;
		padding: 0 30upx 0 0;
		box-shadow: 0 -3upx 8upx 0upx rgba($color: #000000, $alpha: 0.1);
		display:flex;
		align-items:center;
		justify-content:space-between;
		.left div:nth-child(1) img {
			width: 34upx;
			height: 34upx;
		}
		.left div:nth-child(2) img {
			width: 32upx;
			height: 32upx;
		}
		.left div:nth-child(3) img {
			width: 34upx;
			height: 32upx;
		}
		.right {
			width: 400upx;
			height: 70upx;
			line-height: 70upx;
			border-radius: 35upx;
			color: #fff;
			font-size: 26upx;
			font-weight: bold;
			overflow: hidden;
			text-align:center;
		}
		.right p:nth-child(1) {
			background-color: #fda33a;
		}
		.right p:nth-child(2) {
			background-color: #ff6f00;
		}
		.right p.dis {
			// opacity: 0.5;
		}
		.left {
			display:flex;
			align-items:center;
			justify-content:space-between;
			div {
				width: 105upx;
				text-align: center;
				font-size: 22upx;
				color: #999;
				position: relative;
			}
			p{
				line-height:1.4;
			}
			span {
				position: absolute;
				width: 26upx;
				height: 26upx;
				border-radius: 50%;
				background-color: #de1a6e;
				color: #fff;
				font-size: 20upx;
				top: -10upx;
				right: 23upx;
				p{
					line-height:1;
				}
			}
		}
	}

	
}
</style>
