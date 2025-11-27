import { SchoolData } from './types';

// 定数はスプレッドシート管理に移行しました。
// 初期値が必要な場合のフォールバックデータ定義
export const DEFAULT_RANKS = ['S1', 'S2', 'S3', 'S4', 'なし'];
// ユーザー要望により結果定義を変更: S1~S4, なし=合格, ×=辞退
export const DEFAULT_RESULTS = ['未定', '保留', 'S1', 'S2', 'S3', 'S4', 'なし', '×'];
export const DEFAULT_PROSPECTS = ['○', '×', '未定'];
export const DEFAULT_TARGET = 30;