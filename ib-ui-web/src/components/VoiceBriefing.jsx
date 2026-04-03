import React, { useState, useEffect } from 'react';
import { Mic, Volume2, Globe, StopCircle } from 'lucide-react';

const VoiceBriefing = ({ data, lang: globalLang, t }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const generateBriefingText = () => {
        if (!data) return globalLang.startsWith('ko') ? "데이터가 없습니다." : "No data available.";
        
        return `${t('voice_briefing_prefix')} ${data.expectedLoss} ${t('currency_label_full')}${t('voice_briefing_infix')} ${data.var95} ${t('currency_label_full')}${t('voice_briefing_suffix').replace('{{riskLevel}}', data.riskLevel)}`;
    };

    const speak = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const text = generateBriefingText();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = globalLang.startsWith('ko') ? 'ko-KR' : 'en-US';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            
            window.speechSynthesis.speak(utterance);
        } else {
            alert('이 브라우저는 음성 합성을 지원하지 않습니다.');
        }
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mic size={16} color="#00f2ff" /> {t('voice_briefing')}
                </span>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>
                    {globalLang === 'ko' ? '한국어 AI' : 'English AI'}
                </span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
                {!isSpeaking ? (
                    <button 
                        onClick={speak}
                        style={{
                            flex: 1,
                            background: 'linear-gradient(45deg, #00f2ff, #7000ff)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <Volume2 size={16} /> {t('start_briefing')}
                    </button>
                ) : (
                    <button 
                        onClick={stop}
                        style={{
                            flex: 1,
                            background: '#ff4b2b',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <StopCircle size={16} /> {t('stop_briefing')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default VoiceBriefing;
