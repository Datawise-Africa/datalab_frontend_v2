import React from 'react'
export type ReactContextStateType<T,Actions=any> = React.Context<{
    state:T,
    dispatch:React.Dispatch<Actions>
}>

export type InferActions<T> = T extends { [key: string]: (...args: any[]) => infer U }
    ? U
    : never;