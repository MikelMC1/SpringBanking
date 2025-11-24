import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import PrimaryButton from '../../components/common/PrimaryButton';
import TextField from '../../components/common/TextField';
import { useTheme } from '../../theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useBankStore } from '../../store/useBankStore';
import { loginWithEmail, registerUser } from '../../api/account';
import { setAuthToken } from '../../api/client';
import { triggerHaptic } from '../../utils/haptics';

const LoginScreen = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const setSession = useAuthStore((state) => state.setSession);
  const clearAll = useBankStore((state) => state.clearAll);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => {
    // Password must have: 8+ chars, 1 uppercase, 2 numbers, 1 special character (!@#$&*)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasTwoNumbers = (password.match(/\d/g) || []).length >= 2;
    const hasSpecialChar = /[!@#$&*]/.test(password);
    const hasMinLength = password.length >= 8;
    
    return hasUpperCase && hasTwoNumbers && hasSpecialChar && hasMinLength;
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (isSignUp && !fullName.trim()) {
      Toast.show({ type: 'error', text1: 'Full name required', text2: 'Please enter your full name.' });
      return;
    }

    if (!validateEmail(email)) {
      Toast.show({ type: 'error', text1: 'Invalid email', text2: 'Please enter a valid email address.' });
      return;
    }

    if (!password) {
      Toast.show({ type: 'error', text1: 'Password required', text2: 'Please enter your password.' });
      return;
    }

    if (isSignUp && !validatePassword(password)) {
      Toast.show({ 
        type: 'error', 
        text1: 'Weak password', 
        text2: 'Password must have: 8+ characters, 1 uppercase, 2 numbers, 1 special character (!@#$&*)' 
      });
      return;
    }

    try {
      setLoading(true);

      if (isSignUp) {
        console.log('Attempting registration with:', { fullName, email });
        await registerUser(fullName.trim(), email, password);
        Toast.show({ type: 'success', text1: 'Account created', text2: 'You can now sign in' });
        setIsSignUp(false);
        setFullName('');
        setPassword('');
      } else {
        console.log('Attempting login with:', { email, password });
        // Clear all previous user data before logging in
        clearAll();
        const profile = await loginWithEmail(email, password);
        console.log('Login response:', profile);

        setSession({ 
          email: profile.user.email, 
          fullName: profile.user.fullName, 
          token: profile.token 
        });
        
        // Set the token in axios headers
        setAuthToken(profile.token);
        
        triggerHaptic.success();
        Toast.show({ type: 'success', text1: 'Welcome back', text2: profile.user.fullName });
      }

    } catch (error: any) {
      console.error('Auth error:', error.response?.data || error.message || error);
      const message = error.response?.data?.message || error.message || 'Unknown error';
      triggerHaptic.error();
      Toast.show({ 
        type: 'error', 
        text1: isSignUp ? 'Registration failed' : 'Authentication failed', 
        text2: message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {isSignUp ? 'Sign up' : 'Sign in'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
          {isSignUp ? 'Create a new account' : 'Enter your email and password'}
        </Text>

        {isSignUp && (
          <TextField 
            label="Full name" 
            value={fullName} 
            onChangeText={setFullName} 
            autoCapitalize="words" 
          />
        )}
        <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />

        <PrimaryButton 
          label={isSignUp ? 'Create account' : 'Continue'} 
          onPress={handleSubmit} 
          loading={loading} 
        />

        <TouchableOpacity 
          onPress={() => {
            setIsSignUp(!isSignUp);
            setFullName('');
            setPassword('');
          }}
          style={styles.toggleButton}
        >
          <Text style={[styles.toggleText, { color: theme.colors.muted }]}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <Text style={[styles.toggleLink, { color: theme.colors.accent }]}>
              {isSignUp ? 'Sign in' : 'Sign up'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  card: { padding: 24, borderRadius: 28, gap: 12 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 15, marginBottom: 12 },
  toggleButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
  },
  toggleLink: {
    fontWeight: '600',
  },
});

export default LoginScreen;
