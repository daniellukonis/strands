// Author : daniellukonis

window.addEventListener("contextmenu",e => e.preventDefault())
const canvasMain = document.querySelector('canvas')

function resizeCanvas(){
    const canvas = document.querySelector('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

function fillBackground(color = "#FFF"){
    const canvas = document.querySelector('canvas')
    const context = canvas.getContext('2d')
    context.save()
    context.fillStyle = color
    context.fillRect(0,0,canvas.width,canvas.height)
    context.restore()
}

resizeCanvas()

class Strand{
    constructor(color){
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
        this.xCenter = Math.floor(this.canvas.width / 2)
        this.yCenter = Math.floor(this.canvas.height / 2)
    
        // {x:rand, xC:0, xV:1, y:y, yC:y, yV:rand}    
        this.coord1 = this.randomPoint(0, 4, 100)
        this.coord2 = this.randomPoint(this.canvas.height, 1, 100)
        this.coord3 = this.randomPoint(this.canvas.height * 4/6, 1, 100, true)
        this.coord3D = 1
        this.coord4 = this.randomPoint(this.canvas.height * 5/6, 1, 100, true)

        this.lineWidth = (fxrand() * this.canvas.width / 50) + 1
        this.lineWidthC = 0
        this.lineWidthV = 0.05
        this.color = color
        this.strokeStyle = this.randomColor()
    }

    randomSign(){
        return fxrand() > 0.5 ? 1 : -1
    }

    randomColor(){
        const alpha = 0.9

        if(this.color === "white"){
            return `rgba(255,255,255,${alpha})`
        }

        if(this.color === "black"){
            return `rgba(0,0,0,${alpha})`
        }

        const color1 = Math.floor(255 * fxrand())
        const color2 = Math.floor(255 * fxrand())
        const color3 = 255

        if(this.color === "red"){
            return `rgba(${color3}, ${color1}, ${color2}, ${alpha})`
        }
        
        if(this.color === "green"){
            return `rgba(${color1}, ${color3}, ${color2}, ${alpha})`
        }
        if(this.color === "blue"){
            return `rgba(${color1}, ${color2}, ${color3}, ${alpha})`
        }

        const color4 = Math.floor(255 * fxrand())
        if(this.color === "rainbow"){
            return `rgba(${color1}, ${color2}, ${color4}, ${alpha})`
        }
    }

    randomPoint(y, xRatio, yRatio, mid = false){
        const x = (Math.floor(this.canvas.width / 2 * fxrand() / xRatio)) * this.randomSign()
        const xC = 0
        const xV = 1
        const yy = mid ? Math.floor(y - this.canvas.height / 4 * fxrand()) : y
        const yC = 0
        const yV = Math.floor(this.canvas.height / 2 * fxrand() / yRatio) + 1
        return {x:x, xC:xC, xV:xV, y:yy, yC:yC, yV:yV}
    }

    incrementStrand(coord){
        let xFinished = false
        let yFinished = false
        let lFinished = false

        if(coord.x > 0){
            coord.xC < coord.x ? coord.xC += coord.xV : xFinished = true
        }
        
        if(coord.x < 0){
            coord.xC > coord.x ? coord.xC -= coord.xV : xFinished = true
        }
        
        coord.yC < coord.y ? coord.yC += coord.yV : yFinished = true
    
        this.lineWidthC < this.lineWidth ? this.lineWidthC += this.lineWidthV : lFinished = true

        return xFinished && yFinished
    }

    resetStrand(){
        this.coord1.xC = 0
        this.coord1.yC = 0
        this.coord2.xC = 0
        this.coord2.yC = 0
        this.coord3.xC = 0
        this.coord3.yC = 0
        this.coord4.xC = 0
        this.coord4.yC = 0
    }

    shrinkStrand(){
        setTimeout(()=>{
            return this.lineWidthC > -1 ? this.lineWidthC -= this.lineWidthV * 10 : this.resetStrand()
        },20000)
    }

    incrementAllStrands(){
        return(
        this.incrementStrand(this.coord1) &&
        this.incrementStrand(this.coord3) &&
        this.incrementStrand(this.coord4) &&
        this.incrementStrand(this.coord2) &&
        this.shrinkStrand()
        )
    }

    drawDot(x, y, {context} = this){
        context.save()
        context.fillStyle = this.strokeStyle
        context.translate(this.xCenter, 0)
        context.beginPath()
        context.arc(x, y, 10, 0, Math.PI*2)
        context.fill()
        context.restore()
    }

    drawStaticStrand({context} = this){
        context.save()
        context.strokeStyle = this.strokeStyle
        context.lineCap = "round"
        context.lineWidth = this.lineWidth
        context.translate(this.xCenter, 0)
        context.beginPath()
        context.moveTo(this.coord1.x, this.coord1.y)
        context.bezierCurveTo(this.coord3.x, this.coord3.y, this.coord4.x, this.coord4.y, this.coord2.x, this.coord2.y)
        context.stroke()
        context.restore()
    }

    drawStrand({context} = this){
        context.save()
        context.strokeStyle = this.strokeStyle
        context.lineCap = "round"
        context.lineWidth = this.lineWidthC
        context.translate(this.xCenter, 0)
        context.beginPath()
        context.moveTo(this.coord1.xC, this.coord1.yC)
        context.bezierCurveTo(this.coord3.xC, this.coord3.yC, this.coord4.xC, this.coord4.yC, this.coord2.xC, this.coord2.yC)
        context.stroke()
        context.restore()
    }

    animate(){
        // this.drawDot(this.coord3.x, this.coord3.y)
        // this.drawDot(this.coord4.x, this.coord4.y)
        this.drawStrand()
        this.incrementAllStrands()
    }
}

function randomColor(){
    const colorIndex = fxrand()
    const backgroundIndex = fxrand()
    let backgroundColor
    if(backgroundIndex >= 0.5){backgroundColor = "black"}
    if(backgroundIndex < 0.5){backgroundColor = "white"}

    if(colorIndex >= 0.95){
        return {strokeStyle: "rainbow", backgroundColor: backgroundColor, rarity: "high"}
    }

    if(colorIndex >= 0.85){
        return {strokeStyle: "black", backgroundColor: "white", rarity: "medium"}
    }

    if(colorIndex >= 0.75){
        return {strokeStyle: "white", backgroundColor: "black", rarity: "medium"}
    }

    if(colorIndex >= 0.5){
        return {strokeStyle: "red", backgroundColor: backgroundColor, rarity: "low"}

    }

    if(colorIndex >= 0.25){
        return {strokeStyle: "green", backgroundColor: backgroundColor, rarity: "low"}
    }

    if(colorIndex >= 0){
        return {strokeStyle: "blue", backgroundColor: backgroundColor, rarity: "low"}
    }
}

const strandColor = randomColor()

function makeAnimationArray(arrayObject , colors, quantity = 1){
    // const thisColor = strandColor.strokeStyle
    const animationArray = []
    for(let i = 0; i < quantity; i++){
        animationArray.push(new arrayObject(colors.strokeStyle))
    }
    return animationArray
}

const strandQuantity = Math.floor(fxrand() * canvasMain.width / 20) + 10
const strandArray = makeAnimationArray(Strand, strandColor, strandQuantity)

function drawStatic(strandArr){
    fillBackground(strandColor.backgroundColor)
    strandArr.forEach(e=>e.drawStaticStrand())    
}
drawStatic(strandArray)

function loop(strandArr){   
    fillBackground(strandColor.backgroundColor)
    strandArr.forEach(e=>e.animate())
    requestAnimationFrame(()=>{
        loop(strandArr)
    })
}

setTimeout(()=>{loop(strandArray)},5000)

window.$fxhashFeatures = {
    "Strand Count": strandQuantity,
    "Background Color": strandColor.backgroundColor,
    "Strand Shades": strandColor.strokeStyle,
    "Shade Rarity": strandColor.rarity
}