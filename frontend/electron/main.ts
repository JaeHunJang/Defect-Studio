import { app, BrowserWindow, Menu, MenuItemConstructorOptions, ipcMain, dialog } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'fs';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win: BrowserWindow | null;

// Electron 창을 생성하는 함수
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    autoHideMenuBar: true, // 메뉴 바 숨기기
    webPreferences: {
      preload: path.join(MAIN_DIST, 'preload.mjs'), // preload 경로 수정
      contextIsolation: true, // context isolation을 추가하여 보안 강화
      nodeIntegration: false // nodeIntegration을 꺼서 보안 강화
    }
  });

  // 메뉴 바를 숨긴 상태에서 단축키만 설정
  const menuTemplate: MenuItemConstructorOptions[] = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'zoomIn',
          accelerator: 'CmdOrCtrl+=' // 줌 인
        },
        {
          role: 'zoomOut',
          accelerator: 'CmdOrCtrl+-' // 줌 아웃
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload',
          accelerator: 'CmdOrCtrl+R' // 새로고침
        },
        {
          role: 'forceReload',
          accelerator: 'CmdOrCtrl+Shift+R' // 강력 새로고침
        },
        {
          role: 'toggleDevTools',
          accelerator: 'CmdOrCtrl+Shift+I' // 개발자 도구 열기/닫기
        }
      ]
    }
  ];

  // 메뉴 설정 및 숨기기
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, '../dist/index.html'));
  }
}

// 모든 창이 닫혔을 때 애플리케이션 종료
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'] // 폴더 선택 가능
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null; // 사용자가 폴더 선택을 취소했을 경우
  }

  return result.filePaths[0]; // 선택된 폴더의 경로 반환
});

async function downloadImage(url: string, filePath: string): Promise<void> {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream' // Download as a stream
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

ipcMain.handle('save-images', async (event, { images, folderPath, format }) => {
  try {
    // 폴더 경로가 유효한지 확인
    if (!fs.existsSync(folderPath)) {
      throw new Error('The folder does not exist.');
    }

    // 각 이미지 URL을 반복하며 다운로드
    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i];
      const filePath = path.join(folderPath, `image_${i + 1}.${format}`);

      // 이미지 다운로드 및 저장
      await downloadImage(imageUrl, filePath);
    }
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: 'An unknown error occurred.' };
    }
  }
});

ipcMain.handle('get-files-in-folder', async (_, folderPath) => {
  try {
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });

    // 파일을 읽고 File-like 객체로 변환하여 반환
    const fileDataPromises = imageFiles.map((fileName) => {
      const filePath = path.join(folderPath, fileName);
      const fileBuffer = fs.readFileSync(filePath);
      const fileData = {
        name: fileName,
        type: 'image/' + path.extname(fileName).slice(1),
        size: fileBuffer.length,
        data: fileBuffer.toString('base64') // base64로 인코딩하여 전송
      };
      return fileData;
    });

    return fileDataPromises; // 파일 데이터 배열 반환
  } catch (error) {
    console.error('Error reading folder:', error);
    return [];
  }
});