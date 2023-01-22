/* eslint-disable no-unused-vars */
export interface CommonStorage {
    getItem: () => any,
    getItemAndClear: () => any,
    setItem: (value: any) => boolean,
    clear: () => boolean
}