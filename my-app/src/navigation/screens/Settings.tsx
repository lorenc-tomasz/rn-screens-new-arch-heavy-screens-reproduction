import { Text } from '@react-navigation/elements';
import { StyleSheet, View, ScrollView, Animated } from 'react-native';
import { useState, useEffect, useMemo, useRef } from 'react';

// Heavy animation component
const AnimatedBox = ({ index }: { index: number }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000 + (index * 100),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000 + (index * 100),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    
    return () => animation.stop();
  }, [animatedValue, index]);

  const rotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.5, 1],
  });

  return (
    <Animated.View
      style={[
        styles.animatedBox,
        {
          transform: [{ rotate: rotation }, { scale }],
          backgroundColor: `hsl(${(index * 30) % 360}, 70%, 60%)`,
        },
      ]}
    />
  );
};

// Heavy computation component
const HeavySettingsItem = ({ title, index }: { title: string; index: number }) => {
  const heavyComputation = useMemo(() => {
    let result = 0;
    for (let i = 0; i < 25000; i++) {
      result += Math.sin(i + index) * Math.cos(i * index) * Math.tan(i / (index + 1));
    }
    return result.toFixed(4);
  }, [index]);

  return (
    <View style={styles.settingsItem}>
      <Text style={styles.settingsTitle}>{title}</Text>
      <Text style={styles.computationResult}>Heavy calc: {heavyComputation}</Text>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${(Math.abs(parseFloat(heavyComputation)) % 100)}%` }
          ]} 
        />
      </View>
    </View>
  );
};

export function Settings() {
  const [heavyItems, setHeavyItems] = useState<string[]>([]);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    // Generate heavy settings items
    const items = Array.from({ length: 50 }, (_, i) => 
      `Setting Item ${i + 1} - ${Math.random().toString(36).substring(7)}`
    );
    setHeavyItems(items);
    
    // Force re-renders to simulate heavy updates
    const interval = setInterval(() => {
      setRenderCount(prev => prev + 1);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Heavy global computation
  const globalComputation = useMemo(() => {
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.random() * Math.sin(i) * Math.cos(renderCount + i);
    }
    return result;
  }, [renderCount]);

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerText}>Heavy Settings Modal</Text>
        <Text style={styles.statsText}>Renders: {renderCount}</Text>
        <Text style={styles.statsText}>Global computation: {globalComputation.toFixed(2)}</Text>
      </View>
      
      <View style={styles.animationSection}>
        {Array.from({ length: 12 }, (_, i) => (
          <AnimatedBox key={i} index={i} />
        ))}
      </View>
      
      <ScrollView style={styles.scrollSection} showsVerticalScrollIndicator={false}>
        {heavyItems.map((item, index) => (
          <HeavySettingsItem key={`${item}-${renderCount}`} title={item} index={index} />
        ))}
        
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerSection: {
    backgroundColor: '#f4511e',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  animationSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
    minHeight: 120,
  },
  animatedBox: {
    width: 30,
    height: 30,
    margin: 5,
    borderRadius: 5,
  },
  scrollSection: {
    flex: 1,
    padding: 20,
  },
  settingsItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  computationResult: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f4511e',
    borderRadius: 3,
  },
  spacer: {
    height: 50,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
});
