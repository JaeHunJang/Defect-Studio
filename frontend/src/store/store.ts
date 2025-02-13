import { configureStore } from '@reduxjs/toolkit';
import levelSlice from './slices/levelSlice';
import themeSlice from './slices/themeSlice';
import txt2ImgSlice from './slices/generation/txt2ImgSlice';
import img2ImgSlice from './slices/generation/img2ImgSlice';
import inpaintingSlice from './slices/generation/inpaintingSlice';
import removeBgSlice from './slices/generation/removeBgSlice';
import cleanupSlice from './slices/generation/cleanupSlice';
import generatedOutputSlice from './slices/generation/outputSlice';
import userInfoSlice from './slices/userInfoSlice';
import trainingSlice from './slices/training/trainingSlice';
import settingsSlice from './slices/settings/settingsSlice';
import historySlice from './slices/history/historySlice';
import trainingOutputSlice from './slices/training/outputSlice';
import modelSlice from './slices/model/modelSlice';

const store = configureStore({
  reducer: {
    level: levelSlice,
    theme: themeSlice,
    txt2Img: txt2ImgSlice,
    img2Img: img2ImgSlice,
    inpainting: inpaintingSlice,
    removeBg: removeBgSlice,
    cleanup: cleanupSlice,
    generatedOutput: generatedOutputSlice,
    history: historySlice,
    userInfo: userInfoSlice,
    training: trainingSlice,
    settings: settingsSlice,
    trainingOutput: trainingOutputSlice,
    model: modelSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
