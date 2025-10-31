import { useRef, useCallback } from 'react'
import {
  TOOL_LINE,
  TOOL_RECTANGLE,
  TOOL_CIRCLE,
  TOOL_TRIANGLE,
  TOOL_STAR,
  TOOL_TEXT,
  TOOL_PAINT_BUCKET,
  TOOL_PENCIL,
  TOOL_BRUSH,
  TOOL_ERASER,
  getMouseCoordsOnCanvas,
  findDistance,
  drawStar,
  Fill
} from '../utils/paint'

export function usePaint() {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const toolRef = useRef(TOOL_LINE)
  const colorRef = useRef('#000000')
  const lineWidthRef = useRef(3)
  const brushSizeRef = useRef(5)
  const startPosRef = useRef(null)
  const currentPosRef = useRef(null)
  const savedDataRef = useRef(null)
  const undoStackRef = useRef([])
  const redoStackRef = useRef([])
  const undoLimit = 50
  const textStartXRef = useRef(0)
  const fillShapesRef = useRef(false)
  const isDrawingRef = useRef(false)

  const initCanvas = useCallback((canvas) => {
    if (!canvas) return
    canvasRef.current = canvas
    ctxRef.current = canvas.getContext('2d')
    ctxRef.current.lineCap = 'round'
    ctxRef.current.lineWidth = lineWidthRef.current
    ctxRef.current.strokeStyle = colorRef.current
    
    // Carregar do localStorage se existir
    const saved = localStorage.getItem('drawart-canvas')
    if (saved) {
      const img = new Image()
      img.onload = () => {
        ctxRef.current.drawImage(img, 0, 0)
      }
      img.src = saved
    }
  }, [])

  const setTool = useCallback((tool) => {
    toolRef.current = tool
  }, [])

  const setColor = useCallback((color) => {
    colorRef.current = color
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color
    }
  }, [])

  const setLineWidth = useCallback((width) => {
    lineWidthRef.current = width
    if (ctxRef.current) {
      ctxRef.current.lineWidth = width
    }
  }, [])

  const setBrushSize = useCallback((size) => {
    brushSizeRef.current = size
  }, [])

  const setFillShapes = useCallback((fill) => {
    fillShapesRef.current = fill
  }, [])

  const saveState = useCallback(() => {
    if (!canvasRef.current || !ctxRef.current) return
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    
    // Usar width e height do canvas, não clientWidth/clientHeight
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    // Limpar redo stack quando uma nova ação é feita
    redoStackRef.current = []
    
    if (undoStackRef.current.length >= undoLimit) {
      undoStackRef.current.shift()
    }
    undoStackRef.current.push(imageData)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!canvasRef.current || !ctxRef.current || !startPosRef.current) return

    const ctx = ctxRef.current
    currentPosRef.current = getMouseCoordsOnCanvas(e, canvasRef.current)

    switch (toolRef.current) {
      case TOOL_LINE:
      case TOOL_RECTANGLE:
      case TOOL_CIRCLE:
      case TOOL_TRIANGLE:
      case TOOL_STAR:
        drawShape()
        break
      case TOOL_PENCIL:
        drawFreeLine(lineWidthRef.current)
        break
      case TOOL_BRUSH:
        drawFreeLine(brushSizeRef.current)
        break
      case TOOL_ERASER:
        ctx.clearRect(
          currentPosRef.current.x - brushSizeRef.current / 2,
          currentPosRef.current.y - brushSizeRef.current / 2,
          brushSizeRef.current,
          brushSizeRef.current
        )
        break
      default:
        break
    }

    function drawShape() {
      if (!savedDataRef.current || !startPosRef.current || !currentPosRef.current) return
      
      ctx.putImageData(savedDataRef.current, 0, 0)
      ctx.beginPath()
      ctx.strokeStyle = colorRef.current
      ctx.fillStyle = colorRef.current
      
      // Sempre definir fillStyle antes de usar fill()
      if (fillShapesRef.current) {
        ctx.fillStyle = colorRef.current
      }

      if (toolRef.current === TOOL_LINE) {
        ctx.moveTo(startPosRef.current.x, startPosRef.current.y)
        ctx.lineTo(currentPosRef.current.x, currentPosRef.current.y)
        ctx.stroke()
      } else if (toolRef.current === TOOL_RECTANGLE) {
        const width = currentPosRef.current.x - startPosRef.current.x
        const height = currentPosRef.current.y - startPosRef.current.y
        ctx.rect(startPosRef.current.x, startPosRef.current.y, width, height)
        if (fillShapesRef.current) {
          ctx.fill()
        }
        ctx.stroke()
      } else if (toolRef.current === TOOL_CIRCLE) {
        const distance = findDistance(startPosRef.current, currentPosRef.current)
        ctx.arc(
          startPosRef.current.x,
          startPosRef.current.y,
          distance,
          0,
          2 * Math.PI,
          false
        )
        if (fillShapesRef.current) {
          ctx.fill()
        }
        ctx.stroke()
      } else if (toolRef.current === TOOL_TRIANGLE) {
        ctx.moveTo(
          startPosRef.current.x + (currentPosRef.current.x - startPosRef.current.x) / 2,
          startPosRef.current.y
        )
        ctx.lineTo(startPosRef.current.x, currentPosRef.current.y)
        ctx.lineTo(currentPosRef.current.x, currentPosRef.current.y)
        ctx.closePath()
        if (fillShapesRef.current) {
          ctx.fill()
        }
        ctx.stroke()
      } else if (toolRef.current === TOOL_STAR) {
        drawStar(
          ctx,
          startPosRef.current.x,
          startPosRef.current.y,
          5,
          currentPosRef.current.x - startPosRef.current.x - 20,
          currentPosRef.current.y - startPosRef.current.y - 20,
          fillShapesRef.current
        )
      }
    }

    function drawFreeLine(lineWidth) {
      ctx.strokeStyle = colorRef.current
      ctx.lineWidth = lineWidth
      ctx.lineTo(currentPosRef.current.x, currentPosRef.current.y)
      ctx.stroke()
    }
  }, [])

  const autoSave = useCallback(() => {
    if (!canvasRef.current) return
    try {
      const dataURL = canvasRef.current.toDataURL('image/png')
      localStorage.setItem('drawart-canvas', dataURL)
    } catch (e) {
      console.warn('Auto-save falhou:', e)
    }
  }, [])

  const handleMouseDown = useCallback((e) => {
    if (!canvasRef.current || !ctxRef.current) return

    const canvas = canvasRef.current
    const ctx = ctxRef.current

    savedDataRef.current = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    )

    // Salvar estado antes de começar a desenhar
    saveState()

    startPosRef.current = getMouseCoordsOnCanvas(e, canvas)
    isDrawingRef.current = true

    if (toolRef.current === TOOL_PENCIL || toolRef.current === TOOL_BRUSH) {
      ctx.beginPath()
      ctx.moveTo(startPosRef.current.x, startPosRef.current.y)
      ctx.strokeStyle = colorRef.current
      ctx.fillStyle = colorRef.current
    } else if (toolRef.current === TOOL_PAINT_BUCKET) {
      new Fill(canvas, startPosRef.current, colorRef.current)
      // Após o fill, salvar estado novamente para permitir undo
      setTimeout(() => {
        if (canvasRef.current && ctxRef.current) {
          saveState()
          autoSave()
        }
      }, 0)
    } else if (toolRef.current === TOOL_ERASER) {
      ctx.clearRect(
        startPosRef.current.x - brushSizeRef.current / 2,
        startPosRef.current.y - brushSizeRef.current / 2,
        brushSizeRef.current,
        brushSizeRef.current
      )
    }
  }, [saveState, autoSave])

  const handleMouseUp = useCallback(() => {
    if (isDrawingRef.current && canvasRef.current && ctxRef.current) {
      // Salvar estado após desenhar
      saveState()
      // Auto-save no localStorage
      autoSave()
    }
    isDrawingRef.current = false
    startPosRef.current = null
    currentPosRef.current = null
  }, [saveState, autoSave])

  const handleTextClick = useCallback((e) => {
    if (toolRef.current === TOOL_TEXT && canvasRef.current && ctxRef.current) {
      const pos = getMouseCoordsOnCanvas(e, canvasRef.current)
      textStartXRef.current = pos.x
      startPosRef.current = pos
    }
  }, [])

  const undo = useCallback(() => {
    if (!ctxRef.current || !canvasRef.current) return false
    if (undoStackRef.current.length > 0) {
      const canvas = canvasRef.current
      const ctx = ctxRef.current
      const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // Adicionar estado atual ao redo stack
      if (redoStackRef.current.length >= undoLimit) {
        redoStackRef.current.shift()
      }
      redoStackRef.current.push(currentState)
      
      // Restaurar estado anterior
      const previousState = undoStackRef.current.pop()
      ctx.putImageData(previousState, 0, 0)
      autoSave()
      return true
    }
    return false
  }, [autoSave])

  const redo = useCallback(() => {
    if (!ctxRef.current || !canvasRef.current) return false
    if (redoStackRef.current.length > 0) {
      const canvas = canvasRef.current
      const ctx = ctxRef.current
      const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // Adicionar estado atual ao undo stack
      if (undoStackRef.current.length >= undoLimit) {
        undoStackRef.current.shift()
      }
      undoStackRef.current.push(currentState)
      
      // Restaurar estado do redo
      const nextState = redoStackRef.current.pop()
      ctx.putImageData(nextState, 0, 0)
      autoSave()
      return true
    }
    return false
  }, [autoSave])

  const download = useCallback((format = 'png') => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    
    let mimeType = 'image/png'
    let extension = 'png'
    let quality = 1.0
    
    if (format === 'jpg' || format === 'jpeg') {
      mimeType = 'image/jpeg'
      extension = 'jpg'
      quality = 0.9
    } else if (format === 'webp') {
      mimeType = 'image/webp'
      extension = 'webp'
      quality = 0.9
    }
    
    const image = canvas.toDataURL(mimeType, quality)
    const link = document.createElement('a')
    link.download = `drawart.${extension}`
    link.href = image
    link.click()
  }, [])

  const handleKeyDown = useCallback((e) => {
    // Atalhos de teclado globais
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
        return
      }
      if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault()
        redo()
        return
      }
      if (e.key === 's') {
        e.preventDefault()
        download()
        return
      }
    }

    if (toolRef.current === TOOL_TEXT && startPosRef.current && ctxRef.current) {
      const ctx = ctxRef.current
      if (
        (e.keyCode >= 48 && e.keyCode <= 90) ||
        (e.keyCode >= 96 && e.keyCode <= 122) ||
        e.keyCode === 226 ||
        e.keyCode === 32
      ) {
        ctx.font = '25px Arial'
        ctx.fillStyle = colorRef.current
        ctx.fillText(e.key, startPosRef.current.x, startPosRef.current.y)
        startPosRef.current.x += ctx.measureText(e.key).width
      } else if (e.keyCode === 13) {
        startPosRef.current.x = textStartXRef.current
        startPosRef.current.y += 20
      }
    }
  }, [undo, redo, download])

  const canUndo = useCallback(() => {
    return undoStackRef.current.length > 0
  }, [])

  const canRedo = useCallback(() => {
    return redoStackRef.current.length > 0
  }, [])

  const clear = useCallback(() => {
    if (!canvasRef.current || !ctxRef.current) return
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )
    // Limpar localStorage também
    localStorage.removeItem('drawart-canvas')
    // Limpar stacks
    undoStackRef.current = []
    redoStackRef.current = []
  }, [])

  const share = useCallback(async () => {
    if (!canvasRef.current) return
    canvasRef.current.toBlob(function (blob) {
      const file = new File([blob], 'image.png', { type: 'image/png' })
      const data = { files: [file] }
      if (navigator.share) {
        navigator.share(data).catch((error) => {
          console.error('Erro ao compartilhar:', error)
        })
      }
    })
  }, [])

  // Função auxiliar para touch events
  const getTouchCoords = useCallback((e, canvas) => {
    const touch = e.touches[0] || e.changedTouches[0]
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const x = Math.round((touch.clientX - rect.left) * scaleX)
    const y = Math.round((touch.clientY - rect.top) * scaleY)
    
    return { x, y }
  }, [])

  const handleTouchStart = useCallback((e) => {
    e.preventDefault()
    if (!canvasRef.current || !ctxRef.current) return
    const touch = getTouchCoords(e, canvasRef.current)
    const rect = canvasRef.current.getBoundingClientRect()
    const mouseEvent = {
      clientX: (touch.x / (canvasRef.current.width / rect.width)) + rect.left,
      clientY: (touch.y / (canvasRef.current.height / rect.height)) + rect.top
    }
    handleMouseDown(mouseEvent)
  }, [getTouchCoords, handleMouseDown])

  const handleTouchMove = useCallback((e) => {
    e.preventDefault()
    if (!canvasRef.current || !ctxRef.current || !startPosRef.current) return
    const touch = getTouchCoords(e, canvasRef.current)
    const rect = canvasRef.current.getBoundingClientRect()
    const mouseEvent = {
      clientX: (touch.x / (canvasRef.current.width / rect.width)) + rect.left,
      clientY: (touch.y / (canvasRef.current.height / rect.height)) + rect.top
    }
    handleMouseMove(mouseEvent)
  }, [getTouchCoords, handleMouseMove])

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault()
    handleMouseUp()
  }, [handleMouseUp])

  return {
    canvasRef,
    initCanvas,
    setTool,
    setColor,
    setLineWidth,
    setBrushSize,
    setFillShapes,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTextClick,
    handleKeyDown,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    download,
    share,
    getCurrentTool: () => toolRef.current
  }
}

