import { atom } from 'recoil';

export const userInfoState = atom({
    key: 'userInfoState',
    default: typeof window !== 'undefined' && sessionStorage.getItem('username')
})

export const menuTreeState = atom({
    key: 'menuTreeState',
    default: undefined
})