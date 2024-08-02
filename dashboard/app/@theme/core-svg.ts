import {NbIcons, NbSvgIcon} from "@nebular/theme";
import {NbEvaSvgIcon} from "@nebular/eva-icons";
import classnames from 'classnames/dedupe';
import {NbIcon} from "@nebular/theme/components/icon/icon";

const defaultAnimationOptions = {
  hover: true,
};

const isString = (value: any) => typeof value === 'string' || value instanceof String;

class Icon {
  constructor(protected name: string, protected contents: string, protected attrs: {[key: string]: any} = {}) {
    this.name = name;
    this.contents = contents;
    this.attrs = Object.assign({
        "xmlns": "http://www.w3.org/2000/svg",
        "width": 24,
        "height": 24,
        "viewBox": "0 0 24 24",
        class: `op-${name}`
    },attrs);
  }

  toSvg(attrs: any) {
    const { animation, ...remAttrs } = attrs;
    const animationOptions = getAnimationOptions(animation);
    const animationClasses = animationOptions ? animationOptions.class : '';
    const combinedAttrs = {
      ...this.attrs,
      ...remAttrs,
      ...{ class: classnames(this.attrs.class, attrs.class, animationClasses) },
    };
    const svg = `<svg ${attrsToString(combinedAttrs)}>${this.contents}</svg>`;
    return !!animationOptions ? animationOptions.hover ? `<i class="eva-hover">${svg}</i>` : svg : svg;
  }

  toString() {
    return this.contents;
  }
}

function getAnimationOptions(animation: any) {
  if (!animation) {
    return null;
  }

  if (animation.hover) {
    animation.hover = isString(animation.hover) ? JSON.parse(animation.hover) : animation.hover;
  }

  const mergedAnimationOptions = {
    ...defaultAnimationOptions,
    ...animation,
  };
  const animationType = mergedAnimationOptions.hover ?
    `eva-icon-hover-${mergedAnimationOptions.type}` :
    `eva-icon-${mergedAnimationOptions.type}`;
  mergedAnimationOptions.class = classnames(
    {
      'eva-animation': true,
      'eva-infinite': isString(animation.infinite) ? JSON.parse(animation.infinite) : animation.infinite,
    },
    animationType,
  );

  return mergedAnimationOptions;
}

function attrsToString(attrs: {[key: string]: any}) {
  return Object.keys(attrs)
    .map(key => `${key}="${attrs[key]}"`)
    .join(' ');
}

const defaultIcons = {
  "op-cover": new Icon("op-cover", "<path d=\"M18.7 3H5.3C4 3 3 4 3 5.3v13.4C3 20 4 21 5.3 21h13.4c1.3 0 2.3-1 2.3-2.3V5.3C21 4 20 3 18.7 3zm.8 15.7c0 .4-.4.8-.8.8H5.3c-.4 0-.8-.4-.8-.8V5.3c0-.4.4-.8.8-.8h6.2v8.9l2.5-3.1 2.5 3.1V4.5h2.2c.4 0 .8.4.8.8v13.4z\"></path>"),
  "op-group": new Icon("op-group", "<path d=\"M18 4h-7c-1.1 0-2 .9-2 2v3H6c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2v-3h3c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-4.5 14c0 .3-.2.5-.5.5H6c-.3 0-.5-.2-.5-.5v-7c0-.3.2-.5.5-.5h3V13c0 1.1.9 2 2 2h2.5v3zm0-4.5H11c-.3 0-.5-.2-.5-.5v-2.5H13c.3 0 .5.2.5.5v2.5zm5-.5c0 .3-.2.5-.5.5h-3V11c0-1.1-.9-2-2-2h-2.5V6c0-.3.2-.5.5-.5h7c.3 0 .5.2.5.5v7z\"></path>"),
  "op-heading": new Icon("op-heading", "<path d=\"M6 5V18.5911L12 13.8473L18 18.5911V5H6Z\"></path>"),
  "op-rss": new Icon("op-rss", "<path d=\"M5 10.2h-.8v1.5H5c1.9 0 3.8.8 5.1 2.1 1.4 1.4 2.1 3.2 2.1 5.1v.8h1.5V19c0-2.3-.9-4.5-2.6-6.2-1.6-1.6-3.8-2.6-6.1-2.6zm10.4-1.6C12.6 5.8 8.9 4.2 5 4.2h-.8v1.5H5c3.5 0 6.9 1.4 9.4 3.9s3.9 5.8 3.9 9.4v.8h1.5V19c0-3.9-1.6-7.6-4.4-10.4zM4 20h3v-3H4v3z\"></path>"),
  "op-gallery": new Icon("op-gallery", "<path d=\"M16.375 4.5H4.625a.125.125 0 0 0-.125.125v8.254l2.859-1.54a.75.75 0 0 1 .68-.016l2.384 1.142 2.89-2.074a.75.75 0 0 1 .874 0l2.313 1.66V4.625a.125.125 0 0 0-.125-.125Zm.125 9.398-2.75-1.975-2.813 2.02a.75.75 0 0 1-.76.067l-2.444-1.17L4.5 14.583v1.792c0 .069.056.125.125.125h11.75a.125.125 0 0 0 .125-.125v-2.477ZM4.625 3C3.728 3 3 3.728 3 4.625v11.75C3 17.273 3.728 18 4.625 18h11.75c.898 0 1.625-.727 1.625-1.625V4.625C18 3.728 17.273 3 16.375 3H4.625ZM20 8v11c0 .69-.31 1-.999 1H6v1.5h13.001c1.52 0 2.499-.982 2.499-2.5V8H20Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path>"),
  "op-pages": new Icon("op-pages", "<path d=\"M14.5 5.5h-7V7h7V5.5ZM7.5 9h7v1.5h-7V9Zm7 3.5h-7V14h7v-1.5Z\"></path><path d=\"M16 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM6 3.5h10a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5Z\"></path><path d=\"M20 8v11c0 .69-.31 1-.999 1H6v1.5h13.001c1.52 0 2.499-.982 2.499-2.5V8H20Z\"></path>"),
  "op-articles": new Icon("op-articles", "<path d=\"M18 5.5H6a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5ZM6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm1 5h1.5v1.5H7V9Zm1.5 4.5H7V15h1.5v-1.5ZM10 9h7v1.5h-7V9Zm7 4.5h-7V15h7v-1.5Z\"></path>"),
  "op-media-text": new Icon("op-media-text", "<path d=\"M3 6v11.5h8V6H3Zm11 3h7V7.5h-7V9Zm7 3.5h-7V11h7v1.5ZM14 16h7v-1.5h-7V16Z\"></path>"),
}


export const createCoreIcons = (icons: {[key: string]: string} = {}): NbIcons => {
  let fullIcons: {[key: string]: Icon} = {...defaultIcons};
  for (let key in icons) {
    fullIcons['op-' + key] = new Icon('op-' + key, icons[key]);
  }
  const s = Object
    .entries<Icon>(fullIcons)
    .map(([name, icon]) => {
      return [name, new NbEvaSvgIcon(name, icon)] as [string, NbSvgIcon];
    })
    .reduce<{[key: string]: NbIcon | string }>((newIcons, [name, icon]: [string, NbSvgIcon]) => {
      newIcons[name] = icon;
      return newIcons;
    }, {});
  console.log(s);
  return s;
}
