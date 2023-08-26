import { $ } from '../core/ui';

export const uiBase = document.getElementById('ui') as HTMLDivElement;

export const titleScreen = (onStart: () => void) => [
    $('h1', {}, 'UNTITLED'),
    $('button', { className: 'btn', onclick: onStart, autofocus: true }, 'start'),
];

export const levels = (onclick: () => void) => [
    $('button', { className: 'btn', onclick }, '1'),
];

export const HUD = (onPause: () => void) => [
    $('button', { className: 'btn', onclick: onPause }, 'II'),
];

export const pauseScreen = (onResume: () => void, onLeave: () => void) => [
    $('button', { className: 'btn', onclick: onResume }, 'resume'),
    $('button', { className: 'btn', onclick: onLeave }, 'levels'),
];
