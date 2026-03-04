import apiClient from './config';
import type {
  AuthResponse, 
  CatsResponse, 
  ApplicationsResponse, 
  ImagesResponse,
  User,
  Application,
  Cat
} from '../types';

export const authAPI = {
  signup: (name: string, email: string, password: string, role: string) =>
    apiClient.post<AuthResponse>('/signup.php', { name, email, password, role }),

  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/login.php', { email, password }),

  logout: () =>
    apiClient.post('/logout.php'),

  getCurrentUser: () =>
    apiClient.get<User>('/me.php'),

  getUser: (userId: number) =>
    apiClient.get<User>(`/users.php?id=${userId}`),
};

export const catAPI = {
  getAllCats: () =>
    apiClient.get<CatsResponse>('/cats.php'),

  getCatById: (catId: number) =>
    apiClient.get<Cat>(`/cats.php?id=${catId}`),

  createCat: (catData: Partial<Cat>) =>
    apiClient.post<Cat>('/cats.php', catData),

  updateCat: (catId: number, catData: Partial<Cat>) =>
    apiClient.put<Cat>(`/cats.php?id=${catId}`, catData),

  deleteCat: (catId: number) =>
    apiClient.delete(`/cats.php?id=${catId}`),
};

export const applicationAPI = {
  applyForCat: (catId: number, appData: Partial<Application>) =>
    apiClient.post<Application>('/apply-cat.php', { cat_id: catId, ...appData }),

  getMyApplications: () =>
    apiClient.get<ApplicationsResponse>('/my-applications.php'),

  getMyApplication: (appId: number) =>
    apiClient.get<Application>(`/my-application.php?id=${appId}`),

  getCatApplications: (catId: number) =>
    apiClient.get<ApplicationsResponse>(`/applications.php?cat_id=${catId}`),

  getApplicationById: (appId: number) =>
    apiClient.get<Application>(`/application.php?id=${appId}`),
};

export const imageAPI = {
  uploadImage: (catId: number, imageUrl: string) =>
    apiClient.post<any>('/upload-image.php', { cat_id: catId, image_url: imageUrl }),

  getCatImages: (catId: number) =>
    apiClient.get<ImagesResponse>(`/upload-image.php?cat_id=${catId}`),
};
