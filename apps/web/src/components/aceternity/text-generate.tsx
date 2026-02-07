"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextGenerateEffectProps {
    words: string;
    className?: string;
    delay?: number;
}

export function TextGenerateEffect({
    words,
    className,
    delay = 0,
}: TextGenerateEffectProps) {
    const [isVisible, setIsVisible] = useState(false);
    const wordsArray = words.split(" ");

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div className={cn("font-bold", className)}>
            <AnimatePresence>
                {isVisible && (
                    <motion.div className="inline">
                        {wordsArray.map((word, idx) => (
                            <motion.span
                                key={word + idx}
                                className="inline-block"
                                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{
                                    duration: 0.4,
                                    delay: idx * 0.08,
                                    ease: "easeOut",
                                }}
                            >
                                {word}
                                {idx < wordsArray.length - 1 && "\u00A0"}
                            </motion.span>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface TypewriterEffectProps {
    words: string[];
    className?: string;
    cursorClassName?: string;
}

export function TypewriterEffect({
    words,
    className,
    cursorClassName,
}: TypewriterEffectProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const word = words[currentWordIndex];
        if (!word) return; // Guard against undefined

        const timeout = setTimeout(
            () => {
                if (!isDeleting) {
                    if (currentText.length < word.length) {
                        setCurrentText(word.slice(0, currentText.length + 1));
                    } else {
                        setTimeout(() => setIsDeleting(true), 1500);
                    }
                } else {
                    if (currentText.length > 0) {
                        setCurrentText(word.slice(0, currentText.length - 1));
                    } else {
                        setIsDeleting(false);
                        setCurrentWordIndex((prev) => (prev + 1) % words.length);
                    }
                }
            },
            isDeleting ? 50 : 100
        );

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, words, currentWordIndex]);

    return (
        <span className={cn("inline-flex items-center", className)}>
            <span>{currentText}</span>
            <span
                className={cn(
                    "ml-1 inline-block w-[3px] h-[1em] bg-primary-500",
                    "animate-pulse",
                    cursorClassName
                )}
            />
        </span>
    );
}
