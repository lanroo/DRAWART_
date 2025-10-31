import { useState, useEffect } from 'react'
import {
  TOOL_LINE,
  TOOL_RECTANGLE,
  TOOL_CIRCLE,
  TOOL_TRIANGLE,
  TOOL_STAR,
  TOOL_TEXT,
  TOOL_ERASER,
  TOOL_PAINT_BUCKET,
  TOOL_PENCIL,
  TOOL_BRUSH
} from '../utils/paint'

const tools = [
  { id: TOOL_RECTANGLE, icon: '/rectangle.svg', title: 'Retângulo', shortcut: 'R' },
  { id: TOOL_CIRCLE, icon: '/circle.svg', title: 'Círculo', shortcut: 'C' },
  { id: TOOL_TRIANGLE, icon: '/triangle.svg', title: 'Triângulo', shortcut: 'T' },
  { id: TOOL_LINE, icon: '/line.svg', title: 'Linha', shortcut: 'L' },
  { id: TOOL_STAR, icon: '/star.svg', title: 'Estrela', shortcut: 'S' },
  { id: TOOL_TEXT, icon: '/text.svg', title: 'Texto', shortcut: 'X' },
  { id: TOOL_ERASER, icon: '/eraser.svg', title: 'Borracha', shortcut: 'E' },
  { id: TOOL_PAINT_BUCKET, icon: '/paint-bucket.svg', title: 'Balde de tinta', shortcut: 'B' },
  { id: TOOL_PENCIL, icon: '/pencil.svg', title: 'Lápis', shortcut: 'P' },
  { id: TOOL_BRUSH, icon: '/brush.svg', title: 'Pincel', shortcut: 'W' }
]

const lineWidths = [3, 6, 9, 11, 14, 18]
const brushSizes = [5, 10, 15, 20, 25, 30]

export default function Toolbar({
  currentTool,
  onToolChange,
  onLineWidthChange,
  onBrushSizeChange,
  currentLineWidth,
  currentBrushSize,
  fillShapes,
  onFillShapesChange
}) {
  const [showLineWidths, setShowLineWidths] = useState(false)
  const [showBrushSizes, setShowBrushSizes] = useState(false)
  const [toolAnimation, setToolAnimation] = useState(null)

  const handleToolClick = (tool) => {
    // Animação ao trocar ferramenta
    setToolAnimation(tool)
    setTimeout(() => setToolAnimation(null), 600)
    
    onToolChange(tool)
    
    if ([TOOL_LINE, TOOL_RECTANGLE, TOOL_CIRCLE, TOOL_TRIANGLE, TOOL_STAR, TOOL_PENCIL].includes(tool)) {
      setShowLineWidths(true)
      setShowBrushSizes(false)
    } else if ([TOOL_BRUSH, TOOL_ERASER].includes(tool)) {
      setShowBrushSizes(true)
      setShowLineWidths(false)
    } else {
      setShowLineWidths(false)
      setShowBrushSizes(false)
    }
  }

  const handleLineWidthClick = (width) => {
    onLineWidthChange(width)
    setShowLineWidths(false)
  }

  const handleBrushSizeClick = (size) => {
    onBrushSizeChange(size)
    setShowBrushSizes(false)
  }

  const shapeTools = [TOOL_LINE, TOOL_RECTANGLE, TOOL_CIRCLE, TOOL_TRIANGLE, TOOL_STAR]
  const showFillToggle = shapeTools.includes(currentTool)

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-3 lg:p-4 w-full lg:w-auto">
      {/* Toggle Preencher Formas - Apenas Desktop */}
      {showFillToggle && (
        <div className="hidden lg:block mb-4 p-3 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border border-primary-200/50 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">Preencher</span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onFillShapesChange(!fillShapes)
              }}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                fillShapes 
                  ? 'bg-gradient-to-r from-primary-600 to-purple-600 shadow-lg' 
                  : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md ${
                  fillShapes ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Ferramentas */}
      <div className="mb-3 lg:mb-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 lg:mb-3 px-1">
          Ferramentas
        </div>
        <div className="grid grid-cols-5 lg:grid-cols-2 gap-2">
          {tools.map((tool) => (
            <ToolButton
              key={tool.id}
              tool={tool}
              isActive={currentTool === tool.id}
              isAnimating={toolAnimation === tool.id}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleToolClick(tool.id)
              }}
            />
          ))}
        </div>
      </div>

      {/* Tamanho da Linha - Apenas Desktop */}
      {showLineWidths && (
        <div className="hidden lg:block mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Espessura
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="24"
              value={currentLineWidth}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                onLineWidthChange(value)
              }}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(currentLineWidth - 1) / 23 * 100}%, #e5e7eb ${(currentLineWidth - 1) / 23 * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex items-center gap-2 min-w-[60px]">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-gray-200">
                <div
                  className="rounded-full bg-gray-800"
                  style={{
                    width: `${Math.max(currentLineWidth, 2)}px`,
                    height: `${Math.max(currentLineWidth, 2)}px`
                  }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-700 min-w-[35px]">
                {currentLineWidth}px
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tamanho do Pincel - Apenas Desktop */}
      {showBrushSizes && (
        <div className="hidden lg:block p-3 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Tamanho
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="3"
              max="40"
              value={currentBrushSize}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                onBrushSizeChange(value)
              }}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(currentBrushSize - 3) / 37 * 100}%, #e5e7eb ${(currentBrushSize - 3) / 37 * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex items-center gap-2 min-w-[60px]">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-gray-200">
                <div
                  className="rounded-full bg-gray-800"
                  style={{
                    width: `${Math.max(currentBrushSize, 3)}px`,
                    height: `${Math.max(currentBrushSize, 3)}px`
                  }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-700 min-w-[35px]">
                {currentBrushSize}px
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ToolButton({ tool, isActive, isAnimating, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      title={`${tool.title} (${tool.shortcut})`}
      className={`relative group flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-br from-primary-100 to-purple-100 text-gray-800 shadow-lg scale-105 ring-2 ring-primary-400 border border-primary-300'
          : isAnimating
          ? 'bg-white text-gray-700 scale-110 rotate-6 shadow-xl border-2 border-primary-400'
          : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md hover:scale-105 active:scale-95 border border-gray-200'
      }`}
    >
      <img 
        src={tool.icon} 
        className={`w-6 h-6 transition-all duration-300 ${
          isActive 
            ? 'opacity-100' 
            : 'opacity-70 group-hover:opacity-100'
        } ${isAnimating ? 'animate-pulse' : ''}`}
        alt={tool.title}
        draggable="false"
      />
      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-600 rounded-full border-2 border-white shadow-md animate-pulse"></div>
      )}
      {isAnimating && (
        <div className="absolute inset-0 rounded-xl bg-primary-400/20 animate-ping"></div>
      )}
    </button>
  )
}

function getSizeClass(size) {
  const sizeMap = {
    3: 'w-1 h-1',
    5: 'w-1.5 h-1.5',
    6: 'w-1.5 h-1.5',
    9: 'w-2 h-2',
    10: 'w-2.5 h-2.5',
    11: 'w-2.5 h-2.5',
    14: 'w-3 h-3',
    15: 'w-3.5 h-3.5',
    18: 'w-4 h-4',
    20: 'w-4.5 h-4.5',
    25: 'w-5 h-5',
    30: 'w-6 h-6'
  }
  return sizeMap[size] || 'w-2 h-2'
}
