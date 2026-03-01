import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 深度问题库
const psychologyQuestions = [
  { category: "过去经历", question: "哪个童年回忆对你产生了深远的影响，塑造了今天的你？" },
  { category: "过去经历", question: "你生命中有没有哪个时刻挑战了你的信念，并带来了个人成长？" },
  { category: "过去经历", question: "你如何从失败或挫折中学习和恢复？" },
  { category: "过去经历", question: "描述一个你被别人真正理解的时刻。" },
  { category: "过去经历", question: "有什么事情你曾经放下了，但曾经你觉得它定义了你是谁？" },
  { category: "过去经历", question: "你小时候的宗教或精神背景是什么？它对你现在的生活有什么影响？" },
  { category: "过去经历", question: "你童年时的爱好是什么？现在它们还是你的一部分吗？" },
  { category: "过去经历", question: "你最后一次原谅自己是什么时候？" },
  { category: "过去经历", question: "你最讨厌的那份工作教会了你什么重要的教训？" },
  { category: "过去经历", question: "你去过的最令人难忘的派对是哪个？" },
  { category: "过去经历", question: "你有什么遗憾吗？" },
  { category: "过去经历", question: "有什么事情帮助你恢复了对人性的信任？" },
  { category: "过去经历", question: "如果你必须回到一个你已经去过的地方，你会选择哪里，为什么？" },
  { category: "过去经历", question: "工作中有哪个尴尬时刻至今还让你耿耿于怀？" },
  { category: "过去经历", question: "你童年时的朋友们会怎么描述你？" },
  { category: "过去经历", question: "如果你可以重温你生命中的某个时刻，你会选择哪个？" },
  { category: "过去经历", question: "你送过的最好的礼物是什么？" },
  { category: "过去经历", question: "你收到的最好的礼物是什么？" },
  { category: "过去经历", question: "你有什么重要的家庭传统吗？" },
  { category: "过去经历", question: "你喜欢自己成长的那个城市或小镇吗？" },
  { category: "过去经历", question: "你的家人小时候是怎么看待心理健康和心理咨询的？现在他们的观点有变化吗？" },
  { category: "过去经历", question: "在过去的一年里，你什么时候感到最快乐？" },
  { category: "过去经历", question: "在过去的一年里，你什么时候感到最悲伤？" },
  { category: "过去经历", question: "你中学时期是什么样的？" },
  { category: "过去经历", question: "你想对16岁的自己说什么？" },
  { category: "日常生活", question: "你如何应对生活中的压力或困难处境？" },
  { category: "日常生活", question: "有什么爱好或热情能给你带来满足感和快乐？" },
  { category: "日常生活", question: "你在日常生活中如何表达感恩？" },
  { category: "日常生活", question: "你做决定时通常怎么考虑，什么因素最重要？" },
  { category: "日常生活", question: "不提及任何科技产品，你最珍视的财产是什么？" },
  { category: "日常生活", question: "你最快乐的时候通常在哪里？" },
  { category: "日常生活", question: "如果把你的人生拍成电影，谁来扮演你？" },
  { category: "日常生活", question: "你心目中完美的一天是什么样的？" },
  { category: "日常生活", question: "你喜欢冒险吗？" },
  { category: "日常生活", question: "有什么比任何事情都更能让你笑？" },
  { category: "日常生活", question: "现在什么让你压力最大？" },
  { category: "日常生活", question: "有什么坏习惯是你想戒掉的？" },
  { category: "日常生活", question: "你在哪里感到最有安全感？" },
  { category: "日常生活", question: "你最喜欢每天做的事情是什么？" },
  { category: "日常生活", question: "你最引以为傲的成就是什么？" },
  { category: "日常生活", question: "什么时候你觉得自己最真实？" },
  { category: "日常生活", question: "如果你一天有多3个小时，你会怎么用？" },
  { category: "日常生活", question: "你和钱的关系是什么样的？" },
  { category: "日常生活", question: "哪个最难说出口：我爱你、对不起，还是我需要帮助？" },
  { category: "日常生活", question: "你正在努力克服什么？" },
  { category: "日常生活", question: "如果时间和经济不是问题，你会怎么过你的生活？" },
  { category: "人际关系", question: "什么样的友谊是成功的？" },
  { category: "人际关系", question: "你最快乐的时候通常和谁在一起？" },
  { category: "人际关系", question: "你在亲密关系中如何表达和体验爱？" },
  { category: "人际关系", question: "你在以前的友谊中说过或做过什么让你后悔的事情？" },
  { category: "人际关系", question: "你如何处理人际关系中的分歧或冲突？" },
  { category: "人际关系", question: "你怎么知道是时候结束一段关系或友谊了？" },
  { category: "人际关系", question: "你的父母还相爱吗？现在这对你重要吗？" },
  { category: "人际关系", question: "友谊中什么是你的底线或dealbreaker？" },
  { category: "人际关系", question: "作为朋友，我怎样才能更好地支持你？" },
  { category: "人际关系", question: "你恋爱过几次？" },
  { category: "人际关系", question: "你相信糟糕的第一次约会还有第二次机会吗？" },
  { category: "人际关系", question: "你有什么恋爱建议想给我？" },
  { category: "人际关系", question: "你父母的感情对你的恋爱生活有什么影响？" },
  { category: "人际关系", question: "如果你可以教15岁的自己关于友谊的任何事情，你会教什么？" },
  { category: "人际关系", question: "你怎么看待伴侣和朋友讨论你们的性生活？" },
  { category: "人际关系", question: "你觉得我的约会标准是太低、太高，还是刚刚好？" },
  { category: "人际关系", question: "你对我的人生最大的贡献是什么？" },
  { category: "人际关系", question: "你觉得你自己是什么样的朋友？" },
  { category: "人际关系", question: "你和父母的关系怎么样？" },
  { category: "人际关系", question: "你在哪些方面像你的父母，哪些方面不像？" },
  { category: "人际关系", question: "你高中时期的友谊是什么样的？" },
  { category: "人际关系", question: "你觉得年轻时的一些友谊是否影响了你现在对待朋友的方式？" },
  { category: "未来目标", question: "有什么具体的梦想或目标你还没有追求？是什么阻碍了你？" },
  { category: "未来目标", question: "如果你可以去世界上任何地方旅行，你会去哪里，为什么？" },
  { category: "未来目标", question: "今年结束前你想做的一件事是什么？" },
  { category: "未来目标", question: "有什么事情你太害怕而不敢去追求？" },
  { category: "未来目标", question: "如果你可以改变自己的一件事，那会是什么？为什么？" },
  { category: "未来目标", question: "如果你可以问未来的自己一个问题，你会问什么？" },
  { category: "未来目标", question: "如果你可以写一本书，它会关于什么？" },
  { category: "未来目标", question: "如果你必须搬到别的地方住，你会选择哪里，为什么？" },
  { category: "核心价值观", question: "什么事业对你来说最重要？" },
  { category: "核心价值观", question: "有什么事情你觉得人们经常误解你？" },
  { category: "核心价值观", question: "你尊敬什么样的人？" },
  { category: "核心价值观", question: "你第一次见我的时候对我有什么印象？" },
  { category: "核心价值观", question: "你会用三个词怎么形容自己？" },
  { category: "核心价值观", question: "你觉得你找到人生的使命了吗？" },
  { category: "核心价值观", question: "帮助自己还是帮助世界，哪个更重要？" },
  { category: "核心价值观", question: "你热衷于什么？" },
  { category: "核心价值观", question: "有什么对你来说真的非常重要？" },
  { category: "核心价值观", question: "有哪些核心价值观指导着你的决定和行为？" },
]

const getRandomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * psychologyQuestions.length)
  return psychologyQuestions[randomIndex]
}

// 四角星组件
const FourPointedStar = ({ size, x, y, delay, duration }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.2, 0.5, 0.2],
      scale: [0.9, 1.1, 0.9],
      rotate: [0, 8, -8, 0],
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      color: '#2E3A8C',
      filter: 'blur(0.3px)',
    }}
  >
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
    </svg>
  </motion.div>
)

// 噪点叠加层
const NoiseOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      opacity: 0.05,
      mixBlendMode: 'overlay',
    }}
  />
)

// Fortune Cookie SVG - 参考真实照片绘制
const FortuneCookieSVG = () => (
  <svg
    viewBox="0 0 500 350"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '500px', height: '350px' }}
  >
    <defs>
      {/* 饼干主体渐变 - 金黄色 */}
      <radialGradient id="cookieGold" cx="35%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#FAD888" />
        <stop offset="30%" stopColor="#E8B652" />
        <stop offset="70%" stopColor="#D4A23D" />
        <stop offset="100%" stopColor="#C49432" />
      </radialGradient>

      {/* 阴影渐变 */}
      <linearGradient id="cookieShadow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(196, 148, 50, 0.3)" />
        <stop offset="100%" stopColor="rgba(196, 148, 50, 0)" />
      </linearGradient>

      {/* 高光渐变 */}
      <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>

    {/* 主体 - Fortune Cookie 弯曲形状 */}
    <g filter="drop-shadow(0 35px 60px rgba(0,0,0,0.18))">
      {/* 左半边弯月 */}
      <path
        d="M250 60
          C180 45, 90 80, 50 150
          C20 210, 40 280, 100 310
          C160 335, 230 320, 280 290
          C330 260, 360 210, 350 160
          C340 110, 300 70, 250 60Z"
        fill="url(#cookieGold)"
      />

      {/* 右半边弯月 - 交叉形成圆环 */}
      <path
        d="M250 60
          C320 70, 390 110, 420 170
          C450 230, 440 290, 390 320
          C340 350, 270 345, 220 320
          C170 295, 140 250, 150 200
          C160 150, 200 90, 250 60Z"
        fill="url(#cookieGold)"
      />

      {/* 中间折痕交叉线 */}
      <path
        d="M100 200 Q200 180, 400 220"
        stroke="rgba(180, 130, 40, 0.6)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M120 260 Q220 280, 380 240"
        stroke="rgba(180, 130, 40, 0.5)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* 顶部折痕 */}
      <path
        d="M180 90 Q250 100, 320 85"
        stroke="rgba(180, 130, 40, 0.4)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* 纹理斑点 */}
      <ellipse cx="150" cy="150" rx="25" ry="15" fill="rgba(160, 120, 40, 0.08)" />
      <ellipse cx="350" cy="140" rx="20" ry="12" fill="rgba(160, 120, 40, 0.07)" />
      <ellipse cx="250" cy="250" rx="30" ry="18" fill="rgba(160, 120, 40, 0.06)" />
      <ellipse cx="100" cy="240" rx="18" ry="10" fill="rgba(160, 120, 40, 0.05)" />
      <ellipse cx="400" cy="250" rx="22" ry="14" fill="rgba(160, 120, 40, 0.06)" />
      <ellipse cx="200" cy="180" rx="15" ry="10" fill="rgba(160, 120, 40, 0.04)" />
      <ellipse cx="300" cy="200" rx="18" ry="12" fill="rgba(160, 120, 40, 0.05)" />

      {/* 高光效果 - 左上 */}
      <ellipse cx="130" cy="120" rx="50" ry="25" fill="url(#highlightGrad)" transform="rotate(-30 130 120)" />
      {/* 高光效果 - 右上 */}
      <ellipse cx="370" cy="110" rx="45" ry="22" fill="url(#highlightGrad)" transform="rotate(20 370 110)" />

      {/* 边缘光 - 增加立体感 */}
      <path
        d="M250 60
          C180 45, 90 80, 50 150
          C20 210, 40 280, 100 310"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M250 60
          C320 70, 390 110, 420 170
          C450 230, 440 290, 390 320"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
        fill="none"
      />
    </g>
  </svg>
)

// 饼干左半边
const CookieLeft = () => (
  <div style={{ filter: 'drop-shadow(0 25px 45px rgba(0,0,0,0.15))' }}>
    <svg viewBox="0 0 250 350" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '250px', height: '350px' }}>
      <defs>
        <radialGradient id="cookieGoldLeft" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FAD888" />
          <stop offset="40%" stopColor="#E8B652" />
          <stop offset="100%" stopColor="#D4A23D" />
        </radialGradient>
      </defs>
      <path
        d="M125 30
          C80 22, 30 50, 15 100
          C0 155, 20 220, 70 260
          C115 295, 175 285, 220 265
          C255 245, 275 195, 265 145
          C255 95, 210 55, 165 45
          C145 40, 135 35, 125 30Z"
        fill="url(#cookieGoldLeft)"
      />
      {/* 折痕 */}
      <path d="M50 150 Q100 135, 180 165" stroke="rgba(180, 130, 40, 0.5)" strokeWidth="3" fill="none" />
      <path d="M65 200 Q110 215, 175 195" stroke="rgba(180, 130, 40, 0.4)" strokeWidth="2.5" fill="none" />
      {/* 高光 */}
      <ellipse cx="70" cy="85" rx="35" ry="18" fill="rgba(255,255,255,0.5)" transform="rotate(-25 70 85)" />
      {/* 斑点 */}
      <ellipse cx="120" cy="120" rx="15" ry="10" fill="rgba(160, 120, 40, 0.06)" />
      <ellipse cx="80" cy="180" rx="12" ry="8" fill="rgba(160, 120, 40, 0.05)" />
      <ellipse cx="150" cy="220" rx="18" ry="12" fill="rgba(160, 120, 40, 0.04)" />
    </svg>
  </div>
)

// 饼干右半边
const CookieRight = () => (
  <div style={{ filter: 'drop-shadow(0 25px 45px rgba(0,0,0,0.15))' }}>
    <svg viewBox="0 0 250 350" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '250px', height: '350px' }}>
      <defs>
        <radialGradient id="cookieGoldRight" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FAD888" />
          <stop offset="40%" stopColor="#E8B652" />
          <stop offset="100%" stopColor="#D4A23D" />
        </radialGradient>
      </defs>
      <path
        d="M125 30
          C170 38, 220 65, 235 120
          C250 175, 230 240, 180 280
          C135 315, 75 305, 30 285
          C-5 265, -25 215, -15 165
          C-5 115, 40 55, 85 45
          C105 40, 115 35, 125 30Z"
        fill="url(#cookieGoldRight)"
      />
      {/* 折痕 */}
      <path d="M170 140 Q220 155, 200 200" stroke="rgba(180, 130, 40, 0.5)" strokeWidth="3" fill="none" />
      <path d="M185 190 Q230 200, 220 250" stroke="rgba(180, 130, 40, 0.4)" strokeWidth="2.5" fill="none" />
      {/* 高光 */}
      <ellipse cx="180" cy="80" rx="30" ry="15" fill="rgba(255,255,255,0.45)" transform="rotate(20 180 80)" />
      {/* 斑点 */}
      <ellipse cx="130" cy="130" rx="14" ry="9" fill="rgba(160, 120, 40, 0.06)" />
      <ellipse cx="170" cy="175" rx="16" ry="11" fill="rgba(160, 120, 40, 0.05)" />
      <ellipse cx="100" cy="240" rx="20" ry="13" fill="rgba(160, 120, 40, 0.04)" />
    </svg>
  </div>
)

function App() {
  const [isOpened, setIsOpened] = useState(false)
  const [question, setQuestion] = useState(null)
  const [fallingPaper, setFallingPaper] = useState(false)
  const [crumbs, setCrumbs] = useState([])

  const handleOpen = useCallback(() => {
    if (isOpened) return

    setIsOpened(true)

    const newCrumbs = Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      x: Math.random() * 350 - 175,
      y: Math.random() * 200 - 100,
      rotation: Math.random() * 720 - 360,
      scale: Math.random() * 0.7 + 0.3,
      delay: Math.random() * 0.1,
    }))
    setCrumbs(newCrumbs)

    setTimeout(() => {
      setFallingPaper(true)
      setQuestion(getRandomQuestion())
    }, 80)
  }, [isOpened])

  const handleReset = () => {
    setIsOpened(false)
    setFallingPaper(false)
    setQuestion(null)
    setCrumbs([])
  }

  const stars = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    size: Math.random() * 10 + 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 2.5 + 3,
  }))

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{
        fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
        background: `
          radial-gradient(ellipse 140% 140% at 50% 50%,
            #FFD1B9 0%,
            #F8C0C8 25%,
            #D4A8C8 45%,
            #B8C8E0 65%,
            #A1C4FD 85%,
            #A1C4FD 100%
          )
        `,
      }}
    >
      <NoiseOverlay />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <FourPointedStar
            key={star.id}
            size={star.size}
            x={star.x}
            y={star.y}
            delay={star.delay}
            duration={star.duration}
          />
        ))}
      </div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 mb-20 text-center"
      >
        <h1
          className="text-4xl font-light tracking-[0.3em]"
          style={{
            color: '#2E3A8C',
            textShadow: '0 2px 20px rgba(46, 58, 140, 0.1)',
          }}
        >
          FORTUNE COOKIE
        </h1>
      </motion.div>

      <div className="relative w-[500px] h-[400px] flex items-center justify-center z-10">
        <AnimatePresence>
          {crumbs.map((crumb) => (
            <motion.div
              key={crumb.id}
              initial={{ opacity: 1, x: 0, y: 0, rotation: 0, scale: 1 }}
              animate={{
                opacity: 0,
                x: crumb.x,
                y: crumb.y + 180,
                rotation: crumb.rotation,
                scale: crumb.scale,
              }}
              transition={{
                duration: 1.4,
                delay: crumb.delay,
                ease: "easeOut"
              }}
              className="absolute"
              style={{
                width: Math.random() * 22 + 12,
                height: Math.random() * 18 + 10,
                background: `linear-gradient(135deg,
                  hsl(45, ${Math.random() * 20 + 70}%, ${Math.random() * 12 + 55}%) 0%,
                  hsl(42, ${Math.random() * 15 + 55}%, ${Math.random() * 10 + 42}%) 100%)`,
                borderRadius: '40% 60% 55% 45% / 45% 55% 50% 50%',
                filter: 'blur(0.5px)',
              }}
            />
          ))}
        </AnimatePresence>

        {/* 完整饼干 */}
        {!isOpened && (
          <motion.button
            initial={{ scale: 0, rotate: -15 }}
            animate={{
              scale: 1,
              rotate: 0,
              y: [0, -18, 0],
            }}
            transition={{
              type: "spring",
              stiffness: 130,
              damping: 10,
              delay: 0.3,
            }}
            onClick={handleOpen}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative focus:outline-none cursor-pointer"
            style={{
              filter: 'drop-shadow(0 40px 70px rgba(0,0,0,0.18))',
            }}
          >
            <FortuneCookieSVG />
          </motion.button>
        )}

        {/* 左半边饼干 */}
        <AnimatePresence>
          {isOpened && (
            <>
              <motion.div
                initial={{ x: 0, rotate: 0, scale: 1 }}
                animate={{
                  x: -220,
                  rotate: -50,
                  y: 100,
                  scale: 0.92,
                }}
                transition={{ duration: 0.85, ease: "easeOut" }}
                className="absolute"
              >
                <CookieLeft />
              </motion.div>

              {/* 右半边饼干 */}
              <motion.div
                initial={{ x: 0, rotate: 0, scale: 1 }}
                animate={{
                  x: 220,
                  rotate: 50,
                  y: 100,
                  scale: 0.92,
                }}
                transition={{ duration: 0.85, ease: "easeOut" }}
                className="absolute"
              >
                <CookieRight />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 纸条 */}
        <AnimatePresence>
          {fallingPaper && question && (
            <motion.div
              initial={{ y: -120, opacity: 0, scale: 0.9 }}
              animate={{
                y: 200,
                opacity: 1,
                scale: 1.05,
                rotation: Math.random() * 4 - 2,
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 14,
                delay: 0.08
              }}
              className="absolute z-20"
              style={{ width: '280px' }}
            >
              <div
                className="relative"
                style={{
                  background: 'linear-gradient(180deg, #FFFCF8 0%, #FFF9F0 100%)',
                  borderRadius: '3px',
                  boxShadow: `
                    0 30px 80px rgba(46, 58, 140, 0.15),
                    0 10px 40px rgba(46, 58, 140, 0.08),
                    inset 0 0 0 0.5px rgba(212, 168, 75, 0.15)
                  `,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-5"
                  style={{
                    background: 'linear-gradient(135deg, transparent 50%, rgba(245, 238, 225, 0.9) 50%)',
                    backgroundSize: '12px 12px',
                  }}
                />

                <div className="pt-8 pb-6 px-8 text-center">
                  <div className="flex items-center justify-center gap-4 mb-5">
                    <div
                      className="h-px"
                      style={{
                        width: '50px',
                        background: 'linear-gradient(90deg, transparent, rgba(212, 168, 75, 0.4), transparent)',
                      }}
                    />
                    <span style={{ color: '#C9983D', fontSize: '14px' }}>✦</span>
                    <div
                      className="h-px"
                      style={{
                        width: '50px',
                        background: 'linear-gradient(90deg, transparent, rgba(212, 168, 75, 0.4), transparent)',
                      }}
                    />
                  </div>

                  <div
                    className="inline-block px-5 py-2 mb-5"
                    style={{
                      background: 'linear-gradient(135deg, rgba(46, 58, 140, 0.03) 0%, rgba(46, 58, 140, 0.06) 100%)',
                      border: '1px solid rgba(212, 168, 75, 0.25)',
                      borderRadius: '50px',
                      color: '#2E3A8C',
                      fontSize: '0.7rem',
                      letterSpacing: '0.2em',
                      fontWeight: 500,
                    }}
                  >
                    {question.category}
                  </div>

                  <p
                    style={{
                      fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
                      fontSize: '1.05rem',
                      color: '#2E3A8C',
                      letterSpacing: '1px',
                      lineHeight: '1.85',
                    }}
                  >
                    {question.question}
                  </p>
                </div>

                <div
                  className="h-px mx-8 mb-4"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(212, 168, 75, 0.3), transparent)',
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isOpened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 z-10"
        >
          <p
            style={{
              color: '#2E3A8C',
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              opacity: 0.5,
            }}
          >
            点击饼干
          </p>
        </motion.div>
      )}

      {isOpened && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={handleReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-64 px-12 py-3 relative z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(46, 58, 140, 0.9) 0%, rgba(46, 58, 140, 0.95) 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '2px',
            boxShadow: '0 10px 35px rgba(46, 58, 140, 0.25)',
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '0.85rem',
            letterSpacing: '0.25em',
          }}
        >
          再抽一个
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 z-10"
        style={{
          color: '#2E3A8C',
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
        }}
      >
        {psychologyQuestions.length} QUESTIONS
      </motion.div>
    </div>
  )
}

export default App
