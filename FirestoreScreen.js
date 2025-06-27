import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from './firebase';

const db = getFirestore(app);

export default function FirestoreScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'items')); // Replace 'items' with your collection
      const data = [];
      querySnapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setItems(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.code === 'permission-denied') {
        Alert.alert('Access Denied', 'App Check verification failed.');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text> {/* Adjust to your Firestore schema */}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
