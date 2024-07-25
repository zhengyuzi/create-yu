/**
 * @/utils/storage/index.ts
 * localstorage集中管理
 *
 * 添加: AUTH.value = {...}
 * 清空: AUTH.value = null
 */
import { StorageSerializers, useStorage } from '@vueuse/core'

// 加密
// import { decrypt, encrypt } from './crypto'

// const serializer = {
//   read: (v: any) => (v ? JSON.parse(decrypt(v)) : null),
//   write: (v: any) => encrypt(JSON.stringify(v)),
// }

export interface Auth {
  //
}

export const AUTH = useStorage<Auth | null>('AUTH', null, undefined, {
  serializer: StorageSerializers.object,
})
