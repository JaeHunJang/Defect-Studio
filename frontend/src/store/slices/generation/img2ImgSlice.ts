import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Img2ImgState {
  model: string;
  scheduler: string;
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  samplingSteps: number;
  guidanceScale: number;
  strength: number;
  seed: number;
  isRandomSeed: boolean;
  batchCount: number;
  batchSize: number;
  images: string[]; // 초기 이미지 배열
  inputPath: string;
  outputPath: string;
  isNegativePrompt: boolean;
  outputImgUrls: string[]; // 생성된 이미지 배열
  clipResult: string;
}

const initialState: Img2ImgState = {
  model: 'CompVis/stable-diffusion-v1-4',
  scheduler: 'DPM++ 2M',
  prompt: '',
  negativePrompt: '',
  width: 512,
  height: 512,
  samplingSteps: 50,
  guidanceScale: 7.5,
  strength: 0.75,
  seed: -1,
  isRandomSeed: false, // 기본값: 랜덤 시드 비활성화
  batchCount: 1,
  batchSize: 1,
  images: [],
  inputPath: '',
  outputPath: '',
  isNegativePrompt: false, // 기본값: 네거티브 프롬프트 비활성화
  outputImgUrls: [],
  clipResult: ''
};

const img2ImgSlice = createSlice({
  name: 'img2Img',
  initialState,
  reducers: {
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
    setScheduler: (state, action: PayloadAction<string>) => {
      state.scheduler = action.payload;
    },
    setPrompt: (state, action: PayloadAction<string>) => {
      state.prompt = action.payload;
    },
    setNegativePrompt: (state, action: PayloadAction<string>) => {
      state.negativePrompt = action.payload;
    },
    setWidth: (state, action: PayloadAction<number>) => {
      state.width = action.payload;
    },
    setHeight: (state, action: PayloadAction<number>) => {
      state.height = action.payload;
    },
    setSamplingSteps: (state, action: PayloadAction<number>) => {
      state.samplingSteps = action.payload;
    },
    setGuidanceScale: (state, action: PayloadAction<number>) => {
      state.guidanceScale = action.payload;
    },
    setStrength: (state, action: PayloadAction<number>) => {
      state.strength = action.payload;
    },
    setSeed: (state, action: PayloadAction<number>) => {
      state.seed = action.payload;
    },
    setIsRandomSeed: (state, action: PayloadAction<boolean>) => {
      state.isRandomSeed = action.payload;
      if (state.isRandomSeed) {
        state.seed = -1;
      }
    },
    setIsNegativePrompt: (state, action: PayloadAction<boolean>) => {
      state.isNegativePrompt = action.payload;
      if (!state.isNegativePrompt) {
        state.negativePrompt = ''; // 네거티브 프롬프트 비활성화 시 초기화
      }
    },
    setBatchCount: (state, action: PayloadAction<number>) => {
      state.batchCount = action.payload;
    },
    setBatchSize: (state, action: PayloadAction<number>) => {
      state.batchSize = action.payload;
    },
    setImages: (state, action: PayloadAction<string[]>) => {
      state.images = action.payload;
    },
    setInputPath: (state, action: PayloadAction<string>) => {
      state.inputPath = action.payload;
    },
    setOutputPath: (state, action: PayloadAction<string>) => {
      state.outputPath = action.payload;
    },
    setOutputImgUrls: (state, action: PayloadAction<string[]>) => {
      state.outputImgUrls = action.payload;
    },
    setClipResult: (state, action: PayloadAction<string>) => {
      state.clipResult = action.payload;
    }
  }
});

export const {
  setModel,
  setScheduler,
  setPrompt,
  setNegativePrompt,
  setWidth,
  setHeight,
  setSamplingSteps,
  setGuidanceScale,
  setStrength,
  setSeed,
  setIsRandomSeed,
  setIsNegativePrompt,
  setBatchCount,
  setBatchSize,
  setImages,
  setInputPath,
  setOutputPath,
  setOutputImgUrls,
  setClipResult
} = img2ImgSlice.actions;

export default img2ImgSlice.reducer;