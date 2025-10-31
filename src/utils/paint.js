// Utility functions and classes for drawing

export const TOOL_LINE = 'line'
export const TOOL_RECTANGLE = 'rectangle'
export const TOOL_CIRCLE = 'circle'
export const TOOL_TRIANGLE = 'triangle'
export const TOOL_STAR = 'star'
export const TOOL_TEXT = 'text'
export const TOOL_PAINT_BUCKET = 'paint-bucket'
export const TOOL_PENCIL = 'pencil'
export const TOOL_BRUSH = 'brush'
export const TOOL_ERASER = 'eraser'

export class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

export function getMouseCoordsOnCanvas(e, canvas) {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  
  const x = Math.round((e.clientX - rect.left) * scaleX)
  const y = Math.round((e.clientY - rect.top) * scaleY)
  
  return new Point(x, y)
}

export function findDistance(coord1, coord2) {
  const exp1 = Math.pow(coord2.x - coord1.x, 2)
  const exp2 = Math.pow(coord2.y - coord1.y, 2)
  return Math.sqrt(exp1 + exp2)
}

export function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, fill = false) {
  const rot = (Math.PI / 2) * 3
  let x = cx
  let y = cy
  const step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius
    y = cy + Math.sin(rot) * outerRadius
    ctx.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    ctx.lineTo(x, y)
    rot += step
  }
  ctx.lineTo(cx, cy - outerRadius)
  ctx.closePath()
  if (fill) {
    ctx.fill()
  }
  ctx.stroke()
}

export class Fill {
  constructor(canvas, point, color) {
    this.ctx = canvas.getContext('2d')
    this.imageData = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    )
    const targetColor = this.getPixel(point)
    const fillColor = this.hexToRgba(color)
    this.fillStack = []
    this.floodFill(point, targetColor, fillColor)
    this.fillColor()
  }

  floodFill(point, targetColor, fillColor) {
    if (this.colorsMatch(targetColor, fillColor)) return

    const currentColor = this.getPixel(point)
    if (this.colorsMatch(currentColor, targetColor)) {
      this.setPixel(point, fillColor)
      this.fillStack.push([new Point(point.x + 1, point.y), targetColor, fillColor])
      this.fillStack.push([new Point(point.x - 1, point.y), targetColor, fillColor])
      this.fillStack.push([new Point(point.x, point.y + 1), targetColor, fillColor])
      this.fillStack.push([new Point(point.x, point.y - 1), targetColor, fillColor])
    }
  }

  fillColor() {
    if (this.fillStack.length) {
      const range = this.fillStack.length
      for (let i = 0; i < range; i++) {
        this.floodFill(
          this.fillStack[i][0],
          this.fillStack[i][1],
          this.fillStack[i][2]
        )
      }
      this.fillStack.splice(0, range)
      this.fillColor()
    } else {
      this.ctx.putImageData(this.imageData, 0, 0)
      this.fillStack = []
    }
  }

  getPixel(point) {
    if (
      point.x < 0 ||
      point.y < 0 ||
      point.x >= this.imageData.width ||
      point.y >= this.imageData.height
    ) {
      return [-1, -1, -1, -1]
    } else {
      const offset = (point.y * this.imageData.width + point.x) * 4
      return [
        this.imageData.data[offset + 0],
        this.imageData.data[offset + 1],
        this.imageData.data[offset + 2],
        this.imageData.data[offset + 3]
      ]
    }
  }

  setPixel(point, fillColor) {
    const offset = (point.y * this.imageData.width + point.x) * 4
    this.imageData.data[offset + 0] = fillColor[0]
    this.imageData.data[offset + 1] = fillColor[1]
    this.imageData.data[offset + 2] = fillColor[2]
    this.imageData.data[offset + 3] = fillColor[3]
  }

  colorsMatch(color1, color2) {
    return (
      color1[0] === color2[0] &&
      color1[1] === color2[1] &&
      color1[2] === color2[2] &&
      color1[3] === color2[3]
    )
  }

  hexToRgba(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      255
    ]
  }
}

