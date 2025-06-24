import { styles } from '@/assets/styles/auth.styles.js'
import { COLORS } from '@/constants/colors.js'
import { useSignUp } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [verifying, setVerifying] = useState(false)

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      console.log(err)
      if (err.errors?.find(e => e.code === 'form_identifier_exists')) {
        setError('The email is already in use. Please try another.')
      } else if (
        err.errors?.find(e => e.code === 'form_password_length_too_short')
      ) {
        setError('Passwords must be 8 characters or more.')
      } else {
        setError('An error occurred. Please try again.')
      }
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    if (!code || code.trim() === '') {
      setError('Please enter the OTP.')
      return
    }

    try {
      // Use the code the user provided to attempt verification
      setVerifying(true)
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error('Verification not complete:', signUpAttempt)
        setError('Verification failed. Please try again.')
      }
    } catch (err) {
      console.error('Verification error:', err)
      if (err.errors?.[0]?.message === 'Incorrect code') {
        setError('Incorrect OTP. Please try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setVerifying(false)
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name='alert-circle' size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Ionicons name='close' size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        )}
        <TextInput
          style={[styles.verificationInput, error && styles.errorInput]}
          value={code}
          placeholder='Enter your verification code'
          placeholderTextColor='#9A8478'
          onChangeText={code => setCode(code)}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={onVerifyPress}
          disabled={verifying}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={30}
    >
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/illu-signup.png')}
          style={styles.illustration}
        />
        <Text style={styles.title}>Create Account</Text>
        {error && (
          <View style={styles.errorBox}>
            <Ionicons name='alert-circle' size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Ionicons name='close' size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        )}
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize='none'
          value={emailAddress}
          placeholder='Enter email'
          placeholderTextColor='#9A8478'
          onChangeText={email => setEmailAddress(email)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder='Enter password'
          placeholderTextColor='#9A8478'
          secureTextEntry={true}
          onChangeText={password => setPassword(password)}
        />
        <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}
