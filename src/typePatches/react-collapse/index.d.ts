declare module 'react-collapse' {
  import * as React from 'react';
  import { OpaqueConfig } from 'react-motion';

  export interface CollapseProps {
    isOpened: boolean;
    hasNestedCollapse?: boolean;
    fixedHeight?: number;
    springConfig?: OpaqueConfig;
    forceInitialAnimation?: boolean;
    theme?: {collapse?: string, content?: string};
    onRest?: () => void;
    onMeasure?: (measurements: {height: number, width: number}) => void;
    onRender?: (measurements: {current: number, from: number, to: number}) => void;
    style?: React.CSSProperties;
    className?: string;
  }

  export class Collapse extends React.Component<CollapseProps, null> {}
}