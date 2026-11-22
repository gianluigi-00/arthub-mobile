import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useFonts } from 'expo-font';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Ionicons } from '@expo/vector-icons';
import AuthScreen from './src/screens/AuthScreen';
import { getUserSession, clearUserSession } from './src/api/client';
import { colors, fonts } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Periksa sesi user yang tersimpan di AsyncStorage saat startup
  useEffect(() => {
    async function loadUser() {
      try {
        const session = await getUserSession();
        if (session) {
          setCurrentUser(session);
        }
      } catch (e) {
        console.error('Error saat membaca sesi:', e);
      } finally {
        setIsCheckingAuth(false);
      }
    }
    loadUser();
  }, []);

  // Handler saat login berhasil
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  // Handler saat logout
  const handleLogout = async () => {
    await clearUserSession();
    setCurrentUser(null);
  };

  // Tampilkan splash loader sampai font dan auth check selesai
  if (!fontsLoaded || isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Memuat ArtHub...</Text>
      </View>
    );
  }

  // Tampilkan Layar Home Sementara jika sudah login
  if (currentUser) {
    return (
      <SafeAreaView style={styles.homeContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        
        {/* Header App */}
        <View style={styles.homeHeader}>
          <Text style={styles.homeBrand}>ARTHUB</Text>
          <TouchableOpacity
            style={styles.logoutIconButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>

        {/* Konten Home Placeholder */}
        <View style={styles.homeContent}>
          <View style={styles.homeCard}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={36} color={colors.primary} />
            </View>
            <Text style={styles.welcomeTitle}>LOGIN BERHASIL</Text>
            <Text style={styles.welcomeSubtitle}>
              Selamat datang kembali di ArtHub!
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Email Pengguna:</Text>
              <Text style={styles.infoValue}>
                {currentUser.email || 'user@arthub.com'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={18} color={colors.white} style={{ marginRight: 8 }} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Tampilkan Layar Autentikasi (Login & Sign-Up)
  return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FAF9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: colors.textGray,
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  homeBrand: {
    fontFamily: fonts.bebas,
    fontSize: 28,
    color: colors.primary,
    letterSpacing: 1.5,
  },
  logoutIconButton: {
    padding: 6,
  },
  homeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  homeCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECEBF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontFamily: fonts.bebas,
    fontSize: 26,
    color: colors.textDark,
    letterSpacing: 1,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textGray,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#F7F8FC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    marginBottom: 24,
  },
  infoLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textGray,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    borderRadius: 14,
    height: 48,
    width: '100%',
  },
  logoutButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.white,
  },
});
