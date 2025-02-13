import axiosInstance from '../api/token/axiosInstance';

// model export 함수 (1단계 - taskId얻기)
export const getModelDownload = async (modelName: string) => {
  try {
    const response = await axiosInstance.get(`/model/${modelName}/download`);

    if (response.status === 200) {
      return response.data.task_id;
    } else {
      throw new Error('Failed to get model-file');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get model-file');
  }
};

// model export 함수 (2단계)
export const getTaskStatus = async (task_id: string) => {
  try {
    const response = await axiosInstance.get(`/model/tasks/${task_id}`);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to get task-status');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get task-status');
  }
};
