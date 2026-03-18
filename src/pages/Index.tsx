import { useState, useEffect, useCallback } from "react";

const IMAGES = {
  workshop: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/71986eab-ce20-40bd-a168-3f8f8d09deae.jpg",
  mannequins: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/2c70b64a-434e-45a0-9cd9-b2cdc3b1c376.jpg",
  sculpture: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/4f7030e3-82e7-4350-8831-a699b260bf31.jpg",
  ring1: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/3b39e037-f4d9-43b2-8c7e-ad0452e7fa67.jpg",
  ring2: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/c112fdcd-14ca-4af8-ac29-02a83cb908f7.jpg",
};

const T = {
  dark: '#0a0806',
  mid: '#0a0806',
  muted: 'rgba(10,8,4,0.75)',
  accent: '#0a0806',
  gold: '#0a0806',
};

const WoodBg = () => (
  <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
    {/* Основа фанеры — жёлто-коричневый, чуть тёмнее предыдущего */}
    <div style={{ position: 'absolute', inset: 0, background: '#b89a62' }} />
    {/* Слои шпона с разными оттенками — имитация фанеры */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(175deg, #c8a96e 0%, #a8884e 15%, #beaa72 30%, #9e7e44 45%, #b89458 60%, #a07840 75%, #bc9e64 90%, #a88650 100%)', opacity: 0.9 }} />
    {/* Длинные тонкие волокна — характерная текстура фанеры */}
    {[...Array(40)].map((_, i) => (
      <div key={`f${i}`} style={{
        position: 'absolute', top: `${i * 2.52}%`, left: 0, right: 0,
        height: `${0.5 + (i % 6 === 0 ? 1.2 : i % 3 === 0 ? 0.8 : 0.4)}px`,
        background: `rgba(${i % 4 === 0 ? '50,32,8' : i % 4 === 1 ? '140,100,40' : i % 4 === 2 ? '30,18,4' : '170,130,60'},${0.08 + (i % 7) * 0.018})`,
      }} />
    ))}
    {/* Несколько заметных тёмных прожилок */}
    {[8, 23, 41, 58, 77, 91].map((pos, i) => (
      <div key={`g${i}`} style={{
        position: 'absolute', top: `${pos}%`, left: 0, right: 0,
        height: `${1.5 + (i % 2) * 1}px`,
        background: `rgba(40,24,6,${0.18 + (i % 3) * 0.07})`,
      }} />
    ))}
    {/* Вертикальные стыки листов фанеры */}
    {[33, 66].map((pos) => (
      <div key={`s${pos}`} style={{
        position: 'absolute', left: `${pos}%`, top: 0, bottom: 0, width: 2,
        background: 'linear-gradient(to right, rgba(40,24,6,0.25), rgba(25,14,3,0.4), rgba(40,24,6,0.25))',
      }} />
    ))}
    {/* Тёмные сучки */}
    {[[12, 22], [55, 68], [80, 40], [30, 85]].map(([l, t], i) => (
      <div key={`k${i}`} style={{
        position: 'absolute', left: `${l}%`, top: `${t}%`,
        width: 50 + i * 10, height: 28 + i * 5, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(35,20,5,0.28) 20%, rgba(60,38,10,0.12) 60%, transparent 80%)',
        transform: `rotate(${-20 + i * 15}deg)`,
      }} />
    ))}
    {/* Общее затемнение краёв */}
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(20,10,2,0.35) 100%)' }} />
    {/* Общий тёмный оверлей для нужной глубины */}
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,3,0.18)' }} />
    {/* Металлические скобы по углам */}
    {[0, 1, 2, 3].map(i => (
      <div key={`screw${i}`} style={{
        position: 'absolute', left: i % 2 === 0 ? 12 : 'auto', right: i % 2 === 1 ? 12 : 'auto',
        top: i < 2 ? 12 : 'auto', bottom: i >= 2 ? 12 : 'auto',
        width: 18, height: 18, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #c8b880, #6a5020)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,240,180,0.25)',
        zIndex: 3,
      }} />
    ))}
    {/* Крестообразные прорези на скобах */}
    {[0, 1, 2, 3].map(i => (
      <div key={`slot${i}`} style={{
        position: 'absolute', left: i % 2 === 0 ? 20 : 'auto', right: i % 2 === 1 ? 20 : 'auto',
        top: i < 2 ? 20 : 'auto', bottom: i >= 2 ? 20 : 'auto',
        width: 2, height: 7,
        background: 'rgba(30,18,4,0.7)',
        zIndex: 4,
      }} />
    ))}
    {/* Рамка — тёмная полоса по периметру как у ящика */}
    <div style={{
      position: 'absolute', inset: 0,
      border: '6px solid rgba(30,16,4,0.55)',
      boxShadow: 'inset 0 0 0 1px rgba(20,10,2,0.4), inset 0 0 24px rgba(20,10,2,0.2)',
      pointerEvents: 'none', zIndex: 2,
    }} />
    {/* Поперечные доски-рейки ящика */}
    {[16, 50, 84].map((pos) => (
      <div key={`rail${pos}`} style={{
        position: 'absolute', top: `${pos}%`, left: 0, right: 0, height: 8,
        background: 'linear-gradient(to bottom, rgba(30,16,4,0.28), rgba(20,10,2,0.42), rgba(30,16,4,0.28))',
        zIndex: 1,
      }} />
    ))}
  </div>
);

const Stamp = ({ text, color = '#C0392B', rotate = -2, size = 13 }: { text: string; color?: string; rotate?: number; size?: number }) => (
  <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: size, color, textTransform: 'uppercase', letterSpacing: '0.18em', border: `2px solid ${color}`, padding: '3px 10px', display: 'inline-block', transform: `rotate(${rotate}deg)`, opacity: 0.85, textShadow: `0 0 8px ${color}44` }}>
    {text}
  </div>
);

const Code = ({ text }: { text: string }) => (
  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'rgba(8,5,2,0.65)', letterSpacing: '0.18em' }}>{text}</div>
);

const ArrowUp = ({ small = false }: { small?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7 }}>
    {[0, 1].map(i => (
      <div key={i}>
        <div style={{ width: 2, height: small ? 18 : 26, background: 'rgba(8,5,2,0.75)', margin: '0 auto' }} />
        <div style={{ width: 0, height: 0, margin: '-1px auto 0', borderLeft: `${small ? 5 : 7}px solid transparent`, borderRight: `${small ? 5 : 7}px solid transparent`, borderBottom: `${small ? 9 : 13}px solid rgba(8,5,2,0.75)` }} />
      </div>
    ))}
  </div>
);

const Divider = () => (
  <div style={{ height: 1, background: 'rgba(8,5,2,0.25)', margin: '14px 0' }} />
);

const slides = [
  // 0 — ТИТУЛ
  {
    id: 'title',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${IMAGES.workshop})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12, filter: 'sepia(40%) contrast(1.1)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 60, marginBottom: 28 }}>
            <ArrowUp />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Code text="ОТД. B/N4-6BABX58" />
              <Code text="ВЕС 119.485 КГ" />
              <Code text="FRAGILE / ХРУПКОЕ" />
            </div>
            <ArrowUp />
          </div>
          <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 'clamp(64px, 13vw, 120px)', color: T.dark, letterSpacing: '-0.02em', lineHeight: 0.88, textShadow: '2px 2px 0 rgba(0,0,0,0.12)' }}>ПОКАЗ</div>
          <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 'clamp(100px, 20vw, 180px)', color: T.dark, letterSpacing: '-0.04em', lineHeight: 0.85, textShadow: '3px 3px 0 rgba(0,0,0,0.18)' }}>26</div>
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 20 }}>
            <Stamp text="OPEN THIS SIDE" color={T.accent} rotate={-1} />
            <Stamp text="THIS WAY UP ↑" color={T.gold} rotate={1} />
          </div>
          <div style={{ marginTop: 32, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(15px, 2.2vw, 20px)', color: T.mid, letterSpacing: '0.06em' }}>
            Концепция показа «Показ 26»
          </div>
        </div>
      </div>
    ),
  },

  // 1 — ЛОКАЦИЯ
  {
    id: 'location',
    render: () => (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={IMAGES.workshop} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(30%) contrast(1.1)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(200,180,140,0.97) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 24, left: 24 }}><Code text="ПОКАЗ 26 / ЛОКАЦИЯ / ГРУЗ №001" /></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 40px 40px 28px', overflowY: 'auto' }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Code text="ГРУЗ №001" />
            <Stamp text="МЕСТО" color={T.gold} rotate={2} size={11} />
          </div>
          <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 'clamp(22px, 3.2vw, 38px)', color: T.dark, letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: 18 }}>
            Старинный<br />цех железной<br />дороги
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(14px, 1.7vw, 16px)', color: T.mid, lineHeight: 1.85, marginBottom: 14 }}>
            Пространство само по себе — первый и главный экспонат. Грубая кирпичная кладка, высокие потолки с балками и остатки индустриальной инфраструктуры создают атмосферу мощи, истории.
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(14px, 1.7vw, 16px)', color: T.mid, lineHeight: 1.85, marginBottom: 14 }}>
            Это место-память, где когда-то создавали и ремонтировали стальных гигантов, связывающих страны. Теперь оно становится местом встречи инженерии и искусства.
          </div>
          <Divider />
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(13px, 1.6vw, 15px)', color: T.mid, lineHeight: 1.85, borderLeft: '2px solid rgba(10,8,4,0.35)', paddingLeft: 14 }}>
            Новый сезон здесь ощущается не как смена времени, а как вскрытие слоя — переход от скрытого к явленному, от запечатанного к пережитому.
          </div>
        </div>
      </div>
    ),
  },

  // 2 — КОНЦЕПЦИЯ / МЕТАФОРА
  {
    id: 'concept',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '36px 56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Code text="ГРУЗ №002 / МЕТАФОРА ОТКРЫТИЯ" />
          <Stamp text="FRAGILE" color={T.accent} rotate={-1} size={12} />
        </div>
        <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 'clamp(20px, 3vw, 36px)', color: T.dark, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 24, textAlign: 'center' }}>
          Метафора «Распаковки»
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, alignItems: 'start' }}>
          <div>
            <img src={IMAGES.mannequins} alt="" style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', filter: 'sepia(20%) contrast(1.05)', boxShadow: '0 0 0 2px rgba(100,72,28,0.5), 6px 6px 20px rgba(0,0,0,0.25)', marginBottom: 8 }} />
            <Code text="BOÎTE À CORPS" />
          </div>
          <div>
            <img src={IMAGES.sculpture} alt="" style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', filter: 'sepia(10%) contrast(1.05)', boxShadow: '0 0 0 2px rgba(100,72,28,0.5), 6px 6px 20px rgba(0,0,0,0.25)', marginBottom: 8 }} />
            <Code text="THIS WAY UP" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(13px, 1.6vw, 16px)', color: T.mid, lineHeight: 1.8 }}>
              Гости буквально <em>«распаковывают»</em> искусство. Каждый арт-объект воспринимается как уникальный, хрупкий и бесценный экспонат, доставленный с особой бережностью.
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(13px, 1.6vw, 16px)', color: T.mid, lineHeight: 1.8 }}>
              Витринами служат коробки и манекены: платья, украшения, костюмы — будто только что извлечены для осмотра.
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(12px, 1.5vw, 15px)', color: T.mid, lineHeight: 1.8, borderLeft: '2px solid rgba(10,8,4,0.35)', paddingLeft: 12 }}>
              Распаковка становится жестом познания — мы распаковываем не только форму, но и смысл, не только объект, но и неизвестное, скрытое внутри него.
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 3 — УКРАШЕНИЯ
  {
    id: 'jewelry',
    render: () => (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 28px 40px 56px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
            <Code text="ГРУЗ №003 / УКРАШЕНИЯ" />
            <Stamp text="ЦЕННЫЙ ГРУЗ" color={T.gold} rotate={1} size={10} />
          </div>
          <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 'clamp(22px, 3.5vw, 40px)', color: T.dark, textTransform: 'uppercase', lineHeight: 1.05, marginBottom: 18 }}>
            Ювелирные<br />украшения
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(14px, 1.7vw, 16px)', color: T.mid, lineHeight: 1.85, marginBottom: 18 }}>
            Кольцо «ПОКАЗ 26» — авторское украшение из серебра с эмалью. Брутальная геометрия, выгравированный код. Предмет, который носит историю на пальце.
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(13px, 1.6vw, 15px)', color: T.mid, lineHeight: 1.8, marginBottom: 18, borderLeft: '2px solid rgba(10,8,4,0.35)', paddingLeft: 12 }}>
            Каждое открытие — это контакт с новым, ещё не названным, с тем, что существует на границе ожидания и неожиданности.
          </div>
          <Code text="АРТИКУЛ: PK26-JWL-001" />
          <div style={{ marginTop: 16 }}><Stamp text="ПОКАЗ 26" color={T.accent} rotate={-1} /></div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'stretch', border: '1px solid rgba(10,8,4,0.3)', background: 'rgba(10,8,4,0.06)' }}>
            <div style={{ background: 'rgba(10,8,4,0.85)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 52, flexShrink: 0 }}>
              <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 18, color: '#c8a96e', lineHeight: 1 }}>01</div>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: T.mid, letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>ЭТАП 1</div>
              <div style={{ width: 1, height: 16, background: 'rgba(10,8,4,0.25)' }} />
              <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 13, color: T.dark, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Вирусное видео</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 32, alignContent: 'center' }}>
          <img src={IMAGES.ring1} alt="" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', boxShadow: '0 0 0 2px rgba(100,72,28,0.4), 8px 8px 24px rgba(0,0,0,0.25)' }} />
          <img src={IMAGES.ring2} alt="" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', boxShadow: '0 0 0 2px rgba(100,72,28,0.4), 8px 8px 24px rgba(0,0,0,0.25)', marginTop: 32 }} />
        </div>
      </div>
    ),
  },

  // 4 — КОД 26
  {
    id: 'code26',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '36px 56px', textAlign: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <Code text="ГРУЗ №004 / КОД ОТПРАВЛЕНИЯ" />
          <Stamp text="РАСШИФРОВАТЬ" color={T.accent} rotate={-1} size={11} />
        </div>
        <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 'clamp(70px, 14vw, 130px)', color: T.dark, letterSpacing: '-0.02em', lineHeight: 0.85 }}>26</div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: T.mid, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 24 }}>Название «Показ 26»</div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(13px, 1.6vw, 15px)', color: T.mid, lineHeight: 1.8, maxWidth: 700, marginBottom: 24 }}>
          Цифра «26» добавляет интриги и может трактоваться по-разному. В этом коде также зашито ощущение начала — как маркировка нового сезона, новой отправной точки, где каждое произведение впервые выходит в пространство взгляда.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, maxWidth: 840, width: '100%' }}>
          {[
            { num: '01', text: 'Номер партии или вагона в железнодорожной логистике' },
            { num: '02', text: 'Порядковый номер выставки в серии' },
            { num: '03', text: 'Количество художников, объектов или коробок-инсталляций' },
            { num: '04', text: 'Загадочный код, который зритель наполняет своим смыслом' },
          ].map(item => (
            <div key={item.num} style={{ padding: '18px 16px', border: '1px solid rgba(100,72,28,0.3)', background: 'rgba(100,72,28,0.06)', textAlign: 'left' }}>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'rgba(10,8,4,0.55)', letterSpacing: '0.2em', marginBottom: 8 }}>[{item.num}]</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, color: T.mid, lineHeight: 1.7 }}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 5 — ЗВУК
  {
    id: 'sound',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '48px 56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <Code text="ГРУЗ №005 / ЗВУКОВОЕ СОПРОВОЖДЕНИЕ" />
          <Stamp text="ECHO" color={T.dark} rotate={2} size={12} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 500, fontSize: 'clamp(22px, 3.5vw, 44px)', color: T.dark, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 22 }}>
              Звуковое<br />сопровождение
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(14px, 1.8vw, 17px)', color: T.mid, lineHeight: 1.9 }}>
              Звуковое сопровождение может включать отдалённые эхо поездов, скрип дерева, электронные аранжировки — намекая на диалог эпох. Пространство дышит и говорит своим языком.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { icon: '◎', label: 'Эхо поездов', sub: 'Отдалённые звуки движения' },
              { icon: '◎', label: 'Скрип дерева', sub: 'Голос старого цеха' },
              { icon: '◎', label: 'Электроника', sub: 'Диалог прошлого с настоящим' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 52, height: 52, flexShrink: 0, border: '1px solid rgba(10,8,4,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Share Tech Mono, monospace', fontSize: 22, color: 'rgba(10,8,4,0.5)' }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: T.mid, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{item.label}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 14, color: T.gold, marginTop: 2 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // 6 — ИТОГ
  {
    id: 'finale',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '32px 56px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 24 }}>
          <ArrowUp small /><ArrowUp small /><ArrowUp small />
        </div>
        <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 'clamp(13px, 1.6vw, 16px)', color: T.dark, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Итог</div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(15px, 2vw, 19px)', color: T.mid, lineHeight: 1.9, maxWidth: 720, marginBottom: 18 }}>
          «Показ 26» — это не просто «выставка» в необычном месте. Это тотальная инсталляция, где контекст (цех), оформление (коробки) и содержание (искусство) сливаются в единое высказывание.
        </div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(14px, 1.8vw, 17px)', color: T.mid, lineHeight: 1.9, maxWidth: 680, marginBottom: 18 }}>
          Высказывание о хрупкости и ценности, который, как хрупкий груз, путешествует через время и пространство, чтобы быть бережно распакованным перед зрителем здесь и сейчас, среди свидетельств индустриальной мощи прошлого.
        </div>
        <Divider />
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(14px, 1.8vw, 17px)', color: T.mid, lineHeight: 1.9, maxWidth: 640 }}>
          И, возможно, главный жест этого показа — не демонстрация, а открытие: момент, когда неизвестное становится видимым, а новое — переживаемым.
        </div>
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28 }}>
          <Stamp text="ПОКАЗ" color={T.dark} rotate={-2} size={14} />
          <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 60, color: T.dark, lineHeight: 1 }}>26</div>
          <Stamp text="BRUCE HERMAN" color={T.dark} rotate={1} size={12} />
        </div>
        <div style={{ marginTop: 16, fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'rgba(10,8,4,0.45)', letterSpacing: '0.2em' }}>
          B/N4-6BABX58 · W7 119.485 · OPEN THIS SIDE · FRAGILE
        </div>
      </div>
    ),
  },
];

const SLIDE_NAMES = ['Титул', 'Локация', 'Концепция', 'Украшения', 'Код 26', 'Звук', 'Итог'];

export default function Index() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= slides.length || idx === current) return;
    setVisible(false);
    setTimeout(() => { setCurrent(idx); setVisible(true); }, 220);
  }, [current]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(current - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current, goTo]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#b89a62' }}>
      <WoodBg />

      <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.22s ease, transform 0.22s ease' }}>
        {slides[current].render()}
      </div>

      {current > 0 && (
        <button onClick={() => goTo(current - 1)} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(200,180,140,0.75)', border: '1px solid rgba(100,72,28,0.4)', color: T.dark, width: 44, height: 44, cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,57,43,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,180,140,0.75)')}
        >‹</button>
      )}
      {current < slides.length - 1 && (
        <button onClick={() => goTo(current + 1)} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(200,180,140,0.75)', border: '1px solid rgba(100,72,28,0.4)', color: T.dark, width: 44, height: 44, cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,57,43,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,180,140,0.75)')}
        >›</button>
      )}

      <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} title={SLIDE_NAMES[i]} style={{ width: i === current ? 28 : 8, height: 8, background: i === current ? T.accent : 'rgba(100,72,28,0.3)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }} />
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 24, zIndex: 10, fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'rgba(8,5,2,0.55)', letterSpacing: '0.2em' }}>
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: 24, zIndex: 10, fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'rgba(8,5,2,0.4)', letterSpacing: '0.15em' }}>
        ← → НАВИГАЦИЯ
      </div>
    </div>
  );
}