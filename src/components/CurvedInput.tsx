"use client";
import { Search } from "lucide-react";
import styles from "./CurvedInput.module.css";

type ShadowSize = "none" | "sm" | "md" | "lg";

type CurvedInputProps = {
  placeholder?: string;
  buttonText?: string;
  theme?: "dark" | "light";
  bend?: number;
  height?: number;
  width?: number;
  cornerRadius?: number;
  borderWidth?: number;
  fontSize?: number;
  type?: string;
  showButton?: boolean;
  showIcon?: boolean;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  shadowSize?: ShadowSize;
  onSubmit?: (value: string) => void;
  className?: string;
};

const SHADOW_MAP: Record<ShadowSize, string> = {
  none: "none",
  sm: "0 4px 12px rgba(0,0,0,0.12)",
  md: "0 8px 24px rgba(0,0,0,0.16)",
  lg: "0 16px 40px rgba(0,0,0,0.22)",
};

const THEME_DEFAULTS = {
  dark: {
    background: "rgba(255,255,255,0.07)",
    text: "#ffffff",
    border: "rgba(255,255,255,0.28)",
    buttonBg: "rgba(255,255,255,0.14)",
    buttonBorder: "rgba(255,255,255,0.35)",
    buttonText: "#ffffff",
  },
  light: {
    background: "rgba(10,14,24,0.06)",
    text: "#09090b",
    border: "rgba(10,14,24,0.16)",
    buttonBg: "rgba(10,14,24,0.9)",
    buttonBorder: "rgba(10,14,24,0.2)",
    buttonText: "#ffffff",
  },
} as const;

export default function CurvedInput({
  placeholder = "Enter your email",
  buttonText = "Submit",
  theme = "dark",
  bend = 0,
  height = 56,
  width = 420,
  cornerRadius = 999,
  borderWidth = 1,
  fontSize = 15,
  type = "email",
  showButton = true,
  showIcon = false,
  backgroundColor,
  textColor,
  borderColor,
  buttonColor,
  buttonTextColor,
  shadowSize = "none",
  onSubmit,
  className,
}: CurvedInputProps) {
  const t = THEME_DEFAULTS[theme];
  const bg = backgroundColor ?? t.background;
  const fg = textColor ?? t.text;
  const strokeColor = borderColor ?? t.border;
  const btnBg = buttonColor ?? t.buttonBg;
  const btnFg = buttonTextColor ?? t.buttonText;
  const isCurved = bend !== 0;

  const r = height / 2;
  const w = width;
  const h = height;

  // Bent capsule path — top/bottom edges bow outward by `bend` px.
  const path = `M ${r},0 Q ${w / 2},${-bend} ${w - r},0 A ${r},${r} 0 0 1 ${w - r},${h} Q ${w / 2},${h + bend} ${r},${h} A ${r},${r} 0 0 1 ${r},0 Z`;
  const viewBox = `0 ${-bend} ${w} ${h + bend * 2}`;
  const maskSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'><path d='${path}' fill='black'/></svg>`;
  const maskUrl = `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`;

  return (
    <div
      className={`${styles.wrap} ${className ?? ""}`}
      style={{
        width,
        height: isCurved ? h + bend * 2 : h,
        filter: shadowSize !== "none" ? `drop-shadow(${SHADOW_MAP[shadowSize]})` : undefined,
      }}
    >
      {isCurved ? (
        <>
          <div
            className={styles.shape}
            style={{
              background: bg,
              WebkitMaskImage: maskUrl,
              maskImage: maskUrl,
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
            aria-hidden="true"
          />
          <svg
            className={styles.outline}
            width="100%"
            height="100%"
            viewBox={viewBox}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={path} fill="none" stroke={strokeColor} strokeWidth={borderWidth} />
          </svg>
        </>
      ) : (
        <div
          className={styles.flatShape}
          style={{
            background: bg,
            border: `${borderWidth}px solid ${strokeColor}`,
            borderRadius: cornerRadius,
          }}
          aria-hidden="true"
        />
      )}

      <form
        className={styles.row}
        style={{ height: h }}
        onSubmit={(e) => {
          e.preventDefault();
          const value = (e.currentTarget.elements.namedItem("field") as HTMLInputElement)?.value ?? "";
          onSubmit?.(value);
        }}
      >
        {showIcon && (
          <Search size={16} className={styles.icon} style={{ color: fg }} aria-hidden="true" />
        )}
        <input
          type={type}
          name="field"
          required
          placeholder={placeholder}
          className={styles.input}
          style={{ color: fg, fontSize }}
        />
        {showButton && (
          <button
            type="submit"
            className={styles.btn}
            style={{
              background: btnBg,
              color: btnFg,
              borderColor: buttonColor ? btnBg : t.buttonBorder,
              borderWidth,
              borderRadius: isCurved ? 999 : cornerRadius,
              fontSize: Math.max(fontSize - 1, 12),
            }}
          >
            {buttonText}
          </button>
        )}
      </form>
    </div>
  );
}
