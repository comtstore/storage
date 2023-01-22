import Cookies from 'js-cookie'
import { CommonStorage } from './interface'

class CookieStorage implements CommonStorage{

  /**
  * 键名
  */
  public key: string
  
  /**
   * 过期时间，以天来计算，小于一天的用小数，如半天: 0.5
   */
  public expires: number // days

  constructor (key, expires?: number) {
    this.key = key
    if(!expires){ // undefined || 0
      this.expires = 1
    }else {
      this.expires = expires
    }
  }

  getItem () {
    let value = undefined
    try {
      value = Cookies.get(this.key)
    } catch (err) {
      console.error(err)
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

  setItem (value) {
    try {
      Cookies.set(this.key, value, { expires: this.expires })
      return true
    } catch (err) {
      return false
    }
  }

  clear () {
    try {
      Cookies.remove(this.key)
      return true
    } catch {
      return false
    }
  }
}

export default CookieStorage