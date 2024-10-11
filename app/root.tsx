import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import type { LinksFunction } from '@remix-run/node'

import './tailwind.css'

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: '/fonts/custom-fonts.css' },
    // { rel: 'preload', href: '/fonts/huiwen-mincho.otf', as: 'font', type: 'font/otf', crossorigin: 'anonymous' }, // 预加载字体
]

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}
