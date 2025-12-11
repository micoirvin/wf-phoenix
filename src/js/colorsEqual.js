import gsap from 'gsap';

export const colorsEqual = (c1, c2) => {
  let sc1 = gsap.utils.splitColor(c1);
  let sc2 = gsap.utils.splitColor(c2);
  console.log(sc1, sc2);
  return sc1.every((val, i) => val === sc2[i]);
};
