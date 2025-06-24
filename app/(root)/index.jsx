import { styles } from '@/assets/styles/home.styles.js'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader.jsx'
import { useTransactions } from '@/hooks/useTransactions'
import { useUser } from '@clerk/clerk-expo'
import { useEffect, useState } from 'react'
import { Alert, FlatList, RefreshControl, Text, View } from 'react-native'
import BalanceCard from '../../components/BalanceCard'
import NoTransactionFound from '../../components/NoTransactionFound'
import TransactionItem from '../../components/TransactionItem'
export default function Page() {
  const { user } = useUser()
  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTransactions(user.id)

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDelete = id => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(id),
        },
      ]
    )
  }

  if (isLoading && !refreshing) return <PageLoader />
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        <Header />
        {/* BALANCE CARD */}
        <BalanceCard summary={summary} />

        {/* RECENT TRANSACTIONS */}

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  )
}
