import { useState, useMemo } from 'react'
import { useNavigate } from '@remix-run/react'
import { json } from '@remix-run/node'
import type { ActionFunction } from '@remix-run/node'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

const fonts = [
    { name: 'American Typewriter', value: 'American Typewriter, serif' },
    { name: 'Courier', value: 'Courier, monospace' },
    { name: 'Special Elite', value: 'Special Elite, cursive' },
    { name: 'Huiwen Mincho', value: '"Huiwen Mincho", sans-serif' },
]

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData()
    const quote = formData.get('quote')
    const author = formData.get('author')
    const font = formData.get('font')

    return json({ quote, author, font })
}

export default function Quote() {
    const [quote, setQuote] = useState('')
    const [author, setAuthor] = useState('')
    const [font, setFont] = useState(fonts[0].value)
    const navigate = useNavigate()

    const handleGenerate = () => {
        if (quote) {
            navigate(
                `/craft?quote=${encodeURIComponent(quote)}&author=${encodeURIComponent(author)}&font=${encodeURIComponent(font)}`
            )
        }
    }

    return (
        <div className="min-h-screen px-2 pb-20 sm:pb-0 bg-gray-100 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 rounded-3xl sm:-rotate-6"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <Input
                                    type="text"
                                    placeholder="Enter your quote"
                                    value={quote}
                                    onChange={e => setQuote(e.target.value)}
                                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900"
                                />
                                <Input
                                    type="text"
                                    placeholder="Enter author name (optional)"
                                    value={author}
                                    onChange={e => setAuthor(e.target.value)}
                                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900"
                                />
                                <Select onValueChange={value => setFont(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fonts.map(font => (
                                            <SelectItem key={font.value} value={font.value}>
                                                {font.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                                <Button onClick={handleGenerate} className="w-full">
                                    Generate Poster
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
