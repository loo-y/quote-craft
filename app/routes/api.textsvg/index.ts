// 通过输入的文字，根据特定的字体文件生成svg图片
import { json } from '@remix-run/node'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
// var fontkit = require('fontkit');
import * as fontkit from '../../lib/fontkit.module.mjs'

const textToSVG = (text: string, font: any, fontSize = 30) => {
    const svgPath = []
    let x = 0

    // const fontMetrics = font.getMetrics();
    const scale = fontSize / font.unitsPerEm

    console.log(`font.unitsPerEm;`, font.unitsPerEm, scale)

    for (const char of text) {
        const glyph = font.glyphForCodePoint(char.codePointAt(0))
        const path = glyph.path
        const d = path.toSVG() // 获取 SVG 路径命令

        // // 将字形路径添加到 SVG 路径数组
        svgPath.push(`<path d="${d}" transform="translate(${x}, ${fontSize}) scale(${scale}, ${-scale})"/>`)

        // 更新 x 坐标，考虑字距调整（kerning）
        const glyphAdvanceWidth = glyph.advanceWidth //  字形的宽度
        x += glyphAdvanceWidth * scale // 根据字体大小缩放宽度
    }
    // 构建 SVG 字符串,viewBox根据实际情况调整
    const viewBoxWidth = x
    const viewBoxHeight = fontSize * 1.2 // 预留一些空间

    const svg = `<svg viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" xmlns="http://www.w3.org/2000/svg">
              ${svgPath.join('\n')}
          </svg>`

    return svg
}

const generateSvg = async (text: string) => {
    // @ts-ignore
    // const fontkit = await import('fontkit');
    const huiwenMincho = './fonts/huiwen-mincho.otf'
    // const huiwenMincho = path.join(process.cwd(), 'public', 'fonts', 'huiwen-mincho.otf')
    console.log(`huiwenMincho: ${huiwenMincho}`)
    var font = fontkit.openSync(huiwenMincho)

    return textToSVG(text, font, 26)

    var run = font.layout(text)

    // get an SVG path for a glyph
    // var svg = run.glyphs[0].path.toSVG();

    let svg = ''
    console.log(`run:`, run?.glyphs?.length)
    if (run?.glyphs?.length > 0) {
        svg = run.glyphs
            .map((glyph: any) => {
                return glyph.path.toSVG()
            })
            .join(' ')
    }
    console.log(`svg: ${svg}`)
    return `<svg fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${svg}" fill="black" /></svg>`
}

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url)
    const text = url.searchParams.get('text')

    if (!text) {
        return json({ error: 'Text parameter is required' }, { status: 400 })
    }

    const svg = await generateSvg(text)
    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Content-Disposition': 'inline; filename="text.svg"',
        },
    })
}

export const action: ActionFunction = async ({ request }) => {
    const body = await request.json()
    const text = body.text

    if (!text || typeof text !== 'string') {
        return json({ error: 'Text parameter is required' }, { status: 400 })
    }

    const svg = await generateSvg(text)
    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Content-Disposition': 'inline; filename="text.svg"',
        },
    })
}
