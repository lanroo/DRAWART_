import {
  TOOL_LINE,
  TOOL_RECTANGLE,
  TOOL_CIRCLE,
  TOOL_TRIANGLE,
  TOOL_STAR
} from '../utils/paint'

export default function CanvasControls({
  currentTool,
  selectedColor,
  fillShapes,
  onFillShapesChange
}) {

  const shapeTools = [TOOL_LINE, TOOL_RECTANGLE, TOOL_CIRCLE, TOOL_TRIANGLE, TOOL_STAR]
  const showFillControl = shapeTools.includes(currentTool)

  const handleZoomIn = () => {
    console.log('Zoom In')
  }

  const handleZoomOut = () => {
    console.log('Zoom Out')
  }

  const handleResetZoom = () => {
    console.log('Reset Zoom')
  }

  return (
    <div className="w-full">
      {/* Controles Principais */}
      <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 p-2 lg:p-3">
        <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-3">
          
          {/* Toggle Preencher */}
          {showFillControl && (
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1.5 border border-gray-200">
              <span className="text-[10px] font-semibold text-gray-600 hidden sm:inline">Fill</span>
              <button
                onClick={() => onFillShapesChange(!fillShapes)}
                className={`relative w-10 h-5 rounded-full transition-all ${
                  fillShapes 
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600' 
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    fillShapes ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Indicador de Cor */}
          <div
            className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
            style={{ backgroundColor: selectedColor }}
            title={selectedColor}
          ></div>

          {/* Separador */}
          <div className="hidden md:block w-px h-8 bg-gray-300"></div>

          {/* Zoom Controls - Compacto */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1.5 border border-gray-200">
            <button
              onClick={handleZoomOut}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-white hover:bg-gray-100 transition-colors"
              title="Diminuir Zoom"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>
            <span className="text-[10px] font-semibold text-gray-600 min-w-[2.5rem] text-center">100%</span>
            <button
              onClick={handleZoomIn}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-white hover:bg-gray-100 transition-colors"
              title="Aumentar Zoom"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

