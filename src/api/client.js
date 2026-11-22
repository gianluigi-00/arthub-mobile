import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL XAMPP Backend Lokal (ArtHub)
// Ubah konstanta ini jika IP address jaringan komputer XAMPP berubah
export const BASE_URL = 'http://192.168.18.39/arthub/api';

const USER_SESSION_KEY = '@arthub_user_session';

/**
 * Helper untuk melakukan HTTP POST dengan format application/x-www-form-urlencoded
 * menggunakan URLSearchParams (bukan JSON)
 */
async function postFormUrlEncoded(endpoint, data) {
  try {
    const params = new URLSearchParams();
    Object.keys(data).forEach((key) => {
      const val = data[key];
      if (val !== undefined && val !== null) {
        params.append(key, String(val));
      }
    });

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params.toString(),
    });

    const responseText = await response.text();
    let jsonResult;
    try {
      jsonResult = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        message:
          responseText ||
          `Respons server tidak valid (HTTP ${response.status}). Pastikan backend mengembalikan format JSON.`,
      };
    }

    return jsonResult;
  } catch (error) {
    const isNetworkError =
      error.message &&
      (error.message.includes('Network request failed') ||
        error.message.includes('Failed to fetch'));

    return {
      success: false,
      message: isNetworkError
        ? `Gagal terhubung ke backend di ${BASE_URL}. Pastikan Apache XAMPP aktif dan IP address dapat dijangkau oleh perangkat/emulator.`
        : error.message || 'Terjadi kesalahan jaringan.',
    };
  }
}

/**
 * API Login
 * POST /login.php
 * Body (x-www-form-urlencoded): email, password
 */
export async function loginApi(email, password) {
  return await postFormUrlEncoded('/login.php', {
    email: email.trim(),
    password,
  });
}

/**
 * API Register
 * POST /register.php
 * Body (x-www-form-urlencoded): nama_lengkap, tgl_lahir (YYYY-MM-DD), email, password, no_hp
 */
export async function registerApi({ nama_lengkap, tgl_lahir, email, password, no_hp }) {
  return await postFormUrlEncoded('/register.php', {
    nama_lengkap: nama_lengkap.trim(),
    tgl_lahir,
    email: email.trim(),
    password,
    no_hp: no_hp.trim(),
  });
}

/**
 * Simpan sesi user ke local storage (AsyncStorage)
 */
export async function saveUserSession(userData) {
  try {
    await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
    return true;
  } catch (e) {
    console.error('Gagal menyimpan sesi user:', e);
    return false;
  }
}

/**
 * Ambil sesi user dari local storage (AsyncStorage)
 */
export async function getUserSession() {
  try {
    const data = await AsyncStorage.getItem(USER_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Gagal mengambil sesi user:', e);
    return null;
  }
}

/**
 * Hapus sesi user saat logout
 */
export async function clearUserSession() {
  try {
    await AsyncStorage.removeItem(USER_SESSION_KEY);
    return true;
  } catch (e) {
    console.error('Gagal menghapus sesi user:', e);
    return false;
  }
}

export default {
  BASE_URL,
  loginApi,
  registerApi,
  saveUserSession,
  getUserSession,
  clearUserSession,
};
