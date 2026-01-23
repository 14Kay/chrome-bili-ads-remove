/// <reference types="vite/client" />

declare module '*.css' {
    const content: { [className: string]: string }
    export default content
}

declare module '*?script' {
    const scriptUrl: string
    export default scriptUrl
}
