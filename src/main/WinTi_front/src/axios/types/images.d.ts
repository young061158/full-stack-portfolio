declare module '*.svg' {
  import React from 'react';
  const value: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default value;
}

// *.png 파일에 대한 타입 정의
declare module '*.png' {
  const value: string;
  export default value;
}