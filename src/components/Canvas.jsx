import { useEffect, useRef, useState } from 'react'
import {
  TOOL_PENCIL,
  TOOL_BRUSH,
  TOOL_ERASER,
  TOOL_TEXT
} from '../utils/paint'

export default function Canvas({
  canvasRef,
  initCanvas,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleTextClick,
  handleKeyDown,
  currentTool,
  selectedColor,
  lineWidth,
  brushSize
}) {
  const canvas = useRef(null)
  const containerRef = useRef(null)
  const isDrawing = useRef(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (canvas.current) {
      initCanvas(canvas.current)
      canvasRef.current = canvas.current
    }
  }, [initCanvas, canvasRef])

  useEffect(() => {
    const canvasEl = canvas.current
    if (!canvasEl) return

    const onMouseDown = (e) => {
      isDrawing.current = true
      handleMouseDown(e)
    }

    const onMouseMove = (e) => {
      if (isDrawing.current) {
        handleMouseMove(e)
      }
      // Atualizar posição do mouse para preview
      updateMousePosition(e, canvasEl)
    }
    
    const updateMousePosition = (e, canvasEl) => {
      const rect = canvasEl.getBoundingClientRect()
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setShowPreview(true)
    }

    const onMouseUp = () => {
      isDrawing.current = false
      handleMouseUp()
      setShowPreview(false)
    }

    const onTextClick = (e) => {
      handleTextClick(e)
    }

    const onKeyDown = (e) => {
      handleKeyDown(e)
    }

    // Touch events
    const onTouchStart = (e) => {
      isDrawing.current = true
      handleTouchStart(e)
    }

    const onTouchMove = (e) => {
      if (isDrawing.current) {
        handleTouchMove(e)
      }
    }

    const onTouchEnd = (e) => {
      isDrawing.current = false
      handleTouchEnd(e)
    }

    // Mouse events
    canvasEl.addEventListener('mousedown', onMouseDown)
    canvasEl.addEventListener('mousemove', onMouseMove)
    canvasEl.addEventListener('mouseleave', () => setShowPreview(false))
    canvasEl.addEventListener('mouseenter', (e) => {
      updateMousePosition(e, canvasEl)
    })
    window.addEventListener('mouseup', onMouseUp)
    canvasEl.addEventListener('click', onTextClick)
    window.addEventListener('keydown', onKeyDown)

    // Touch events
    canvasEl.addEventListener('touchstart', onTouchStart, { passive: false })
    canvasEl.addEventListener('touchmove', onTouchMove, { passive: false })
    canvasEl.addEventListener('touchend', onTouchEnd, { passive: false })

    return () => {
      canvasEl.removeEventListener('mousedown', onMouseDown)
      canvasEl.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      canvasEl.removeEventListener('click', onTextClick)
      window.removeEventListener('keydown', onKeyDown)
      canvasEl.removeEventListener('touchstart', onTouchStart)
      canvasEl.removeEventListener('touchmove', onTouchMove)
      canvasEl.removeEventListener('touchend', onTouchEnd)
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd, handleTextClick, handleKeyDown])

  useEffect(() => {
    if (!canvas.current) return
    const cursorMap = {
      [TOOL_PENCIL]: "url('/pencil.svg'), crosshair",
      [TOOL_BRUSH]: "url('/brush.svg'), crosshair",
      [TOOL_ERASER]: "url('/eraser.svg'), crosshair",
      [TOOL_TEXT]: 'text'
    }
    canvas.current.style.cursor = cursorMap[currentTool] || 'crosshair'
    
    // Mostrar preview apenas para lápis, pincel e borracha
    const toolsWithPreview = [TOOL_PENCIL, TOOL_BRUSH, TOOL_ERASER]
    if (!toolsWithPreview.includes(currentTool)) {
      setShowPreview(false)
    }
  }, [currentTool])

  const toolsWithPreview = [TOOL_PENCIL, TOOL_BRUSH, TOOL_ERASER]
  const shouldShowPreview = showPreview && toolsWithPreview.includes(currentTool)
  const previewSize = currentTool === TOOL_ERASER ? brushSize : (currentTool === TOOL_PENCIL ? lineWidth : brushSize)
  const previewColor = currentTool === TOOL_ERASER ? '#ffffff' : selectedColor

  return (
    <div className="relative w-full flex justify-center items-center">
      <div ref={containerRef} className="relative w-full max-w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-xl shadow-xl"></div>
        <canvas
          ref={canvas}
          id="canvas"
          width={1000}
          height={480}
          className="relative z-10 bg-white rounded-xl shadow-xl border-2 border-gray-200 w-full h-auto"
          style={{
            maxWidth: '100%',
            height: 'auto',
            aspectRatio: '1000/480'
          }}
        />
        
        {/* Preview do Pincel/Lápis/Borracha */}
        {shouldShowPreview && (
          <div
            className="absolute pointer-events-none z-20 transition-opacity duration-150"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {currentTool === TOOL_ERASER ? (
              <div
                className="rounded-full border-2 border-gray-400 border-dashed"
                style={{
                  width: `${previewSize}px`,
                  height: `${previewSize}px`,
                  backgroundColor: 'rgba(255, 255, 255, 0.5)'
                }}
              />
            ) : (
              <div
                className="rounded-full shadow-lg"
                style={{
                  width: `${previewSize}px`,
                  height: `${previewSize}px`,
                  backgroundColor: previewColor,
                  border: previewSize <= 5 ? '1px solid rgba(0,0,0,0.2)' : 'none'
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
