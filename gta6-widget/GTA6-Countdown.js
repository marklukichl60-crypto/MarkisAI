// GTA VI Countdown — виджет для приложения Scriptable (iOS)
// Релиз на PS5, польский регион (PS Store PL): 19.11.2026, 00:00 по Варшаве (CET, UTC+1)
// = 18.11.2026 23:00 UTC = 19.11.2026 02:00 по Москве (МСК, UTC+3)

const RELEASE = new Date("2026-11-18T23:00:00Z")
const RELEASE_MSK_LABEL = "19 ноября · 02:00 МСК"

const PINK = new Color("#ff4fa3")
const ORANGE = new Color("#ffb347")
const WHITE = Color.white()
const DIM = new Color("#ffffff", 0.7)

const now = new Date()
const released = now >= RELEASE
const family = config.runsInWidget ? config.widgetFamily : "medium"

const w = new ListWidget()
// После релиза виджет больше не нужно обновлять часто
w.refreshAfterDate = released ? new Date(now.getTime() + 6 * 3600e3) : RELEASE

if (family && family.startsWith("accessory")) {
  buildLockScreen(w, family)
} else {
  buildHomeScreen(w, family)
}

if (config.runsInWidget) {
  Script.setWidget(w)
} else {
  await w.presentMedium()
}
Script.complete()

// ---------- Виджет на экране «Домой» ----------
function buildHomeScreen(w, family) {
  const g = new LinearGradient()
  g.colors = [new Color("#2b0a3d"), new Color("#7a1f5c"), new Color("#ff6a3d")]
  g.locations = [0, 0.6, 1]
  g.startPoint = new Point(0, 0)
  g.endPoint = new Point(1, 1)
  w.backgroundGradient = g
  w.setPadding(14, 14, 14, 14)

  const title = w.addText("GTA VI")
  title.font = Font.blackSystemFont(family === "small" ? 22 : 26)
  title.textColor = WHITE

  const sub = w.addText("PS5 · Польша 🇵🇱")
  sub.font = Font.mediumSystemFont(11)
  sub.textColor = DIM

  w.addSpacer()

  if (released) {
    const t = w.addText("Уже вышла! 🎮")
    t.font = Font.boldSystemFont(family === "small" ? 18 : 22)
    t.textColor = ORANGE
  } else {
    const days = Math.floor((RELEASE - now) / 86400e3)
    if (days >= 1) {
      const d = w.addText(`${days} ${plural(days, "день", "дня", "дней")}`)
      d.font = Font.boldSystemFont(family === "small" ? 20 : 24)
      d.textColor = ORANGE
    }
    // Живой таймер — iOS обновляет его каждую секунду сам
    const timer = w.addDate(RELEASE)
    timer.applyTimerStyle()
    timer.font = Font.boldMonospacedSystemFont(days >= 1 ? 16 : (family === "small" ? 24 : 28))
    timer.textColor = WHITE
  }

  w.addSpacer(4)
  const when = w.addText(RELEASE_MSK_LABEL)
  when.font = Font.mediumSystemFont(11)
  when.textColor = PINK
}

// ---------- Виджет на экране блокировки ----------
function buildLockScreen(w, family) {
  if (family === "accessoryCircular") {
    w.addAccessoryWidgetBackground = true
    const t = w.addText("VI")
    t.font = Font.blackSystemFont(14)
    t.centerAlignText()
    if (released) {
      const s = w.addText("🎮")
      s.centerAlignText()
    } else {
      const days = Math.floor((RELEASE - now) / 86400e3)
      const s = days >= 1 ? w.addText(`${days}д`) : w.addDate(RELEASE)
      if (days < 1) s.applyTimerStyle()
      s.font = Font.boldSystemFont(12)
      s.centerAlignText()
    }
    return
  }

  if (family === "accessoryInline") {
    if (released) {
      w.addText("GTA VI уже вышла 🎮")
    } else {
      const s = w.addStack()
      s.addText("GTA VI через ")
      const d = s.addDate(RELEASE)
      d.applyTimerStyle()
    }
    return
  }

  // accessoryRectangular
  const t = w.addText("GTA VI · PS5 PL")
  t.font = Font.boldSystemFont(13)
  if (released) {
    w.addText("Уже вышла! 🎮").font = Font.systemFont(13)
  } else {
    const d = w.addDate(RELEASE)
    d.applyTimerStyle()
    d.font = Font.boldMonospacedSystemFont(16)
  }
  const m = w.addText(RELEASE_MSK_LABEL)
  m.font = Font.systemFont(11)
}

function plural(n, one, few, many) {
  const n10 = n % 10, n100 = n % 100
  if (n10 === 1 && n100 !== 11) return one
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return few
  return many
}
