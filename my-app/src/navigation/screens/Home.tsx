import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View, FlatList, Image } from 'react-native';
import { useState, useEffect, useMemo } from 'react';

// Simulate heavy data
const generateHeavyData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    title: `Heavy Item ${index}`,
    description: `This is a description for item ${index} with some complex data processing`,
    value: Math.random() * 1000,
    timestamp: new Date().getTime() + index,
  }));
};

// Heavy computation component
const HeavyListItem = ({ item }: { item: any }) => {
  // Simulate expensive calculations
  const expensiveValue = useMemo(() => {
    let result = 0;
    for (let i = 0; i < 10000; i++) {
      result += Math.sin(item.value + i) * Math.cos(item.timestamp + i);
    }
    return result.toFixed(2);
  }, [item.value, item.timestamp]);

  return (
    <View style={styles.listItem}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemValue}>Computed: {expensiveValue}</Text>
    </View>
  );
};

export function Home() {
  const [heavyData, setHeavyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate heavy data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeavyData(generateHeavyData(1000)); // Generate 1000 items
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Heavy computation that runs on every render
  const heavyComputation = useMemo(() => {
    let result = 0;
    for (let i = 0; i < 50000; i++) {
      result += Math.random() * Math.sin(i) * Math.cos(i);
    }
    return result;
  }, [heavyData.length]);

  return (
    <View style={styles.container}>
      <Text>Home Screen (Heavy Performance Test)</Text>
      <Text>Open up 'src/App.tsx' to start working on your app!</Text>
      <Text>Heavy computation result: {heavyComputation.toFixed(2)}</Text>
      <Text>Data items: {heavyData.length}</Text>
      
      <View style={styles.buttonContainer}>
        <Button screen="Profile" params={{ user: 'jane' }}>
          Go to Profile
        </Button>
        <Button screen="SettingsModal" params={{ screen: 'Settings' }}>Go to Settings</Button>
      </View>

      {isLoading ? (
        <Text>Loading heavy data...</Text>
      ) : (
        <FlatList
          data={heavyData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <HeavyListItem item={item} />}
          style={styles.list}
          getItemLayout={(data, index) => ({
            length: 80,
            offset: 80 * index,
            index,
          })}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  list: {
    flex: 1,
    width: '100%',
  },
  listItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  itemValue: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});
