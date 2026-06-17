/// <reference types="wxt/client" />

declare const browser: typeof chrome
declare const storage: typeof import('wxt/storage').storage
declare function defineContentScript<T>(definition: T): T
declare function defineBackground<T>(definition: T): T
declare function defineUnlistedScript<T>(definition: T): T
