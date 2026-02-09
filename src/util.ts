export const isArray: typeof Array.isArray = Array.isArray;

export const isFunction = (val: unknown): val is Function => typeof val === 'function';

export const isHTMLElement = (val: unknown): val is HTMLElement => val instanceof HTMLElement;

export const isDOM = (obj: any) => {
  if (typeof HTMLElement === 'object') {
    return obj instanceof HTMLElement;
  }
  return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
};

export const clamp = (n: number, min: number, max: number) => {
  if (n < min) return min;
  if (n > max) return max;
  return n;
};

export const toBarPerc = (n: number) => {
  return (-1 + n) * 100;
};

export const camelCase = (string: string) => {
  return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function (_, letter) {
    return letter.toUpperCase();
  });
};

export const classList = (element: HTMLElement) => {
  return (' ' + ((element && element.className) || '') + ' ').replace(/\s+/gi, ' ');
};

export const queue = (() => {
  const pending: Function[] = [];
  const next = () => {
    const fn = pending.shift();
    isFunction(fn) && fn(next);
  };
  return (fn: Function) => {
    pending.push(fn);
    if (pending.length == 1) next();
  };
})();

export const css = (() => {
  const cssPrefixes = ['Webkit', 'O', 'Moz', 'ms'];
  const cssProps: Record<string, any> = {};
  const getVendorProp = (name: string) => {
    const style = document.body.style;
    if (name in style) return name;
    let i = cssPrefixes.length;
    const capName = name.charAt(0).toUpperCase() + name.slice(1);
    while (i--) {
      const vendorName = cssPrefixes[i] + capName;
      if (vendorName in style) return vendorName;
    }
    return name;
  };

  const getStyleProp = (name: string) => {
    name = camelCase(name);
    return cssProps[name] || (cssProps[name] = getVendorProp(name));
  };

  const applyCss = (element: HTMLElement, prop: string, value: unknown) => {
    const styleName = getStyleProp(prop);
    (element.style as any)[styleName] = value;
  };

  return (element: HTMLElement, properties: Record<string, any>) => {
    for (const prop in properties) {
      const value = properties[prop];
      if (value !== undefined && Object.prototype.hasOwnProperty.call(properties, prop)) {
        applyCss(element, prop, value);
      }
    }
  };
})();

export const hasClass = (element: string | HTMLElement, name: string) => {
  const list = typeof element == 'string' ? element : classList(element);
  return list.indexOf(' ' + name + ' ') >= 0;
};

export const addClass = (element: HTMLElement, name: string) => {
  const oldList = classList(element);
  if (hasClass(oldList, name)) return;
  const newList = oldList + name;
  // Trim the opening space.
  element.className = newList.substring(1);
};

export const removeClass = (element: HTMLElement, name: string) => {
  const oldList = classList(element);
  if (!hasClass(element, name)) return;
  // Replace the class name.
  const newList = oldList.replace(' ' + name + ' ', ' ');
  // Trim the opening and closing spaces.
  element.className = newList.substring(1, newList.length - 1);
};

export const removeElement = (element: HTMLElement | Element | null) => {
  element?.parentNode?.removeChild(element);
};
