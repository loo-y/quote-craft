import React, { FC, ReactNode } from 'react'

interface LoadingProps {
    children?: ReactNode
    show?: boolean
    content?: string
}

const Loading: FC<LoadingProps> = ({ children, show = true, content }) => {
    return (
        <>
            {children}
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50 transition-opacity duration-300">
                    <div className="flex flex-col items-center">
                        {/* 使用 img 标签显示 SVG */}
                        <img
                            src={`/images/loading.svg`}
                            alt="Loading"
                            className="w-40 h-40 animate-spin"
                            style={{ animationDuration: '2s' }}
                        />
                        {content && <p className="mt-4 text-white text-lg font-medium">{content}</p>}
                    </div>
                </div>
            )}
        </>
    )
}

export default Loading
