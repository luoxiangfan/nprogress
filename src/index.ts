import { defaultSettings } from './settings.js';
import type { ProgressSetting } from './type.js';
import {
  addClass,
  clamp,
  css,
  isHTMLElement,
  queue,
  removeClass,
  removeElement,
  toBarPerc
} from './util.js';

class NProgress {
  settings: ProgressSetting;

  constructor(settings?: ProgressSetting) {
    this.settings = settings || defaultSettings;
  }

  get isRendered(): boolean {
    return !!document.getElementById('nprogress');
  }

  status: number | null = null;
  isStarted: boolean = typeof this.status === 'number';

  configure(options: Partial<ProgressSetting>) {
    const settings = this.settings;
    for (const key in options) {
      const k = key as keyof ProgressSetting;
      const value = options[k];
      if (value && Object.prototype.hasOwnProperty.call(options, key)) {
        (settings[k] as any) = value;
      }
    }
  }

  set(n: number) {
    const started = this.isStarted;
    n = clamp(n, this.settings.minimum, 1);
    this.status = n === 1 ? null : n;

    const progress = this.render(!started)!;
    const bar = progress.querySelector<HTMLElement>(this.settings.barSelector)!;
    const speed = this.settings.speed;
    const ease = this.settings.easing;

    progress.offsetWidth; /* Repaint */

    queue((next: Function) => {
      // Set positionUsing if it hasn't already been set
      if (this.settings.positionUsing === '') {
        this.settings.positionUsing = this.getPositioningCSS();
      }

      // Add transition
      css(bar, this.barPositionCSS(n, speed, ease));

      if (n === 1) {
        // Fade out
        css(progress, {
          transition: 'none',
          opacity: 1
        });
        progress.offsetWidth; /* Repaint */

        setTimeout(() => {
          css(progress, {
            transition: 'all ' + speed + 'ms linear',
            opacity: 0
          });
          setTimeout(() => {
            this.remove();
            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });
  }

  start() {
    if (!this.status) {
      this.set(0);
    }
    var work = () => {
      setTimeout(() => {
        if (!this.status) return;
        this.trickle();
        work();
      }, this.settings.trickleSpeed);
    };
    if (this.settings.trickle) work();
  }

  done(force?: boolean) {
    if (!force && !this.status) return this;
    return this.set(1);
  }

  inc(amount?: number) {
    let n = this.status;
    if (!n) {
      return this.start();
    } else if (n > 1) {
      return;
    } else {
      if (typeof amount !== 'number') {
        if (n >= 0 && n < 0.2) {
          amount = 0.1;
        } else if (n >= 0.2 && n < 0.5) {
          amount = 0.04;
        } else if (n >= 0.5 && n < 0.8) {
          amount = 0.02;
        } else if (n >= 0.8 && n < 0.99) {
          amount = 0.005;
        } else {
          amount = 0;
        }
      }
      n = clamp(n + amount, 0, 0.994);
      return this.set(n);
    }
  }

  private render(fromStart?: boolean) {
    if (this.isRendered) {
      return document.getElementById('nprogress');
    }
    addClass(document.documentElement, 'nprogress-busy');
    const progress = document.createElement('div');
    progress.id = 'nprogress';
    progress.innerHTML = this.settings.template;

    const bar = progress.querySelector<HTMLElement>(this.settings.barSelector)!;
    const perc = fromStart ? '-100' : toBarPerc(this.status || 0);
    const parent = isHTMLElement(this.settings.parent)
      ? this.settings.parent
      : document.querySelector<HTMLElement>(this.settings.parent)!;

    css(bar, {
      transition: 'all 0 linear',
      transform: 'translate3d(' + perc + '%,0,0)'
    });

    if (!this.settings.showSpinner) {
      const spinner = progress.querySelector(this.settings.spinnerSelector);
      removeElement(spinner);
    }

    if (parent != document.body) {
      addClass(parent, 'nprogress-custom-parent');
    }

    parent.appendChild(progress);
    return progress;
  }

  remove() {
    removeClass(document.documentElement, 'nprogress-busy');
    const parent = isHTMLElement(this.settings.parent)
      ? this.settings.parent
      : document.querySelector<HTMLElement>(this.settings.parent)!;
    removeClass(parent, 'nprogress-custom-parent');
    const progress = document.getElementById('nprogress');
    removeElement(progress);
  }

  trickle() {
    return this.inc();
  }

  private barPositionCSS(n: number, speed: number, ease: string) {
    let barCSS: Record<string, any>;

    if (this.settings.positionUsing === 'translate3d') {
      barCSS = { transform: `translate3d(${toBarPerc(n)}%, 0, 0)` };
    } else if (this.settings.positionUsing === 'translate') {
      barCSS = { transform: `translate(${toBarPerc(n)}%, 0)` };
    } else {
      barCSS = { 'margin-left': `${toBarPerc(n)}%` };
    }
    barCSS.transition = `all ${speed}ms ${ease}`;
    return barCSS;
  }

  private getPositioningCSS(): 'translate3d' | 'translate' | 'margin' {
    // Sniff on document.body.style
    const bodyStyle = document.body.style;

    // Sniff prefixes
    const vendorPrefix =
      'WebkitTransform' in bodyStyle
        ? 'Webkit'
        : 'MozTransform' in bodyStyle
          ? 'Moz'
          : 'msTransform' in bodyStyle
            ? 'ms'
            : 'OTransform' in bodyStyle
              ? 'O'
              : '';

    if (vendorPrefix + 'Perspective' in bodyStyle) {
      // Modern browsers with 3D support, e.g. Webkit, IE10
      return 'translate3d';
    } else if (vendorPrefix + 'Transform' in bodyStyle) {
      // Browsers without 3D support, e.g. IE9
      return 'translate';
    } else {
      // Browsers without translate() support, e.g. IE7-8
      return 'margin';
    }
  }

  create(settings: ProgressSetting): NProgress {
    return new NProgress(settings);
  }
}

const nprogress = new NProgress(defaultSettings);

export type { ProgressSetting };

export default nprogress;
