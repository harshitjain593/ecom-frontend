import { useState, useEffect } from 'react';

const UseTypewriterEffect = (texts, speed) => {
    const [displayedText, setDisplayedText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        if (texts.length === 0) return;

        const handleTyping = () => {
            if (charIndex < texts[textIndex].length) {
                setDisplayedText(prev => prev + texts[textIndex][charIndex]);
                setCharIndex(prev => prev + 1);
            } else {
                clearInterval(typingInterval);

                setTimeout(() => {
                    setDisplayedText('');
                    setCharIndex(0);
                    setTextIndex(prev => (prev + 1) % texts.length);
                }, 1000); // Adjust delay between texts here
            }
        };

        const typingInterval = setInterval(handleTyping, speed);

        return () => clearInterval(typingInterval);
    }, [texts, textIndex, charIndex, speed]);

    return displayedText;
};

export default UseTypewriterEffect;
