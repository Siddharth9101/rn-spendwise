import { styles } from '@/assets/styles/home.styles.js'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from './SignOutButton'

const Header = () => {
  const { user } = useUser()
  return (
    <View style={styles.header}>
      {/* LEFT */}
      <View style={styles.headerLeft}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.headerLogo}
          contentFit='contain'
        />
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.usernameText}>
            {user?.emailAddresses[0]?.emailAddress.split('@')[0]}
          </Text>
        </View>
      </View>
      {/* RIGHT */}
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/create')}
        >
          <Ionicons name='add' size={20} color={'#fff'} />
          {/* <Text style={styles.addButtonText}>Add</Text> */}
        </TouchableOpacity>
        <SignOutButton />
      </View>
    </View>
  )
}

export default Header
