import { useState, useRef, useEffect } from 'react'

const defaultColors = [
  '#000000', '#6D7278', '#B620E0', '#6236FF',
  '#0091FF', '#32C5FF', '#6DD400', '#F7B500',
  '#FA6400', '#E02020', '#FFFFFF'
]

export default function ColorPicker({ selectedColor, onColorChange }) {
  const [showPicker, setShowPicker] = useState(false)
  const [hex, setHex] = useState('#000000')
  const pickerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false)
      }
    }
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPicker])

  const handleColorClick = (color) => {
    if (color) {
      onColorChange(color)
      setShowPicker(false)
    } else {
      setShowPicker(!showPicker)
    }
  }

  const handleSetColor = () => {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      onColorChange(hex)
      setShowPicker(false)
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 p-3 w-full lg:w-auto">
      {/* Grid de Cores Compacto */}
      <div className="grid grid-cols-6 gap-2">
        {defaultColors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorClick(color)}
            className={`w-8 h-8 rounded-lg transition-all hover:scale-110 hover:shadow-md border-2 ${
              selectedColor === color
                ? 'border-primary-600 shadow-lg scale-110 ring-2 ring-primary-200'
                : color === '#FFFFFF'
                ? 'border-gray-300 hover:border-gray-400'
                : 'border-transparent hover:border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      {/* Seletor Customizado - Compacto */}
      <div className="relative mt-2" ref={pickerRef}>
        <button
          onClick={() => handleColorClick('')}
          className="w-full h-8 rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-pink-500 hover:scale-105 transition-transform shadow-md border-2 border-white relative overflow-hidden"
          title="Mais Cores"
        >
          <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-all"></div>
          <span className="relative z-10 text-white text-xs font-semibold drop-shadow-lg">
            +
          </span>
        </button>

        {/* Painel de Cor Customizado - Compacto */}
        {showPicker && (
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 z-50 animate-slide-up">
            <div className="mb-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => {
                    const value = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`
                    setHex(value.toUpperCase())
                  }}
                  placeholder="#000000"
                  className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                />
                <button
                  onClick={handleSetColor}
                  className="px-3 py-1.5 text-xs bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  OK
                </button>
              </div>
            </div>
            
            {/* Preview */}
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm"
                style={{ backgroundColor: hex }}
              ></div>
              <div className="flex-1">
                <div className="font-mono text-xs font-semibold text-gray-800">{hex}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
