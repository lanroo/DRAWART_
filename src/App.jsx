import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import ColorPicker from './components/ColorPicker'
import CanvasControls from './components/CanvasControls'
import { usePaint } from './hooks/usePaint'
import { TOOL_LINE } from './utils/paint'

function App() {
  useEffect(() => {
    console.log('%c🎨 DrawArt Pro - Paint Profissional', 'color: #6366f1; font-size: 18px; font-weight: bold;')
    console.log('%c✨ Design Moderno e Responsivo', 'color: #8b5cf6; font-size: 14px; font-weight: bold;')
  }, [])

  const paint = usePaint()
  const [currentTool, setCurrentTool] = useState(TOOL_LINE)
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(3)
  const [brushSize, setBrushSize] = useState(5)
  const [fillShapes, setFillShapes] = useState(false)

  useEffect(() => {
    paint.setTool(currentTool)
  }, [currentTool, paint])

  useEffect(() => {
    paint.setColor(selectedColor)
  }, [selectedColor, paint])

  useEffect(() => {
    paint.setLineWidth(lineWidth)
  }, [lineWidth, paint])

  useEffect(() => {
    paint.setBrushSize(brushSize)
  }, [brushSize, paint])

  useEffect(() => {
    paint.setFillShapes(fillShapes)
  }, [fillShapes, paint])

  const handleUndo = () => {
    paint.undo()
  }

  const handleRedo = () => {
    paint.redo()
  }

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o canvas?')) {
      paint.clear()
    }
  }

  const handleDownload = (format = 'png') => {
    paint.download(format)
  }

  const handleShare = () => {
    paint.share()
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 flex flex-col overflow-hidden">
      {/* Navbar Superior - Sticky */}
      <Navbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={paint.canUndo()}
        canRedo={paint.canRedo()}
        onDelete={handleDelete}
        onShare={handleShare}
        onDownload={handleDownload}
      />

      {/* Área Principal - Flexível e Compacta */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-col lg:flex-row gap-3 p-3 overflow-hidden">
          
          {/* Canvas Central */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <Canvas
                canvasRef={paint.canvasRef}
                initCanvas={paint.initCanvas}
                handleMouseDown={paint.handleMouseDown}
                handleMouseMove={paint.handleMouseMove}
                handleMouseUp={paint.handleMouseUp}
                handleTouchStart={paint.handleTouchStart}
                handleTouchMove={paint.handleTouchMove}
                handleTouchEnd={paint.handleTouchEnd}
                handleTextClick={paint.handleTextClick}
                handleKeyDown={paint.handleKeyDown}
                currentTool={currentTool}
                selectedColor={selectedColor}
                lineWidth={lineWidth}
                brushSize={brushSize}
              />
            </div>

            {/* Controles Abaixo do Canvas */}
            <div className="mt-2 w-full">
              <CanvasControls
                currentTool={currentTool}
                selectedColor={selectedColor}
                fillShapes={fillShapes}
                onFillShapesChange={setFillShapes}
              />
            </div>
          </div>

          {/* Sidebar Direita - Desktop */}
          <div className="hidden lg:flex flex-col gap-3 w-72 flex-shrink-0 overflow-y-auto">
            <Toolbar
              currentTool={currentTool}
              onToolChange={setCurrentTool}
              onLineWidthChange={setLineWidth}
              onBrushSizeChange={setBrushSize}
              currentLineWidth={lineWidth}
              currentBrushSize={brushSize}
              fillShapes={fillShapes}
              onFillShapesChange={setFillShapes}
            />
            
            <ColorPicker
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
            />
          </div>

          {/* Sidebar Mobile - Abaixo */}
          <div className="lg:hidden w-full flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Toolbar
                currentTool={currentTool}
                onToolChange={setCurrentTool}
                onLineWidthChange={setLineWidth}
                onBrushSizeChange={setBrushSize}
                currentLineWidth={lineWidth}
                currentBrushSize={brushSize}
                fillShapes={fillShapes}
                onFillShapesChange={setFillShapes}
              />
            </div>
            
            <div className="flex-1">
              <ColorPicker
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default App
