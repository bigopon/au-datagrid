const fadeKeyframes = [
  { opacity: 0 },
  { opacity: 1 },
];

export function fade(element: HTMLElement, delay: number) {
  element.animate(fadeKeyframes, {
    duration: 400,
    fill: 'backwards',
    delay,
  });
}

export function moveY(element: HTMLElement, distance: number, delay: number) {
  element.animate([
      { transform: `translate(${distance}px)` }, // `translateY(${distance}px)`
      { transform: 'none' },
    ], {
      duration: 500,
      easing: 'ease-in-out',
      fill: 'backwards',
      delay
    });
}

export function moveX(distance: number): Parameters<HTMLElement['animate']> {
  return [[
      { transform: `translate(${distance}px)` }, // `translateX(${distance}px)`
      { transform: 'none' },
    ], {
      duration: 300,
      easing: 'ease-in-out',
    }];
}