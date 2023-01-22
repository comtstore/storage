/* eslint-disable no-unused-vars */
import CookieStorage from "./cookie-storage"
import LocalStorage from './local-storage'
import { CommonStorage } from "./interface"

export enum StorageType {
    COOKIE = 'cookie',
    LOCALSTORAGE = 'localstorage',
    LOCALS = 'locals'
}

class StorageCenter {
    public static instance: StorageCenter

    public static getInstance(): StorageCenter {
        if(!StorageCenter.instance){
            StorageCenter.instance = new StorageCenter()
        }
        return StorageCenter.instance
    }

    public storageMap: Map<string, CommonStorage>

    private constructor(){
        this.storageMap = new Map()
    }

    setItem(key: string, value: any, expires: number = 0,type: StorageType | string){
        try{
            let _storage: CommonStorage | undefined = this.storageMap.get(key)
            if(_storage === undefined){
                //没有数据
                if(type === StorageType.COOKIE){
                    _storage = new CookieStorage(key, expires)
                } else if(type === StorageType.LOCALS || type === StorageType.LOCALSTORAGE){
                    _storage = new LocalStorage(key, expires)
                }
                this.storageMap.set(key, _storage as CommonStorage)
            }
            return _storage?.setItem(value)
        }catch(err){
            console.error(err)
            return false
        }
    }

    setCookieItem(key: string, value: any, expires: number = 0){
        return this.setItem(key, value, expires, StorageType.COOKIE)
    }
    
    setLocalSItem(key: string, value: any, expires?: number){
        return this.setItem(key, value, expires, StorageType.LOCALSTORAGE)
    }
    
    getItem(key: string, type?: StorageType | string){
        const _storage: CommonStorage | undefined = this.storageMap.get(key)
        if(!_storage){
            // storage没有存储，那么就需要从所有storage中找
            let value: any = undefined

            if(type === undefined || type === StorageType.COOKIE){
                const cookieStorage = new CookieStorage(key)
                value = cookieStorage.getItem()
                if(value !== undefined){
                    return value
                }
            }

            if(type === undefined || type === StorageType.LOCALS || type === StorageType.LOCALSTORAGE){
                const _localStorage = new LocalStorage(key)
                value = _localStorage.getItem()
                if(value !== null){
                    return value
                }
            }

            // 都没有找到数据
            return value
        }else{
            // 已经存储了
            return _storage.getItem()
        }
    }

    getCookieItem(key: string){
        return this.getItem(key, StorageType.COOKIE)
    }

    getLocalSItem(key: string){
        return this.getItem(key, StorageType.LOCALSTORAGE)
    }

    clear(key: string, type?: StorageType | string){
         const _storage: CommonStorage | undefined = this.storageMap.get(key)

         if(!_storage){
            let isCleared: boolean = true

            if(type === undefined || type === StorageType.COOKIE){
                const cookieStorage = new CookieStorage(key)
                const _isCleared = cookieStorage.clear()
                if(!_isCleared){
                    isCleared = false
                }
            }
   
            if(type === undefined || type === StorageType.LOCALS || type === StorageType.LOCALSTORAGE){
                const _localStorage = new LocalStorage(key)
                const _isCleared = _localStorage.clear()
                if(!_isCleared){
                    isCleared = false
                }
            }
   
            return isCleared
         } else {
            return _storage.clear()
         }
    }

    clearCookieItem(key: string){
        return this.clear(key, StorageType.COOKIE)
    }

    clearLocalSItem(key: string){
        return this.clear(key, StorageType.LOCALSTORAGE)
    }
}

export default StorageCenter