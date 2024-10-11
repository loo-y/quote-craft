import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from '@remix-run/react'
import { json } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'
import Loading from '~/components/Loading'
// @ts-ignore
import FontFaceObserver from 'fontfaceobserver'

const backgroundColors = [
    { enName: 'Deep Navy', name: '深海军蓝', value: 'bg-[#1a2a3a]', textColor: 'text-gray-200' },
    { enName: 'Forest Green', name: '森林绿', value: 'bg-[#1a2e1a]', textColor: 'text-gray-200' },
    { enName: 'Aged Parchment', name: '古旧羊皮纸', value: 'bg-[#f2e8c9]', textColor: 'text-gray-800' },
    { enName: 'Faded Sepia', name: '褪色乌贼墨', value: 'bg-[#e0d4b4]', textColor: 'text-gray-800' },
    { enName: 'Antique Ivory', name: '古董象牙白', value: 'bg-[#f4e9d1]', textColor: 'text-gray-800' },
    { enName: 'Vintage Cream', name: '复古奶油色', value: 'bg-[#f3e7c9]', textColor: 'text-gray-800' },
    { enName: 'Weathered Tan', name: '风化棕褐', value: 'bg-[#d5c5a1]', textColor: 'text-gray-800' },
    { enName: 'Midnight Black', name: '午夜黑', value: 'bg-[#1e1e1e]', textColor: 'text-gray-300' },
    { enName: 'Charcoal Gray', name: '炭灰色', value: 'bg-[#2a2a2a]', textColor: 'text-gray-200' },
    { enName: 'Burgundy', name: '勃艮第红', value: 'bg-[#3a1a1a]', textColor: 'text-gray-200' },
    { enName: 'Slate Blue', name: '石板蓝', value: 'bg-[#2a3a4a]', textColor: 'text-gray-200' },
    { enName: 'Rich Brown', name: '浓褐色', value: 'bg-[#2a1a0a]', textColor: 'text-gray-200' },
]
const textPositions = [
    { enName: 'Top Left', name: '左上', value: 'items-start justify-start text-left' },
    { enName: 'Top Center', name: '顶部居中', value: 'items-start justify-center text-center' },
    { enName: 'Top Right', name: '右上', value: 'items-start justify-end text-right' },
    { enName: 'Middle Left', name: '左中', value: 'items-center justify-start text-left' },
    { enName: 'Middle Center', name: '正中', value: 'items-center justify-center text-center' },
    { enName: 'Middle Right', name: '右中', value: 'items-center justify-end text-right' },
    { enName: 'Bottom Left', name: '左下', value: 'items-end justify-start text-left' },
    { enName: 'Bottom Center', name: '底部居中', value: 'items-end justify-center text-center' },
    { enName: 'Bottom Right', name: '右下', value: 'items-end justify-end text-right' },
]

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url)
    const quote = url.searchParams.get('quote')
    const author = url.searchParams.get('author')
    const font = url.searchParams.get('font')

    return json({ quote, author, font })
}

export default function Craft() {
    const [searchParams] = useSearchParams()
    const canvasRef = useRef<HTMLDivElement>(null)
    const quote = searchParams.get('quote')
    console.log(`quote: ${quote}`, quote?.split('\\n'))
    const author = searchParams.get('author')
    const font = searchParams.get('font')
    const [isLoading, setIsLoading] = useState(true)
    const [bgColor, setBgColor] = useState(backgroundColors[0].value)
    const [textColor, setTextColor] = useState(backgroundColors[0].textColor)
    const [textPosition, setTextPosition] = useState(textPositions[4].value)

    const navigate = useNavigate()

    // useEffect(() => {
    //     if (quote) {
    //         setIsLoading(false)
    //     }
    // }, [quote])

    useEffect(() => {
        const font = new FontFaceObserver('Huiwen Mincho')

        font.load(null, 60000)
            .then(() => {
                setIsLoading(false)
            })
            .catch((error: any) => {
                console.error('Failed to load font:', error)
                // 处理字体加载失败的情况，例如显示错误信息或使用默认字体
                setIsLoading(false) // 即使加载失败，也要设置 fontsLoaded 为 true，以避免 loading 状态一直显示
            })
    }, [])

    useEffect(() => {
        const width = canvasRef?.current?.offsetWidth || 0
        const height = canvasRef?.current?.offsetHeight || 0
        console.log(height, width, canvasRef?.current)
        if (height && width && canvasRef?.current) {
            const noiseTexture = createNoiseTexture(width, height)

            canvasRef.current.style.backgroundImage = `url("${noiseTexture}")`
        }
    }, [bgColor, isLoading])

    const handleDownload = async () => {
        if (canvasRef.current) {
            // const html2canvas = (await import('html2canvas')).default
            // const canvas = await html2canvas(canvasRef.current, {
            //   // useCORS: true,
            //   // allowTaint: true,
            //   // foreignObjectRendering: true,
            // })
            // const image = canvas.toDataURL('image/png')

            const image = (await new Promise((resolve, reject) => {
                toPng(canvasRef.current as HTMLElement)
                    .then(function (dataUrl) {
                        resolve(dataUrl)
                    })
                    .catch(reject)
            })) as string

            const link = document.createElement('a')
            link.href = image
            link.download = 'quote-poster.png'
            link.click()
        }
    }

    const handleBack = () => {
        navigate('/')
    }

    // if (isLoading) {
    //     return <div>Loading...</div>
    // }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Loading show={isLoading} content="loading...">
                <div className="flex-grow flex items-center justify-center p-4">
                    <div
                        ref={canvasRef}
                        className={`relative w-full h-full max-w-2xl aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden  ${bgColor}`}
                    >
                        <div
                            className={`relative z-10 w-full h-full flex ${textPosition} p-8`}
                            style={{ fontFamily: font as string }}
                        >
                            <div className="max-w-lg">
                                <p
                                    className={`text-4xl mb-8 leading-tight ${textColor} drop-shadow-sm`}
                                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}
                                >
                                    {quote?.split('\\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            {index < quote.split('\\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </p>
                                {author && (
                                    <p
                                        className={`text-right text-2xl ${textColor} drop-shadow-sm`}
                                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)', opacity: '0.9' }}
                                    >
                                        - {author}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-between items-center"> */}
                <div className="flex flex-col p-4 space-y-4 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-4">
                    <Button onClick={handleBack} variant="outline" className="w-full sm:w-auto">
                        Back
                    </Button>
                    {/* <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0"> */}
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <Select
                            value={bgColor}
                            onValueChange={value => {
                                const selectedColor =
                                    backgroundColors.find(color => color.value === value) || backgroundColors[0]
                                setBgColor(selectedColor.value)
                                setTextColor(selectedColor.textColor)
                            }}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Background Color" />
                            </SelectTrigger>
                            <SelectContent>
                                {backgroundColors.map(color => (
                                    <SelectItem key={color.value} value={color.value}>
                                        {color.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={textPosition} onValueChange={value => setTextPosition(value)}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Text Position" />
                            </SelectTrigger>
                            <SelectContent>
                                {textPositions.map(position => (
                                    <SelectItem key={position.value} value={position.value}>
                                        {position.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleDownload} className="w-full sm:w-auto">
                        Download Poster
                    </Button>
                </div>
            </Loading>
        </div>
    )
}

function createNoiseTexture(width: number, height: number): string {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('Unable to get 2D context')
    }

    // 填充背景颜色
    ctx.fillStyle = '#1e1e1e' // 你的背景颜色
    ctx.fillRect(0, 0, width, height)

    // 创建噪点数据
    const noiseData: number[] = []
    for (let i = 0; i < width * height; i++) {
        noiseData[i] = Math.random() * 255 // 生成 0-255 之间的随机数
    }

    // 创建 ImageData 对象
    const imageData = ctx.createImageData(width, height)
    const data = imageData.data

    // 将噪点数据应用到 ImageData
    for (let i = 0; i < width * height; i++) {
        const offset = i * 4
        const noiseValue = noiseData[i]
        // 使用灰色噪点，将 R, G, B 设置为相同的噪点值
        data[offset] = noiseValue // Red
        data[offset + 1] = noiseValue // Green
        data[offset + 2] = noiseValue // Blue
        data[offset + 3] = 255 * 0.15 // Alpha - 控制噪点强度 (0-255), 这里设置示例为 0.15 的不透明度
    }

    // 将 ImageData 绘制到 Canvas
    ctx.putImageData(imageData, 0, 0)

    // 将canvas转换成base64格式的图片url
    return canvas.toDataURL()
}
