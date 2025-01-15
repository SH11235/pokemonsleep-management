import '@testing-library/jest-dom';                 // Jest DOM の型を読み込む
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// Vitest の expect に拡張マッチャーを登録
expect.extend(matchers);
