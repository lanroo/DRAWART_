// "use strict"

// Paint
class Paint {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId)
        this.ctx = canvas.getContext('2d')
        this.ctx.lineCap = 'round'
        this.undoStack = []
        this.undoLimit = 10
    }

    set activeTool(tool) {
        this.tool = tool
    }

    set lineWidth(linewidth) {
        this._lineWidth = linewidth
        this.ctx.lineWidth = this._lineWidth
    }
    set brushSize(brushsize) {
        this._brushSize = brushsize
    }

    set selectedColor(color) {
        this.color = color
        this.ctx.strokeStyle = this.color
    }

    init() {
        this.canvas.onmousedown = e => this.onMouseDown(e)
        this.canvas.onclick = e => this.writeText(e)
    }

    //Write Text
    writeText(st, words) {
        if (this.tool == TOOL_TEXT) {
            document.onkeydown = e => this.writing(e)
            var x = 10
            this.st = this.startPos.x
        }
    }

    writing(e) {
        if (this.tool == TOOL_TEXT) {
            if (
                (e.keyCode >= 48 && e.keyCode <= 90) ||
                (e.keyCode >= 96 && e.keyCode <= 122) ||
                e.keyCode == 226 ||
                e.keyCode == 32
            ) {
                this.ctx.font = `25px Arial`
                this.ctx.fillStyle = this.color
                this.ctx.fillText(e.key, this.startPos.x, this.startPos.y)
                this.startPos.x += this.ctx.measureText(e.key).width
            } else if (e.keyCode == 13) {
                this.startPos.x = this.st
                this.startPos.y += 20
            }
        }
    }

    //OnMouseDown Function
    onMouseDown(e) {
        this.savedData = this.ctx.getImageData(
            0,
            0,
            this.canvas.clientWidth,
            this.canvas.clientHeight
        )

        this.canvas.onmousemove = e => this.onMouseMove(e)
        document.onmouseup = e => this.onMouseUp(e)
        this.startPos = getMouseCoordsOnCanvas(e, this.canvas)

        if (this.undoStack.length >= this.undoLimit) this.undoStack.shift()
        this.undoStack.push(this.savedData)

        if (this.tool == TOOL_PENCIL || this.tool == TOOL_BRUSH) {
            this.ctx.beginPath()
            this.ctx.moveTo(this.startPos.x, this.startPos.y)
        } else if (this.tool == TOOL_PAINT_BUCKET) {
            new Fill(this.canvas, this.startPos, this.color)
        } else if (this.tool == TOOL_ERASER) {
            this.ctx.clearRect(
                this.startPos.x,
                this.startPos.y,
                this._brushSize,
                this._brushSize
            )
        }
    }

    //OnMouseMove Function
    onMouseMove(e) {
        this.currentPos = getMouseCoordsOnCanvas(e, this.canvas)
        switch (this.tool) {
            case TOOL_LINE:
            case TOOL_RECTANGLE:
            case TOOL_CIRCLE:
            case TOOL_TRIANGLE:
            case TOOL_STAR:
            case TOOL_TEXT:
                this.drawShape()
                break
            case TOOL_PENCIL:
                this.drawFreeLine(this._lineWidth)
                break
            case TOOL_BRUSH:
                this.drawFreeLine(this._brushSize)
                break
            case TOOL_ERASER:
                this.ctx.clearRect(
                    this.currentPos.x,
                    this.currentPos.y,
                    this._brushSize,
                    this._brushSize
                )
                break
            default:
                break
        }
    }
    onMouseUp(e) {
        this.canvas.onmousemove = null
        document.onmouseup = null
    }

    drawShape() {
        this.ctx.putImageData(this.savedData, 0, 0)
        this.ctx.beginPath()

        if (this.tool == TOOL_LINE) {
            this.ctx.moveTo(this.startPos.x, this.startPos.y)
            this.ctx.lineTo(this.currentPos.x, this.currentPos.y)
        } else if (this.tool == TOOL_RECTANGLE) {
            this.ctx.rect(
                this.startPos.x,
                this.startPos.y,
                this.currentPos.x - this.startPos.x,
                this.currentPos.y - this.startPos.y
            )
        } else if (this.tool == TOOL_CIRCLE) {
            var distance = findDistance(this.startPos, this.currentPos)
            this.ctx.arc(
                this.startPos.x,
                this.startPos.y,
                distance,
                0,
                2 * Math.PI,
                false
            )
        } else if (this.tool == TOOL_TRIANGLE) {
            this.ctx.moveTo(
                this.startPos.x + (this.currentPos.x - this.startPos.x) / 2,
                this.startPos.y
            )
            this.ctx.lineTo(this.startPos.x, this.currentPos.y)
            this.ctx.lineTo(this.currentPos.x, this.currentPos.y)
            this.ctx.closePath()
        } else if (this.tool == TOOL_STAR) {
            var y = new star().drawStar(
                this.startPos.x,
                this.startPos.y,
                5,
                this.currentPos.x - this.startPos.x - 20,
                this.currentPos.y - this.startPos.y - 20
            )
        }
        this.ctx.stroke()
    }

    drawFreeLine(lineWidth) {
        this.ctx.lineWidth = lineWidth
        this.ctx.lineTo(this.currentPos.x, this.currentPos.y)
        this.ctx.stroke()
    }

    //Undo
    undoPaint() {
        if (this.undoStack.length > 0) {
            this.ctx.putImageData(this.undoStack[this.undoStack.length - 1], 0, 0)
            this.undoStack.pop()
        } else {
            alert('A página está limpa')
        }
    }
}

var ctx = canvas.getContext('2d')

//Class to Draw Star
class star {
    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        var rot = (Math.PI / 2) * 3
        var x = cx
        var y = cy
        var step = Math.PI / spikes

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

        ctx.stroke()
    }
}

//Fill with Paint Bucket
class Fill {
    constructor(canvas, point, color) {
        this.ctx = canvas.getContext('2d')

        this.imageData = this.ctx.getImageData(
            0,
            0,
            this.ctx.canvas.width,
            this.ctx.canvas.height
        )

        var targetColor = this.getPixel(point)

        var fillColor = this.hexToRgba(color)

        this.fillStack = []

        this.floodFill(point, targetColor, fillColor)
        this.fillColor()
    }

    floodFill(point, targetColor, fillColor) {
        if (this.colorsMatch(targetColor, fillColor)) return

        var currentColor = this.getPixel(point)

        if (this.colorsMatch(currentColor, targetColor)) {
            this.setPixel(point, fillColor)

            this.fillStack.push([
                new Point(point.x + 1, point.y),
                targetColor,
                fillColor
            ])
            this.fillStack.push([
                new Point(point.x - 1, point.y),
                targetColor,
                fillColor
            ])
            this.fillStack.push([
                new Point(point.x, point.y + 1),
                targetColor,
                fillColor
            ])
            this.fillStack.push([
                new Point(point.x, point.y - 1),
                targetColor,
                fillColor
            ])
        }
    }

    fillColor() {
        if (this.fillStack.length) {
            var range = this.fillStack.length
            for (var i = 0; i < range; i++) {
                this.floodFill(
                    this.fillStack[i][0],
                    this.fillStack[i][1],
                    this.fillStack[i][2],
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
            (point.x < 0 || point.y < 0 || point.x > this.imageData.width,
                point.y >= this.imageData.height)
        ) {
            return [-1, -1, -1, -1]
        } else {
            var offset = (point.y * this.imageData.width + point.x) * 4

            return [
                this.imageData.data[offset + 0],
                this.imageData.data[offset + 1],
                this.imageData.data[offset + 2],
                this.imageData.data[offset + 3]
            ]
        }
    }

    setPixel(point, fillColor) {
        var offset = (point.y * this.imageData.width + point.x) * 4

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
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
            255
        ]
    }
}

function findDistance(coord1, coord2) {
    var exp1 = Math.pow(coord2.x - coord1.x, 2)
    var exp2 = Math.pow(coord2.y - coord1.y, 2)

    var distance = Math.sqrt(exp1 + exp2)

    return distance
}

//Tools
Tool = [
    (TOOL_LINE = 'line'),
    (TOOL_RECTANGLE = 'rectangle'),
    (TOOL_CIRCLE = 'circle'),
    (TOOL_TRIANGLE = 'triangle'),
    (TOOL_STAR = 'star'),
    (TOOL_TEXT = 'text'),
    (TOOL_PAINT_BUCKET = 'paint-bucket'),
    (TOOL_PENCIL = 'pencil'),
    (TOOL_BRUSH = 'brush'),
    (TOOL_ERASER = 'eraser')
]

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

function getMouseCoordsOnCanvas(e, canvas) {
    var rect = canvas.getBoundingClientRect()
    var x = Math.round(e.clientX - rect.left)
    var y = Math.round(e.clientY - rect.top)
    return new Point(x, y)
}

//Set Default values and Start Drawing
var paint = new Paint('canvas')
paint.init()
paint.activeTool = TOOL_LINE
paint.lineWidth = 3
paint.brushSize = 5
paint.selectedColor = '#000000'

//Data-Command
document.querySelectorAll('[data-command]').forEach(item => {
    item.addEventListener('click', e => {
        var command = item.getAttribute('data-command')
        if (command === 'undo') {
            paint.undoPaint()
        } else if (command === 'delete') {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        } else if (command === 'download') {
            var canvas = document.getElementById('canvas')
            var image = canvas
                .toDataURL('image/png', 1.0)
                .replace('image/png', 'image/octet-stream')
            var link = document.createElement('a')
            link.download = 'image.jpg'
            link.href = image
            link.click()
        }
    })
})

//Canvas Click
canvas.addEventListener('click', () => {
    document.querySelector('.linewidths').classList.remove('showLine')
    document.querySelector('.brushwidths').classList.remove('showBrush')
})

//Data-Tool
document.querySelectorAll('[data-tool]').forEach(item => {
    item.addEventListener('click', e => {
        document.querySelector('[data-tool].active').classList.toggle('active')
        item.classList.toggle('active')

        var selectedTool = item.getAttribute('data-tool')
        var lines = document.querySelector('.linewidths')
        var brushes = document.querySelector('.brushwidths')
        paint.activeTool = selectedTool
        switch (selectedTool) {
            case TOOL_LINE:
                lines.classList.add('showLine')
                lines.style.left = '-120%'
                lines.style.top = '23%'
                document.querySelector('.brushwidths').classList.remove('showBrush')
                canvas.style.cursor = 'default'
                break
            case TOOL_RECTANGLE:
                lines.classList.add('showLine')
                lines.style.left = '-160%'
                lines.style.top = '3%'
                document.querySelector('.brushwidths').classList.remove('showBrush')
                canvas.style.cursor = 'default'
                break
            case TOOL_CIRCLE:
                lines.classList.add('showLine')
                lines.style.left = '-120%'
                lines.style.top = '3%'
                document.querySelector('.brushwidths').classList.remove('showBrush')
                canvas.style.cursor = 'default'
                break
            case TOOL_TRIANGLE:
                lines.classList.add('showLine')
                lines.style.left = '-160%'
                lines.style.top = '23%'
                document.querySelector('.brushwidths').classList.remove('showBrush')
                canvas.style.cursor = 'default'
                break
            case TOOL_STAR:
                lines.classList.add('showLine')
                lines.style.left = '-160%'
                lines.style.top = '42%'
                document.querySelector('.brushwidths').classList.remove('showBrush')
                canvas.style.cursor = 'default'
                break
            case TOOL_PENCIL:
                lines.classList.add('showLine')
                lines.style.left = '-160%'
                lines.style.top = '79.5%'
                document.querySelector('.brushwidths').classList.remove('showBrush')
                canvas.style.cursor = "url('assets/pencil.svg'), pointer"
                break

                break

            case TOOL_BRUSH:
                brushes.classList.add('showBrush')
                brushes.style.left = '-120%'
                brushes.style.top = '79.5%'
                document.querySelector('.linewidths').classList.remove('showLine')
                canvas.style.cursor = "url('/assets/brush.svg'), pointer"
                break
            case TOOL_ERASER:
                document.querySelector('.linewidths').classList.remove('showLine')
                brushes.classList.add('showBrush')
                brushes.style.left = '-160%'
                brushes.style.top = '60%'
                document.querySelector('.linewidths').classList.remove('showLine')
                canvas.style.cursor = "url('/assets/eraser.svg'), pointer"
                break

            case TOOL_TEXT:
                document.querySelector('.brushwidths').classList.remove('showBrush')
                document.querySelector('.linewidths').classList.remove('showLine')
                canvas.style.cursor = 'text'
                break
            case TOOL_PAINT_BUCKET:
                document.querySelector('.brushwidths').classList.remove('showBrush')
                document.querySelector('.linewidths').classList.remove('showLine')
                canvas.style.cursor = "url('/images/cursor-bucket.svg'), pointer"
                break
            default:
        }
    })
})

//Data-Line-Width
document.querySelectorAll('[data-line-width]').forEach(item => {
    item.addEventListener('click', e => {
        document
            .querySelector('[data-line-width].active')
            .classList.toggle('active')
        item.classList.toggle('active')

        var lineWidth = item.getAttribute('data-line-width')
        paint.lineWidth = lineWidth

        document.querySelector('.linewidths').classList.remove('showLine')
    })
})

//Data-Brush-Size
document.querySelectorAll('[data-brush-size]').forEach(item => {
    item.addEventListener('click', e => {
        document
            .querySelector('[data-brush-size].active')
            .classList.toggle('active')
        item.classList.toggle('active')

        var brushSize = item.getAttribute('data-brush-size')
        paint.brushSize = brushSize

        document.querySelector('.brushwidths').classList.remove('showBrush')
    })
})

//Data-Color
document.querySelectorAll('[data-color]').forEach(item => {
    item.addEventListener('click', e => {
        document.querySelector('[data-color].active').classList.toggle('active')
        item.classList.toggle('active')
        wrp_setPicker.classList.remove('showBoard')

        var color = item.getAttribute('data-color')
        paint.selectedColor = color
    })
})

// Add/Remove Color Picker
var picker = document.getElementById('picker')
var wrp_setPicker = document.querySelector('.wrp-picker')
var setColor = document.getElementById('setColor')

picker.addEventListener('click', () => {
    wrp_setPicker.classList.add('showBoard')
})

canvas.addEventListener('click', () => {
    wrp_setPicker.classList.remove('showBoard')
})