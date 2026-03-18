import { useState, useEffect, useCallback } from "react";

const IMAGES = {
  workshop: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/71986eab-ce20-40bd-a168-3f8f8d09deae.jpg",
  mannequins: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/2c70b64a-434e-45a0-9cd9-b2cdc3b1c376.jpg",
  sculpture: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/4f7030e3-82e7-4350-8831-a699b260bf31.jpg",
  ring1: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/3b39e037-f4d9-43b2-8c7e-ad0452e7fa67.jpg",
  ring2: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/c112fdcd-14ca-4af8-ac29-02a83cb908f7.jpg",
};

const WoodBg = () => (
  <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
    {/* Основной фон — светлое некрашеное дерево ящика */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(160deg, #e8d9be 0%, #d4c49e 18%, #dccfb0 35%, #c9b888 52%, #d8caa8 68%, #cfc09a 85%, #d4c49e 100%)',
    }} />
    {/* Текстура древесных волокон — горизонтальные полосы */}
    {[...Array(22)].map((_, i) => (
      <div key={`h${i}`} style={{
        position: 'absolute', top: `${i * 4.6}%`, left: 0, right: 0,
        height: `${0.8 + (i % 4) * 0.5}px`,
        background: `rgba(${i % 3 === 0 ? '100,75,30' : i % 3 === 1 ? '160,130,70' : '80,55,20'},${0.06 + (i % 5) * 0.025})`,
      }} />
    ))}
    {/* Вертикальные стыки досок */}
    {[20, 47, 73].map((pos, i) => (
      <div key={`v${i}`} style={{
        position: 'absolute', left: `${pos}%`, top: 0, bottom: 0,
        width: 3,
        background: 'linear-gradient(to right, rgba(80,55,20,0.18), rgba(60,40,12,0.28), rgba(80,55,20,0.18))',
      }} />
    ))}
    {/* Тёмные узлы дерева */}
    {[[15, 30], [62, 55], [38, 80], [82, 20]].map(([l, t], i) => (
      <div key={`k${i}`} style={{
        position: 'absolute', left: `${l}%`, top: `${t}%`,
        width: 38 + i * 8, height: 22 + i * 4,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(90,60,20,0.18) 30%, transparent 70%)',
        transform: `rotate(${-15 + i * 12}deg)`,
      }} />
    ))}
    {/* Лёгкое затемнение по краям */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at center, transparent 40%, rgba(60,40,15,0.22) 100%)',
    }} />
    {/* Угловые металлические скобы */}
    {[0, 1, 2, 3].map(i => (
      <div key={`screw${i}`} style={{
        position: 'absolute',
        left: i % 2 === 0 ? 14 : 'auto', right: i % 2 === 1 ? 14 : 'auto',
        top: i < 2 ? 14 : 'auto', bottom: i >= 2 ? 14 : 'auto',
        width: 16, height: 16, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #d4c8a8, #8a7040)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,240,0.3)',
        zIndex: 2,
      }} />
    ))}
    {/* Рамка-окантовка ящика */}
    <div style={{
      position: 'absolute', inset: 0,
      border: '4px solid rgba(100,72,28,0.45)',
      boxShadow: 'inset 0 0 0 2px rgba(160,130,70,0.2), inset 0 0 18px rgba(80,55,20,0.12)',
      pointerEvents: 'none', zIndex: 2,
    }} />
    {/* Горизонтальные рейки поперёк ящика */}
    {[18, 50, 82].map((pos, i) => (
      <div key={`rail${i}`} style={{
        position: 'absolute', top: `${pos}%`, left: 0, right: 0,
        height: 6,
        background: 'linear-gradient(to bottom, rgba(100,72,28,0.22), rgba(80,55,20,0.32), rgba(100,72,28,0.22))',
        zIndex: 1,
      }} />
    ))}
  </div>
);

const Stamp = ({ text, color = '#C0392B', rotate = -2, size = 13 }: { text: string; color?: string; rotate?: number; size?: number }) => (
  <div style={{
    fontFamily: 'Oswald, sans-serif', fontWeight: 700,
    fontSize: size, color, textTransform: 'uppercase', letterSpacing: '0.18em',
    border: `2px solid ${color}`, padding: '3px 10px', display: 'inline-block',
    transform: `rotate(${rotate}deg)`, opacity: 0.82,
    textShadow: `0 0 8px ${color}55`,
  }}>
    {text}
  </div>
);

const Code = ({ text }: { text: string }) => (
  <div style={{
    fontFamily: 'Share Tech Mono, monospace', fontSize: 10,
    color: 'rgba(80,55,20,0.6)', letterSpacing: '0.15em',
  }}>{text}</div>
);

const ArrowUp = ({ small = false }: { small?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.55 }}>
    {[0, 1].map(i => (
      <div key={i}>
        <div style={{ width: 2, height: small ? 18 : 26, background: 'rgba(80,55,20,0.7)', margin: '0 auto' }} />
        <div style={{
          width: 0, height: 0, margin: '-1px auto 0',
          borderLeft: `${small ? 5 : 7}px solid transparent`,
          borderRight: `${small ? 5 : 7}px solid transparent`,
          borderBottom: `${small ? 9 : 13}px solid rgba(80,55,20,0.7)`,
        }} />
      </div>
    ))}
  </div>
);

const slides = [
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
          <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 'clamp(64px, 13vw, 120px)', color: '#3a2508', letterSpacing: '-0.02em', lineHeight: 0.88, textShadow: '2px 2px 0 rgba(0,0,0,0.15)' }}>ПОКАЗ</div>
          <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 'clamp(100px, 20vw, 180px)', color: '#C0392B', letterSpacing: '-0.04em', lineHeight: 0.85, textShadow: '3px 3px 0 rgba(0,0,0,0.2), 0 0 60px rgba(192,57,43,0.2)' }}>26</div>
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 20 }}>
            <Stamp text="OPEN THIS SIDE" color="#C0392B" rotate={-1} />
            <Stamp text="THIS WAY UP ↑" color="#8a6020" rotate={1} />
          </div>
          <div style={{ marginTop: 32, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(15px, 2.2vw, 20px)', color: 'rgba(60,40,12,0.65)', letterSpacing: '0.06em' }}>
            Старинный цех железной дороги.<br />Место встречи инженерии и искусства.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'location',
    render: () => (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={IMAGES.workshop} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(30%) contrast(1.1)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(40,22,8,0.95) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 24, left: 24 }}><Code text="ПОКАЗ 26 / ЛОКАЦИЯ / ГРУЗ №001" /></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px 48px 32px' }}>
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Code text="ГРУЗ №001" />
            <Stamp text="МЕСТО" color="#8a6020" rotate={2} size={11} />
          </div>
          <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 'clamp(26px, 4vw, 46px)', color: '#2a1a06', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: 24 }}>
            Старинный<br />цех <span style={{ color: '#C0392B' }}>железной</span><br />дороги
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(14px, 1.8vw, 17px)', color: 'rgba(50,32,8,0.75)', lineHeight: 1.85, marginBottom: 16 }}>
            Пространство само по себе — первый и главный экспонат. Грубая кирпичная кладка, высокие потолки с балками и остатки индустриальной инфраструктуры создают атмосферу мощи, истории.
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(13px, 1.6vw, 16px)', color: 'rgba(100,70,20,0.75)', lineHeight: 1.8, borderLeft: '2px solid rgba(192,57,43,0.5)', paddingLeft: 16 }}>
            Это место-память, где когда-то создавали и ремонтировали стальных гигантов, связывающих страны. Теперь оно становится местом встречи инженерии и искусства.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'concept',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '40px 56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <Code text="ГРУЗ №002 / КОНЦЕПЦИЯ" />
          <Stamp text="FRAGILE" color="#C0392B" rotate={-1} size={12} />
        </div>
        <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 'clamp(22px, 3.5vw, 40px)', color: '#2a1a06', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 32, textAlign: 'center' }}>
          Метафора <span style={{ color: '#C0392B' }}>«Распаковки»</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, alignItems: 'start' }}>
          <div>
            <img src={IMAGES.mannequins} alt="" style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', filter: 'sepia(20%) contrast(1.05)', boxShadow: '0 0 0 2px rgba(100,72,28,0.5), 6px 6px 20px rgba(0,0,0,0.3)', marginBottom: 10 }} />
            <Code text="BOÎTE À CORPS" />
          </div>
          <div>
            <img src={IMAGES.sculpture} alt="" style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', filter: 'sepia(10%) contrast(1.05)', boxShadow: '0 0 0 2px rgba(100,72,28,0.5), 6px 6px 20px rgba(0,0,0,0.3)', marginBottom: 10 }} />
            <Code text="THIS WAY UP" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(14px, 1.8vw, 17px)', color: 'rgba(50,32,8,0.8)', lineHeight: 1.85 }}>
              Гости буквально <em>«распаковывают»</em> искусство. Каждый арт-объект воспринимается как уникальный, хрупкий и бесценный экспонат, доставленный с особой бережностью.
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(13px, 1.6vw, 16px)', color: 'rgba(100,70,20,0.75)', lineHeight: 1.8, borderLeft: '2px solid rgba(192,57,43,0.4)', paddingLeft: 14 }}>
              Витринами служат коробки и манекены: платья, украшения, костюмы — будто только что извлечены для осмотра.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'jewelry',
    render: () => (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 32px 48px 56px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <Code text="ГРУЗ №003 / УКРАШЕНИЯ" />
            <Stamp text="ЦЕННЫЙ ГРУЗ" color="#C8A060" rotate={1} size={10} />
          </div>
          <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 'clamp(24px, 3.8vw, 44px)', color: '#2a1a06', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: 24 }}>
            Ювелирные<br /><span style={{ color: '#C0392B' }}>украшения</span>
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(14px, 1.8vw, 17px)', color: 'rgba(50,32,8,0.75)', lineHeight: 1.85, marginBottom: 24 }}>
            Кольцо «ПОКАЗ 26» — авторское украшение из серебра с эмалью. Брутальная геометрия, выгравированный код. Предмет, который носит историю на пальце.
          </div>
          <Code text="АРТИКУЛ: PK26-JWL-001" />
          <div style={{ marginTop: 20 }}><Stamp text="ПОКАЗ 26" color="#C0392B" rotate={-1} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 32, alignContent: 'center' }}>
          <img src={IMAGES.ring1} alt="" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', boxShadow: '0 0 0 2px rgba(160,120,60,0.4), 8px 8px 24px rgba(0,0,0,0.7)' }} />
          <img src={IMAGES.ring2} alt="" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', boxShadow: '0 0 0 2px rgba(160,120,60,0.4), 8px 8px 24px rgba(0,0,0,0.7)', marginTop: 32 }} />
        </div>
      </div>
    ),
  },
  {
    id: 'code26',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '40px 56px', textAlign: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
          <Code text="ГРУЗ №004 / КОД ОТПРАВЛЕНИЯ" />
          <Stamp text="РАСШИФРОВАТЬ" color="#C0392B" rotate={-1} size={11} />
        </div>
        <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 'clamp(80px, 16vw, 140px)', color: '#C0392B', letterSpacing: '-0.02em', lineHeight: 0.85, textShadow: '0 0 40px rgba(192,57,43,0.2)' }}>26</div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: 'rgba(80,55,20,0.55)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 36 }}>Что означает цифра?</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 840, width: '100%', marginBottom: 28 }}>
          {[
            { num: '01', text: 'Номер партии или вагона в железнодорожной логистике' },
            { num: '02', text: 'Порядковый номер выставки в серии' },
            { num: '03', text: 'Количество художников, объектов или коробок-инсталляций' },
            { num: '04', text: 'Загадочный код, который зритель наполняет своим смыслом' },
          ].map(item => (
            <div key={item.num} style={{ padding: '20px 18px', border: '1px solid rgba(100,72,28,0.3)', background: 'rgba(100,72,28,0.06)', textAlign: 'left' }}>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'rgba(192,57,43,0.7)', letterSpacing: '0.2em', marginBottom: 10 }}>[{item.num}]</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, color: 'rgba(50,32,8,0.75)', lineHeight: 1.7 }}>{item.text}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'stretch', maxWidth: 840, width: '100%', border: '1px solid rgba(100,72,28,0.3)', background: 'rgba(100,72,28,0.05)' }}>
          <div style={{ background: '#C0392B', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 64, flexShrink: 0 }}>
            <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 22, color: '#fff', lineHeight: 1 }}>01</div>
          </div>
          <div style={{ padding: '14px 20px', textAlign: 'left', flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'rgba(80,55,20,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>ЭТАП 1</div>
            <div style={{ width: 1, height: 20, background: 'rgba(100,72,28,0.25)' }} />
            <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 14, color: '#2a1a06', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Вирусное видео</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'sound',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '48px 56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <Code text="ГРУЗ №005 / ЗВУКОВОЕ СОПРОВОЖДЕНИЕ" />
          <Stamp text="ECHO" color="#8E9BA8" rotate={2} size={12} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 500, fontSize: 'clamp(22px, 3.5vw, 44px)', color: '#2a1a06', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 28 }}>
              Звуковое<br /><span style={{ color: '#5a7a8a' }}>сопровождение</span>
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(15px, 1.9vw, 18px)', color: 'rgba(50,32,8,0.75)', lineHeight: 1.9 }}>
              Звуковое сопровождение включает отдалённые эхо поездов, скрип дерева, электронные аранжировки — намекая на диалог эпох. Пространство дышит и говорит своим языком.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {[
              { icon: '◎', label: 'Эхо поездов', sub: 'Отдалённые звуки движения' },
              { icon: '◎', label: 'Скрип дерева', sub: 'Голос старого цеха' },
              { icon: '◎', label: 'Электроника', sub: 'Диалог прошлого с настоящим' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 52, height: 52, flexShrink: 0, border: '1px solid rgba(142,155,168,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Share Tech Mono, monospace', fontSize: 22, color: 'rgba(142,155,168,0.6)' }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: 'rgba(50,32,8,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{item.label}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 14, color: 'rgba(90,60,20,0.6)', marginTop: 2 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'finale',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '32px 56px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 28 }}>
          <ArrowUp small /><ArrowUp small /><ArrowUp small />
        </div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(15px, 2.2vw, 21px)', color: 'rgba(50,32,8,0.85)', lineHeight: 1.9, maxWidth: 680 }}>
          «Показ 26» — это не просто <em>«выставка»</em> в необычном месте. Это тотальная инсталляция, где контекст (цех), оформление (коробки) и содержание (искусство) сливаются в единое высказывание.
        </div>

        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28 }}>
          <Stamp text="ПОКАЗ" color="#C0392B" rotate={-2} size={14} />
          <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 64, color: '#C0392B', lineHeight: 1, textShadow: '0 0 30px rgba(192,57,43,0.2)' }}>26</div>
          <Stamp text="BRUCE HERMAN" color="#8a6020" rotate={1} size={12} />
        </div>
        <div style={{ marginTop: 20, fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'rgba(80,55,20,0.35)', letterSpacing: '0.2em' }}>
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
    setTimeout(() => {
      setCurrent(idx);
      setVisible(true);
    }, 220);
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
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#3d2810' }}>
      <WoodBg />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 0.22s ease, transform 0.22s ease',
      }}>
        {slides[current].render()}
      </div>

      {current > 0 && (
        <button onClick={() => goTo(current - 1)} style={{
          position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, background: 'rgba(200,180,140,0.7)', border: '1px solid rgba(100,72,28,0.4)',
          color: 'rgba(50,32,8,0.85)', width: 44, height: 44, cursor: 'pointer',
          fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'serif', transition: 'background 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,57,43,0.25)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,180,140,0.7)')}
        >‹</button>
      )}
      {current < slides.length - 1 && (
        <button onClick={() => goTo(current + 1)} style={{
          position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, background: 'rgba(200,180,140,0.7)', border: '1px solid rgba(100,72,28,0.4)',
          color: 'rgba(50,32,8,0.85)', width: 44, height: 44, cursor: 'pointer',
          fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'serif', transition: 'background 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,57,43,0.25)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,180,140,0.7)')}
        >›</button>
      )}

      <div style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, display: 'flex', gap: 10, alignItems: 'center',
      }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} title={SLIDE_NAMES[i]} style={{
            width: i === current ? 28 : 8, height: 8,
            background: i === current ? '#C0392B' : 'rgba(100,72,28,0.3)',
            border: 'none', cursor: 'pointer', padding: 0,
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 24, zIndex: 10, fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'rgba(80,55,20,0.45)', letterSpacing: '0.2em' }}>
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: 24, zIndex: 10, fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: 'rgba(80,55,20,0.35)', letterSpacing: '0.15em' }}>
        ← → НАВИГАЦИЯ
      </div>
    </div>
  );
}