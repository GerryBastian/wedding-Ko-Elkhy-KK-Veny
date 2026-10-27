/**
 * Definisi gradien SVG global — dirender sekali di <body>, dipakai oleh
 * semua dekorasi (bunga, segel, mutiara) lewat url(#id).
 */
export function DecorDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        {/* Kelopak mawar burgundy: pangkal gelap → ujung terang */}
        <linearGradient id="petal-wine" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0" stopColor="#2c030b" />
          <stop offset="0.45" stopColor="#6a1226" />
          <stop offset="0.82" stopColor="#9b2840" />
          <stop offset="1" stopColor="#c45569" />
        </linearGradient>
        <linearGradient id="petal-wine-dark" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0" stopColor="#1e0207" />
          <stop offset="0.55" stopColor="#4d0b1b" />
          <stop offset="1" stopColor="#86203a" />
        </linearGradient>
        <linearGradient id="petal-blush" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0" stopColor="#8a3d48" />
          <stop offset="0.5" stopColor="#c27c80" />
          <stop offset="1" stopColor="#efc9c3" />
        </linearGradient>
        <linearGradient id="petal-cream" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0" stopColor="#bba585" />
          <stop offset="0.4" stopColor="#e7dcc8" />
          <stop offset="1" stopColor="#fffdf8" />
        </linearGradient>
        <radialGradient id="rose-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#12010a" stopOpacity="0.95" />
          <stop offset="1" stopColor="#12010a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cream-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#9c8463" stopOpacity="0.8" />
          <stop offset="1" stopColor="#9c8463" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="leaf" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0" stopColor="#3e4c37" />
          <stop offset="0.6" stopColor="#6f8162" />
          <stop offset="1" stopColor="#a6b494" />
        </linearGradient>
        <linearGradient id="leaf-dark" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0" stopColor="#24301f" />
          <stop offset="1" stopColor="#56684a" />
        </linearGradient>
        <radialGradient id="berry" cx="0.35" cy="0.35" r="0.65">
          <stop offset="0" stopColor="#c0566a" />
          <stop offset="0.5" stopColor="#5d0d1e" />
          <stop offset="1" stopColor="#25030a" />
        </radialGradient>
        <radialGradient id="pearl" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#f3ece2" />
          <stop offset="0.85" stopColor="#c9bcae" />
          <stop offset="1" stopColor="#a69888" />
        </radialGradient>
        <radialGradient id="wax" cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#b8394f" />
          <stop offset="0.45" stopColor="#7c1729" />
          <stop offset="0.85" stopColor="#4d0a18" />
          <stop offset="1" stopColor="#33050f" />
        </radialGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7e5b3" />
          <stop offset="0.35" stopColor="#d6b06a" />
          <stop offset="0.6" stopColor="#9c7032" />
          <stop offset="0.85" stopColor="#ebcd8c" />
          <stop offset="1" stopColor="#b3874a" />
        </linearGradient>
        <linearGradient id="satin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a02a43" />
          <stop offset="0.45" stopColor="#5e0f20" />
          <stop offset="0.7" stopColor="#8a2036" />
          <stop offset="1" stopColor="#3d0713" />
        </linearGradient>
        <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1a0207" floodOpacity="0.45" />
        </filter>

        {/* ── Emas tempa 3D: bevel + kilau specular ── */}
        <linearGradient id="gold-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c5a1e" />
          <stop offset="0.18" stopColor="#d9b56a" />
          <stop offset="0.34" stopColor="#f7e3a3" />
          <stop offset="0.5" stopColor="#b8893c" />
          <stop offset="0.68" stopColor="#ecd08e" />
          <stop offset="0.84" stopColor="#9a7230" />
          <stop offset="1" stopColor="#d8b46c" />
        </linearGradient>
        <filter id="gilded" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="bump" />
          <feDiffuseLighting in="bump" surfaceScale="3.2" diffuseConstant="1.05" lightingColor="#ffffff" result="diffuse">
            <feDistantLight azimuth="225" elevation="48" />
          </feDiffuseLighting>
          <feComposite in="SourceGraphic" in2="diffuse" operator="arithmetic" k1="1.15" k2="0" k3="0" k4="0" result="shaded" />
          <feSpecularLighting in="bump" surfaceScale="3.2" specularConstant="1.25" specularExponent="22" lightingColor="#fff4d6" result="spec">
            <feDistantLight azimuth="225" elevation="42" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
          <feComposite in="shaded" in2="specIn" operator="arithmetic" k1="0" k2="1" k3="0.85" k4="0" result="lit" />
          <feDropShadow in="lit" dx="0" dy="2.5" stdDeviation="2.2" floodColor="#2a0a06" floodOpacity="0.55" />
        </filter>

        {/* ── Lilin segel: relief timbul, bagian tengah tertekan ── */}
        <radialGradient id="wax-base" cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#a82c43" />
          <stop offset="0.55" stopColor="#7d1529" />
          <stop offset="1" stopColor="#4c0917" />
        </radialGradient>
        <filter id="wax-relief" x="-15%" y="-15%" width="130%" height="135%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3.2" result="bump" />
          <feDiffuseLighting in="bump" surfaceScale="5" diffuseConstant="1" lightingColor="#ffffff" result="diffuse">
            <feDistantLight azimuth="235" elevation="50" />
          </feDiffuseLighting>
          <feComposite in="SourceGraphic" in2="diffuse" operator="arithmetic" k1="1.2" k2="0" k3="0" k4="0" result="shaded" />
          <feSpecularLighting in="bump" surfaceScale="5" specularConstant="0.9" specularExponent="28" lightingColor="#ffd6dd" result="spec">
            <feDistantLight azimuth="235" elevation="38" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
          <feComposite in="shaded" in2="specIn" operator="arithmetic" k1="0" k2="1" k3="0.7" k4="0" result="lit" />
          <feDropShadow in="lit" dx="0" dy="3" stdDeviation="2.5" floodColor="#1b0207" floodOpacity="0.55" />
        </filter>
        <filter id="wax-emboss" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.9" result="bump" />
          <feSpecularLighting in="bump" surfaceScale="2.2" specularConstant="0.8" specularExponent="18" lightingColor="#ffc9d3" result="spec">
            <feDistantLight azimuth="235" elevation="40" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
          <feOffset in="SourceAlpha" dx="0.8" dy="1" result="off" />
          <feFlood floodColor="#2a030c" floodOpacity="0.7" />
          <feComposite in2="off" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="specIn" />
          </feMerge>
        </filter>
        <filter id="wax-inset" x="-5%" y="-5%" width="110%" height="110%">
          <feOffset in="SourceAlpha" dx="2" dy="2.5" result="off" />
          <feGaussianBlur in="off" stdDeviation="2" result="offBlur" />
          <feComposite in="SourceAlpha" in2="offBlur" operator="out" result="inverse" />
          <feFlood floodColor="#1f0208" floodOpacity="0.75" />
          <feComposite in2="inverse" operator="in" result="innerShadow" />
          <feOffset in="SourceAlpha" dx="-1.5" dy="-1.5" result="offL" />
          <feGaussianBlur in="offL" stdDeviation="1.5" result="offLBlur" />
          <feComposite in="SourceAlpha" in2="offLBlur" operator="out" result="inverseL" />
          <feFlood floodColor="#e47b90" floodOpacity="0.35" />
          <feComposite in2="inverseL" operator="in" result="innerLight" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="innerShadow" />
            <feMergeNode in="innerLight" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
