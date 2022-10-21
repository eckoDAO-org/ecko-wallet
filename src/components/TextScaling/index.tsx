import React from 'react';

export const TextScaling = ({ text, color = 'black', containerStyle }: { text: string; color?: string; containerStyle?: React.CSSProperties }) => (
  <div style={containerStyle}>
    <svg width="100%" height="100%" viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="170" fontSize="200" fontWeight={600} fill={color}>
        {text}
      </text>
    </svg>
  </div>
);
