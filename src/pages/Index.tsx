import { useState, useEffect, useRef } from "react";

const IMAGES = {
  workshop: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/71986eab-ce20-40bd-a168-3f8f8d09deae.jpg",
  mannequins: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/2c70b64a-434e-45a0-9cd9-b2cdc3b1c376.jpg",
  sculpture: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/4f7030e3-82e7-4350-8831-a699b260bf31.jpg",
  ring1: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/3b39e037-f4d9-43b2-8c7e-ad0452e7fa67.jpg",
  ring2: "https://cdn.poehali.dev/projects/430806ea-8434-4775-a22d-00be684af521/bucket/c112fdcd-14ca-4af8-ac29-02a83cb908f7.jpg",
};

const WoodTextureBg = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(135deg, #3d2810 0%, #5c3d1e 20%, #4a2f14 40%, #6b4822 60%, #3a2510 80%, #4f3318 100%)',
    }} />
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
    {[...Array(18)].map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        top: `${(i * 5.5) % 100}%`,
        left: 0, right: 0,
        height: `${1 + (i % 3) * 0.5}px`,
        background: `rgba(${i % 2 === 0 ? '30,18,8' : '120,80,30'},${0.08 + (i % 4) * 0.04})`,
      }} />
    ))}
    {[...Array(12)].map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        left: `${(i * 8.3) % 100}%`,
        top: 0, bottom: 0,
        width: `${0.5 + (i % 3) * 0.3}px`,
        background: `rgba(${i % 2 === 0 ? '20,12,5' : '100,65,25'},${0.06 + (i % 3) * 0.03})`,
      }} />
    ))}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at center, transparent 30%, rgba(15,8,2,0.6) 100%)',
    }} />
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{
        position: 'absolute',
        left: i % 2 === 0 ? 0 : 'auto',
        right: i % 2 === 1 ? 0 : 'auto',
        top: i < 2 ? 0 : 'auto',
        bottom: i >= 2 ? 0 : 'auto',
        width: '60px', height: '60px',
        borderRadius: '4px',
        background: 'rgba(10,6,2,0.7)',
        boxShadow: '0 0 30px 10px rgba(10,6,2,0.5)',
      }} />
    ))}
  </div>
);

const CrateFrame = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative ${className}`} style={{
    border: '3px solid rgba(160,120,60,0.6)',
    boxShadow: 'inset 0 0 0 1px rgba(80,50,20,0.8), 0 0 0 1px rgba(200,165,100,0.2), 6px 6px 20px rgba(0,0,0,0.6)',
    background: 'rgba(35,22,10,0.85)',
  }}>
    <div style={{
      position: 'absolute', top: -2, left: -2, right: -2, bottom: -2,
      border: '1px solid rgba(100,65,25,0.4)',
      pointerEvents: 'none',
    }} />
    {[[-6,-6],[-6,'auto'],['auto',-6],['auto','auto']].map(([t,l], i) => (
      <div key={i} style={{
        position: 'absolute',
        top: t === 'auto' ? 'auto' : t,
        bottom: t === 'auto' ? -6 : 'auto',
        left: l === 'auto' ? 'auto' : l,
        right: l === 'auto' ? -6 : 'auto',
        width: 12, height: 12,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #c8a060 0%, #6b4020 100%)',
        boxShadow: '0 0 4px rgba(0,0,0,0.8)',
        zIndex: 10,
      }} />
    ))}
    {children}
  </div>
);

const StampText = ({ text, color = '#C0392B', rotate = -2 }: { text: string; color?: string; rotate?: number }) => (
  <div style={{
    fontFamily: 'Oswald, sans-serif',
    fontWeight: 700,
    fontSize: 'inherit',
    color,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    border: `2px solid ${color}`,
    padding: '2px 10px',
    display: 'inline-block',
    transform: `rotate(${rotate}deg)`,
    opacity: 0.85,
    textShadow: `0 0 8px ${color}44`,
    boxShadow: `inset 0 0 0 1px ${color}33`,
  }}>
    {text}
  </div>
);

const ShippingLabel = ({ lines }: { lines: string[] }) => (
  <div style={{
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '11px',
    color: 'rgba(200,165,100,0.6)',
    letterSpacing: '0.1em',
    lineHeight: 1.6,
  }}>
    {lines.map((l, i) => <div key={i}>{l}</div>)}
  </div>
);

const ArrowUp = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7 }}>
    <div style={{ width: 2, height: 28, background: 'rgba(200,165,100,0.7)' }} />
    <div style={{
      width: 0, height: 0,
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderBottom: '14px solid rgba(200,165,100,0.7)',
      marginTop: -14,
    }} />
    <div style={{ width: 2, height: 28, background: 'rgba(200,165,100,0.7)', marginTop: -1 }} />
    <div style={{
      width: 0, height: 0,
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderBottom: '14px solid rgba(200,165,100,0.7)',
      marginTop: -14,
    }} />
  </div>
);

const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

const Section = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(50px)',
      transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
};

export default function Index() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <WoodTextureBg />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* HERO */}
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', position: 'relative', paddingTop: 40,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${IMAGES.workshop})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.22, filter: 'sepia(60%) contrast(1.1)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(30,18,8,0.3) 0%, rgba(30,18,8,0.1) 50%, rgba(30,18,8,0.9) 100%)',
          }} />

          <div style={{
            position: 'relative', zIndex: 1, textAlign: 'center',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1.2s ease 0.3s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, gap: 40 }}>
              <ArrowUp />
              <div>
                <ShippingLabel lines={['ОТД. № B/N4-6BABX58', 'ВЕС 119.485', 'ХРУПКОЕ / FRAGILE']} />
              </div>
              <ArrowUp />
            </div>

            <div style={{
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(72px, 16vw, 140px)',
              color: '#E8DDD0',
              letterSpacing: '-0.02em',
              lineHeight: 0.9,
              textShadow: '0 0 60px rgba(200,165,100,0.3), 4px 4px 0 rgba(0,0,0,0.5)',
            }}>
              ПОКАЗ
            </div>
            <div style={{
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(100px, 22vw, 200px)',
              color: '#C0392B',
              letterSpacing: '-0.04em',
              lineHeight: 0.85,
              textShadow: '0 0 80px rgba(192,57,43,0.4), 4px 4px 0 rgba(0,0,0,0.6)',
            }}>
              26
            </div>

            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 24 }}>
              <StampText text="OPEN THIS SIDE" color="#C0392B" rotate={-1} />
              <StampText text="THIS WAY UP ↑" color="#C8A060" rotate={1} />
            </div>

            <div style={{
              marginTop: 48,
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(16px, 3vw, 22px)',
              color: 'rgba(232,221,208,0.8)',
              letterSpacing: '0.08em',
              maxWidth: 560,
              margin: '48px auto 0',
            }}>
              Старинный цех железной дороги.<br />
              Место встречи инженерии и искусства.
            </div>

            <div style={{ marginTop: 60, color: 'rgba(200,165,100,0.5)', fontFamily: 'Share Tech Mono, monospace', fontSize: 12, letterSpacing: '0.2em', animation: 'pulse 2s infinite' }}>
              ↓ &nbsp; ПРОКРУТИТЕ &nbsp; ↓
            </div>
          </div>
        </div>

        {/* SECTION 1 — ЛОКАЦИЯ */}
        <Section delay={0}>
          <CrateFrame className="mb-20">
            <div style={{ padding: '48px 40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <ShippingLabel lines={['ГРУЗ №001', 'ЛОКАЦИЯ']} />
                <StampText text="МЕСТО" color="#C8A060" rotate={2} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
                <div>
                  <div style={{
                    fontFamily: 'Oswald, sans-serif', fontWeight: 600,
                    fontSize: 'clamp(28px, 5vw, 48px)', color: '#E8DDD0',
                    letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.1,
                    marginBottom: 24,
                  }}>
                    Старинный цех<br />
                    <span style={{ color: '#C0392B' }}>железной</span><br />
                    дороги
                  </div>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(15px, 2vw, 18px)',
                    color: 'rgba(232,221,208,0.75)',
                    lineHeight: 1.8,
                  }}>
                    Пространство само по себе — первый и главный экспонат. Грубая кирпичная кладка, высокие потолки с балками и остатки индустриальной инфраструктуры создают атмосферу мощи, истории.
                  </div>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                    fontSize: 'clamp(15px, 2vw, 18px)',
                    color: 'rgba(232,221,208,0.6)',
                    lineHeight: 1.8, marginTop: 16,
                  }}>
                    Это место-память, где когда-то создавали и ремонтировали стальных гигантов, связывающих страны.
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <img src={IMAGES.workshop} alt="Цех железной дороги" style={{
                    width: '100%', aspectRatio: '9/16', objectFit: 'cover',
                    filter: 'sepia(30%) contrast(1.1)',
                    boxShadow: '0 0 0 2px rgba(160,120,60,0.4), 8px 8px 24px rgba(0,0,0,0.7)',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 12, left: 12,
                    fontFamily: 'Share Tech Mono, monospace', fontSize: 10,
                    color: 'rgba(200,165,100,0.7)', letterSpacing: '0.1em',
                  }}>
                    ПОКАЗ 26 / ЛОКАЦИЯ
                  </div>
                </div>
              </div>
            </div>
          </CrateFrame>
        </Section>

        {/* SECTION 2 — КОНЦЕПЦИЯ */}
        <Section delay={0.1}>
          <CrateFrame className="mb-20">
            <div style={{ padding: '48px 40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                <ShippingLabel lines={['ГРУЗ №002', 'КОНЦЕПЦИЯ']} />
                <StampText text="FRAGILE" color="#C0392B" rotate={-2} />
              </div>

              <div style={{
                fontFamily: 'Oswald, sans-serif', fontWeight: 600,
                fontSize: 'clamp(24px, 4vw, 40px)', color: '#E8DDD0',
                letterSpacing: '0.05em', textTransform: 'uppercase',
                marginBottom: 32, textAlign: 'center',
              }}>
                Метафора<br />
                <span style={{ color: '#C8A060' }}>«Распаковки»</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
                <div>
                  <img src={IMAGES.mannequins} alt="Манекены в ящике" style={{
                    width: '100%', aspectRatio: '9/16', objectFit: 'cover',
                    filter: 'sepia(20%) contrast(1.05)',
                    boxShadow: '0 0 0 2px rgba(160,120,60,0.4), 8px 8px 24px rgba(0,0,0,0.7)',
                  }} />
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'rgba(200,165,100,0.5)', marginTop: 8, letterSpacing: '0.1em' }}>
                    BOÎTE À CORPS — ПОКАЗ 26
                  </div>
                </div>
                <div>
                  <img src={IMAGES.sculpture} alt="Скульптура в ящике" style={{
                    width: '100%', aspectRatio: '9/16', objectFit: 'cover',
                    filter: 'sepia(10%) contrast(1.05)',
                    boxShadow: '0 0 0 2px rgba(160,120,60,0.4), 8px 8px 24px rgba(0,0,0,0.7)',
                  }} />
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'rgba(200,165,100,0.5)', marginTop: 8, letterSpacing: '0.1em' }}>
                    THIS WAY UP — ПОКАЗ 26
                  </div>
                </div>
              </div>

              <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(16px, 2.2vw, 21px)',
                color: 'rgba(232,221,208,0.8)',
                lineHeight: 1.9, textAlign: 'center',
                maxWidth: 600, margin: '0 auto',
              }}>
                Гости буквально <em>«распаковывают»</em> искусство. Каждый арт-объект, инсталляция или коллекция воспринимается как уникальный, хрупкий и бесценный экспонат, доставленный с особой бережностью.
              </div>

              <div style={{
                marginTop: 32,
                padding: '24px 32px',
                borderLeft: '3px solid #C0392B',
                background: 'rgba(192,57,43,0.06)',
              }}>
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                  fontSize: 'clamp(15px, 2vw, 18px)',
                  color: 'rgba(232,221,208,0.7)',
                  lineHeight: 1.8,
                }}>
                  Витринами будут служить коробки и манекены: платья, украшения, костюмы размещены внутри открытых коробок — будто только что извлечены для осмотра.
                </div>
              </div>
            </div>
          </CrateFrame>
        </Section>

        {/* SECTION 3 — УКРАШЕНИЯ */}
        <Section delay={0.1}>
          <CrateFrame className="mb-20">
            <div style={{ padding: '48px 40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                <ShippingLabel lines={['ГРУЗ №003', 'ЮВЕЛИРНЫЕ УКРАШЕНИЯ']} />
                <StampText text="ЦЕННЫЙ ГРУЗ" color="#C8A060" rotate={1} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
                <div>
                  <div style={{
                    fontFamily: 'Oswald, sans-serif', fontWeight: 600,
                    fontSize: 'clamp(22px, 4vw, 38px)', color: '#E8DDD0',
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                    marginBottom: 20, lineHeight: 1.1,
                  }}>
                    Ювелирные<br />
                    <span style={{ color: '#C0392B' }}>украшения</span>
                  </div>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(15px, 2vw, 18px)',
                    color: 'rgba(232,221,208,0.75)',
                    lineHeight: 1.8,
                  }}>
                    Кольцо «ПОКАЗ 26» — авторское украшение из серебра с эмалью. Брутальная геометрия, выгравированный код. Предмет, который носит историю на пальце.
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <div style={{
                      fontFamily: 'Share Tech Mono, monospace', fontSize: 11,
                      color: 'rgba(200,165,100,0.6)', letterSpacing: '0.15em',
                      marginBottom: 8,
                    }}>
                      АРТИКУЛ: PK26-JWL-001
                    </div>
                    <StampText text="ПОКАЗ 26" color="#C0392B" rotate={-1} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <img src={IMAGES.ring1} alt="Кольцо ПОКАЗ 26" style={{
                      width: '100%', aspectRatio: '3/4', objectFit: 'cover',
                      filter: 'contrast(1.05)',
                      boxShadow: '0 0 0 2px rgba(160,120,60,0.4), 6px 6px 20px rgba(0,0,0,0.7)',
                    }} />
                  </div>
                  <div>
                    <img src={IMAGES.ring2} alt="Кольцо в коробке" style={{
                      width: '100%', aspectRatio: '3/4', objectFit: 'cover',
                      filter: 'contrast(1.05)',
                      boxShadow: '0 0 0 2px rgba(160,120,60,0.4), 6px 6px 20px rgba(0,0,0,0.7)',
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </CrateFrame>
        </Section>

        {/* SECTION 4 — НАЗВАНИЕ */}
        <Section delay={0.1}>
          <CrateFrame className="mb-20">
            <div style={{ padding: '48px 40px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                <ShippingLabel lines={['ГРУЗ №004', 'КОД ОТПРАВЛЕНИЯ']} />
                <StampText text="РАСШИФРОВАТЬ" color="#C0392B" rotate={-1} />
              </div>

              <div style={{
                fontFamily: 'Oswald, sans-serif', fontWeight: 700,
                fontSize: 'clamp(60px, 14vw, 120px)', color: '#C0392B',
                letterSpacing: '-0.02em', lineHeight: 0.9,
                textShadow: '0 0 40px rgba(192,57,43,0.3)',
                marginBottom: 16,
              }}>
                26
              </div>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                fontSize: 'clamp(14px, 1.8vw, 17px)',
                color: 'rgba(200,165,100,0.6)', letterSpacing: '0.2em',
                textTransform: 'uppercase', marginBottom: 48,
              }}>
                Что означает цифра?
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 640, margin: '0 auto' }}>
                {[
                  { num: '01', text: 'Номер партии, отправления или вагона в железнодорожной логистике' },
                  { num: '02', text: 'Порядковый номер выставки в серии' },
                  { num: '03', text: 'Количество художников, объектов или коробок-инсталляций' },
                  { num: '04', text: 'Загадочный код, который зритель может наполнить своим смыслом' },
                ].map((item) => (
                  <div key={item.num} style={{
                    padding: '20px 24px',
                    border: '1px solid rgba(160,120,60,0.3)',
                    background: 'rgba(200,165,100,0.04)',
                    textAlign: 'left',
                  }}>
                    <div style={{
                      fontFamily: 'Share Tech Mono, monospace', fontSize: 11,
                      color: 'rgba(192,57,43,0.7)', letterSpacing: '0.2em', marginBottom: 8,
                    }}>
                      [{item.num}]
                    </div>
                    <div style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: 15, color: 'rgba(232,221,208,0.75)', lineHeight: 1.7,
                    }}>
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CrateFrame>
        </Section>

        {/* SECTION 5 — ЗВУК */}
        <Section delay={0.1}>
          <CrateFrame className="mb-20">
            <div style={{ padding: '48px 40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                <ShippingLabel lines={['ГРУЗ №005', 'ЗВУКОВОЕ СОПРОВОЖДЕНИЕ']} />
                <StampText text="ECHO" color="#8E9BA8" rotate={2} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'Oswald, sans-serif', fontWeight: 500,
                    fontSize: 'clamp(20px, 3.5vw, 34px)', color: '#E8DDD0',
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                    marginBottom: 24, lineHeight: 1.2,
                  }}>
                    Диалог<br />
                    <span style={{ color: '#8E9BA8' }}>эпох</span>
                  </div>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(15px, 2vw, 18px)',
                    color: 'rgba(232,221,208,0.75)',
                    lineHeight: 1.9,
                  }}>
                    Звуковое сопровождение включает отдалённые эхо поездов, скрип дерева, электронные аранжировки — намекая на диалог эпох.
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flexShrink: 0 }}>
                  {['Эхо поездов', 'Скрип дерева', 'Электроника'].map((sound, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40, height: 40,
                        border: '1px solid rgba(142,155,168,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Share Tech Mono, monospace', fontSize: 18,
                        color: 'rgba(142,155,168,0.7)',
                      }}>
                        ◎
                      </div>
                      <div style={{
                        fontFamily: 'Share Tech Mono, monospace', fontSize: 11,
                        color: 'rgba(232,221,208,0.5)', letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                      }}>
                        {sound}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CrateFrame>
        </Section>

        {/* ФИНАЛ — ИТОГ */}
        <Section delay={0.1}>
          <div style={{
            padding: '64px 40px',
            textAlign: 'center',
            borderTop: '1px solid rgba(160,120,60,0.3)',
            borderBottom: '1px solid rgba(160,120,60,0.3)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
              background: '#3d2810', padding: '0 24px',
              fontFamily: 'Share Tech Mono, monospace', fontSize: 10,
              color: 'rgba(200,165,100,0.5)', letterSpacing: '0.2em',
              whiteSpace: 'nowrap',
            }}>
              ◆ ИТОГ ◆
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 48 }}>
              <ArrowUp />
              <ArrowUp />
              <ArrowUp />
            </div>

            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(18px, 3vw, 26px)',
              color: 'rgba(232,221,208,0.85)',
              lineHeight: 1.9, maxWidth: 680, margin: '0 auto',
            }}>
              «Показ 26» — это не просто <em>«выставка»</em> в необычном месте. Это тотальная инсталляция, где контекст (цех), оформление (коробки) и содержание (искусство) сливаются в единое высказывание.
            </div>

            <div style={{
              marginTop: 32,
              fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
              fontSize: 'clamp(15px, 2vw, 19px)',
              color: 'rgba(200,165,100,0.65)',
              lineHeight: 1.8, maxWidth: 560, margin: '32px auto 0',
            }}>
              Высказывание о хрупкости и ценности, который, как хрупкий груз, путешествует через время и пространство, чтобы быть бережно распакованным перед зрителем здесь и сейчас, среди свидетельств индустриальной мощи прошлого.
            </div>

            <div style={{ marginTop: 56, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
              <StampText text="ПОКАЗ" color="#C0392B" rotate={-2} />
              <div style={{
                fontFamily: 'Oswald, sans-serif', fontWeight: 700,
                fontSize: 64, color: '#C0392B', lineHeight: 1,
                textShadow: '0 0 30px rgba(192,57,43,0.4)',
              }}>26</div>
              <StampText text="BRUCE HERMAN" color="#C8A060" rotate={1} />
            </div>

            <div style={{
              marginTop: 40,
              fontFamily: 'Share Tech Mono, monospace', fontSize: 10,
              color: 'rgba(200,165,100,0.35)', letterSpacing: '0.2em',
            }}>
              B/N4-6BABX58 · W7 119.485 · OPEN THIS SIDE · FRAGILE
            </div>
          </div>
        </Section>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @media (max-width: 640px) {
          .grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
