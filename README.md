# weapp-polyfill [![npm](https://img.shields.io/npm/v/weapp-polyfill.svg?style=flat-square)](https://www.npmjs.com/package/weapp-polyfill)
Polyfills for w3c API on top of Weapp API, including:

- XMLHttpRequest
- FormData
- WebSocket
- localStorage
- online/offline events

## Why
微信小程序设计了一系列 IO 相关的 API，但社区中现存的模块绝大部分使用的是 w3c 标准的 API。本项目通过 polyfill 这些 w3c API 允许开发者在不修改第三方模块代码的情况下直接在小程序中使用这些模块。

## Usage
```
npm i weapp-polyfill -D
```

如果你的应用或 SDK 使用打包工具（打包成一个文件后再导入微信开发工具使用），你可以在程序入口的最开始 auto polyfill 所有 API

```
require('weapp-polyfill/auto-polyfill');
```

即可在整个项目中直接使用浏览器 API。See a [realworld demo](https://github.com/leancloud/javascript-sdk/blob/35af5a0547b1d48d3d933fac1fae0eaf16083fa9/src/index-weapp.js)。

weapp-polyfill pacakge 本身 export 了以下对象：

```
const {
  XMLHttpRequest,·
  FormData,
  WebSocket,
  localStorage,
  polyfill,
} = require('weapp-polyfill');
```

不支持不使用打包工具直接在微信开发工具使用。

## Caveats
由于微信 API 与小程序运行时的限制，polyfill 的 API 有以下限制：

### XMLHttpRequest
- 不会出现 `HEADERS_RECEIVED` 与 `LOADING` 状态

### FormData
- Blob 被定义为一个拥有 `uri` 属性的对象，`uri` 的值为通过微信 API 得到的本地临时文件路径：`{ uri: 'tempFilePath' }`
- 如果一个 FormData append 了多个 blob，只有第一个会被发送

### online/offline events
- 仅当使用 auto polyfill 功能时有效。当网络状态变化时，会在当前模块的 global/window 中派发 online/offline 事件。

## Changelogs
#### 3.1.2
- 修复了导致 Babel 提供的 Promise 失效的兼容性问题
- 修复了 `WebSocket is not connected` 错误
- 修复小程序中一个 regression

#### 3.1.1
- 修复 auto-polyfill 在小游戏真机上没有生效的问题

### 3.1.0
-  支持微信小游戏

### 3.0.0
- WebSocket 增加了以下特性
  - 支持 subprotocal
  - 支持二进制帧（ArrayBuffer）
- 增加 online/offline events 支持

#### 2.0.1
- XMLHttpRequest 忽略 response headers key 的大小写。

### 2.0.0
- XMLHttpRequest 增加了以下特性
  - 支持获取 Response Headers
  - 支持通过 xhr.upload 获取文件上传进度
  - 支持 abort
