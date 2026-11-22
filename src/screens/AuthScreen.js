import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';
import { loginApi, registerApi } from '../api/client';

const { width } = Dimensions.get('window');

export default function AuthScreen({ onLoginSuccess }) {
  // Tab state: 'login' | 'register'
  const [activeTab, setActiveTab] = useState('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [registerFullName, setRegisterFullName] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerPhone, setRegisterPhone] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Date of birth input refs for auto-focus
  const dobDayRef = useRef(null);
  const dobMonthRef = useRef(null);
  const dobYearRef = useRef(null);

  // Handle Tab Switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Validation checks
  const isLoginFormValid =
    loginEmail.trim().length > 0 && loginPassword.trim().length > 0;

  const isRegisterFormValid =
    registerFullName.trim().length > 0 &&
    dobDay.trim().length === 2 &&
    dobMonth.trim().length === 2 &&
    dobYear.trim().length === 4 &&
    registerEmail.trim().length > 0 &&
    registerPassword.trim().length > 0 &&
    registerPhone.trim().length > 0;

  // Handle Login Submit
  const handleLogin = async () => {
    if (!isLoginFormValid || loading) return;
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await loginApi(loginEmail, loginPassword);
      if (result.success) {
        if (onLoginSuccess) {
          onLoginSuccess({ email: loginEmail.trim(), ...result });
        }
      } else {
        setErrorMessage(result.message || 'Login gagal. Periksa email dan password.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegister = async () => {
    if (!isRegisterFormValid || loading) return;
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Format YYYY-MM-DD
    const formattedDob = `${dobYear.trim()}-${dobMonth.trim().padStart(2, '0')}-${dobDay.trim().padStart(2, '0')}`;

    try {
      const result = await registerApi({
        nama_lengkap: registerFullName,
        tgl_lahir: formattedDob,
        email: registerEmail,
        password: registerPassword,
        no_hp: registerPhone,
      });

      if (result.success) {
        // Otomatis pindah ke tab Login dengan email sudah terisi
        setActiveTab('login');
        setLoginEmail(registerEmail);
        setLoginPassword('');
        setSuccessMessage(
          result.message || 'Akun berhasil dibuat. Silakan login.'
        );
        // Reset form register
        setRegisterFullName('');
        setDobDay('');
        setDobMonth('');
        setDobYear('');
        setRegisterPassword('');
        setRegisterPhone('');
      } else {
        setErrorMessage(
          result.message || 'Pendaftaran akun gagal. Silakan coba lagi.'
        );
      }
    } catch (err) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat pendaftaran.');
    } finally {
      setLoading(false);
    }
  };

  // Back button handler
  const handleBack = () => {
    if (activeTab === 'register') {
      handleTabChange('login');
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.headerWaveDark} translucent />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Bergelombang 3 Lapis Ungu */}
          <View style={styles.headerContainer}>
            {/* Base Gradient Header */}
            <LinearGradient
              colors={[colors.headerWaveDark, colors.headerWaveMid, colors.headerWaveLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Lapisan Gelombang 1 (Gelap) */}
            <View style={styles.waveLayerDark} />

            {/* Lapisan Gelombang 2 (Tengah) */}
            <View style={styles.waveLayerMid} />

            {/* Lapisan Gelombang 3 (Terang) */}
            <View style={styles.waveLayerLight} />

            {/* Tombol Back (Kotak rounded outline putih) */}
            <View style={styles.headerTopBar}>
              <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.7}
                onPress={handleBack}
              >
                <Ionicons name="chevron-back" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>

            {/* Header Titles */}
            <View style={styles.headerTextWrapper}>
              <Text style={styles.headerTitle}>
                {activeTab === 'login'
                  ? 'WELCOME BACK!\nGLAD TO SEE YOU, AGAIN!'
                  : 'WELCOME MATE!\nLETS START TO NEW EXPERIENCE!'}
              </Text>
              <Text style={styles.headerSubtitle}>
                Discover and book your favorite concerts, theater, and art exhibitions.
              </Text>
            </View>
          </View>

          {/* Panel Putih dengan Sudut Lengkung Atas 44 */}
          <View style={styles.bottomCard}>
            {/* Tab Toggle Pill ("Sign-Up" | "Login") */}
            <View style={styles.tabContainerWrapper}>
              <View style={styles.tabContainer}>
                {/* Tab Sign-Up */}
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === 'register' && styles.tabButtonActive,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleTabChange('register')}
                >
                  {activeTab !== 'register' && (
                    <LinearGradient
                      colors={[colors.tabInactiveGradientStart, colors.tabInactiveGradientEnd]}
                      style={StyleSheet.absoluteFillObject}
                    />
                  )}
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'register'
                        ? styles.tabTextActive
                        : styles.tabTextInactive,
                    ]}
                  >
                    Sign-Up
                  </Text>
                </TouchableOpacity>

                {/* Tab Login */}
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === 'login' && styles.tabButtonActive,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleTabChange('login')}
                >
                  {activeTab !== 'login' && (
                    <LinearGradient
                      colors={[colors.tabInactiveGradientStart, colors.tabInactiveGradientEnd]}
                      style={StyleSheet.absoluteFillObject}
                    />
                  )}
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'login'
                        ? styles.tabTextActive
                        : styles.tabTextInactive,
                    ]}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Banner Pesan Error */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color={colors.error}
                  style={styles.bannerIcon}
                />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Banner Pesan Sukses */}
            {successMessage ? (
              <View style={styles.successBanner}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.success}
                  style={styles.bannerIcon}
                />
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            {/* FORM LOGIN */}
            {activeTab === 'login' ? (
              <View style={styles.formContainer}>
                {/* Input Your email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your email</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={colors.placeholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      placeholder="Enter your email"
                      placeholderTextColor={colors.placeholder}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={loginEmail}
                      onChangeText={setLoginEmail}
                    />
                  </View>
                </View>

                {/* Input Your password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={colors.placeholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      placeholder="Enter your password"
                      placeholderTextColor={colors.placeholder}
                      secureTextEntry={!showLoginPassword}
                      autoCapitalize="none"
                      value={loginPassword}
                      onChangeText={setLoginPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowLoginPassword(!showLoginPassword)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.eyeIconButton}
                    >
                      <Ionicons
                        name={showLoginPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={colors.placeholder}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Tombol Login */}
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    isLoginFormValid ? styles.buttonActive : styles.buttonDisabled,
                  ]}
                  disabled={!isLoginFormValid || loading}
                  activeOpacity={0.8}
                  onPress={handleLogin}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text style={styles.primaryButtonText}>Login</Text>
                  )}
                </TouchableOpacity>

                {/* Pemisah "Or Login with" */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Or Login with</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* 3 Tombol Kotak Icon Sosial */}
                <View style={styles.socialRow}>
                  <TouchableOpacity
                    style={styles.socialButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="logo-facebook" size={22} color="#1877F2" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="logo-google" size={22} color="#EA4335" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="logo-apple" size={24} color="#000000" />
                  </TouchableOpacity>
                </View>

                {/* Footer Switch to Sign-Up */}
                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => handleTabChange('register')}>
                    <Text style={styles.footerLink}>Sign Up Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* FORM SIGN-UP */
              <View style={styles.formContainer}>
                {/* Input Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={colors.placeholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      placeholder="Enter your full name"
                      placeholderTextColor={colors.placeholder}
                      value={registerFullName}
                      onChangeText={setRegisterFullName}
                    />
                  </View>
                </View>

                {/* 3 Kotak Tanggal Lahir (DD, MM, YYYY) */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Date of Birth</Text>
                  <View style={styles.dobRow}>
                    {/* Kotak DD */}
                    <View style={styles.dobInputWrapper}>
                      <TextInput
                        ref={dobDayRef}
                        style={styles.dobInput}
                        placeholder="DD"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="numeric"
                        maxLength={2}
                        value={dobDay}
                        onChangeText={(val) => {
                          const sanitized = val.replace(/[^0-9]/g, '');
                          setDobDay(sanitized);
                          if (sanitized.length === 2) {
                            dobMonthRef.current?.focus();
                          }
                        }}
                      />
                    </View>

                    {/* Kotak MM */}
                    <View style={styles.dobInputWrapper}>
                      <TextInput
                        ref={dobMonthRef}
                        style={styles.dobInput}
                        placeholder="MM"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="numeric"
                        maxLength={2}
                        value={dobMonth}
                        onChangeText={(val) => {
                          const sanitized = val.replace(/[^0-9]/g, '');
                          setDobMonth(sanitized);
                          if (sanitized.length === 2) {
                            dobYearRef.current?.focus();
                          }
                        }}
                        onKeyPress={({ nativeEvent }) => {
                          if (nativeEvent.key === 'Backspace' && dobMonth === '') {
                            dobDayRef.current?.focus();
                          }
                        }}
                      />
                    </View>

                    {/* Kotak YYYY */}
                    <View style={[styles.dobInputWrapper, styles.dobYearWrapper]}>
                      <TextInput
                        ref={dobYearRef}
                        style={styles.dobInput}
                        placeholder="YYYY"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="numeric"
                        maxLength={4}
                        value={dobYear}
                        onChangeText={(val) => {
                          const sanitized = val.replace(/[^0-9]/g, '');
                          setDobYear(sanitized);
                        }}
                        onKeyPress={({ nativeEvent }) => {
                          if (nativeEvent.key === 'Backspace' && dobYear === '') {
                            dobMonthRef.current?.focus();
                          }
                        }}
                      />
                    </View>
                  </View>
                </View>

                {/* Input Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={colors.placeholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      placeholder="Enter your email"
                      placeholderTextColor={colors.placeholder}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={registerEmail}
                      onChangeText={setRegisterEmail}
                    />
                  </View>
                </View>

                {/* Input Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={colors.placeholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      placeholder="Enter password"
                      placeholderTextColor={colors.placeholder}
                      secureTextEntry={!showRegisterPassword}
                      autoCapitalize="none"
                      value={registerPassword}
                      onChangeText={setRegisterPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowRegisterPassword(!showRegisterPassword)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.eyeIconButton}
                    >
                      <Ionicons
                        name={showRegisterPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={colors.placeholder}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Input Phone Number */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="call-outline"
                      size={20}
                      color={colors.placeholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      placeholder="Enter your phone number"
                      placeholderTextColor={colors.placeholder}
                      keyboardType="phone-pad"
                      value={registerPhone}
                      onChangeText={setRegisterPhone}
                    />
                  </View>
                </View>

                {/* Tombol Sign-Up */}
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    isRegisterFormValid ? styles.buttonActive : styles.buttonDisabled,
                  ]}
                  disabled={!isRegisterFormValid || loading}
                  activeOpacity={0.8}
                  onPress={handleRegister}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text style={styles.primaryButtonText}>Sign-Up</Text>
                  )}
                </TouchableOpacity>

                {/* Footer Switch to Login */}
                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => handleTabChange('login')}>
                    <Text style={styles.footerLink}>Login Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.headerWaveDark,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  /* HEADER DENGAN 3 LAPIS GELOMBANG UNGU */
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 56 : (StatusBar.currentHeight || 28) + 16,
    paddingHorizontal: 24,
    paddingBottom: 68,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.headerWaveDark,
  },
  waveLayerDark: {
    position: 'absolute',
    top: -50,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.headerWaveDark,
    opacity: 0.65,
  },
  waveLayerMid: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 320,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.headerWaveMid,
    opacity: 0.55,
    transform: [{ rotate: '-18deg' }],
  },
  waveLayerLight: {
    position: 'absolute',
    bottom: -40,
    right: -50,
    width: 300,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.headerWaveLight,
    opacity: 0.45,
    transform: [{ rotate: '12deg' }],
  },
  headerTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 10,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrapper: {
    zIndex: 10,
  },
  headerTitle: {
    fontFamily: fonts.bebas,
    fontSize: 32,
    lineHeight: 38,
    color: colors.white,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13.5,
    lineHeight: 19,
    color: 'rgba(255, 255, 255, 0.85)',
    maxWidth: width * 0.85,
  },

  /* PANEL PUTIH DENGAN SUDUT ATAS 44 */
  bottomCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    marginTop: -32,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },

  /* TAB TOGGLE PILL ("Sign-Up" | "Login") */
  tabContainerWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ECEBF8',
    borderRadius: 28,
    padding: 4,
    width: '100%',
    maxWidth: 320,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tabButtonActive: {
    backgroundColor: colors.white,
    shadowColor: '#7869D1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  tabText: {
    fontSize: 14.5,
  },
  tabTextActive: {
    color: colors.tabActiveText,
    fontFamily: fonts.bold,
  },
  tabTextInactive: {
    color: colors.tabInactiveText,
    fontFamily: fonts.medium,
  },

  /* NOTIFIKASI ERROR & SUKSES */
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorBg,
    borderColor: colors.errorBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    lineHeight: 18,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    borderColor: colors.successBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  successText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.success,
    lineHeight: 18,
  },
  bannerIcon: {
    marginRight: 10,
  },

  /* FORM STYLES */
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: fonts.medium,
    fontSize: 13.5,
    color: colors.textDark,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 14,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textDark,
    height: '100%',
  },
  eyeIconButton: {
    padding: 6,
  },

  /* 3 KOTAK TANGGAL LAHIR */
  dobRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dobInputWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 14,
    backgroundColor: colors.inputBg,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dobYearWrapper: {
    flex: 1.4,
  },
  dobInput: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },

  /* TOMBOL UTAMA (LOGIN & SIGN UP) */
  primaryButton: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  buttonActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: colors.buttonDisabled,
  },
  primaryButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 15.5,
    color: colors.buttonText,
  },

  /* PEMISAH "OR LOGIN WITH" */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerText: {
    marginHorizontal: 12,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textGray,
  },

  /* 3 TOMBOL KOTAK ICON SOSIAL */
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 60,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.socialBorder,
    backgroundColor: colors.socialBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* FOOTER */
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  footerText: {
    fontFamily: fonts.regular,
    fontSize: 13.5,
    color: colors.textGray,
  },
  footerLink: {
    fontFamily: fonts.semiBold,
    fontSize: 13.5,
    color: colors.tabActiveText,
  },
});
