"use client";
import styles from "./CurvedInput.module.css";

type CurvedInputProps = {
  placeholder?: string;
  buttonText?: string;
  theme?: "dark" | "light";
  bend?: number;
  height?: number;
  width?: number;
  onSubmit?: (email: string) => void;
  className?: string;
};

export default function CurvedInput({
  placeholder = "Enter your email",
  buttonText = "Book a Demo",
  theme = "dark",
  bend = 28,
  height = 64,
  width = 450,
  onSubmit,
  className,
}: CurvedInputProps) {
  const r = height / 2;
  const w = width;
  const h = height;

  const path = `M ${r},0 Q ${w / 2},${-bend} ${w - r},0 A ${r},${r} 0 0 1 ${w - r},${h} Q ${w / 2},${h + bend} ${r},${h} A ${r},${r} 0 0 1 ${r},0 Z`;
  const viewBox = `0 ${-bend} ${w} ${h + bend * 2}`;
  const maskSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'><path d='${path}' fill='black'/></svg>`;
  const maskUrl = `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`;

  return (
    <div
      className={`${styles.wrap} ${theme === "light" ? styles.light : styles.dark} ${className ?? ""}`}
      style={{ width, height: h + bend * 2 }}
    >
      <div
        className={styles.shape}
        style={{
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
        <path d={path} fill="none" className={styles.outlinePath} />
      </svg>

      <form
        className={styles.row}
        style={{ height: h }}
        onSubmit={(e) => {
          e.preventDefault();
          const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement)?.value ?? "";
          onSubmit?.(email);
        }}
      >
        <input
          type="email"
          name="email"
          required
          placeholder={placeholder}
          className={styles.input}
        />
        <button type="submit" className={styles.btn}>
          {buttonText}
        </button>
      </form>
    </div>
  );
}
