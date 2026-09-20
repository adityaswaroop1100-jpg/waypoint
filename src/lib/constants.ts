import { Settings } from '../types';

export const APP_NAME = 'WAYPOINT';
export const HEADER_TAGLINE = 'Know your next move.';
export const PITCH_TAGLINE = "Waypoint doesn't show you your money. It tells you what to do with it.";
export const DISCLAIMER_TEXT = 'Waypoint provides decision support, not investment or financial advice.';

export const BANNED_SHAMING_WORDS = [
  'wasted',
  "shouldn't have",
  'failed',
  'irresponsible',
  'bad decision',
  'you failed',
  'foolish',
  'guilty',
  'careless',
  'bad'
];

export const DEFAULT_SETTINGS: Settings = {
  bufferAmount: 15000,
  dangerBufferAmount: 5000,
  monthlyIncome: 85000,
  currency: '₹',
  mockMode: true,
  userName: 'Aditya',
};

export const PINNED_DEMO_DIP_DATE = '2026-10-27'; // Pinned 27th collision
