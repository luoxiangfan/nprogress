type ProgressSetting = {
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

declare class NProgress {
    settings: ProgressSetting;
    constructor(settings?: ProgressSetting);
    get isRendered(): boolean;
    status: number | null;
    isStarted: boolean;
    configure(options: Partial<ProgressSetting>): void;
    set(n: number): void;
    start(): void;
    done(force?: boolean): void | this;
    inc(amount?: number): void;
    private render;
    remove(): void;
    trickle(): void;
    private barPositionCSS;
    private getPositioningCSS;
    create(settings: ProgressSetting): NProgress;
}
declare const nprogress: NProgress;

export { type ProgressSetting, nprogress as default };