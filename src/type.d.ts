export type ProgressSetting = {
  minimum: number;
  easing: 'linear' | string;
  positionUsing: string;
  speed: number;
  trickle: boolean;
  trickleSpeed: number;
  showSpinner: boolean;
  barSelector: string;
  spinnerSelector: string;
  parent: string;
  template: string;
};
