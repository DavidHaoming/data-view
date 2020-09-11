<template>
  <div class="container">
    <div class="left">
      <div class="menu" v-for="item in navList" :key="item.name">
        <span @click="click(item.router)"><i :class="item.icon"></i>{{item.name}}</span>
      </div>
    </div>
    <div class="content">
        <div class="title">最近</div>
    </div>
    <div class="right">
      <div class="title"><i class="el-icon-s-opportunity"></i>快捷入口</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  },
  data(){
    return{
      navList: [
        {
          name: '工作台',
          icon: 'el-icon-s-tools'
        },
        {
          name: '互动对话',
          icon: 'el-icon-s-grid',
          router: '/test'
        }
      ]
    }
  },
  methods:{
    click(data){
      if(data){
        this.$router.push({
          path: data,
          // query:{
          //   types : "edit",
          //   id : row.id
          // }
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .container{
    display: flex;
    font-size: 14px;
    .left{
      width: 20%;
      .menu{
        margin-top: 38px;
        i{
          margin-right: 10px;
        }
      }
      .menu:hover span{
        color: #3894FF;
        cursor: pointer;
      }
    }
    .content{
      width: 60%;
      margin-top: 38px;
      border-left: 1px solid #f2f2f2;
      .title{
        text-align: left;
      }
    }
    .right{
      width: 20%;
      margin-top: 38px;
      border-left: 1px solid #f2f2f2;
      .title{
        text-align: left;
      }
    }
  }
</style>