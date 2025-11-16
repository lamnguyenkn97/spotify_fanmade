declare module 'react-equalizer' {
  import { Component } from 'react';

  interface EqualizerProps {
    bars?: number;
    color?: string;
    height?: number;
    width?: number;
    [key: string]: any;
  }

  export default class Equalizer extends Component<EqualizerProps> {}
}


