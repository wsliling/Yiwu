<template>
  <div class="shop">
    <div class="heads">
      <img mode='aspectFill' :src="data.BannerPicNo" alt />
      <div class="content">
        <div class="top flex-center-between">
          <img :src="data.Logo" alt />
          <div class="title">
            <div class="name flex-center-start">
              <h4>{{data.ShopNick}}</h4>
              <!-- <img src="http://hxjp.wtvxin.com/static/images/map.png" alt /> -->
              <!-- <p>14km</p> -->
            </div>
            <div class="address">{{data.Address}}</div>
          </div>
          <div class="phone" @click="call(data.Phone)">
              <div class="phone-icon">
                    <img src="http://hxjp.wtvxin.com/static/images/o2o/phone.png" alt />
              </div>
            <p>联系卖家</p>
          </div>
        </div>
      </div>
    </div>
    <div class="nav">
        <scroll-view class="nav-scroll" scroll-x>
            <div class="list">
                <div class="item" v-for="(val,key) in classifyList" :key="key"
                 :class="{active:val.Id==classId}" @click="tabClassify(val.Id)">
                    {{val.Name}}
                </div>
            </div>
        </scroll-view>
    </div>
    <div class="sort">
        <div class="item" :class="[{'active':sort==0},{'top':sortMode==1}]" @click="onSort(0)">
            默认
        </div>
        <div class="item" :class="[{'active':sort==1},{'top':sortMode==1}]" @click="onSort(1)">
            人气
        </div>
        <div class="item" :class="[{'active':sort==2},{'top':sortMode==1}]" @click="onSort(2)">
            价格
        </div>
    </div>
    <view class="wu-box">
        <!-- <image v-if="type == 4" class="wu-img" src="../../../static/of/p3.jpg" mode=""></image> -->
        <view class="wu-item" v-for="(val,key) in list" :key="key" @click="navigate('shopSon/product/productDetails',{proId:val.Id})">
            <image :src="val.PicNo" mode="aspectFill"></image>
            <view class="wu-tet">
                <view class="wu-name"><span v-if="val.IsPlatform">自营</span>{{val.Name}}</view>
                <view class="wu-price">￥{{val.Price}}</view>
            </view>
        </view>
		<uni-load-more :loadingType="loadingType" v-if="list.length"></uni-load-more>
		<notData v-else></notData>
    </view>
  
  </div>
</template>
<script>
import {post,get,toLogin,navigate,call} from '@/common/util.js';
import uniLoadMore from '@/components/uni-load-more.vue';
import notData from '@/components/notData.vue';
export default {
    components: {
        uniLoadMore,notData
    },
    data(){
        return {
            navigate,
            call,
            userId: "",
            token: "",
            page:1,
            pageSize:10,
            loadingType:0,//0-loading前；1-loading中；2-没有更多了
            classId:0,//分类id
            brandId:0,//品牌id
            sort:0,//0-默认,1-人气,2-价格
            sortMode:0,//0- 升序（从小到大） 1-降序（从大到小）
            shopId:'',
            classifyList:[{Id:0,Name:'全部'}],
            list:[],
            data:{}
        }
    },
    onLoad(e){
        this.shopId = e.shopId;
        this.userId = uni.getStorageSync("userId");
        this.token = uni.getStorageSync("token");
        this.getShopData();
        this.getClassify();
        this.getData();
    },
    onShow() {
        this.userId = uni.getStorageSync("userId");
        this.token = uni.getStorageSync("token");
    },
    methods:{
        async getShopData(){
            const res = await post('Shop/ReadShop',{
                UserId:this.userId,
                Token:this.token,
                ShopId:this.shopId
            })
            this.data = res.data;
        },
        async getClassify(){
            const res = await post('Goods/TypeList',{
                Type: 0,
            })
            this.classifyList.push(...res.data);
        },
        // 切换分类
        tabClassify(id){
            this.classId = id;
            this.sort=0;
            this.sortMode=0;
            this.page=1;
            this.getData();
        },
        async getData(){
            this.loadingType =1;
            const res = await post('Goods/GoodsList',{
                UserId:this.userId,
                Token:this.token,
                Page:this.page,
                PageSize:this.pageSize,
                TypeId:this.classId,
                BrandId:this.brandId,
                Sort:this.sort,
                Order:this.sortMode,
                ShopId:this.shopId,
                });
            if(res.code)return;
            const data = res.data;
            if(this.page===1){
                this.list=[];
            }
            this.list.push(...data);

            this.loadingType = 0;
            if(data.length<this.pageSize){
                this.loadingType=2;
            }
        },
        onSort(sort){
            if(this.sort == sort){
                this.sortMode = this.sortMode===1?0:1;
            }else{
                this.sortMode =0;
            }
            this.sort = sort;
            this.page = 1
            this.getData();
        },
    },
		// 下拉刷新
		onPullDownRefresh() {
			this.sort=0;
			this.sortMode=0;
			this.searchText = '';
			this.page = 1;
            this.getShopData();
			this.getData();
			// 停止下拉动画
			uni.stopPullDownRefresh()
		},
		// 上拉加载更多
		onReachBottom(){
			if(this.loadMore===2)return;
			this.page+=1;
            this.getShopData();
			this.getData();
		},
}
</script>


<style lang="scss" scoped>
.shop{background:#f5f5f5;min-height:100vh;}
.heads{
    
    &>img{
        width:100%;
        height:390upx;
    }
    .content{
        position:relative;
        margin:-80upx 30upx 0 30upx;
        background:#fff;
        padding:20upx 20upx 30upx;
        border-radius: 10upx;
        box-shadow: 0 3upx 8upx 8upx rgba(0, 0, 0, 0.1);
        .top{
            display:Flex;
            align-items:center;
            justify-content: space-between;
            &>img{
                width:80upx;
                height:80upx;
                margin-right:10upx;
                border-radius:8upx;
            }
            .title{
                .name{
                    font-size: 28px; 
                    margin-bottom:10upx;
                    width:460upx; 
                    h4{
                        font-size:28upx;
                    }
                    &>img{
                        width:21upx;
                        height:25upx;
                        margin-right:8upx;
                        margin-left:30upx;
                        margin-top:3upx;
                    }
                    p{
                        font-size:22upx;
                        
                    }
                }
                .address{
                    font-size:22upx;
                    color:#999;
                }
            }
            .phone{
                display:Flex;
                align-items:center;
                flex-flow:column wrap;
                font-size:0;
                width:100upx;
                flex:0 0 auto;
                .phone-icon{
                    width:60upx;
                    height:60upx;
                    padding:15upx;
                    background:#f5f5f5;
                    border-radius:50%;
                    // margin-bottom:10upx;
                     img{
                        width:30upx;
                        height:30upx;
                     }
                }
                p{
                   font-size:22upx;
                   color:#999; 
                }

            }
        }
    }
}
.nav{
    background:#fff;
    margin-top:20upx;
    .nav-scroll{
        height:80upx;
        width:100%;
        .list{
            display:flex;
            align-items:center;
            .item{
                padding:0 40upx;
                line-height:80upx;
                flex:0 0 auto;
                &.active{
                    font-size:1.2em;
                    color:$primary;
                }
            }
        }
    }
}

	.sort{
		display:flex;
		justify-content:space-between;
		align-items:center;
		padding:0 30upx;
		line-height:3;
		background: #fff;
		.item{
			font-size:24upx;
			display:flex;
			align-items:center;
			&::after{
				content:'';
				display:block;
				border-right:8upx solid #fff;
				border-left:8upx solid #fff;
				border-bottom:15upx solid #666;
				border-top:1upx solid #fff;
				margin-left:8upx;
			}
			&.active{
				color:$primary;
				&.top{
					&::after{
						border-top:15upx solid #666;
						border-bottom:0upx solid #fff;
					}
				}
			}
		}
	}
	.wu-box{
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 0 20upx;
		.wu-img{
			margin-top: 30upx;
			width:702upx;
			height:386upx;
			border-radius:6upx;
		}
		.wu-item{
			width:350upx;
			margin-top: 30upx;
			background:#fff;
			image{
				width:100%;
				height:440upx;
				border-radius:6upx;
			}
			.wu-tet{
				width: 100%;
				font-weight: bold;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				padding:20upx 10upx;
				span{
					height:31upx;
					background:linear-gradient(90deg,rgba(222,26,110,1),rgba(233,56,132,1));
					border-radius:6upx;
					font-size:24upx;
					font-weight:bold;
					color:rgba(255,255,255,1);
					line-height:31upx;
					padding: 0 10upx;
					margin-right:10upx;
				}
				.wu-name{
					white-space:nowrap;
					overflow: hidden;
					text-overflow: ellipsis;//可以用来多行文本的情况下，用省略号“…”隐藏超出范围的文本 
					text-overflow: -o-ellipsis-lastline;
					width: 100%;

				}
			}
			.wu-price{
				font-weight: 400;
				font-size: 26upx;
				color: #DE1A6E;
			}
		}
		
	}
</style>
