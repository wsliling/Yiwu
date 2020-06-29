<template>
	<!-- 问大家 -->
	<view class="askeveryone">
		<view class="ask-box">
			<view class="ask"><span>问</span>{{item.Content}}</view>
			<!-- <view class="ask color"><span>答</span>质量很好，值得购买，要买的小伙伴可以去买了</view> -->
			<view class="flex-between">
				<view class="ask-txt">{{item.AddTime}}</view>
				<view class="flex">
					<view class="ask-txt txt">共{{item.count}}个回答</view>
				</view>
			</view>
		</view>
        <div class="list">
            <div class="item" v-for="(val,key) in problemList" :key="key">
                <img :src="val.Avatar" alt="">
                <div class="info">
                    <div class="name">{{val.NickName}}</div>
                    <div class="time">{{val.AddTime}}</div>
                    <div class="content">{{val.Content}}</div>
                </div>
            </div>
        </div>
		<view class="ask-bottom" @click="problemWinStatus = true">我来回答</view>
        <div class="ask-win" v-if="problemWinStatus">
            <div class="content">
                <div class="tit">回答</div>
                <textarea name="" id="" cols="30" rows="10" v-model="problemContent" placeholder="请输入发表的回答"></textarea>
                <div class="btn-box">
                    <div class="cancel" @click="problemWinStatus = false">取消</div>
                    <div class="confirm" @click="problemConfirm">确定</div>
                </div>
            </div>
        </div>
		<uni-load-more :loadingType="loadingType" v-if="problemList.length"></uni-load-more>
		<notData v-else tipsTitle="暂无回答"></notData>
	</view>
</template>
<script>
    import {post,get,toLogin,navigate,dateUtils,toast} from '@/common/util.js';
    import uniLoadMore from '@/components/uni-load-more.vue';
	import notData from '@/components/notData.vue';
    export default {
		components: {
			uniLoadMore,notData
		},
        data(){
            return {
                navigate,
                userId: "",
                token: "",
				page:1,
				pageSize:12,
				loadingType:0,//0-loading前；1-loading中；2-没有更多了
                item:{},
                problemList:[],
                problemWinStatus:false,
                problemContent:'',
                
            }
        },
        onLoad(e){
            e.item &&(this.item = JSON.parse(e.item));
            console.log(this.item,'item')
            this.userId = uni.getStorageSync("userId");
            this.token = uni.getStorageSync("token");
            this.getProblemList();
        },
        onShow() {
            this.userId = uni.getStorageSync("userId");
            this.token = uni.getStorageSync("token");
        },
        methods:{
            async getProblemList(){
				this.loadingType =1;
				if(this.page===1){
					this.problemList=[];
				}
                const res = await post('Goods/AnswersList',{
                    UserId:this.userId,
                    Token:this.token,
                    ParentId:this.item.Id,
                    Page:this.page,
                    PageSize:this.pageSize
                })
                const data = res.data;
                if(res.code)return;
                if(data[0]&&this.page==1){
                     this.item.count = res.count;
                    this.item.AddTime = dateUtils.format(data[0].AddTime)
                }
                data.map(item=>{
                    item.AddTime = dateUtils.format(item.AddTime)
                    this.problemList.push(item);
                })
				this.loadingType = 0;
				if(data.length<this.pageSize){
					this.loadingType=2;
				}
            },
            async problemConfirm(){
                if(!this.problemContent){
                    toast('请填写回答！')
                    return;
                }
                const res = await post('Goods/Questionsd',{
                    UserId:this.userId,
                    Token:this.token,
                    ParentId:this.item.Id,
                    ProductId:this.item.ProductId,
                    TypeInt:2,
                    Content:this.problemContent
                })
                toast('回答成功！',{icon:true})
                setTimeout(()=>{
                    this.problemWinStatus = false;
                    this.problemContent = '';
                    this.page=1;
                    this.getProblemList();
                },1500)
            }
        },
		// 上拉加载更多
		onReachBottom(){
			if(this.loadingType===2)return;
			this.page+=1;
			this.getProblemList()
		},
    }
</script>

<style lang="scss" scoped>
	.askeveryone{
        padding-bottom:110upx;
		.ask-box{
			margin-top: 20upx;
			background: #fff;
			padding: 30upx;
			.ask{
				padding-bottom: 20upx;
				span{
					height:26upx;
					background:rgba(222,27,110,1);
					border-radius:6upx;
					font-size:20upx;
					line-height: 26upx;
					color:rgba(255,255,255,1);
					padding: 0 6upx;
					margin-right: 10upx;
				}
			}
			.color{
				span{
					background:rgba(98,160,247,1);
				}
			}
			.ask-txt{
				font-size: 26upx;
				color: #999999;
				
			}
			.txt{
				color: #666666;
			}
			image{
				width:18upx;
				height:24upx;
				margin: 12upx 0 0 16upx;
			}
		}
		.ask-bottom{
			width: 90%;
			height:88upx;
			background:rgba(222,27,110,1);
			border-radius:44upx;
			font-size:32upx;
			color:rgba(255,255,255,1);
			line-height:88upx;
			position: fixed;
			bottom: 20upx;
			text-align: center;
			margin: 0 30upx;
        }
        .list{
            .item{
                display:flex;
                align-items:flex-start;
                padding:20upx 30upx 30upx;
                border-top:1upx solid #ececec;
                background:#fff;
                font-size:30upx;
                line-height:1.3;
                img{
                    width:80upx;height:80upx;
                    border-radius:50%;
                    margin-right:30upx;
                    margin-top:10upx;
                }
                .time{
                    color:#999;
                    font-size:24upx;
                }
                .info{
                    width:83%;
                    line-height:1.5;
                    .content{
                        margin-top:10upx;
                    }
                }
            }
        }
    }
    .ask-win{
        position:fixed;
        top:0;left:0;
        width:100%;height:100vh;
        background:rgba(0,0,0,.4);
        display:flex;
        align-items:center;
        justify-content:center;
        .content{
            background:#fff;
            border-radius:15upx;
            overflow:hidden;
            padding:0 30upx;
            .tit{
                font-weight:bold;
                font-size:30upx;
                text-align:center;
                line-height:90upx;
            }
            .btn-box{
                display:flex;
                align-items:center;
                border-top:1upx solid #e8e8e8;
                div{
                    width:50%;
                    text-align:center;
                    line-height:90upx;
                    &:last-child{
                        border-left:1px solid #e8e8e8;
                        color:$primary;
                    }
                }
            }
        }
    }
</style>
