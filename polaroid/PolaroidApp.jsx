import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import '../index.css'
import { allTopics } from './data'

const NoiseOverlay = () => (
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      opacity: 0.06,
      mixBlendMode: 'multiply'
    }}
  />
)

function useRandomAngle() {
  return 0
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split('')
  let line = ''
  const lines = []
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i]
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && i > 0) {
      lines.push(line)
      line = words[i]
    } else {
      line = testLine
    }
  }
  if (line) lines.push(line)
  lines.forEach((l, idx) => ctx.fillText(l, x, y + idx * lineHeight))
}

// 多套贴纸主题与网格/装饰
const palettes = [
  { k: 'pink',   bg: '#fde6e8', border: '#f6b8c1', gridColor: 'rgba(246,184,193,0.35)' },
  { k: 'blue',   bg: '#e9f2ff', border: '#bcd7ff', gridColor: 'rgba(146,184,238,0.35)' },
  { k: 'green',  bg: '#ebf7ef', border: '#c0e8cf', gridColor: 'rgba(144,192,164,0.35)' },
  { k: 'sand',   bg: '#fff1dc', border: '#ffd9a6', gridColor: 'rgba(255,195,120,0.35)' },
  { k: 'violet', bg: '#f2ecff', border: '#d2c5ff', gridColor: 'rgba(170,150,235,0.35)' },
  { k: 'warm',   bg: '#f7f3ee', border: '#d9cdbd', gridColor: 'rgba(180,165,150,0.28)' },
]
const radii = [6, 8, 10, 12, 14, 16]
const gridTypes = ['grid', 'rows', 'cols', 'dots', 'none']
const accents = ['none', 'dashedBorder', 'perforatedEdge', 'rippedEdge', 'rippedCurve', 'twoToneTop', 'twoToneBottom', 'cornerTag', 'washiTape', 'cornerText']
const splits = ['none', 'twoCols', 'twoRows']

function genStickerTheme() {
  const pal = palettes[Math.floor(Math.random() * palettes.length)]
  const radius = radii[Math.floor(Math.random() * radii.length)]
  const grid = gridTypes[Math.floor(Math.random() * gridTypes.length)]
  const accent = accents[Math.floor(Math.random() * accents.length)]
  const split = splits[Math.floor(Math.random() * splits.length)]
  const sx = Math.round((Math.random() * 2 - 1) * 10)
  const sy = Math.round(24 + Math.random() * 18)
  const cornerTexts = ['Series.1','Series.2','WOW','Flip It']
  const cornerText = Math.random() < 0.6 ? cornerTexts[Math.floor(Math.random()*cornerTexts.length)] : ''
  const tapeAngle = (Math.random() * 8 - 4).toFixed(1)
  return { ...pal, radius, grid, accent, split, sx, sy, cornerText, tapeAngle }
}

function gridBackground(theme) {
  const c = theme.gridColor
  switch (theme.grid) {
    case 'rows':
      return `repeating-linear-gradient(0deg, ${c} 0 1px, transparent 1px 14px)`
    case 'cols':
      return `repeating-linear-gradient(90deg, ${c} 0 1px, transparent 1px 14px)`
    case 'dots':
      return `radial-gradient(${c} 1px, transparent 1px)`
    case 'none':
      return 'none'
    default:
      return `repeating-linear-gradient(0deg, ${c} 0 1px, transparent 1px 14px),
              repeating-linear-gradient(90deg, ${c} 0 1px, transparent 1px 14px)`
  }
}

const ScratchOverlay = ({ w, h, onDone }) => {
  const seeds = useMemo(
    () => Array.from({ length: 8 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      rTo: 60 + Math.random() * 90,
      d: 0.6 + Math.random() * 0.5,
    })),
    [w, h]
  )
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 900)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <svg width={w} height={h} className="absolute left-0 right-0 mx-auto" style={{ top: 18 }}>
      <defs>
        <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9c9c9" />
          <stop offset="50%" stopColor="#e6e6e6" />
          <stop offset="100%" stopColor="#bdbdbd" />
        </linearGradient>
        <mask id="scratchMask">
          <rect width={w} height={h} fill="white" />
          {seeds.map((s, i) => (
            <motion.circle
              key={i}
              initial={{ r: 0 }}
              animate={{ r: s.rTo }}
              transition={{ duration: s.d, delay: i * 0.06, ease: 'easeOut' }}
              cx={s.x}
              cy={s.y}
              fill="black"
            />
          ))}
        </mask>
      </defs>
      <rect width={w} height={h} fill="url(#foil)" mask="url(#scratchMask)" />
    </svg>
  )
}

// Jelly 按钮配色池，按贴纸主题联动；每项给两套可选
const jellyPool = {
  pink: [
    { next: 'radial-gradient(140% 120% at 15% 0%, rgba(255,182,193,0.50) 0%, rgba(255,221,244,0.45) 50%, rgba(186,255,214,0.45) 100%)',
      save: 'radial-gradient(140% 120% at 15% 0%, rgba(255,192,203,0.55) 0%, rgba(255,228,196,0.5) 50%, rgba(221,160,221,0.55) 100%)' },
    { next: 'radial-gradient(140% 120% at 15% 0%, rgba(255,160,180,0.55) 0%, rgba(255,215,235,0.5) 60%, rgba(186,255,214,0.45) 100%)',
      save: 'radial-gradient(140% 120% at 15% 0%, rgba(255,228,225,0.6) 0%, rgba(255,239,213,0.5) 60%, rgba(216,191,216,0.55) 100%)' },
  ],
  blue: [
    { next: 'radial-gradient(140% 120% at 15% 0%, rgba(168,198,255,0.55) 0%, rgba(187,222,251,0.5) 50%, rgba(221,160,221,0.45) 100%)',
      save: 'radial-gradient(140% 120% at 15% 0%, rgba(144,224,239,0.55) 0%, rgba(173,216,230,0.5) 50%, rgba(255,228,196,0.5) 100%)' },
    { next: 'radial-gradient(140% 120% at 15% 0%, rgba(135,206,250,0.55) 0%, rgba(176,224,230,0.5) 50%, rgba(221,160,221,0.5) 100%)',
      save: 'radial-gradient(140% 120% at 15% 0%, rgba(187,222,251,0.6) 0%, rgba(200,230,255,0.5) 60%, rgba(255,239,213,0.5) 100%)' },
  ],
  green: [
    { next: 'radial-gradient(140% 120% at 15% 0%, rgba(186,255,214,0.55) 0%, rgba(173, 232, 208,0.5) 50%, rgba(187,222,251,0.45) 100%)',
      save: 'radial-gradient(140% 120% at 15% 0%, rgba(144,238,144,0.55) 0%, rgba(224,255,255,0.5) 60%, rgba(255,228,196,0.5) 100%)' },
    { next: 'radial-gradient(140% 120% at 15% 0%, rgba(152,251,152,0.55) 0%, rgba(173,232,208,0.5) 50%, rgba(176,224,230,0.45) 100%)',
      save: 'radial-gradient(140% 120% at 15% 0%, rgba(224,255,255,0.6) 0%, rgba(200,245,220,0.5) 60%, rgba(255,239,213,0.5) 100%)' },
  ],
  sand: [
    { next: 'radial-gradient(140% 120% at 15% 0%, rgba(255,222,173,0.55) 0%, rgba(255,239,213,0.5) 50%, rgba(255,182,193,0.45) 100%)',
      save: 'radial-gradient(140% 120% at 15% 0%, rgba(255,239,213,0.6) 0%, rgba(187,222,251,0.5) 60%, rgba(221,160,221,0.5) 100%)' },
    { next: 'radial-gradient(140% 120% at 15% 0%, rgba(255,228,196,0.6) 0%, rgba(255,250,205,0.5) 60%, rgba(176,224,230,0.45) 100%)',
      save: 'radial-gradient(140% 120% at 15% 0%, rgba(255,239,213,0.6) 0%, rgba(216,191,216,0.5) 60%, rgba(186,255,214,0.5) 100%)' },
  ],
  violet: [
    { next: 'radial-gradient(140% 120% at 15% 0%, rgba(221,160,221,0.55) 0%, rgba(200,180,255,0.5) 50%, rgba(187,222,251,0.45) 100%)',
      save: 'radial-gradient(140% 120% at 15% 0%, rgba(216,191,216,0.6) 0%, rgba(255,228,196,0.5) 60%, rgba(186,255,214,0.5) 100%)' },
    { next: 'radial-gradient(140% 120% at 15% 0%, rgba(200,170,230,0.6) 0%, rgba(187,222,251,0.5) 60%, rgba(255,182,193,0.45) 100%)',
      save: 'radial-gradient(140% 120% at 15% 0%, rgba(221,160,221,0.6) 0%, rgba(173,216,230,0.5) 60%, rgba(255,239,213,0.5) 100%)' },
  ],
  warm: [
    { next: 'radial-gradient(140% 120% at 15% 0%, rgba(255,218,185,0.55) 0%, rgba(255,239,213,0.5) 50%, rgba(255,182,193,0.5) 100%)',
      save: 'radial-gradient(140% 120% at 15% 0%, rgba(255,239,213,0.6) 0%, rgba(221,160,221,0.5) 60%, rgba(187,222,251,0.5) 100%)' },
    { next: 'radial-gradient(140% 120% at 15% 0%, rgba(250,214,195,0.6) 0%, rgba(255,239,213,0.5) 60%, rgba(186,255,214,0.5) 100%)',
      save: 'radial-gradient(140% 120% at 15% 0%, rgba(245,222,179,0.6) 0%, rgba(255,239,213,0.5) 60%, rgba(176,224,230,0.5) 100%)' },
  ],
}

const ScratchCanvas = ({ w, h, onDone, onStart, threshold = 0.5, dotR = 2.4, tileSize = 14, dotColor = 'rgba(60,140,220,0.8)' }) => {
  const ref = React.useRef(null)
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  const [done, setDone] = useState(false)
  const [fade, setFade] = useState(false)
  const drawing = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const clearedChecks = useRef(0)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    c.width = w * dpr
    c.height = h * dpr
    c.style.width = w + 'px'
    c.style.height = h + 'px'
    ctx.scale(dpr, dpr)
    // 纸面底色（去除金属与镭射，仅保留纸面与点阵）
    ctx.fillStyle = '#f7faff'
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'source-over'
    // 蓝色点阵纹理（不旋转，整面平铺，色彩更明显）
    const tile = document.createElement('canvas')
    tile.width = tileSize
    tile.height = tileSize
    const tctx = tile.getContext('2d')
    tctx.fillStyle = dotColor
    tctx.beginPath(); tctx.arc(tileSize * 0.285, tileSize * 0.285, dotR, 0, Math.PI * 2); tctx.fill()
    tctx.beginPath(); tctx.arc(tileSize * 0.715, tileSize * 0.715, dotR, 0, Math.PI * 2); tctx.fill()
    const pat = ctx.createPattern(tile, 'repeat')
    ctx.globalAlpha = 1
    ctx.fillStyle = pat
    ctx.fillRect(0, 0, w, h)
    // 蓝色窄边框避免白边
    ctx.strokeStyle = 'rgba(60, 140, 220, 0.5)'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, w - 2, h - 2)
  }, [w, h, dpr])
  const erase = useCallback((x, y) => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 28
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(x, y)
    ctx.stroke()
    last.current = { x, y }
    clearedChecks.current++
    if (clearedChecks.current % 12 === 0) {
      const img = ctx.getImageData(0, 0, w, h)
      let cleared = 0
      for (let i = 3; i < img.data.length; i += 4) if (img.data[i] === 0) cleared++
      const perc = cleared / (w * h)
      if (perc > threshold && !done) {
        setDone(true)
        setFade(true)
        setTimeout(() => onDone?.(), 320)
      }
    }
  }, [done, onDone, w, h, threshold])
  const onPointerDown = useCallback(e => {
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    drawing.current = true
    last.current = { x, y }
    onStart?.()
  }, [onStart])
  const onPointerMove = useCallback(e => {
    if (!drawing.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    erase(x, y)
  }, [erase])
  const end = useCallback(() => { drawing.current = false }, [])
  return (
    <canvas
      ref={ref}
      width={w}
      height={h}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      className="absolute left-0 right-0 mx-auto"
      style={{ top: 18, touchAction: 'none', borderRadius: 8, cursor: 'grab', opacity: fade ? 0 : 1, transition: 'opacity 320ms ease' }}
    />
  )
}

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function PolaroidApp() {
  const [index, setIndex] = useState(null)
  const [key, setKey] = useState(0)
  const angle = useRandomAngle()
  const [sticker, setSticker] = useState(() => genStickerTheme())
  const [scratching, setScratching] = useState(true)
  const [scratchThreshold] = useState(() => 0.25 + Math.random() * 0.15)
  const [jelly, setJelly] = useState(() => {
    const base = genStickerTheme()
    const opts = jellyPool[base.k] || jellyPool.warm
    return opts[Math.floor(Math.random() * opts.length)]
  })
  const [deck, setDeck] = useState(() => shuffle([...Array(allTopics.length).keys()]))
  const [showTutorial, setShowTutorial] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('tutorial') === '1' || params.has('tour')) return true
      return localStorage.getItem('flipit_tutorial_shown') !== '1'
    } catch {
      return true
    }
  })
  const [confetti, setConfetti] = useState([])
  const [soundOn, setSoundOn] = useState(false)

  const topic = index == null ? null : allTopics[index % allTopics.length]

  const nextCard = useCallback(() => {
    let d = deck.slice()
    if (d.length === 0) d = shuffle([...Array(allTopics.length).keys()])
    const nextIdx = d.shift()
    setDeck(d)
    const nt = genStickerTheme()
    setIndex(nextIdx)
    setSticker(nt)
    const opts = jellyPool[nt.k] || jellyPool.warm
    setJelly(opts[Math.floor(Math.random() * opts.length)])
    setKey(prev => prev + 1)
    setScratching(true)
  }, [deck])

  const [downloading, setDownloading] = useState(false)

  const handleSaveImage = useCallback(async () => {
    if (!topic) return
    setDownloading(true)
    try {
      const canvas = document.createElement('canvas')
      const scale = 2
      const W = 360 * scale
      const H = 430 * scale
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d')

      ctx.fillStyle = '#f4f1ea'
      ctx.fillRect(0, 0, W, H)

      const cardX = 32 * scale
      const cardY = 26 * scale
      const cardW = W - cardX * 2
      const cardH = H - cardY * 2
      const bottomExtra = 60 * scale
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(cardX, cardY, cardW, cardH - bottomExtra)
      ctx.fillRect(cardX, cardY + cardH - bottomExtra, cardW, bottomExtra)
      ctx.strokeStyle = '#e5e2da'
      ctx.lineWidth = 3
      ctx.strokeRect(cardX + 1.5, cardY + 1.5, cardW - 3, cardH - 3)

      // 贴纸区域（更小）
      const stickerX = cardX + 30 * scale
      const stickerY = cardY + 20 * scale
      const stickerW = cardW - 60 * scale
      const stickerH = Math.round((cardH - bottomExtra) * 0.65)
      ctx.fillStyle = sticker.bg
      ctx.fillRect(stickerX, stickerY, stickerW, stickerH)
      ctx.strokeStyle = sticker.border
      ctx.lineWidth = 2
      ctx.strokeRect(stickerX + 1, stickerY + 1, stickerW - 2, stickerH - 2)
      // 网格
      ctx.lineWidth = 1
      const step = 10 * scale
      if (sticker.grid !== 'none') {
        ctx.strokeStyle = sticker.gridColor
        if (sticker.grid === 'grid' || sticker.grid === 'cols') {
          for (let x = stickerX + step; x < stickerX + stickerW; x += step) {
            ctx.beginPath()
            ctx.moveTo(x, stickerY)
            ctx.lineTo(x, stickerY + stickerH)
            ctx.stroke()
          }
        }
        if (sticker.grid === 'grid' || sticker.grid === 'rows') {
          for (let y = stickerY + step; y < stickerY + stickerH; y += step) {
            ctx.beginPath()
            ctx.moveTo(stickerX, y)
            ctx.lineTo(stickerX + stickerW, y)
            ctx.stroke()
          }
        }
        if (sticker.grid === 'dots') {
          for (let y = stickerY + step; y < stickerY + stickerH; y += step) {
            for (let x = stickerX + step; x < stickerX + stickerW; x += step) {
              ctx.beginPath()
              ctx.arc(x, y, 1 * scale, 0, Math.PI * 2)
              ctx.fillStyle = sticker.gridColor
              ctx.fill()
            }
          }
        }
      }

      // 题目文字（贴纸内）
      ctx.fillStyle = '#2b2b2b'
      ctx.font = `${16 * scale}px "Noto Serif SC", "Noto Serif CJK SC", serif`
      ctx.textBaseline = 'top'
      const padding = 18 * scale
      const textX = stickerX + padding
      const textY = stickerY + padding
      const maxW = stickerW - padding * 2
      wrapText(ctx, topic.text, textX, textY, maxW, 26 * scale)

      // 编号取消

      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `flipit-${index + 1}.png`
      a.click()
    } finally {
      setDownloading(false)
    }
  }, [topic, sticker, index])

  useEffect(() => {
    document.fonts && document.fonts.ready?.then(() => {})
  }, [])
  useEffect(() => {
    const opts = jellyPool[sticker.k] || jellyPool.warm
    setJelly(opts[Math.floor(Math.random() * opts.length)])
  }, [sticker])
  useEffect(() => {
    if (index == null && deck.length) {
      const d = deck.slice()
      const first = d.shift()
      setDeck(d)
      setIndex(first)
      setScratching(true)
    }
  }, [index, deck])

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        nextCard()
      } else if (e.key?.toLowerCase() === 's') {
        e.preventDefault()
        handleSaveImage()
      } else if (e.key?.toLowerCase() === 't') {
        // 预留主题面板快捷键
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [nextCard, handleSaveImage])

  const handleScratchDone = useCallback(() => {
    setScratching(false)
    // 简易纸屑粒子
    const items = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 260 + 20,
      y: 160 + Math.random() * 40,
      dx: (Math.random() - 0.5) * 160,
      dy: -80 - Math.random() * 60,
      rot: Math.random() * 360,
      color: `hsl(${Math.random() * 360}, 70%, 70%)`,
    }))
    setConfetti(items)
    setTimeout(() => setConfetti([]), 1200)
    if (soundOn) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(520, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.12)
        gain.gain.setValueAtTime(0.06, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16)
        osc.connect(gain).connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.18)
      } catch {}
    }
  }, [soundOn])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23f7f4ea'/%3E%3Cg fill='%23c6d8ff'%3E%3Cpath d='M10 1 L12 7 L18 7 L13 10 L15 16 L10 12 L5 16 L7 10 L2 7 L8 7 Z' transform='translate(16 16) scale(0.8)'/%3E%3C/g%3E%3Cg fill='%23f4a5b8'%3E%3Cpath d='M10 1 L12 7 L18 7 L13 10 L15 16 L10 12 L5 16 L7 10 L2 7 L8 7 Z' transform='translate(56 12) scale(0.7)'/%3E%3C/g%3E%3Cg fill='%2392d3a6'%3E%3Cpath d='M10 1 L12 7 L18 7 L13 10 L15 16 L10 12 L5 16 L7 10 L2 7 L8 7 Z' transform='translate(32 48) scale(0.75)'/%3E%3C/g%3E%3Cg fill='%23e86c6c'%3E%3Cpath d='M10 1 L12 7 L18 7 L13 10 L15 16 L10 12 L5 16 L7 10 L2 7 L8 7 Z' transform='translate(74 64) scale(0.8)'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '96px 96px',
          backgroundRepeat: 'repeat'
        }}
      />
      <NoiseOverlay />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1
              className="text-sm font-normal"
              style={{
                fontFamily: '"Gloria Hallelujah", "Ma Shan Zheng", cursive',
                fontSize: '2.2rem',
                letterSpacing: '0.12em',
                lineHeight: 1.1,
                color: '#4f4a41',
                textShadow: '0 1px 0 rgba(255,255,255,0.5), 0 1px 0 rgba(0,0,0,0.03)',
              }}
            >
              Q&amp;
            </h1>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-col items-center">
          <div className="relative h-[460px] w-[380px]">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={key}
                initial={{ x: 40, opacity: 0, rotate: Number(angle) }}
                animate={{ x: 0, opacity: 1, rotate: Number(angle) }}
                exit={{ x: -60, opacity: 0, rotate: Number(angle) + (Math.random() * 4 - 2) }}
                transition={{ duration: 0.32, ease: 'easeInOut' }}
                className="absolute inset-0"
                style={{ perspective: 1000 }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    filter: `drop-shadow(${sticker.sx}px ${sticker.sy}px 40px rgba(0,0,0,0.12))`
                  }}
                >
                  <div
                    className="absolute left-0 right-0 top-0 mx-auto"
                    style={{
                      width: 360,
                      height: 430,
                      background: '#f8f8f5',
                      border: '1.5px solid #e8e6e0',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -2px 0 rgba(0,0,0,0.04)',
                      backgroundImage: `
                        radial-gradient(circle at 10% 15%, rgba(0,0,0,0.03) 1px, transparent 1.5px),
                        radial-gradient(circle at 80% 25%, rgba(0,0,0,0.025) 1px, transparent 1.5px),
                        linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.0) 30%),
                        linear-gradient(0deg, rgba(255,255,255,0.9), rgba(255,255,255,0.2))
                      `,
                      backgroundSize: '10px 10px, 12px 12px, 100% 100%, 100% 100%'
                    }}
                  />
                  <div
                    className="absolute left-0 right-0 mx-auto"
                    style={{
                      top: 18,
                      width: 300,
                      height: 260,
                      background: sticker.bg,
                      border: `1.5px ${sticker.accent==='dashedBorder'?'dashed':'solid'} ${sticker.border}`,
                      borderRadius: sticker.radius,
                      boxShadow: '0 6px 14px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,.5)'
                    }}
                  />
                  <div
                    className="absolute left-0 right-0 mx-auto px-6"
                    style={{
                      top: 18,
                      width: 300,
                      height: 260,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: '#2b2b2b',
                      fontFamily: '"Noto Serif SC","Noto Serif CJK SC",serif',
                      lineHeight: 1.8,
                      letterSpacing: '0.2px',
                      borderRadius: sticker.radius,
                      backgroundImage: gridBackground(sticker)
                    }}
                  >
                    <span>{topic ? topic.text : ''}</span>
                  </div>
                  {sticker.accent==='washiTape' && (
                    <div
                      className="absolute left-0 right-0 mx-auto"
                      style={{
                        top: 8,
                        width: 170,
                        height: 26,
                        backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0 6px, rgba(0,0,0,0.06) 6px 8px)',
                        backgroundColor: '#f6deb0',
                        opacity: 0.8,
                        transform: `rotate(${sticker.tapeAngle}deg)`,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                        borderRadius: 2
                      }}
                    />
                  )}
                  {sticker.accent==='cornerText' && sticker.cornerText && (
                    <div
                      className="absolute"
                      style={{
                        top: 10,
                        right: 46,
                        transform: 'rotate(12deg)',
                        fontSize: 10,
                        letterSpacing: '0.08em',
                        color: '#6b5f50',
                        background: 'rgba(255,255,255,0.8)',
                        padding: '2px 6px',
                        border: `1px solid ${sticker.border}`,
                        borderRadius: 3,
                      }}
                    >
                      {sticker.cornerText}
                    </div>
                  )}
                  {sticker.accent==='perforatedEdge' && (
                    <div
                      className="absolute"
                      style={{
                        top: 18,
                        right: 30,
                        width: 12,
                        height: 260,
                        backgroundImage: `radial-gradient(circle at 6px 6px, #ffffff 3.5px, ${sticker.bg} 3.5px)`,
                        backgroundSize: '12px 16px',
                        backgroundRepeat: 'repeat-y'
                      }}
                    />
                  )}
                  {sticker.accent==='rippedEdge' && (
                    <div
                      className="absolute left-0 right-0 mx-auto"
                      style={{
                        top: 18+260-14,
                        width: 300,
                        height: 14,
                        backgroundImage: `linear-gradient(-45deg, #ffffff 8px, transparent 8px), linear-gradient(45deg, #ffffff 8px, transparent 8px)`,
                        backgroundSize: '16px 16px',
                        backgroundPosition: '0 0, 8px 0'
                      }}
                    />
                  )}
                  {sticker.accent==='rippedCurve' && (
                    <svg className="absolute left-0 right-0 mx-auto" style={{ top: 18+260-18 }} width={300} height={18}>
                      <path d="M0,6 C20,12 40,2 60,8 C80,14 100,4 120,10 C140,16 160,6 180,12 C200,14 220,8 240,12 C260,16 280,10 300,14 L300,18 L0,18 Z" fill="#ffffff" />
                    </svg>
                  )}
                  {sticker.accent==='twoToneTop' && (
                    <div
                      className="absolute left-0 right-0 mx-auto"
                      style={{ top: 18, width: 300, height: 36, background: sticker.border, borderTopLeftRadius: sticker.radius, borderTopRightRadius: sticker.radius, opacity: 0.6 }}
                    />
                  )}
                  {sticker.accent==='twoToneBottom' && (
                    <div
                      className="absolute left-0 right-0 mx-auto"
                      style={{ top: 18+260-36, width: 300, height: 36, background: sticker.border, borderBottomLeftRadius: sticker.radius, borderBottomRightRadius: sticker.radius, opacity: 0.6 }}
                    />
                  )}
                  {sticker.accent==='cornerTag' && (
                    <div
                      className="absolute"
                      style={{ top: 8, left: 40, width: 58, height: 18, background: sticker.border, transform: 'rotate(-12deg)', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}
                    />
                  )}
                  {sticker.split==='twoCols' && (
                    <div className="absolute" style={{ top: 18, width: 1, height: 260, left: '50%', background: 'rgba(0,0,0,0.08)' }} />
                  )}
                  {sticker.split==='twoRows' && (
                    <div className="absolute" style={{ top: 18+130, width: 300, height: 1, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.08)' }} />
                  )}
                  {showTutorial && (
                    <div
                      className="absolute left-0 right-0 mx-auto"
                      style={{
                        top: 18,
                        width: 300,
                        height: 260,
                        borderRadius: sticker.radius,
                        background: 'rgba(255,255,255,0.55)',
                        mixBlendMode: 'multiply',
                        pointerEvents: 'none'
                      }}
                    >
                      <svg width="300" height="260" style={{ position: 'absolute', inset: 0 }}>
                        <defs>
                          <linearGradient id="dashFade" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="rgba(90,90,90,0.7)" />
                            <stop offset="100%" stopColor="rgba(90,90,90,0.1)" />
                          </linearGradient>
                        </defs>
                        <path d="M30 210 C70 180, 120 180, 160 150 C200 120, 240 110, 270 90"
                          stroke="url(#dashFade)"
                          strokeWidth="4"
                          strokeDasharray="10 10"
                          fill="none">
                          <animate attributeName="stroke-dashoffset" from="0" to="200" dur="1.6s" repeatCount="indefinite" />
                        </path>
                      </svg>
                      <div style={{
                        position: 'absolute', bottom: 10, left: 0, right: 0,
                        textAlign: 'center', fontSize: 12, color: '#6b6b6b', letterSpacing: '0.1em'
                      }}>
                        轻轻刮开试试
                      </div>
                    </div>
                  )}
                  {scratching && topic && (
                    <ScratchCanvas
                      w={300}
                      h={260}
                      threshold={scratchThreshold}
                      dotR={2.6}
                      tileSize={14}
                      dotColor={`${sticker.border}`}
                      onStart={() => {
                        if (showTutorial) {
                          setShowTutorial(false)
                          localStorage.setItem('flipit_tutorial_shown', '1')
                        }
                      }}
                      onDone={handleScratchDone}
                    />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={nextCard}
              className="rounded px-5 py-2"
              style={{
                background:
                  `linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 100%), ${jelly?.next || 'radial-gradient(140% 120% at 15% 0%, rgba(168,198,255,0.55) 0%, rgba(186,255,214,0.45) 45%, rgba(255,182,193,0.5) 100%)'}`,
                color: '#4b443a',
                border: '1px solid rgba(255,255,255,0.8)',
                borderRadius: 20,
                boxShadow:
                  'inset 0 6px 14px rgba(255,255,255,0.9), inset 0 -8px 14px rgba(50,50,50,0.08), 0 12px 24px rgba(0,0,0,0.14)',
                backdropFilter: 'blur(6px)'
              }}
            >
              下一题
            </button>
            <button
              onClick={handleSaveImage}
              disabled={downloading}
              className="rounded px-4 py-2"
              style={{
                background:
                  `linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 100%), ${jelly?.save || 'radial-gradient(140% 120% at 15% 0%, rgba(255,222,173,0.55) 0%, rgba(187,222,251,0.5) 50%, rgba(221,160,221,0.55) 100%)'}`,
                color: '#4b443a',
                border: '1px solid rgba(255,255,255,0.8)',
                borderRadius: 18,
                boxShadow:
                  'inset 0 6px 14px rgba(255,255,255,0.9), inset 0 -8px 14px rgba(50,50,50,0.08), 0 12px 24px rgba(0,0,0,0.14)',
                backdropFilter: 'blur(6px)'
              }}
            >
              {downloading ? '生成中…' : '保存为图片'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
