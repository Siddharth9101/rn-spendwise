import SafeArea from '@/components/SafeArea'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeArea>
        <Slot />
      </SafeArea>
      <StatusBar />
      <StatusBar style='dark' />
    </ClerkProvider>
  )
}
