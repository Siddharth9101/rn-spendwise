import { styles } from '@/assets/styles/home.styles.js'
import { COLORS } from '@/constants/colors.js'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'

const NoTransactionFound = () => {
  const router = useRouter()
  return (
    <View style={styles.emptyState}>
      <Ionicons
        name='receipt-outline'
        size={60}
        color={COLORS.textLight}
        style={styles.emptyStateIcon}
      />
      <Text style={styles.emptyStateTitle}>No transaction yet</Text>
      <Text style={styles.emptyStateText}>
        Start tracking your finances by adding your first transaction
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => router.push('/create')}
      >
        <Ionicons name='add-circle' size={18} color={COLORS.white} />
        <Text style={styles.emptyStateButtonText}>Add Transactions</Text>
      </TouchableOpacity>
    </View>
  )
}

export default NoTransactionFound
