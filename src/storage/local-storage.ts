import { CommonStorage } from './interface'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

class LocalStorage implements CommonStorage{
  /**
  * 键名
  */
   public key: string
  
   /**
    * 过期时间，以天来计算，小于一天的用小数，如半天: 0.5
    */
   public expires: number // days
 
   constructor (key: string, expires?: number) {
     this.key = key
     if(expires === undefined){
        this.expires = 0
     }else{
        this.expires = expires
     }
   }
 
   /**
     * 返回null，表示没有数据
     */
   getItem () {
     let value = null
     try {
       const data_str: string | null = localStorage.getItem(this.key)
       if(typeof data_str === 'string'){
          const data_obj = JSON.parse(data_str)
          const ddl = data_obj.ddl
          const isExpired = ddl ? dayjs().isAfter(dayjs(ddl)) : false
          if(!isExpired){
            value = data_obj.value
          }else{
            this.clear()
          }
       }else if(data_str === null){
          throw `${this.key}'s value are not exist!`  
       }else {
          throw `${this.key}'s value are not string!`
       }
     } catch (err) {
       console.warn(err)
     }
     return value
   }
 
   /**
    * 只取一次数据，取完删除
    * @returns any
    */
   getItemAndClear() {
     const value = this.getItem()
     this.clear()
     return value
   }
   
   /**
    * @param value 
    * @returns 是否设置成功
    */
   setItem (value: any) {
     try {
       const ddl = this.expires ? dayjs().add(dayjs.duration({
          'days': this.expires
       })).format() : 0
       localStorage.setItem(this.key, JSON.stringify({
          value,
          ddl
       }))
       return true
     } catch (err) {
       return false
     }
   }
 
   clear () {
     try {
       localStorage.removeItem(this.key)
       return true
     } catch {
       return false
     }
   }
}

export default LocalStorage