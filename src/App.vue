<script setup lang="ts">
import { DB } from './utils/app'
import useLogin from './hook/useLogin'
import useUserInfo from './hook/useUserInfo'
import useEximineRealTimeNotice, { genEditUrl } from './hook/useEximineRealTimeNotice'
import { statusFilter  } from './utils/status'
import { parseTime } from './utils/time'
import { resouceMap } from './utils/constant'

import type { ResourceType } from './utils/constant'
import type { ExamineNotice } from './hook/useEximineRealTimeNotice'

const { login, isLogin } = useLogin()
const { getInfo } = useUserInfo()
const { initEximineRealTimeNotice, review, examineMessages } = useEximineRealTimeNotice()
window.onOpenUrl((_event, value) => {
  let url = new URL(value)
  let token = url.searchParams.get('token')
  console.log(token)
  if (token) {
    DB.set('token', token)
  }
  location.reload()
});

const init = async () => {

  if (!isLogin.value) {
    return
  }

  await getInfo()
  initEximineRealTimeNotice()
}

const goDetailPage = (item: ExamineNotice) => {
  const url = genEditUrl(item)
  window.open(url, '_blank')
}


init()
</script>

<template>
  <div class="container">
    <!-- <div class="header">
      <span>通知</span>
    </div> -->
    <template v-if="!isLogin">
      <p>没有权限</p>
      <el-button  @click="login"  >登录</el-button>
    </template>
    <p v-else-if="examineMessages.length === 0" >
      当前没新的待审核的通知
    </p>
    <ul class="list" v-else >
      <li class="item" v-for="item in examineMessages" :key="item.resource_id">
        <span class="item_front" >{{ parseTime(item.received_at, '{y}-{m}-{d} {h}:{i}') }}</span>
        <span class="item_middle" @click="goDetailPage(item)" >{{`${statusFilter(item.to_status).label} - 【${resouceMap[item.resource_type as ResourceType] || ''}】${item.title}`}}</span>
        <span class="item_back" >
          <!-- <ReviewStatus
            :status="item.from_status"
            :loading="false"
            @review="review($event, item)"
          /> -->
        </span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;

  .header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    span {
      font-size: 24px;
    }
  }
}

.list {
  width: 100%;
  box-sizing: border-box;
}

.item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;

  .item_front {
    text-align: left;
  }

  .item_middle {
    flex: 1;
    text-align: left;
    margin: 0 16px;
    color: #409eff;
    cursor: pointer;
  }

  .item_back {
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

ul, li {
  list-style: none;
  padding: 0;
  margin: 0;
}

</style>
